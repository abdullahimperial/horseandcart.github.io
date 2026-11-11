const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../merchant-extra.js');require('../merchant-rules.js');require('../engine.js');require('../bank-files.js');require('../review-chart.js');require('../resilience.js');
const E=globalThis.ResetEngine,B=globalThis.ResetBankFiles;
const transfer='Transfer / card payment';
const map={date:0,description:1,amount:2,debit:-1,credit:-1,balance:-1,currency:-1,direction:-1,descriptionExtra:-1,mode:'signed',positive:'in',dateFormat:'auto',numberStyle:'dot'};
function csv(role,rows){return E.normalize(E.parseCSV('Date,Description,Amount\n'+rows.map(r=>r.join(',')).join('\n')),map,role).transactions;}

test('common card repayment descriptions are recognized on both statement sides',()=>{
 for(const text of ['CREDIT CARD PMT','CREDIT-CARD PYMT','AMEX PAYMENT','PAYMENT TO AMERICAN EXPRESS','MASTER CARD PAYMENT','ONLINE BANKING PAYMENT TO VISA','TRANSFER TO VISA','MB TRANSFER TO MASTERCARD','BILL PAYMENT - CREDIT CARD','CARD PAYMENT']){
  assert.equal(E.classify(text,'out','chequing'),transfer,text);
 }
 for(const text of ['PAYMENT RECEIVED','ONLINE PAYMENT','AUTOPAY PAYMENT','AUTO PAY PAYMENT','AUTOMATIC PAYMENT','PRE-AUTHORIZED PAYMENT','PAYMENT FROM CHEQUING','PAYMENT THANK YOU','THANK YOU PAYMENT','PAYMENT']){
  assert.equal(E.classify(text,'in','card'),transfer,text);
 }
});

test('generic payments, merchant refunds and card-funded purchases are not silently excluded',()=>{
 const cases=[['ONLINE PAYMENT','out','chequing'],['BILL PAYMENT','out','chequing'],['BMO PAYMENT','out','chequing'],['PREAUTHORIZED PAYMENT','out','card'],['PAYMENT RECEIVED','in','chequing'],['REFUND OF VISA PAYMENT','in','card'],['GROCERY PAYMENT VIA VISA','out','card'],['GROCERY DEBIT CARD PAYMENT','out','chequing'],['VISA CASHBACK REWARD','in','card']];
 for(const [text,flow,account] of cases)assert.notEqual(E.classify(text,flow,account),transfer,text);
 assert.equal(E.classify('TELUS PAYMENT','out','chequing'),'Utilities');
 assert.equal(E.classify('FARM BOY REFUND','in','card'),'Groceries');
 assert.equal(E.classify('MORTGAGE PAYMENT','out','chequing'),'Debt payments');
});

test('interest and fee wording takes priority over card-payment wording',()=>{
 for(const text of ['VISA PAYMENT INTEREST CHARGE','CREDIT CARD PAYMENT PURCHASE INTEREST'])assert.equal(E.classify(text,'out','card'),'Financing charges',text);
 for(const text of ['VISA PAYMENT LATE FEE','CREDIT CARD PAYMENT FEE','AMEX ANNUAL FEE'])assert.equal(E.classify(text,'out','card'),'Bank fees',text);
});

function fixture(payment=115){return [
 ...csv('card',[
  ['2026-09-02','FARM BOY',-100],['2026-09-03','FARM BOY REFUND',10],
  ['2026-09-04','VISA PAYMENT INTEREST CHARGE',-20],['2026-09-04','VISA PAYMENT LATE FEE',-5],
  ['2026-09-20','PAYMENT RECEIVED',payment]
 ]),
 ...csv('chequing',[
  ['2026-09-01','PAYROLL',1000],['2026-09-05','TELUS PAYMENT',-20],
  ['2026-09-19','CREDIT CARD PMT',-payment]
 ])
];}

test('a $100 purchase plus its $100 repayment is $100 spending when either payment description varies',()=>{
 for(const [bankText,cardText] of [['CREDIT CARD PMT','PAYMENT THANK YOU'],['VISA PAYMENT','PAYMENT RECEIVED']]){
  const rows=[...csv('card',[['2026-09-01','FARM BOY',-100],['2026-09-10',cardText,100]]),...csv('chequing',[['2026-09-09',bankText,-100]])];
  const s=E.summarize(rows,'2026-09-01','2026-09-30');
  assert.equal(s.expenses,100);assert.equal(s.refunds,0);assert.equal(s.income,0);assert.equal(s.transfers,200);assert.equal(s.chequeOut,100);
 }
});

test('CSV imports count purchases once and keep payments in the cash-movement view only',()=>{
 for(const payment of [60,115,500]){
  const rows=fixture(payment),s=E.summarize(rows,'2026-09-01','2026-09-30');
  assert.equal(s.income,1000);assert.equal(s.expenses,135);assert.equal(s.surplus,865);
  assert.equal(s.refunds,10);assert.equal(s.transfers,payment*2);assert.equal(s.chequeOut,payment+20);
  assert.deepEqual(s.totals,{Groceries:90,'Financing charges':20,'Bank fees':5,Utilities:20});
  assert.equal(globalThis.ResetReviewChart.build(rows,'2026-09-01','2026-09-30').total,135);
 }
});

test('a repayment stays excluded when the matching side or purchases fall outside the date window',()=>{
 const rows=fixture();
 for(const day of ['2026-09-19','2026-09-20']){
  const s=E.summarize(rows,day,day);assert.equal(s.expenses,0);assert.equal(s.income,0);assert.equal(s.refunds,0);assert.equal(s.transfers,115);
 }
 const reversed=[...rows].reverse();assert.deepEqual(E.summarize(reversed,'2026-09-01','2026-09-30').totals,E.summarize(rows,'2026-09-01','2026-09-30').totals);
});

test('payment recognition does not delete equal-amount purchases or override manual corrections',()=>{
 const rows=fixture();rows.push(...csv('card',[['2026-09-19','FARM BOY',-115]]));
 assert.equal(E.summarize(rows,'2026-09-01','2026-09-30').expenses,250);
 const payment=rows.find(t=>t.description==='CREDIT CARD PMT');payment.category='Debt payments';
 assert.equal(E.summarize(rows,'2026-09-01','2026-09-30').expenses,365);
 payment.category=transfer;assert.equal(E.summarize(rows,'2026-09-01','2026-09-30').expenses,250);
});

test('OFX, QFX and QBO use the same repayment rules and retain explicit interest and fees',()=>{
 const row=(id,amount,name,type='OTHER')=>`<STMTTRN><TRNTYPE>${type}</TRNTYPE><DTPOSTED>20260915</DTPOSTED><TRNAMT>${amount}</TRNAMT><FITID>${id}</FITID><NAME>${name}</NAME></STMTTRN>`;
 const statement=(role,rows)=>role==='card'?`<CCSTMTRS><CURDEF>CAD</CURDEF><CCACCTFROM><ACCTID>1234</ACCTID></CCACCTFROM><BANKTRANLIST>${rows}</BANKTRANLIST></CCSTMTRS>`:`<STMTRS><CURDEF>CAD</CURDEF><BANKACCTFROM><BANKID>001</BANKID><ACCTID>5678</ACCTID><ACCTTYPE>CHECKING</ACCTTYPE></BANKACCTFROM><BANKTRANLIST>${rows}</BANKTRANLIST></STMTRS>`;
 for(const ext of ['ofx','qfx','qbo']){
  const load=(role,rows)=>B.normalize(B.parse('<?xml version="1.0"?><OFX>'+statement(role,rows)+'</OFX>','example.'+ext),0,role).transactions;
  const rows=[...load('card',row('purchase',-100,'FARM BOY','DEBIT')+row('refund',10,'FARM BOY','CREDIT')+row('payment',115,'ONLINE PAYMENT','CREDIT')+row('interest',-20,'VISA PAYMENT','INT')+row('fee',-5,'VISA PAYMENT','FEE')),...load('chequing',row('income',1000,'PAYROLL','DIRECTDEP')+row('bill',-20,'TELUS PAYMENT','PAYMENT')+row('payment',-115,'AMEX PAYMENT','PAYMENT'))];
  const s=E.summarize(rows,'2026-09-01','2026-09-30');assert.equal(s.expenses,135,ext);assert.equal(s.surplus,865,ext);assert.equal(s.transfers,230,ext);assert.equal(s.refunds,10,ext);
 }
});

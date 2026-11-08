const {test}=require('node:test'),assert=require('node:assert/strict');
require('../engine.js');require('../guidance.js');
const E=globalThis.ResetEngine,G=globalThis.ResetGuidance;
function row(account,date,description,amount,flow,category){return {account,date,description,amount,flow,category,merchant:E.merchant(description),review:'Recognized',row:1,id:description};}

test('investment movements have their own category without guessing generic transfers or fees',()=>{
 assert.ok(E.categories.includes('Investments'));assert.ok(E.categories.includes('Income'));
 for(const name of ['RRSP CONTRIBUTION','TFSA DEPOSIT','RESP CONTRIBUTION','RDSP TRANSFER','FHSA CONTRIBUTION','TRANSFER TO TFSA','INVESTMENT TRANSFER','BROKERAGE DEPOSIT','ETF PURCHASE'])assert.equal(E.classify(name,'out','chequing'),'Investments',name);
 assert.equal(E.classify('TFSA WITHDRAWAL','in','chequing'),'Investments');
 assert.equal(E.classify('INVESTMENT TRANSFER','in','chequing'),'Investments');
 for(const name of ['E-TRANSFER','INVESTMENT ADVISORY FEE','RRSP ACCOUNT FEE'])assert.notEqual(E.classify(name,'out','chequing'),'Investments');
 assert.equal(E.classify('PAYROLL','in','chequing'),'Income');
});

test('investment contributions and withdrawals stay out of spending, refunds and income',()=>{
 const rows=[
  row('chequing','2024-08-01','FICTIONAL PAY',1000,'in','Income'),
  row('chequing','2024-08-02','FICTIONAL RENT',300,'out','Housing'),
  row('card','2024-08-03','FICTIONAL GROCERY',100,'out','Groceries'),
  row('chequing','2024-08-04','FICTIONAL CARD PAYMENT',100,'out','Transfer / card payment'),
  row('card','2024-08-04','FICTIONAL PAYMENT RECEIVED',100,'in','Transfer / card payment'),
  row('chequing','2024-08-05','FICTIONAL INVESTMENT',250,'out','Investments'),
  row('chequing','2024-09-05','FICTIONAL INVESTMENT',250,'out','Investments'),
  row('chequing','2024-09-06','FICTIONAL WITHDRAWAL',100,'in','Investments'),
  row('chequing','2024-09-07','CONFIRMED DIVIDEND',15,'in','Income'),
  row('chequing','2024-07-01','OUTSIDE WINDOW',999,'out','Investments')
 ];
 const s=E.summarize(rows,'2024-08-01','2024-09-30');
 assert.equal(s.income,1015);assert.equal(s.expenses,400);assert.equal(s.surplus,615);
 assert.equal(s.investmentOut,500);assert.equal(s.investmentIn,100);assert.equal(s.transfers,200);
 assert.equal(s.chequeIn,1115);assert.equal(s.chequeOut,900);assert.equal(s.chequeIn-s.chequeOut,215);
 assert.equal(s.refunds,0);assert.equal(s.otherCredits,0);assert.equal(s.totals.Investments,undefined);assert.equal(s.recurring.length,0);assert.equal(s.unknown.length,0);
 const c={...E.contextNumbers({months:3,threshold:10}),debts:[],debtComplete:false,stability:'unknown'};
 assert.ok(G.build(s,c).matrix.every(r=>r.category!=='Investments'));
 const excluded=E.summarize(rows.map(r=>r.description==='FICTIONAL WITHDRAWAL'?{...r,category:'Exclude'}:r),'2024-08-01','2024-09-30');
 assert.equal(excluded.investmentIn,0);assert.equal(excluded.chequeIn,1115);
});

test('unidentified deposits can be explicitly categorized as income',()=>{
 const t=row('chequing','2024-09-01','FICTIONAL EMPLOYER',2000,'in','Other');
 assert.equal(E.summarize([t],'2024-09-01','2024-09-30').income,0);
 const s=E.summarize([{...t,category:'Income'}],'2024-09-01','2024-09-30');assert.equal(s.income,2000);assert.equal(s.otherCredits,0);
});

test('transaction dropdown offers Investments and enables Income for chequing deposits only',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
 const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const nodes=new Map(),$=selector=>{if(!nodes.has(selector))nodes.set(selector,{value:'',innerHTML:'',textContent:'',querySelectorAll:()=>[]});return nodes.get(selector);};$('#category-filter').value='all';
 const state={E,$,page:0,transactions:[],cash:String,esc:String};vm.createContext(state);
 vm.runInContext(source.slice(source.indexOf('function renderTransactions('),source.indexOf('\nfunction debtRows(')),state);
 for(const [account,flow,incomeAllowed] of [['chequing','in',true],['chequing','out',false],['card','in',false],['card','out',false]]){
  state.transactions=[row(account,'2024-09-01','FICTIONAL ENTRY',10,flow,'Other')];vm.runInContext('renderTransactions()',state);
  const html=$('#transactions').innerHTML,investment=html.match(/<option\b([^>]*)>Investments<\/option>/),income=html.match(/<option\b([^>]*)>Income<\/option>/);
  assert.ok(investment);assert.ok(income);assert.ok(!investment[1].includes('disabled'));assert.equal(!income[1].includes('disabled'),incomeAllowed);
 }
});

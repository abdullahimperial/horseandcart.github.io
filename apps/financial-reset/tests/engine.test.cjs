const {test}=require('node:test');const assert=require('node:assert/strict');require('../engine.js');const E=globalThis.ResetEngine;
const base={date:0,description:1,amount:2,debit:-1,credit:-1,balance:-1,currency:-1,direction:-1,mode:'signed',positive:'out',dateFormat:'auto',numberStyle:'dot'};
test('quoted separators, escaped quotes, BOM, CRLF, and multiline descriptions',()=>{
 const p=E.parseCSV('\uFEFFDate,Description,Amount\r\n2026-09-01,"Store, with ""quotes""\nand newline",100\r\n');assert.equal(p.rows.length,1);assert.equal(p.rows[0][1],'Store, with "quotes"\nand newline');
 assert.equal(E.parseCSV('Date;Description;Amount\n2026-09-01;Shop;1.234,56').delimiter,';');assert.equal(E.parseCSV('Date\tDescription\tAmount\n2026-09-01\tShop\t12').delimiter,'\t');
 assert.throws(()=>E.parseCSV('Date,Amount\n"unclosed,1'),/closing quote/);
});
test('dates are valid and ambiguous slash dates need an explicit choice',()=>{
 assert.equal(E.date('2024-02-29'),'2024-02-29');assert.throws(()=>E.date('2026-02-29'),/Invalid calendar/);assert.throws(()=>E.date('01/02/2026'),/Ambiguous/);assert.equal(E.date('01/02/2026','mdy'),'2026-01-02');assert.equal(E.date('01/02/2026','dmy'),'2026-02-01');assert.equal(E.date('13/02/2026'),'2026-02-13');
});
test('numbers preserve sign, grouping, refunds, zero, and decimal styles',()=>{
 assert.equal(E.number('($1,234.56)'),-1234.56);assert.equal(E.number('C$ 10.50'),10.5);assert.equal(E.number('-$10.50'),-10.5);assert.equal(E.number('1.234,56','comma'),1234.56);assert.equal(E.number(''),null);assert.equal(E.number('0'),0);assert.throws(()=>E.number('1,23'),/Invalid/);assert.throws(()=>E.number('Infinity'),/Invalid/);
});
test('signed and debit/credit layouts preserve purchase and refund direction',()=>{
 const p=E.parseCSV('Date,Description,Amount\n2026-09-01,Shop,-100\n2026-09-02,Refund,20');const result=E.normalize(p,{...base,positive:'in'},'card');assert.equal(result.transactions[0].flow,'out');assert.equal(result.transactions[1].flow,'in');
 const d=E.parseCSV('Date,Description,Debit,Credit\n2026-09-01,Pay,,100\n2026-09-02,Shop,50,');const rows=E.normalize(d,{...base,mode:'separate',debit:2,credit:3},'chequing').transactions;assert.equal(rows[0].flow,'in');assert.equal(rows[1].flow,'out');
 const bad=E.parseCSV('Date,Description,Debit,Credit\n2026-09-01,Pay,20,100\n2026-09-02,Shop,50,');assert.equal(E.normalize(bad,{...base,mode:'separate',debit:2,credit:3},'chequing').invalid.length,1);
});
test('currency mismatches and invalid rows are surfaced, never silently included',()=>{
 const p=E.parseCSV('Date,Description,Amount,Currency\n2026-09-01,Shop,100,CAD\n2026-09-02,Shop,50,USD\n2026-09-03,Shop,nope,CAD');const r=E.normalize(p,{...base,currency:3},'card');assert.equal(r.transactions.length,1);assert.equal(r.invalid.length,2);assert.match(r.invalid[0].reason,/Currency/);
});
const t=(account,date,description,amount,flow,category,id=description)=>({account,date,description,merchant:E.merchant(description),amount,flow,category,id,review:'Unreviewed'});
test('card settlement is excluded once; purchases and direct bills determine surplus',()=>{
 const rows=[t('chequing','2026-09-01','Payroll',2000,'in','Income'),t('card','2026-09-03','Grocery',100,'out','Groceries'),t('card','2026-09-04','Refund',20,'in','Groceries'),t('chequing','2026-09-05','VISA PAYMENT',80,'out','Transfer / card payment'),t('card','2026-09-05','PAYMENT THANK YOU',80,'in','Transfer / card payment'),t('chequing','2026-09-06','Rent',1000,'out','Housing')];
 const s=E.summarize(rows,'2026-09-01','2026-09-30');assert.equal(s.income,2000);assert.equal(s.expenses,1080);assert.equal(s.surplus,920);assert.equal(s.chequeIn-s.chequeOut,920);assert.equal(s.transfers,160);assert.equal(s.totals.Groceries,80);
});
test('unknown chequing credits are not income; classified refunds offset spending',()=>{
 const rows=[t('chequing','2026-09-01','Unknown transfer',300,'in','Other'),t('chequing','2026-09-02','Grocery refund',50,'in','Groceries'),t('chequing','2026-09-03','Groceries',100,'out','Groceries')];const s=E.summarize(rows,'2026-09-01','2026-09-30');assert.equal(s.income,0);assert.equal(s.otherCredits,300);assert.equal(s.expenses,50);assert.equal(s.refunds,50);
});
test('duplicate candidates are preserved until user exclusion; recurrence is only a candidate',()=>{
 const rows=[t('card','2026-09-01','Shop',100,'out','Other','a'),t('card','2026-09-01','Shop',100,'out','Other','b'),t('card','2026-09-22','Shop',100,'out','Other','c')];let s=E.summarize(rows,'2026-09-01','2026-09-30');assert.equal(s.expenses,300);assert.equal(s.duplicates.length,1);assert.equal(s.recurring.length,1);rows[1].category='Exclude';s=E.summarize(rows,'2026-09-01','2026-09-30');assert.equal(s.expenses,200);assert.equal(s.excluded,1);assert.equal(s.duplicates.length,0);
});
test('period, unknown reserve, zero essentials, and invalid targets remain explicit',()=>{
 const s=E.summarize([t('chequing','2026-08-31','Payroll',1000,'in','Income'),t('chequing','2026-09-01','Payroll',2000,'in','Income')],'2026-09-01','2026-09-30');assert.equal(s.income,2000);assert.equal(s.days,30);assert.equal(s.monthlyIncome,2000*30.4375/30);assert.throws(()=>E.summarize([],'2026-10-01','2026-09-01'),/valid date/);
 const n=E.contextNumbers({months:'3',threshold:'10'});assert.equal(n.reserve,null);assert.equal(n.essentials,null);assert.throws(()=>E.contextNumbers({months:0,threshold:10}),/duration/);assert.throws(()=>E.contextNumbers({months:3,threshold:0}),/screening rate/);
});
test('merchant rule uncertainty stays separate from proof of authorization',()=>{
 assert.equal(E.classify('PAYROLL','in','chequing'),'Income');assert.equal(E.classify('E-TRANSFER IN','in','chequing'),'Other');assert.equal(E.classify('PAYMENT THANK YOU','in','card'),'Transfer / card payment');assert.equal(E.classify('PURCHASE INTEREST','out','card'),'Financing charges');assert.equal(E.classify('UNKNOWN MERCHANT','out','card'),'Other');
});

test('split bank description fields are combined, and excessive columns are rejected',()=>{
 const p=E.parseCSV('Date,Description 1,Description 2,Amount\n2026-09-01,VISA,PAYMENT,-100');const r=E.normalize(p,{...base,amount:3,descriptionExtra:2,positive:'in'},'chequing');assert.equal(r.transactions[0].description,'VISA PAYMENT');assert.equal(r.transactions[0].category,'Transfer / card payment');assert.throws(()=>E.parseCSV(Array(65).fill('Col').join(',')+'\n'+Array(65).fill('1').join(',')),/64 columns/);
});

const {test}=require('node:test'),assert=require('node:assert/strict');
require('../engine.js');require('../resilience.js');require('../explore-engine.js');
const M=globalThis.ResetExploreMath;
const deposit=(id,description,amount,category='Income',date='2026-09-15')=>({id,description,merchant:description,amount,category,date,row:1,account:'chequing',flow:'in',review:'Recognized'});
test('income prefill separates payroll, benefits and other income while respecting corrected categories',()=>{
 const rows=[deposit('1','PAYROLL',4000),deposit('2','PENSION PAY',700),deposit('3','CANADA CCB',500,'Government benefits & support'),deposit('4','INVESTMENT DIVIDEND',30),deposit('5','PAYROLL',800,'Transfer / card payment'),deposit('6','GROCERY REFUND',100,'Groceries'),deposit('7','UNKNOWN DEPOSIT',200,'Other'),deposit('8','INVESTMENT WITHDRAWAL',900,'Investments'),deposit('9','EMPLOYER PAY',600,'Exclude')];
 const b=M.incomeBasis(rows,'2026-09-01','2026-09-30');assert.equal(b.monthlyIncome,5230);assert.equal(b.monthlyPay,4000);assert.equal(b.monthlyBenefits,500);assert.equal(b.monthlyOther,730);assert.equal(b.unclassifiedCredits,200);assert.equal(b.deposits.length,4);assert.equal(b.complete,true);
 rows[0].category='Other';assert.equal(M.incomeBasis(rows,'2026-09-01','2026-09-30').monthlyPay,null);
});
test('income comes from the whole selected window and uses actual complete months or labelled partial scaling',()=>{
 const rows=[deposit('1','SALARY',4000,'Income','2026-08-15'),deposit('2','SALARY',5000,'Income','2026-09-15'),deposit('3','SALARY',99000,'Income','2026-10-15')];
 const b=M.incomeBasis(rows,'2026-08-01','2026-09-30');assert.equal(b.monthlyPay,4500);assert.equal(b.months,2);
 const partial=M.incomeBasis(rows,'2026-09-01','2026-09-15');assert.equal(partial.complete,false);assert.ok(Math.abs(partial.monthlyPay-5000/(15/30.4375))<1e-8);
});
test('benefits, business payouts and unidentified deposits do not silently become net wages',()=>{
 const rows=[deposit('1','CANADA CCB',500,'Government benefits & support'),deposit('2','DRIVER PAYOUT',1000),deposit('3','DEP',999,'Other')];
 const b=M.incomeBasis(rows,'2026-09-01','2026-09-30');assert.equal(b.monthlyPay,null);assert.equal(b.monthlyIncome,1500);assert.equal(M.incomeBasis([],'2026-09-01','2026-09-30').monthlyIncome,null);
});
test('bank deposits are distinct from gross pay; work hours and gross-up are independently optional',()=>{
 const r=M.depositedWork(200,4500,4000,40,52,'');assert.ok(Math.abs(r.hours-8.6666666667)<1e-8);assert.equal(r.gross,null);assert.ok(Math.abs(r.share-4.4444444444)<1e-8);
 const edited=M.depositedWork(200,2500,2000,40,52,20);assert.ok(Math.abs(edited.hours-17.3333333333)<1e-8);assert.equal(edited.gross,250);assert.equal(edited.share,8);
 const noWages=M.depositedWork(200,500,'',40,52,'');assert.equal(noWages.share,40);assert.equal(noWages.hours,null);assert.equal(noWages.gross,null);
 const unknown=M.depositedWork(200,'','','','','');assert.equal(unknown.share,null);assert.equal(unknown.hours,null);
 assert.equal(M.depositedWork(200,0,0,40,52,0).gross,200);assert.throws(()=>M.depositedWork(200,4000,4000,169,52,''));assert.throws(()=>M.depositedWork(200,4000,4000,40,53,''));assert.throws(()=>M.depositedWork(200,4000,4000,40,52,100));
});

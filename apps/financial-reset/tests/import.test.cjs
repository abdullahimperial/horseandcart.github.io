const {test}=require('node:test'),assert=require('node:assert/strict');
require('../engine.js');const E=globalThis.ResetEngine;
const mapping={date:0,description:1,descriptionExtra:-1,mode:'separate',debit:2,credit:3,amount:-1,balance:4,currency:-1,direction:-1,positive:'out',numberStyle:'dot'};
test('headerless five-column exports keep the first purchase, refunds and balances',()=>{
 const p=E.parseCSV('09/05/2024,FICTIONAL SHOP,12.50,,130.00\n08/29/2024,FICTIONAL RETURN,,2.25,117.50\n08/25/2024,FICTIONAL TRANSIT,7.00,,119.75');
 assert.equal(p.headerless,true);assert.deepEqual(p.headers,['Date','Description','Debit','Credit','Balance']);assert.equal(p.rows.length,3);
 const dateFormat=E.dateFormatHint(p.rows,0);assert.equal(dateFormat,'mdy');const r=E.normalize(p,{...mapping,dateFormat},'card');
 assert.deepEqual(r.invalid,[]);assert.equal(r.transactions.length,3);assert.equal(r.transactions[0].row,1);assert.equal(r.transactions[0].date,'2024-09-05');assert.equal(r.transactions[0].amount,12.5);assert.equal(r.transactions[0].balance,130);assert.equal(r.transactions[1].flow,'in');assert.equal(r.transactions[2].row,3);
});
test('ISO debit exports and single-transaction headerless files import without data loss',()=>{
 const p=E.parseCSV('2024-08-06,FICTIONAL PAY,,2500,4100');const r=E.normalize(p,{...mapping,dateFormat:'auto'},'chequing');assert.equal(r.transactions.length,1);assert.equal(r.transactions[0].flow,'in');assert.equal(r.transactions[0].amount,2500);assert.equal(r.transactions[0].row,1);
 assert.throws(()=>E.parseCSV('Date,Description,Debit,Credit,Balance'),/transaction row/);
});
test('date hints consider the whole column and do not guess fully ambiguous or mixed formats',()=>{
 assert.equal(E.dateFormatHint([['05/09/2024'],['29/08/2024']],0),'dmy');assert.equal(E.dateFormatHint([['05/09/2024'],['06/09/2024']],0),'auto');assert.equal(E.dateFormatHint([['08/29/2024'],['29/08/2024']],0),'auto');
 const p=E.parseCSV('05/09/2024,FICTIONAL SHOP,10,,100');assert.throws(()=>E.normalize(p,{...mapping,dateFormat:'auto'},'card'),/Ambiguous date/);assert.equal(E.normalize(p,{...mapping,dateFormat:'dmy'},'card').transactions[0].date,'2024-09-05');
});
test('malformed first transactions remain errors at the original CSV row',()=>{
 const p=E.parseCSV('2024-09-01,FICTIONAL SHOP,bad,,100\n2024-09-02,FICTIONAL SHOP,10,,90');const r=E.normalize(p,{...mapping,dateFormat:'auto'},'card');assert.equal(p.rows.length,2);assert.equal(r.invalid[0].row,1);assert.equal(r.transactions[0].row,2);
 const h=E.parseCSV('Date,Description,Debit,Credit,Balance\n2024-09-01,FICTIONAL SHOP,bad,,100\n2024-09-02,FICTIONAL SHOP,10,,90');const hr=E.normalize(h,{...mapping,dateFormat:'auto'},'card');assert.equal(hr.invalid[0].row,2);assert.equal(hr.transactions[0].row,3);
});
test('headerless row limits count every transaction',()=>{
 const row='2024-09-01,FICTIONAL SHOP,1,,10';assert.equal(E.parseCSV(Array(10000).fill(row).join('\n')).rows.length,10000);assert.throws(()=>E.parseCSV(Array(10001).fill(row).join('\n')),/10,000/);
});
test('default dates use the observed overlap and never fill the rest of a month',()=>{
 const r=(account,date)=>({account,date});assert.deepEqual(E.commonDateWindow([r('card','2024-08-25'),r('card','2024-09-05'),r('chequing','2024-08-10'),r('chequing','2024-09-09')]),{start:'2024-08-25',end:'2024-09-05'});assert.equal(E.commonDateWindow([r('card','2024-08-25'),r('chequing','2024-09-09')]),null);
});
test('upload after a demo clears both fictional accounts and household assumptions',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const nodes=new Map(),$=selector=>{if(!nodes.has(selector))nodes.set(selector,{value:'demo value',checked:true,disabled:false,hidden:false,innerHTML:'demo report',textContent:''});return nodes.get(selector);};
 const state={parsed:{card:{demo:true},chequing:{demo:true}},names:{},loads:{},transactions:[{demo:true}],quality:{},debts:[{balance:'999'}],page:2,lastReport:{demo:true},demoMode:true,$,E,window:{ResetPlanUI:{reset(){state.planReset=true;}}},debtRows(){},invalidate(){},status(){},mapping(){}};
 vm.createContext(state);vm.runInContext(src.match(/const fieldNames=\[[^;]+;/)[0]+src.slice(src.indexOf('function resetDemoForImport('),src.indexOf('\nfunction defaultDates(')),state);
 await vm.runInContext("load('card',{size:40,name:'fictional.csv',text:async()=> '2024-09-01,FICTIONAL SHOP,10,,90'})",state);
 assert.equal(state.demoMode,false);assert.equal(state.parsed.card.rows.length,1);assert.equal(state.parsed.chequing,undefined);assert.equal(state.planReset,true);assert.equal(state.transactions.length,0);assert.equal(state.debts.length,0);assert.equal(state.lastReport,null);
 assert.equal($('#reserve').value,'');assert.equal($('#confirmedSurplus').value,'');assert.equal($('#debt-status').value,'unknown');assert.equal($('#stability').value,'unknown');assert.equal($('#report').hidden,true);assert.equal($('#analyze').disabled,true);assert.equal($('#coverage').checked,false);
 await vm.runInContext("load('chequing',{size:40,name:'fictional-debit.csv',text:async()=> '2024-09-01,FICTIONAL PAY,,2000,3000'})",state);assert.equal(state.parsed.card.rows.length,1);assert.equal(state.parsed.chequing.rows.length,1);
});

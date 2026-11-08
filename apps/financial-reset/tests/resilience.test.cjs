const {test}=require('node:test'),assert=require('node:assert/strict');
require('../engine.js');require('../guidance.js');require('../resilience.js');
const E=globalThis.ResetEngine,G=globalThis.ResetGuidance,R=globalThis.ResetResilience;
function row(n,date,amount,flow='out',balance=null,category='Shopping',account='chequing'){return {row:n,id:String(n),date,amount,flow,balance,category,account,description:'FICTIONAL ENTRY '+n,merchant:'FICTIONAL ENTRY '+n,review:'Recognized'};}

test('municipal and other explicit tax entries use Taxes without absorbing benefits or merchant purchases',()=>{
 for(const description of ['COE EDMTAXES TAX','FICTIONAL MUNICIPAL TAX','PROPERTY TAX PAYMENT','INCOME TAX PAYMENT'])assert.equal(E.classify(description,'out','chequing'),'Taxes');
 assert.equal(E.classify('INCOME TAX REFUND','in','chequing'),'Taxes');
 assert.equal(E.classify('GST HST CREDIT','in','chequing'),'Government benefits & support');
 assert.equal(E.classify('HOME DEPOT SALES TAX','out','chequing'),'Home renovation');
 assert.notEqual(E.classify('TAXI TRIP','out','chequing'),'Taxes');
 const s=E.summarize([row(1,'2024-09-01',200,'out',null,'Taxes')],'2024-09-01','2024-09-30');
 const c={...E.contextNumbers({months:3,threshold:10}),debts:[],debtComplete:false,stability:'unknown'};
 assert.equal(G.build(s,c).matrix.find(r=>r.category==='Taxes').cells.length,4);
});

test('a full month uses its actual expense total for 3, 6 and 12 month scenarios',()=>{
 const result=R.build([row(1,'2024-09-01',1000,'out',1500)],'2024-09-01','2024-09-30');
 assert.equal(result.monthly,1000);assert.equal(result.observed.complete,true);assert.equal(result.available,1500);assert.equal(result.runway,1.5);
 assert.deepEqual(result.targets.map(t=>t.target),[3000,6000,12000]);assert.deepEqual(result.targets.map(t=>t.gap),[1500,4500,10500]);assert.deepEqual(result.targets.map(t=>t.coverage),[50,25,12.5]);
 assert.match(result.html,/1 complete calendar month/);assert.match(result.html,/As recorded on 2024-09-01/);
});

test('partial windows are labelled and extrapolated while complete multi-month windows use calendar averages',()=>{
 const partial=R.build([row(1,'2024-09-01',1000)],'2024-09-01','2024-09-10');assert.equal(partial.observed.complete,false);assert.equal(partial.monthly,3043.75);assert.match(partial.html,/Scaled from 10 days/);
 const full=R.build([row(1,'2024-07-01',3000)],'2024-07-01','2024-09-30');assert.equal(full.observed.months,3);assert.equal(full.monthly,1000);
});

test('cash estimates ignore card balances and reconcile latest same-day entries in either CSV order',()=>{
 const rows=[row(1,'2024-09-01',100,'out',900),row(2,'2024-09-02',200,'in',1100,'Income'),row(3,'2024-09-02',50,'out',1050),row(4,'2024-09-03',1,'out',99999,'Shopping','card')];
 assert.equal(R.recordedBalance(rows).amount,1050);assert.equal(R.recordedBalance(rows).date,'2024-09-02');
 const reverse=rows.slice().reverse().map((t,i)=>({...t,row:i+1}));assert.equal(R.recordedBalance(reverse).amount,1050);
 assert.equal(R.recordedBalance([row(1,'2024-09-03',1,'out',99999,'Shopping','card')]).amount,null);
});

test('conflicting same-day order and inconsistent running balances stay unknown',()=>{
 const ambiguous=[row(1,'2024-09-01',10,'out',90),row(2,'2024-09-01',10,'in',100)];assert.equal(R.recordedBalance(ambiguous).amount,null);
 const inconsistent=[row(1,'2024-09-01',10,'out',100),row(2,'2024-09-02',10,'out',85),row(3,'2024-09-02',20,'out',50)];assert.equal(R.recordedBalance(inconsistent).amount,null);
 const missing=R.build([row(1,'2024-09-01',1000)],'2024-09-01','2024-09-30');assert.equal(missing.available,null);assert.equal(missing.runway,null);assert.ok(missing.targets.every(t=>t.target>0&&t.gap===null&&t.coverage===null));
});

test('investments and card settlements do not inflate spending targets; refunds reduce spending',()=>{
 const rows=[row(1,'2024-09-01',2000,'in',null,'Income'),row(2,'2024-09-02',1200,'out',null,'Groceries','card'),row(3,'2024-09-03',200,'in',null,'Groceries','card'),row(4,'2024-09-04',1000,'out',null,'Transfer / card payment'),row(5,'2024-09-05',500,'out',null,'Investments')];
 assert.equal(R.build(rows,'2024-09-01','2024-09-30').monthly,1000);
});

test('entered budgets and reserves override estimates; zero and negative balances never imply infinite coverage',()=>{
 const rows=[row(1,'2024-09-01',1000,'out',5000)];
 const entered=R.build(rows,'2024-09-01','2024-09-30',{essentials:'1500',reserve:'4500'});assert.equal(entered.monthly,1500);assert.equal(entered.available,4500);assert.equal(entered.runway,3);assert.equal(entered.targets[0].gap,0);assert.equal(entered.source,'entered');assert.equal(entered.budgetSource,'entered');
 const zero=R.build(rows,'2024-09-01','2024-09-30',{reserve:'0'});assert.equal(zero.available,0);assert.equal(zero.runway,0);
 const debt=R.build([row(1,'2024-09-01',100,'out',-50)],'2024-09-01','2024-09-30');assert.equal(debt.balance.amount,-50);assert.equal(debt.available,0);
 for(const sample of [R.build(rows,'2024-09-01','2024-09-30',{essentials:0}),R.build([],'2024-09-01','2024-09-30'),R.build([row(1,'2024-09-01',20,'in',10,'Shopping')],'2024-09-01','2024-09-30')]){assert.equal(sample.monthly,null);assert.equal(sample.runway,null);assert.ok(sample.targets.every(t=>t.target===null));assert.ok(!/NaN|Infinity/.test(sample.html));}
 const excess=R.build(rows,'2024-09-01','2024-09-30',{reserve:100000});assert.ok(excess.targets.every(t=>t.coverage===100&&t.gap===0));
 assert.throws(()=>R.build(rows,'2024-09-01','2024-09-30',{reserve:-1}));assert.throws(()=>R.build(rows,'2024-09-01','2024-09-30',{essentials:'invalid'}));
});

test('review preview derives estimates without filling verified inputs and refreshes from user entries',()=>{
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const nodes=new Map(),$=key=>{if(!nodes.has(key))nodes.set(key,{value:'',innerHTML:'',events:{},addEventListener(name,fn){this.events[name]=fn;}});return nodes.get(key);};
 $('#start-date').value='2024-09-01';$('#end-date').value='2024-09-30';
 const state={$,transactions:[row(1,'2024-09-01',1000,'out',2000)],window:{ResetResilience:R},esc:String};vm.createContext(state);
 vm.runInContext(source.slice(source.indexOf('function renderResiliencePreview('),source.indexOf('\nfunction renderReviewChart(')),state);
 vm.runInContext("for(const id of ['start-date','end-date','reserve','essentials'])$('#'+id).addEventListener('input',renderResiliencePreview);renderResiliencePreview();",state);
 assert.match($('#resilience-preview').innerHTML,/2.0 months/);assert.equal($('#reserve').value,'');assert.equal($('#essentials').value,'');
 $('#reserve').value='4500';$('#essentials').value='1500';$('#reserve').events.input();assert.match($('#resilience-preview').innerHTML,/3.0 months/);assert.match($('#resilience-preview').innerHTML,/Savings available after bills, entered by you/);
 $('#essentials').value='2000';$('#essentials').events.input();assert.match($('#resilience-preview').innerHTML,/2.3 months/);
 $('#end-date').value='2024-08-01';$('#end-date').events.input();assert.match($('#resilience-preview').innerHTML,/Choose valid dates/);
});

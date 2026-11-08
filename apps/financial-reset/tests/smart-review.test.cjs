const {test}=require('node:test'),assert=require('node:assert/strict');
require('../engine.js');require('../guidance.js');require('../review-chart.js');
const E=globalThis.ResetEngine,G=globalThis.ResetGuidance,C=globalThis.ResetReviewChart;
function row(category,amount,flow='out',account='chequing',description='FICTIONAL ENTRY',date='2024-09-01'){return {id:description,row:1,category,amount,flow,account,description,date,merchant:E.merchant(description),review:'Unreviewed'};}

test('merchant and keyword matching handles school, grocery, retail, renovation and recreation',()=>{
 const cases=[['FICTIONAL SCHOOL FEE','Education & training'],['PC EXPRESS TEST','Groceries'],['PCEXPRESS TEST','Groceries'],['H & W PRODUCE TEST','Groceries'],['DOLLAR TREE TEST','Shopping'],['DOLLARAMA TEST','Shopping'],['THE HOME DEPOT TEST','Home renovation'],['HOMEDEPOT TEST','Home renovation'],['RONA TEST','Home renovation'],['LANDMARK CINEMAS TEST','Recreation'],['CINEPLEX TEST','Recreation'],['SWIM LESSON TEST','Recreation'],['FICTIONAL INV SERVICES','Investments'],['TD WATERHOUSE TEST','Investments']];
 for(const [description,category] of cases)assert.equal(E.classify(description,'out','chequing'),category,description);
 assert.equal(E.classify('PC EXPRESS REFUND','in','card'),'Groceries');
 assert.match(E.categorySuggestion('FICTIONAL INV SERVICES','out','chequing').reason,/may mean investment/);
});

test('specific payment contexts win over misleading broad keywords',()=>{
 const cases=[['UBER CANADA/UBEREATS TEST','Dining & shopping'],['UBER *TRIP TEST','Transport'],['UBER CANADA/UBERTRIP TEST','Transport'],['DOORDASHDASHPASS TEST','Subscriptions'],['DOORDASHPIZZA TEST','Dining & shopping'],['CHATGPT SUBSCR TEST','Subscriptions'],['HOMEDEPOTCCS TEST','Transfer / card payment'],['VISA PREAUTH PYMT TEST','Transfer / card payment'],['PC EXPRESS INV TEST','Groceries'],['AMAZON CASHBACK REWARD','Other'],['SHOPPERS DRUG MART TEST','Health & care'],['HOME DEPOT INV TEST','Home renovation'],['OLD SCHOOL CAFE TEST','Dining & shopping'],['AFTER SCHOOL CARE TEST','Childcare'],['FICTIONAL INVOICE TEST','Other'],['FICTIONAL INVISIBLE TEST','Other'],['E-TRANSFER IN','Other'],['INV ACCOUNT FEE','Bank fees']];
 for(const [description,category] of cases)assert.equal(E.classify(description,'out','chequing'),category,description);
 assert.equal(E.classify('FICTIONAL EMPLOYER PAY','in','chequing'),'Income');
 assert.notEqual(E.classify('FICTIONAL EMPLOYER PAY','out','chequing'),'Income');
 assert.notEqual(E.classify('FICTIONAL EMPLOYER PAY','in','card'),'Income');
 assert.equal(E.classify('ACCT BAL REBATE','in','chequing'),'Bank fees');
});

test('new spending categories receive all four saving-pillar cells',()=>{
 const s=E.summarize([row('Recreation',20),row('Shopping',30),row('Home renovation',40)],'2024-09-01','2024-09-30');
 const c={...E.contextNumbers({months:3,threshold:10}),debts:[],debtComplete:false,stability:'unknown'};
 const g=G.build(s,c);assert.deepEqual(new Set(g.matrix.map(r=>r.category)),new Set(['Recreation','Shopping','Home renovation']));assert.ok(g.matrix.every(r=>r.cells.length===4));
});

test('pie uses positive net spending, handles refunds and leaves income and investments out',()=>{
 const transactions=[row('Income',2000,'in'),row('Groceries',120),row('Groceries',20,'in','card'),row('Shopping',50),row('Home renovation',70),row('Recreation',30),row('Other',25),row('Investments',300),row('Transfer / card payment',100),row('Exclude',500),row('Other',40,'in'),row('Housing',900,'out','chequing','BEFORE','2024-08-31')];
 const c=C.build(transactions,'2024-09-01','2024-09-30');assert.equal(c.total,275);assert.equal(c.slices.find(s=>s.category==='Groceries').amount,100);assert.ok(Math.abs(c.slices.reduce((sum,s)=>sum+s.percent,0)-100)<1e-9);
 for(const category of ['Income','Investments','Transfer / card payment','Exclude','Housing'])assert.ok(!c.slices.some(s=>s.category===category));
 assert.ok(!/NaN|Infinity/.test(c.svg));assert.equal((c.svg.match(/<path /g)||[]).length,5);assert.match(c.html,/Explore all categories/);
});

test('pie supports one category, empty and refund-heavy periods, and changed categories or dates',()=>{
 assert.match(C.build([row('Shopping',10)],'2024-09-01','2024-09-30').svg,/<circle /);
 const transactions=[row('Groceries',10),row('Groceries',20,'in'),row('Recreation',15)];
 const c=C.build(transactions,'2024-09-01','2024-09-30');assert.equal(c.total,15);assert.equal(c.slices.length,1);
 const empty=C.build([row('Income',100,'in'),row('Groceries',10,'in')],'2024-09-01','2024-09-30');assert.equal(empty.total,0);assert.equal(empty.svg,'');assert.match(empty.html,/No positive net spending/);
 assert.equal(C.build([],'2024-09-01','2024-09-30').total,0);
 assert.equal(C.build([row('Investments',10)],'2024-09-01','2024-09-30').total,0);
 assert.equal(C.build([row('Shopping',10)],'2024-09-02','2024-09-30').total,0);
 assert.throws(()=>C.build([],'','2024-09-30'));assert.throws(()=>C.build([],'2024-10-01','2024-09-30'));
});

test('chart renderer filters the review table without altering its all-category totals',()=>{
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const buttons=[{dataset:{reviewCategory:'Shopping'},addEventListener(name,fn){this.click=fn;}},{dataset:{reviewCategory:'all'},addEventListener(name,fn){this.click=fn;}}];
 const nodes=new Map(),$=key=>{if(!nodes.has(key))nodes.set(key,{value:'',innerHTML:'',querySelectorAll:selector=>selector==='[data-review-category]'?buttons:[]});return nodes.get(key);};
 $('#start-date').value='2024-09-01';$('#end-date').value='2024-09-30';$('#search').value='old search';
 const state={$,page:3,transactions:[row('Shopping',50),row('Recreation',25)],window:{ResetReviewChart:C},renderTransactions(){state.rendered=true;}};vm.createContext(state);
 vm.runInContext(source.slice(source.indexOf('function renderReviewChart('),source.indexOf('\nfunction renderTransactions(')),state);vm.runInContext('renderReviewChart()',state);
 const html=$('#review-chart').innerHTML;assert.match(html,/Shopping/);assert.match(html,/Recreation/);
 buttons[0].click();assert.equal($('#category-filter').value,'Shopping');assert.equal($('#search').value,'');assert.equal(state.page,0);assert.equal(state.rendered,true);assert.equal($('#review-chart').innerHTML,html);
 buttons[1].click();assert.equal($('#category-filter').value,'all');
 state.transactions[0].category='Investments';vm.runInContext('renderReviewChart()',state);assert.ok(!$('#review-chart').innerHTML.includes('data-review-category="Shopping"'));
 $('#start-date').value='2024-10-01';vm.runInContext('renderReviewChart()',state);assert.match($('#review-chart').innerHTML,/Choose a valid start and end date/);
});

test('manual transaction corrections refresh the pie and preserve the chosen category',()=>{
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const control={dataset:{category:'FICTIONAL ENTRY'},value:'Recreation',addEventListener(name,fn){this.change=fn;}};
 const nodes=new Map(),$=key=>{if(!nodes.has(key))nodes.set(key,{value:'',innerHTML:'',querySelectorAll:selector=>selector==='[data-category]'?[control]:[]});return nodes.get(key);};$('#category-filter').value='all';
 const state={E,$,page:0,transactions:[row('Other',20)],esc:String,cash:String,invalidate(){state.invalidated=true;},renderReviewChart(){state.refreshed=true;},renderResiliencePreview(){state.resilienceRefreshed=true;}};vm.createContext(state);
 vm.runInContext(source.slice(source.indexOf('function renderTransactions('),source.indexOf('\nfunction debtRows(')),state);vm.runInContext('renderTransactions()',state);control.change();
 assert.equal(state.transactions[0].category,'Recreation');assert.equal(state.transactions[0].categoryReason,'Selected by you.');assert.equal(state.invalidated,true);assert.equal(state.refreshed,true);assert.equal(state.resilienceRefreshed,true);
 assert.match(source,/\['start-date','end-date'\].*addEventListener\('input',renderReviewChart\)/);
});

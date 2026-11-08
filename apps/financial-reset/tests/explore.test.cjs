const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
require('../engine.js');require('../resilience.js');require('../guidance.js');require('../explore-engine.js');require('../planner.js');
const M=globalThis.ResetExploreMath,E=globalThis.ResetEngine,P=globalThis.ResetPlanner;
const row=(id,category,amount,flow='out',account='card',merchant='Example')=>({id,row:Number(id)||1,date:'2026-09-10',category,amount,flow,account,merchant,description:merchant,review:'Recognized'});
const rows=[row('1','Transport',100),row('2','Transport',20,'in'),row('3','Transport',50,'out','card','Another'),row('4','Investments',500),row('5','Income',2000,'in','chequing'),row('6','Other',30,'in','chequing'),row('7','Transfer / card payment',400)];
const start='2026-09-01',end='2026-09-30';
test('explorer totals reconcile with spending and respect category, merchant, selected rows and refunds',()=>{
 const a=M.selection(rows,start,end);assert.equal(a.total,130);assert.equal(a.rows.length,3);assert.equal(a.monthly,130);assert.equal(a.complete,true);
 assert.equal(M.selection(rows,start,end,{category:'Transport',merchant:'Example'}).total,80);
 assert.equal(M.selection(rows,start,end,{category:'Transport',ids:['2','3']}).total,30);
 assert.equal(M.selection(rows,start,end,{category:'Groceries',ids:['1']}).total,0);
 assert.equal(M.groups(a.rows,'merchant')[0].name,'Example');
 const partial=M.selection(rows,'2026-09-05',end);assert.equal(partial.complete,false);assert.ok(Math.abs(partial.monthly-130/(26/30.4375))<1e-9);
});
test('work cost grosses up an already tax-inclusive charge without adding sales tax',()=>{
 const r=M.work(200,25,20);assert.equal(r.gross,250);assert.equal(r.hours,10);assert.equal(r.netHourly,20);
 for(const v of ['',NaN,Infinity,-1,100])assert.throws(()=>M.work(200,25,v));
 assert.throws(()=>M.work(200,0,20));assert.equal(M.work(200,25,0).gross,200);
});
test('annual projections need explicit recurrence and do not call spending a saving',()=>{
 assert.throws(()=>M.annual(50,'monthly',false));assert.equal(M.annual(50,'monthly',true).annual,600);
 assert.equal(M.annual(10,'weekly',true).annual,520);assert.equal(M.annual(10,'fortnightly',true).annual,260);
 assert.equal(M.annual(10,'yearly',true).annual,10);assert.throws(()=>M.annual(10,'daily',true));
});
test('cashback scenarios require eligibility and subtract additional costs, including negative net value',()=>{
 assert.throws(()=>M.cashback(200,0,false));assert.deepEqual(M.cashback(200,0,true).map(r=>r.reward),[2,4,6]);
 assert.deepEqual(M.cashback(200,5,true).map(r=>r.net),[-3,-1,1]);assert.throws(()=>M.cashback(200,'',true));
});
test('reductions use only the chosen saving and never alter their baseline',()=>{
 assert.deepEqual(M.reduction(200,50,-20,true),{monthly:50,annual:600,remaining:150,surplus:30});
 assert.equal(M.reduction(200,50,null,true).surplus,null);assert.throws(()=>M.reduction(200,201,0,true));assert.throws(()=>M.reduction(200,50,0,false));
});
test('emergency scenarios hold cash constant and reduce only the confirmed essential budget',()=>{
 const r=M.emergency(2000,6000,500,true);assert.equal(r.before,3);assert.equal(r.after,4);assert.equal(r.targets[0].after,4500);assert.equal(r.targets[1].gap,3000);assert.equal(r.targets[2].after,18000);
 assert.throws(()=>M.emergency(2000,6000,500,false));assert.throws(()=>M.emergency(2000,6000,2001,true));assert.equal(M.emergency(2000,6000,2000,true).after,null);
});
test('growth is a one-time amount with losses and zero return handled explicitly',()=>{
 assert.equal(M.growth(1000,10,0).end,1000);assert.equal(M.growth(1000,1,-50).end,500);assert.equal(M.growth(1000,10,-100).end,0);
 assert.ok(Math.abs(M.growth(1000,2,10).end-1210)<1e-8);assert.throws(()=>M.growth(1e12,80,100));
});
const scope={category:'Transport',merchant:'',ids:['1','2'],start,end};
const action=(id,impact,s=scope)=>({id,title:id,status:'todo',notes:'',due:'',impact,scope:s});
test('overlapping savings are blocked, while review-only actions and distinct costs remain possible',()=>{
 assert.throws(()=>P.checkOverlap([action('a',10),action('b',5)]),/Overlapping/);
 assert.doesNotThrow(()=>P.checkOverlap([action('a',10),action('b',null)]));
 assert.doesNotThrow(()=>P.checkOverlap([action('a',10),action('b',5,{...scope,ids:['3']})]));
 assert.doesNotThrow(()=>P.checkOverlap([action('a',10),action('b',5,{...scope,start:'2026-08-01',end:'2026-08-31'})]));
});
test('saved plans retain explorer scope and remain compatible with earlier unscoped plans',()=>{
 const s=E.summarize(rows,start,end),c={reserve:null,essentials:null,debtComplete:false,debts:[]};
 const data=P.snapshot({s,c,start,end},[action('explore-a',10)]);assert.deepEqual(P.validate(data).actions[0].scope,scope);
 delete data.actions[0].scope;assert.equal(P.validate(data).actions[0].id,'explore-a');
 data.actions=[action('explore-a',10),action('explore-b',5)];assert.throws(()=>P.validate(data),/Overlapping/);
});
test('five-step journey locks unavailable steps, preserves nodes and switches report/plan views',()=>{
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,dataset:{},focus(){this.focused=true;},scrollIntoView(){}});return nodes.get(id);};
 const buttons=['import','review','context','snapshot','plan'].map(step=>({dataset:{step},setAttribute(k,v){this[k]=v;}}));
 const state={window:{},document:{getElementById:get,querySelectorAll:selector=>selector==='[data-step]'?buttons:[],addEventListener(){}}};vm.createContext(state);vm.runInContext(fs.readFileSync(path.join(__dirname,'../journey.js'),'utf8'),state);const J=state.window.ResetJourney;
 assert.equal(get('import-section').hidden,false);assert.equal(buttons[1].disabled,true);J.go('plan');assert.equal(J.current(),'import');
 J.imported();assert.equal(J.current(),'review');J.go('context');assert.equal(get('context-section').hidden,false);assert.equal(get('review-section').hidden,true);
 J.reported();assert.equal(get('report').dataset.view,'snapshot');J.go('plan');assert.equal(get('report').dataset.view,'plan');J.full();assert.equal(get('report').dataset.view,'full');
 J.reset();assert.equal(get('report').hidden,true);assert.equal(buttons[4].disabled,true);
});
test('all application scripts parse, and explorer modules have no network or persistence calls',()=>{
 const dir=path.join(__dirname,'..');for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(dir,file),'utf8'),{filename:file});
 for(const file of ['explore-engine.js','explore-ui.js','journey.js'])assert.doesNotMatch(fs.readFileSync(path.join(dir,file),'utf8'),/\b(fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB)\b/);
});

test('work-time blocks represent partial days and scale large totals without losing time',()=>{
 const r=M.workTime(12,8,40);assert.equal(r.days,1.5);assert.equal(r.weeks,.3);assert.deepEqual(r.blocks,[8,4]);assert.equal(r.blockHours,8);
 const custom=M.workTime(12,6,30);assert.equal(custom.days,2);assert.equal(custom.weeks,.4);assert.deepEqual(custom.blocks,[6,6]);
 for(const hours of [0,.001,8,480,481,1e6,1e17]){const v=M.workTime(hours,8,40);assert.ok(v.blocks.length<=60);assert.ok(Math.abs(v.blocks.reduce((a,b)=>a+b,0)-hours)<=Math.max(1e-8,hours*1e-12));assert.ok(v.blocks.every(b=>b>=0&&b<=v.blockHours));}
 assert.throws(()=>M.workTime(8,0,40));assert.throws(()=>M.workTime(8,25,40));assert.throws(()=>M.workTime(8,8,0));
});

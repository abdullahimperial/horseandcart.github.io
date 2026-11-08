const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
require('../engine.js');require('../guidance.js');require('../intelligence.js');require('../resilience.js');
const E=globalThis.ResetEngine;
function render(context={}){
 const transactions=[{id:'fictional-1',row:1,account:'chequing',date:'2024-09-01',description:'FICTIONAL EXPENSE',merchant:'FICTIONAL EXPENSE',amount:1000,flow:'out',category:'Shopping',balance:1500,review:'Recognized'}];
 const start='2024-09-01',end='2024-09-30',s=E.summarize(transactions,start,end);
 const c={...E.contextNumbers({months:3,threshold:10}),debts:[],debtComplete:false,stability:'unknown',profile:{},...context};
 const nodes=new Map(),report={innerHTML:'',hidden:true,querySelectorAll:()=>[]};
 const $=selector=>{if(selector==='#report')return report;if(!nodes.has(selector))nodes.set(selector,{value:'',addEventListener(){},insertAdjacentHTML(position,html){report.innerHTML+=html;}});return nodes.get(selector);};
 const state={E,$,transactions,lastReport:{s,c,start,end,notes:''},demoMode:false,esc:String,cash:n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n),downloadReport(){},window:{ResetGuidance:globalThis.ResetGuidance,ResetIntelligence:globalThis.ResetIntelligence,ResetResilience:globalThis.ResetResilience,ResetPlanUI:{render(){}},ResetDashboard:{organize(){}}}};
 const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');vm.createContext(state);
 vm.runInContext(source.slice(source.indexOf('function renderReport(){'),source.indexOf('\nfunction downloadReport(')),state);vm.runInContext('renderReport()',state);
 return report.innerHTML;
}
test('actual report has one populated emergency section without manual budget or reserve entries',()=>{
 const html=render();
 assert.equal((html.match(/Emergency cushion at a glance/g)||[]).length,1);
 assert.ok(!html.includes('Emergency-system check'));assert.ok(!html.includes('What could absorb a shock?'));
 const section=html.match(/<section class="activity-card emergency-system-report">([\s\S]*?)<\/section>/)?.[1];assert.ok(section);
 assert.match(section,/Monthly spending estimate/);assert.match(section,/Last recorded chequing balance/);assert.match(section,/1\.5 months/);
 for(const amount of ['$1,000.00','$1,500.00','$3,000.00','$6,000.00','$12,000.00'])assert.ok(section.includes(amount),amount);
 assert.ok(!section.includes('Unknown'));assert.ok(!section.includes('Accessible savings you entered'));
});
test('the single emergency section respects entered values and preserves a custom reserve duration',()=>{
 const html=render({essentials:2000,reserve:3000,months:9,confirmedSurplus:500});
 assert.equal((html.match(/Emergency cushion at a glance/g)||[]).length,1);
 const section=html.match(/<section class="activity-card emergency-system-report">([\s\S]*?)<\/section>/)[1];
 assert.match(section,/Your essential monthly budget/);assert.match(section,/Your chosen 9-month plan/);
 assert.ok(section.includes('$18,000.00 target'));assert.ok(section.includes('$15,000.00 additional savings needed'));assert.match(section,/30\.0 months to fill/);
 assert.match(section,/Income\/obligations/);
});

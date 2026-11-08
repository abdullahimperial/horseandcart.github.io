/* Controller-level checks with a small DOM boundary; not browser layout tests. */
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
require('../engine.js');require('../resilience.js');require('../guidance.js');require('../explore-engine.js');
function fixture(){
 const nodes=new Map(),get=k=>{if(!nodes.has(k))nodes.set(k,{innerHTML:'',hidden:true,focus(){},scrollIntoView(){},replaceChildren(){this.innerHTML='';},querySelector:get,insertAdjacentHTML(_,html){this.innerHTML+=html;}});return nodes.get(k);};
 const handlers={},saved=[];let dialog;const rows=[{id:'1',row:1,account:'card',date:'2026-09-10',category:'Utilities',amount:200,flow:'out',merchant:'EXAMPLE INTERNET',description:'EXAMPLE INTERNET',review:'Recognized'}];
 const c={...globalThis.ResetEngine.contextNumbers({months:3,threshold:10,reserve:6000,essentials:2000}),debts:[],debtComplete:false,stability:'unknown',profile:{}};
 const state={window:{ResetExploreMath:globalThis.ResetExploreMath,ResetEngine:globalThis.ResetEngine,ResetGuidance:globalThis.ResetGuidance,ResetResilience:globalThis.ResetResilience,ResetPlanUI:{add:a=>saved.push(a)},ResetSnapshot:{status:e=>{throw Error(e);}}},document:{activeElement:{isConnected:true,focus(){}},createElement(){dialog={...get('dialog'),setAttribute(){},addEventListener:(type,fn)=>handlers[type]=fn,showModal(){this.open=true;},close(){this.open=false;handlers.close?.();},querySelector:get};return dialog;},body:{append(){}}},FormData:class{constructor(form){this.values=form.values;}get(key){return this.values[key]??null;}},Intl,MouseEvent:class{},Map};
 vm.createContext(state);vm.runInContext(fs.readFileSync(path.join(__dirname,'../explore-ui.js'),'utf8'),state);
 const api=state.window.ResetExplorer;api.init(()=>({rows,start:'2026-09-01',end:'2026-09-30',context:c,reportCurrent:false}));api.open({category:'Utilities'});
 const click=(attrs)=>{const dataset=Object.fromEntries(Object.entries(attrs).map(([k,v])=>[k.replace(/^data-/,'').replace(/-([a-z])/g,(_,x)=>x.toUpperCase()),v]));handlers.click({target:{closest(){return {dataset,hasAttribute:k=>k in attrs};}}});};
 const submit=(values,id='explore-form')=>handlers.submit({preventDefault(){},target:{id,values}});
 return {api,click,submit,get,saved,rows,dialog:()=>dialog};
}
test('explorer opens relevant choices without calculating or adding a plan action',()=>{
 const f=fixture();assert.match(f.dialog().innerHTML,/Monthly or annual payment/);assert.match(f.dialog().innerHTML,/Compare cashback/);assert.equal(f.saved.length,0);
 assert.match(f.dialog().innerHTML,/EXAMPLE INTERNET/);f.click({'data-group':'0'});assert.match(f.dialog().innerHTML,/Choose individual transactions/);
 for(const k of ['pillars','annual','work','cashback','yearly','reduce','emergency','growth','essential','mortgage','calendar','value']){f.click({'data-tool':k});assert.ok(f.get('#explore-tool').innerHTML.length>100,k);assert.equal(f.saved.length,0);}
});
test('scenario results are opt-in and action saving requires a separate explicit choice',()=>{
 const f=fixture(),original=JSON.stringify(f.rows);f.click({'data-tool':'work'});assert.match(f.get('#explore-tool').innerHTML,/Gross hourly pay/);assert.equal(f.saved.length,0);
 f.submit({amount:'200',hourly:'25',deductions:'20'});assert.match(f.get('#explore-result').innerHTML,/10\.0 working hours/);assert.match(f.get('#explore-result').innerHTML,/\$250\.00/);assert.equal(f.saved.length,0);
 f.click({'data-save-draft':''});assert.match(f.get('#explore-action').innerHTML,/Add to my plan/);
 f.submit({title:'Review work time',notes:'Ten hours',impact:'',due:''},'explore-action-form');assert.equal(f.saved.length,1);assert.equal(f.saved[0].impact,null);assert.equal(f.saved[0].scope.category,'Utilities');assert.equal(JSON.stringify(f.rows),original);
});
test('cashback eligibility is required and shows costs rather than just gross rewards',()=>{
 const f=fixture();f.click({'data-tool':'cashback'});f.submit({amount:'200',fees:'5'});assert.match(f.get('#explore-result').innerHTML,/Confirm the payment qualifies/);
 f.submit({amount:'200',fees:'5',eligible:'on'});assert.match(f.get('#explore-result').innerHTML,/-\$3\.00/);assert.match(f.get('#explore-result').innerHTML,/\$1\.00/);assert.equal(f.saved.length,0);
});
test('editing scenario inputs discards obsolete results and data invalidation closes the explorer',()=>{
 const f=fixture();f.click({'data-tool':'reduce'});f.submit({monthly:'200',cut:'50',confirmed:'on'});assert.match(f.get('#explore-result').innerHTML,/\$50\.00 less/);
 f.api.invalidate();assert.equal(f.dialog().open,false);assert.equal(f.saved.length,0);
});
test('a positive savings estimate cannot be added without confirming recurrence and overlap review',()=>{
 const f=fixture();f.click({'data-tool':'reduce'});f.submit({monthly:'200',cut:'50',confirmed:'on'});f.click({'data-save-draft':''});
 f.submit({title:'Reduce internet',notes:'Ask for quote',impact:'50',due:''},'explore-action-form');assert.equal(f.saved.length,0);assert.match(f.get('#explore-save-status').textContent,/Confirm/);
 f.submit({title:'Reduce internet',notes:'Ask for quote',impact:'50',due:'',unique:'on'},'explore-action-form');assert.equal(f.saved.length,1);assert.equal(f.saved[0].impact,50);
});

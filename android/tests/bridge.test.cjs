const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../web/android-bridge.js'),'utf8');
function setup(){
  const messages=[],listeners={},nodes=new Map(),blobs=new Map();let n=0,originalClicks=0;
  class Anchor { constructor(){this.href='';this.download='';} click(){originalClicks++;} }
  const context={Map,Blob,Event,HTMLAnchorElement:Anchor,URL:Object.assign(class extends URL {},{
    createObjectURL(blob){const key='blob:test-'+(++n);blobs.set(key,blob);return key;},revokeObjectURL(key){blobs.delete(key);}
  }),location:new URL('https://appassets.androidplatform.net/assets/site/apps/financial-reset/index.html'),requestAnimationFrame(fn){fn();},
  document:{getElementById(id){return nodes.get(id);},createElement(){return {setAttribute(){}};},body:{prepend(node){nodes.set(node.id,node);}},addEventListener(name,fn){listeners[name]=fn;}},
  addEventListener(name,fn){listeners[name]=fn;}};
  context.window=context;context.MoneySnapshotAndroid={postMessage(s){messages.push(JSON.parse(s));}};
  context.dispatchEvent=e=>listeners[e.type]?.(e);
  vm.createContext(context);vm.runInContext(source,context);
  return {context,messages,listeners,nodes,Anchor,get clicks(){return originalClicks;}};
}
test('exports report and action-plan blobs through native save without fetching or navigating',async()=>{
 const s=setup();
 for(const [filename,text] of [['money-snapshot-2026-09-01-to-2026-09-30.txt','Spending: $100'],['money-snapshot-plan-2026-09-30.json','{"version":1}']]){
  const a=new s.Anchor();a.href=s.context.URL.createObjectURL(new Blob([text]));a.download=filename;a.click();s.context.URL.revokeObjectURL(a.href);
  await new Promise(r=>setImmediate(r));assert.deepEqual(s.messages.at(-1),{type:'save',filename,text});
 }
 assert.equal(s.clicks,0);
});
test('unsupported names and oversized exports never reach the native bridge',async()=>{
 const s=setup();
 for(const [name,blob] of [['../../report.txt',new Blob(['private'])],['money-snapshot-test.txt',new Blob(['x'.repeat(8*1024*1024+1)])]]){
  const a=new s.Anchor();a.href=s.context.URL.createObjectURL(blob);a.download=name;a.click();
 }
 await new Promise(r=>setImmediate(r));assert.equal(s.messages.length,0);
});
test('printing requires a current visible report and dispatches beforeprint first',()=>{
 const s=setup();s.context.print();assert.equal(s.messages.length,0);
 s.nodes.set('report',{hidden:false});s.nodes.set('report-stale',{hidden:false});s.context.print();assert.equal(s.messages.length,0);
 let prepared=false;s.listeners.beforeprint=()=>prepared=true;s.nodes.get('report-stale').hidden=true;s.context.print();
 assert.equal(prepared,true);assert.deepEqual(s.messages,[{type:'print'}]);
});
test('lesson links preserve fragment and query, while internal anchors stay inside the app',()=>{
 const s=setup();let prevented=false;
 const click=href=>s.listeners.click({target:{closest:()=>({href})},preventDefault(){prevented=true;}});
 click('https://appassets.androidplatform.net/assets/site/course/module-3.html?lesson=savings#pillars');
 assert.equal(prevented,true);assert.match(s.messages[0].url,/\?lesson=savings#pillars$/);
 prevented=false;click(s.context.location.href+'#report');assert.equal(prevented,false);assert.equal(s.messages.length,1);
 click('javascript:alert(1)');assert.equal(s.messages.length,1);
});
test('native save results appear as text and do not execute markup',()=>{
 const s=setup();s.listeners['money-snapshot-native-status']({detail:'<img onerror=alert(1)>'});
 assert.equal(s.nodes.get('android-status').textContent,'<img onerror=alert(1)>');
});

// Interaction logic tests using a small DOM fixture. These do not check layout.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
class Element {
  constructor(){this.children=[];this.attributes={};this.dataset={};this.handlers={};this.hidden=false;this.textContent='';this.classList={add(){},remove(){},toggle(){}};}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,fn){this.handlers[k]=fn;}
}
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
const choices=['tap','leak','both'].map(answer=>{const e=new Element();e.dataset.answer=answer;return e;});
const document={getElementById:el,createElement:()=>new Element(),querySelectorAll:q=>{assert.equal(q,'[data-answer]');return choices;}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/tap-leak-game.js'),'utf8'),{document});
assert.equal(el('scenario-tabs').children.length,5);
assert.equal(el('scenario-feedback').hidden,true);
choices[0].onclick();assert.match(el('feedback-title').textContent,/You chose Adds a Tap/);assert.equal(el('bucket-scene').dataset.state,'leak');
choices[1].onclick();assert.equal(el('game-progress').textContent,'1 of 5 scenarios explored');
el('improve-choices').children[0].onclick();assert.match(el('improve-feedback').textContent,/Saving first can remove/);
el('scenario-tabs').children[2].onclick();choices[2].onclick();assert.match(el('feedback-detail').textContent,/not automatically a consumption leak/);
el('scenario-tabs').children[0].onclick();assert.match(el('improve-feedback').textContent,/Saving first can remove/);
el('scenario-tabs').children.forEach((tab,i)=>{tab.onclick();choices[i<2?1:2].onclick();});
assert.equal(el('game-progress').textContent,'5 of 5 scenarios explored');assert.equal(el('game-complete').hidden,false);
el('restart-game').onclick();assert.equal(el('game-complete').hidden,true);assert.equal(el('game-progress').textContent,'0 of 5 scenarios explored');assert.equal(el('scenario-feedback').hidden,true);
choices[1].handlers.drop({preventDefault(){},dataTransfer:{getData:()=> 'tap-leak-scenario'}});assert.equal(el('game-progress').textContent,'1 of 5 scenarios explored');
choices[2].handlers.drop({preventDefault(){},dataTransfer:{getData:()=> 'unrelated'}});assert.equal(choices[1].attributes['aria-pressed'],'true');
el('next-scenario').onclick();assert.match(el('scenario-title').textContent,/luxury/);
console.log('PASS: choices, feedback, improvement, navigation, progress, restart, valid/invalid drag-and-drop.');

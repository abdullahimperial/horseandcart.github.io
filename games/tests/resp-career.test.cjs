const assert=require('node:assert/strict');
require('../assets/life-engine.js');const E=globalThis.LifeEngine;
function run(job,children,resp){let s=E.fresh();E.roll(s,1);E.choose(s,'education','trades');E.roll(s,job);E.choose(s,'transport','used');E.roll(s,1);E.choose(s,'marriage',true);E.choose(s,'wedding','low');E.choose(s,'children',children);if(children)E.choose(s,'resp',resp);E.choose(s,'housing',20);return s;}
for(let job=1;job<=6;job++)for(const children of [0,1,2,5])for(const resp of [false,true]){
 const s=run(job,children,resp),career=s.ledger.filter(e=>e.text.startsWith('Career')),education=s.ledger.filter(e=>e.text==='RESP contributions');
 assert.equal(career.length,43);assert.deepEqual(career.map(e=>e.age),Array.from({length:43},(_,i)=>23+i));
 assert.equal(career.reduce((sum,e)=>sum+e.amount,0),43*E.RULES.jobs[job]);assert.equal(s.careerRoll,job);
 assert.equal(s.respPerChild,resp&&children?50000:0);
 assert.equal(education.reduce((sum,e)=>sum-e.amount,0),resp?children*50000:0);
 assert.equal(education.length,resp&&children?20:0);
 if(education.length){assert.equal(education[0].age,33);assert.equal(education.at(-1).age,52);}
 assert.equal(s.net,50000+43*E.RULES.jobs[job]-10000-19500-10000-children*272000-(resp?children*50000:0)-125000);
}
// Execute the real renderer with a minimal DOM, and check persistent UI output.
const fs=require('node:fs'),vm=require('node:vm'),elements={};
const document={getElementById(id){return elements[id]??={textContent:'',innerHTML:'',hidden:false,addEventListener(){},focus(){}};}};
const ctx=vm.createContext({LifeEngine:E,document,Intl,Math,setTimeout});vm.runInContext(fs.readFileSync(require.resolve('../assets/life.js'),'utf8'),ctx);
assert.equal(elements['career-summary'].hidden,true);
vm.runInContext("E.roll(state,1);choose('education','trades');render();",ctx);
assert.match(elements.stage.innerHTML,/High-paying job/);assert.match(elements.stage.innerHTML,/20,000/);
vm.runInContext("E.roll(state,1);render();",ctx);
assert.equal(elements['career-summary'].hidden,false);assert.match(elements['career-summary'].innerHTML,/20,000/);
vm.runInContext("choose('transport','used');E.roll(state,1);choose('marriage',true);choose('wedding','low');choose('children',1);",ctx);
assert.match(elements.stage.innerHTML,/50,000/);
vm.runInContext("choose('resp',true);choose('housing',20);",ctx);
assert.match(elements['career-summary'].innerHTML,/860,000/);assert.match(elements.stage.innerHTML,/50,000/);
vm.runInContext('restart()',ctx);assert.equal(elements['career-summary'].hidden,true);
console.log('PASS: 48 complete paths; all 6 career rolls applied exactly 43 times; RESP per-child caps, opt-out, age-52 cutoff, persistent summary, roll options, finish and restart.');

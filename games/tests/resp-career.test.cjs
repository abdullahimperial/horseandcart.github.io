// Run the real UI renderer and click handlers against a minimal DOM fixture.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');require('../assets/life-engine.js');
const elements={};const document={getElementById(id){return elements[id]??={textContent:'',innerHTML:'',hidden:false,handlers:{},addEventListener(k,f){this.handlers[k]=f;},focus(){}};}};
const ctx=vm.createContext({LifeEngine:globalThis.LifeEngine,document,Intl,Math,setTimeout});
vm.runInContext(fs.readFileSync(require.resolve('../assets/life.js'),'utf8'),ctx);
assert.equal(elements['career-summary'].hidden,true);
assert.match(elements.stage.innerHTML,/See the six funding outcomes/);
assert.match(elements.stage.innerHTML,/Registered Education Savings Plan/);
vm.runInContext("E.roll(state,1);choose('education','college');E.roll(state,1);render();",ctx);
assert.match(elements['career-summary'].innerHTML,/49,000/);assert.match(elements.stage.innerHTML,/4,000/);
vm.runInContext("choose('transport','transit');",ctx);
assert.match(elements.stage.innerHTML,/See the six relationship outcomes/);
assert.match(elements.stage.innerHTML,/20,000 per year/);
vm.runInContext("E.roll(state,1);render();",ctx);
assert.match(elements.stage.innerHTML,/Roll 1: Your partner spends carefully/);
assert.match(elements.stage.innerHTML,/500 per year/);
vm.runInContext("choose('marriage',true);choose('wedding','low');choose('children',2);",ctx);
assert.match(elements.stage.innerHTML,/43,200/);assert.match(elements.stage.innerHTML,/86,400/);assert.match(elements.stage.innerHTML,/72,000/);
assert.match(elements.stage.innerHTML,/per child across all RESPs/);
assert.match(elements.stage.innerHTML,/not a government penalty/);
vm.runInContext("choose('resp',false);",ctx);assert.match(elements.stage.innerHTML,/90,000 upfront/);
vm.runInContext("choose('housing','rent');",ctx);assert.match(elements.stage.innerHTML,/86,400.*age 50/);assert.match(elements.stage.innerHTML,/Replay same rolls/);
assert.match(elements.stage.innerHTML,/Education funding: 1/);
assert.match(elements.stage.innerHTML,/Career budget: 1/);
assert.match(elements.stage.innerHTML,/Relationship spending: 1/);
vm.runInContext("restart(true);E.roll(state,6);choose('education','college');E.roll(state,6);choose('transport','transit');E.roll(state,6);choose('marriage',true);choose('wedding','low');choose('children',2);choose('resp',true);choose('housing','rent');",ctx);
assert.match(elements.stage.innerHTML,/72,000/);assert.match(elements.stage.innerHTML,/Change:.*14,400/);assert.match(elements.stage.innerHTML,/Same dice and family choices/);
// Header restart must start a random game, not interpret the click event as replay=true.
elements.restart.handlers.click({type:'click'});assert.equal(elements['career-summary'].hidden,true);assert.match(elements.feedback.textContent,/random/);
console.log('PASS: renderer, education choices, per-family costs, replay comparison and header restart.');


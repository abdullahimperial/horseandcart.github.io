// DOM fixture tests interaction logic, not browser layout.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
class Element{
 constructor(){this.children=[];this.handlers={};this.dataset={};this.style={};this.value='';this.checked=false;this.classList={add(){},remove(){},toggle(){}};}
 set innerHTML(v){this.html=v;this.children=[];}
 get innerHTML(){return this.html||'';}
 addEventListener(k,f){this.handlers[k]=f;}
 setAttribute(k,v){this[k]=v;}
 append(e){this.children.push(e);e.parent=this;}
 prepend(e){this.children.unshift(e);e.parent=this;}
 get lastChild(){return this.children.at(-1);}
 remove(){this.parent.children.splice(this.parent.children.indexOf(this),1);}
}
const els=new Map(),el=id=>{if(!els.has(id))els.set(id,new Element());return els.get(id);};el('theme').value='book';
const document={getElementById:el,querySelectorAll:()=>[],createElement:()=>new Element()};
const context=vm.createContext({document,console,Math:Object.create(Math),setTimeout:f=>{f();return 1;},matchMedia:()=>({matches:true}),URL,Blob});
for(const f of ['board-geometry.js','snakes.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets',f),'utf8'),context);
async function roll(n){context.Math.random=()=> (n-1)/6+.001;await el('roll').handlers.click();}
(async()=>{
 assert.match(el('art').src,/board-book.jpg/);assert.equal((el('grid').innerHTML.match(/data-square=/g)||[]).length,100);
 await roll(4);assert.equal(el('board').dataset.position,16,'Ladder from 5 to 16');
 el('restart').handlers.click();await roll(6);assert.equal(el('board').dataset.position,7);assert.equal(el('roll').disabled,true);assert.match(el('event').innerHTML,/outside the numbered grid/);el('setback-square').value='3';el('apply-setback').onclick();assert.equal(el('board').dataset.position,3);assert.equal(el('roll').disabled,false);
 vm.runInContext('position=17;moveToken()',context);await roll(1);assert.equal(el('board').dataset.position,4,'Snake from 18 to 4');
 vm.runInContext('position=99;moveToken()',context);await roll(2);assert.equal(el('board').dataset.position,99,'Overshoot stays in place');await roll(1);assert.equal(el('board').dataset.position,100);assert.equal(el('roll').disabled,true);assert.match(el('status').textContent,/reached 100/);
 el('restart').handlers.click();assert.equal(el('board').dataset.position,1);assert.equal(el('roll').disabled,false);
 console.log('PASS: default artwork, 100 cells, ladder, snake, square-7 choice, exact finish and restart.');
})().catch(e=>{console.error(e);process.exitCode=1;});

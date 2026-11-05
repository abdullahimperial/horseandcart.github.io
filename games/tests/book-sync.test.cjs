const assert=require('node:assert/strict');require('../assets/life-engine.js');require('../assets/board-geometry.js');
const E=globalThis.LifeEngine,G=globalThis.BoardGeometry;
function run({career=1,education='college',funding=1,degree='low',car='transit',marry=false,partner=1,children=0,resp=false,home='rent',replay=[]}={}){
 const s=E.fresh(replay);E.roll(s,funding);E.choose(s,'education',education);if(s.stage==='degree')E.choose(s,'degree',degree);
 E.roll(s,career);E.choose(s,'transport',car);E.roll(s,partner);E.choose(s,'marriage',marry);if(marry)E.choose(s,'wedding','low');
 E.choose(s,'children',children);if(children)E.choose(s,'resp',resp);E.choose(s,'housing',home);return s;
}
const sum=(s,label)=>s.ledger.filter(e=>e.text===label).reduce((a,e)=>a+e.amount,0);
let s=run();assert.equal(s.net,1010500);assert.equal(s.age,65);assert.equal(s.stage,'finish');
assert.equal(sum(s,'Career: available annual budget'),49000*43);
assert.equal(sum(s,'Housing before age 37'),-24000*14);assert.equal(sum(s,'Rent'),-24000*29);
assert.equal(sum(s,'Public transit'),-1500*42);
for(let career=1;career<=6;career++)for(const education of ['college','trades','work'])for(const children of [0,1,2,5]){
 const yes=run({career,education,children,resp:true}),no=run({career,education,children,resp:false});
 assert.equal(yes.net-no.net,children*7200,'RESP saves exactly the basic grant for the same family and rent path');
 assert.equal(sum(yes,'RESP contributions'),(-36000*children)||0);assert.equal(sum(no,'RESP contributions'),0);
 assert.equal(sum(no,'Children’s education without an RESP'),(-43200*children)||0);assert.equal(sum(yes,'Children’s education without an RESP'),0);
 assert.equal(sum(yes,'Child living costs'),(-8000*18*children)||0);
 assert.equal(yes.respPerChild,children?36000:0);assert.ok(yes.respPerChild<=50000);
 const respYears=yes.ledger.filter(e=>e.text==='RESP contributions');assert.equal(respYears.length,children?15:0);
 if(children){assert.equal(respYears[0].age,33);assert.equal(respYears.at(-1).age,47);assert.equal(respYears.at(-1).amount,-1000*children);assert.equal(no.ledger.filter(e=>e.text==='Children’s education without an RESP').length,1);assert.equal(no.ledger.find(e=>e.text==='Children’s education without an RESP').age,50);}
 for(const result of [yes,no]){assert.equal(result.ledger.filter(e=>e.text.startsWith('Career')).length,43);assert.equal(result.net,result.ledger.reduce((a,e)=>a+e.amount,0));}
}
for(const car of ['used','cash','finance']){s=run({education:'trades',car});assert.equal(sum(s,'Car running and replacement allowance'),-4000*42);if(car==='finance'){assert.equal(s.ledger.filter(e=>e.text.includes('financing')).length,7);assert.equal(s.ledger.filter(e=>e.text.includes('financing')).reduce((a,e)=>a+e.amount,0),-56000);}}
for(const home of [5,10,15,20]){s=run({home});assert.equal(sum(s,'Home down payment · '+home+'%'),-450000*home/100);assert.equal(s.ledger.filter(e=>e.text.startsWith('Mortgage')).length,25);assert.equal(sum(s,'Home-value addition after 25 years'),450000);assert.equal(s.ledger.find(e=>e.text.startsWith('Home-value')).age,62);}
// Unaffordable choices must reject before any partial score or stage changes.
s=E.fresh();E.roll(s,4);E.choose(s,'education','college');assert.equal(s.stage,'degree');E.choose(s,'degree','high');E.roll(s,6);
for(const car of ['used','cash']){const before=JSON.stringify(s);assert.throws(()=>E.choose(s,'transport',car),/upfront/);assert.equal(JSON.stringify(s),before);}
E.choose(s,'transport','transit');E.roll(s,6);E.choose(s,'marriage',false);E.choose(s,'children',0);
for(const home of [5,10,15,20]){const before=JSON.stringify(s);assert.throws(()=>E.choose(s,'housing',home),/down payment/);assert.equal(JSON.stringify(s),before);}
E.choose(s,'housing','rent');assert.equal(s.stage,'finish');assert.ok(s.net<0);
// Exact affordability boundary, with payments recorded once.
s=E.fresh();Object.assign(s,{age:37,stage:'housing',net:22500,job:44000});E.choose(s,'housing',5);assert.equal(s.ledger[0].total,0);assert.equal(s.ledger[0].amount,-22500);
const original=run({funding:5,career:3,partner:4,children:2,resp:true});
const replay=run({funding:1,career:1,partner:1,children:2,resp:false,replay:original.rolls});assert.deepEqual(replay.rolls,original.rolls);assert.equal(original.net-replay.net,14400);
// The funding roll does not force an irrelevant degree choice for trades/work.
s=E.fresh();E.roll(s,4);E.choose(s,'education','trades');assert.equal(s.stage,'career-roll');assert.equal(s.net,50000);
const coords=new Set();for(let n=1;n<=100;n++){const c=G.cell(n),p=G.center(n,G.book);coords.add(c.row+','+c.col);assert.ok(p.x>0&&p.x<100&&p.y>0&&p.y<100);}assert.equal(coords.size,100);assert.ok(G.valid(G.book));
assert.deepEqual(G.snakes,{7:2,18:4,48:13,67:46,82:59});assert.deepEqual(G.ladders,{5:16,25:36,44:57,52:69,64:77,85:96});
for(const [a,b] of Object.entries(G.snakes))assert.ok(b<+a&&b>=1);for(const [a,b] of Object.entries(G.ladders))assert.ok(b>+a&&b<=100);
console.log('PASS: 144 matched RESP/non-RESP paths; all careers/training paths; education and child cutoffs; car and mortgage totals; affordability; identical-roll replay; all 100 board cells and fixed routes.');

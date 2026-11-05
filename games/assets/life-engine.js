/* Chapter 1: fixed, fictional amounts for a teaching game, not a forecast. */
(function(root){
'use strict';
const RULES=Object.freeze({usedCar:10000,newCar:40000,carFinance:8000,carAnnual:4000,transit:1500,weddingLow:10000,weddingHigh:40000,child:8000,childEnd:49,resp:2500,respFinal:1000,respEnd:47,respLimit:50000,respTarget:36000,grantMax:7200,educationCost:43200,educationAge:50,rent:24000,homePrice:450000,homeValue:450000,mortgages:{5:30000,10:28000,15:26000,20:23000},jobs:{1:44000,2:34000,3:29000,4:24000,5:19000,6:14000},training:{college:5000,trades:2500,work:0},partners:{1:500,2:2000,3:3000,4:4000,5:10000,6:20000}});
function fresh(replayRolls=[]){return {age:18,stage:'education-roll',net:0,ledger:[],educationRoll:null,degree:null,job:0,careerRoll:null,respPerChild:0,partner:0,married:false,children:0,resp:false,car:null,housing:null,rolls:[],replayRolls:replayRolls.map(r=>({...r}))};}
function record(s,amount,text,age=s.age){s.net+=amount;s.ledger.push({age,amount,text,total:s.net});}
function downPayment(percent){return RULES.homePrice*Number(percent)/100;}
function year(s,age){
 if(age>=23)record(s,s.job,'Career: available annual budget',age);
 if(age>=23&&age<=36)record(s,-RULES.rent,'Housing before age 37',age);
 if(s.car==='finance'&&age>=24&&age<=30)record(s,-RULES.carFinance,'New-car financing · year '+(age-23)+' of 7',age);
 if(age>=24&&s.car){record(s,-(s.car==='transit'?RULES.transit:RULES.carAnnual),s.car==='transit'?'Public transit':'Car running and replacement allowance',age);}
 if(age>=27&&(age<30||s.married))record(s,-s.partner,'Relationship spending',age);
 if(age>=32&&age<=RULES.childEnd&&s.children)record(s,-s.children*RULES.child,'Child living costs',age);
 if(age>=33&&age<=RULES.respEnd&&s.resp&&s.children){
  const contribution=Math.min(age===RULES.respEnd?RULES.respFinal:RULES.resp,RULES.respTarget-s.respPerChild,RULES.respLimit-s.respPerChild);
  if(contribution>0){s.respPerChild+=contribution;record(s,-s.children*contribution,'RESP contributions',age);}
 }
 if(age===RULES.educationAge&&s.children&&!s.resp)record(s,-s.children*RULES.educationCost,'Children’s education without an RESP',age);
 if(age>=37&&s.housing==='rent')record(s,-RULES.rent,'Rent',age);
 if(age>=37&&age<=61&&typeof s.housing==='number')record(s,-RULES.mortgages[s.housing],'Mortgage path · year '+(age-36)+' of 25',age);
 if(age===62&&typeof s.housing==='number')record(s,RULES.homeValue,'Home-value addition after 25 years',age);
}
function years(s,from,to){for(let a=from;a<=to;a++)year(s,a);s.age=to;}
function roll(s,r){
 if(!Number.isInteger(r)||r<1||r>6)throw Error('A die result must be 1–6.');
 if(!['education-roll','career-roll','partner-roll'].includes(s.stage))throw Error('This stage does not ask for a die roll.');
 const saved=s.replayRolls[s.rolls.length];if(saved)r=saved.value;
 if(!Number.isInteger(r)||r<1||r>6)throw Error('The saved die result is invalid.');
 s.rolls.push({age:s.age,value:r});
 if(s.stage==='education-roll'){s.educationRoll=r;s.stage='education';}
 else if(s.stage==='career-roll'){s.careerRoll=r;s.job=RULES.jobs[r]+RULES.training[s.education];year(s,23);s.age=24;s.stage='transport';}
 else{s.partner=RULES.partners[r];years(s,27,29);s.age=30;s.stage='marriage';}
 return s;
}
function choose(s,action,value){
 if(s.stage==='degree'&&action==='degree'){if(!['low','high'].includes(value))throw Error('Choose a printed degree path.');s.degree=value;s.stage='education';return choose(s,'education','college');}
 else if(s.stage==='education'&&action==='education'){
  if(!['college','trades','work'].includes(value))throw Error('Choose an education path.');
  if(value==='college'&&s.educationRoll===4&&!s.degree){s.stage='degree';return s;}
  if(value==='trades'||value==='work'){for(let age=18;age<=22;age++)record(s,value==='trades'?10000:5000,value==='trades'?'Apprenticeship savings':'Work savings',age);}
  else{const cost=s.educationRoll===4?(s.degree==='high'?20000:10000):s.educationRoll===5?5000:0;for(let age=18;age<=21;age++)record(s,-cost,'Education cost / support',age);}
  s.age=23;s.stage='career-roll';s.education=value;
 }
 else if(s.stage==='transport'&&action==='transport'){
  if(!['used','cash','finance','transit'].includes(value))throw Error('Choose a printed transport option.');
  const upfront=value==='cash'?RULES.newCar:value==='used'?RULES.usedCar:0;
  if(upfront&&s.net<upfront)throw Error('Your current score must cover the upfront car price. Choose transit or financing instead.');
  s.car=value;if(upfront)record(s,-upfront,value==='used'?'Used functional car':'New car paid upfront');
  year(s,24);years(s,25,26);s.age=27;s.stage='partner-roll';
 }
 else if(s.stage==='marriage'&&action==='marriage'){
  if(typeof value!=='boolean')throw Error('Choose yes or no.');s.married=value;
  if(s.married)s.stage='wedding';else{years(s,30,31);s.age=32;s.stage='children';}
 }
 else if(s.stage==='wedding'&&action==='wedding'){
  if(!['low','high'].includes(value))throw Error('Choose a printed wedding option.');
  record(s,-(value==='high'?RULES.weddingHigh:RULES.weddingLow),'Wedding · '+(value==='high'?'expensive':'reasonable'));years(s,30,31);s.age=32;s.stage='children';
 }
 else if(s.stage==='children'&&action==='children'){
  if(!Number.isInteger(value)||value<0||value>99)throw Error('Choose a whole number of children from 0 to 99.');s.children=value;year(s,32);s.age=33;
  if(value>0)s.stage='resp';else{years(s,33,36);s.age=37;s.stage='housing';}
 }
 else if(s.stage==='resp'&&action==='resp'){if(typeof value!=='boolean')throw Error('Choose yes or no.');s.resp=value;years(s,33,36);s.age=37;s.stage='housing';}
 else if(s.stage==='housing'&&action==='housing'){
  if(value!=='rent'&&!Object.hasOwn(RULES.mortgages,value))throw Error('Choose a printed housing path.');
  if(value!=='rent'&&s.net<downPayment(value))throw Error('Your current score must cover the down payment. Choose a smaller down payment or rent.');
  s.housing=value==='rent'?'rent':Number(value);
  if(value!=='rent')record(s,-downPayment(value),'Home down payment · '+value+'%');
  years(s,37,65);s.stage='finish';
 }else throw Error('This choice is not available at this stage.');
 return s;
}
root.LifeEngine={RULES,fresh,roll,choose,downPayment};
})(typeof window!=='undefined'?window:globalThis);

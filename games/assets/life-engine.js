/* Chapter 1 manuscript amounts; an educational game, not financial accounting. */
(function(root){
'use strict';
const RULES=Object.freeze({usedCar:10000,newCar:40000,carFinance:8000,transit:1500,weddingLow:10000,weddingHigh:40000,child:8000,resp:2500,rent:24000,homeValue:450000,mortgages:{5:30000,10:28000,15:26000,20:23000},jobs:{1:20000,2:10000,3:5000,4:0,5:-5000,6:-10000},partners:{1:500,2:2000,3:3000,4:4000,5:10000,6:20000}});
function fresh(){return {age:18,stage:'education-roll',net:0,ledger:[],educationRoll:null,degree:null,job:0,partner:0,married:false,children:0,resp:false,car:null,housing:null,rolls:[]};}
function record(s,amount,text,age=s.age){s.net+=amount;s.ledger.push({age,amount,text,total:s.net});}
function year(s,age){
 if(age>=23)record(s,s.job,s.job<0?'Career outcome: annual debt':'Career outcome: annual savings',age);
 if(s.car==='finance'&&age>=23&&age<=29)record(s,-RULES.carFinance,'New-car financing · year '+(age-22)+' of 7',age);
 if(s.car==='transit'&&age>=23)record(s,-RULES.transit,'Public transit',age);
 if(age>=27&&(age<30||s.married))record(s,-s.partner,'Relationship spending',age);
 if(age>=32&&s.children)record(s,-s.children*RULES.child,'Children · '+s.children+' × $8,000',age);
 if(age>=33&&s.resp&&s.children)record(s,-s.children*RULES.resp,'RESP contributions',age);
 if(age>=37&&s.housing==='rent')record(s,-RULES.rent,'Rent',age);
 if(age>=37&&age<=61&&typeof s.housing==='number')record(s,-RULES.mortgages[s.housing],'Mortgage path · year '+(age-36)+' of 25',age);
 if(age===62&&typeof s.housing==='number')record(s,RULES.homeValue,'Book’s home-value addition after 25 years',age);
}
function years(s,from,to){for(let a=from;a<=to;a++)year(s,a);s.age=to;}
function roll(s,r){
 if(!Number.isInteger(r)||r<1||r>6)throw Error('A die result must be 1–6.');
 if(!['education-roll','career-roll','partner-roll'].includes(s.stage))throw Error('This stage does not ask for a die roll.');
 s.rolls.push({age:s.age,value:r});
 if(s.stage==='education-roll'){s.educationRoll=r;s.stage=r===4?'degree':'education';}
 else if(s.stage==='career-roll'){s.job=RULES.jobs[r];record(s,s.job,s.job<0?'Career roll: annual debt':'Career roll: annual savings',23);s.stage='transport';}
 else if(s.stage==='partner-roll'){s.partner=RULES.partners[r];years(s,27,29);s.age=30;s.stage='marriage';}
 else throw Error('This stage does not ask for a die roll.');
 return s;
}
function choose(s,action,value){
 if(s.stage==='degree'&&action==='degree'){if(!['low','high'].includes(value))throw Error('Choose a printed degree path.');s.degree=value;s.stage='education';}
 else if(s.stage==='education'&&action==='education'){
  if(!['college','trades','work'].includes(value))throw Error('Choose an education path.');
  if(value==='trades'||value==='work'){for(let age=18;age<=22;age++)record(s,value==='trades'?10000:5000,value==='trades'?'Apprenticeship savings':'Work savings',age);}
  else{const cost=s.educationRoll===4?(s.degree==='high'?20000:10000):s.educationRoll===5?5000:0;for(let age=18;age<=21;age++)record(s,-cost,'Education cost / support',age);}
  s.age=23;s.stage='career-roll';s.education=value;
 }
 else if(s.stage==='transport'&&action==='transport'){
  if(!['used','cash','finance','transit'].includes(value))throw Error('Choose a printed transport option.');
  if(value==='cash'&&s.net<RULES.newCar)throw Error('The book permits a new car paid upfront only if you can afford $40,000.');
  s.car=value;
  if(value==='used')record(s,-RULES.usedCar,'Used functional car');
  if(value==='cash')record(s,-RULES.newCar,'New car paid upfront');
  if(value==='finance')record(s,-RULES.carFinance,'New-car financing · year 1 of 7');
  if(value==='transit')record(s,-RULES.transit,'Public transit');
  years(s,24,26);s.age=27;s.stage='partner-roll';
 }
 else if(s.stage==='marriage'&&action==='marriage'){
  s.married=value===true;
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
 else if(s.stage==='resp'&&action==='resp'){s.resp=value===true;years(s,33,36);s.age=37;s.stage='housing';}
 else if(s.stage==='housing'&&action==='housing'){
  if(value!=='rent'&&!Object.hasOwn(RULES.mortgages,value))throw Error('Choose a printed housing path.');s.housing=value==='rent'?'rent':Number(value);years(s,37,62);s.stage='finish';
 }else throw Error('This choice is not available at this stage.');
 return s;
}
root.LifeEngine={RULES,fresh,roll,choose};
})(typeof window!=='undefined'?window:globalThis);

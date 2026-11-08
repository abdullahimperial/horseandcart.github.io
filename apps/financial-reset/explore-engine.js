/* Optional scenarios. Pure calculations; no network, storage or automatic plan edits. */
(function(root){'use strict';
const E=root.ResetEngine;
function number(value,label,min=0,max=1e12){
 if(value===null||value===undefined||String(value).trim()==='')throw Error('Enter '+label+'.');
 const n=Number(value);if(!Number.isFinite(n)||n<min||n>max)throw Error('Check '+label+'.');return n;
}
function spending(t){return !['Income','Government benefits & support','Investments','Transfer / card payment','Exclude'].includes(t.category)&&!(t.account==='chequing'&&t.flow==='in'&&t.category==='Other');}
function merchant(t){return t.merchantName||t.merchant||t.description;}
function selection(rows,start,end,scope={}){
 const selected=rows.filter(t=>t.date>=start&&t.date<=end&&spending(t)&&(!scope.category||t.category===scope.category)&&(!scope.merchant||merchant(t)===scope.merchant)&&(!scope.ids||scope.ids.includes(t.id)));
 const s=E.summarize(selected,start,end),basis=root.ResetResilience.monthlyBasis(s,start,end);
 return {rows:selected,total:s.expenses,monthly:s.expenses/basis.months,months:basis.months,complete:basis.complete,start,end,
  scope:{category:scope.category||'',merchant:scope.merchant||'',ids:selected.map(t=>t.id),start,end}};
}
function groups(rows,key){const m=new Map();for(const t of rows){const k=key==='category'?t.category:merchant(t);if(!m.has(k))m.set(k,{name:k,total:0,count:0});const r=m.get(k);r.total+=t.flow==='out'?t.amount:-t.amount;r.count++;}return [...m.values()].sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name));}
function work(amount,hourly,deductions){amount=number(amount,'spending');hourly=number(hourly,'gross hourly pay',.01,1e7);deductions=number(deductions,'combined payroll deduction percentage',0,99.9);const netHourly=hourly*(1-deductions/100);return {gross:amount/(1-deductions/100),hours:amount/netHourly,netHourly};}
function workTime(hours,day=8,week=40){
 hours=number(hours,'working hours',0,1e20);day=number(day,'hours per workday',.01,24);week=number(week,'paid hours per week',.01,168);
 const days=hours/day,weeks=hours/week,daysPerBlock=Math.max(1,Math.ceil(days/60)),blockHours=day*daysPerBlock;
 const count=Math.min(60,Math.ceil(hours/blockHours));
 const blocks=Array.from({length:count},(_,i)=>Math.max(0,Math.min(blockHours,hours-i*blockHours)));
 return {hours,day,week,days,weeks,daysPerBlock,blockHours,blocks};
}
function incomeBasis(rows,start,end){
 const summary=E.summarize(rows,E.date(start),E.date(end)),basis=root.ResetResilience.monthlyBasis(summary,start,end);
 const deposits=summary.active.filter(t=>t.account==='chequing'&&t.flow==='in'&&['Income','Government benefits & support'].includes(t.category));
 const payroll=deposits.filter(t=>t.category==='Income'&&!/\b(?:pension|refund|reimbursement)\b/i.test(t.description)&&/\b(?:payroll|salary|wages|employer pay)\b|direct deposit.*\bpay\b|\bpay$/i.test(t.description));
 const total=list=>list.reduce((sum,t)=>sum+t.amount,0),payrollTotal=total(payroll),benefitsTotal=total(deposits.filter(t=>t.category==='Government benefits & support'));
 return {deposits,payroll,months:basis.months,complete:basis.complete,days:summary.days,total:summary.income,
  monthlyIncome:deposits.length?summary.income/basis.months:null,monthlyPay:payroll.length?payrollTotal/basis.months:null,
  monthlyBenefits:benefitsTotal/basis.months,monthlyOther:(summary.income-payrollTotal-benefitsTotal)/basis.months,
  monthlyExpenses:summary.expenses/basis.months,unclassifiedCredits:summary.otherCredits,duplicates:summary.duplicates.length};
}
function depositedWork(amount,income,pay,hours,weeks,deductions){
 const optional=(v,label,min=0,max=1e12)=>v===null||v===undefined||String(v).trim()===''?null:number(v,label,min,max);
 amount=number(amount,'spending');income=optional(income,'monthly income');pay=optional(pay,'monthly take-home pay');
 hours=optional(hours,'paid hours per week',.01,168);weeks=optional(weeks,'paid weeks per year',.01,52);deductions=optional(deductions,'combined payroll deduction percentage',0,99.9);
 if(income!==null&&pay!==null&&pay>income)throw Error('Monthly income including benefits must be at least the take-home work pay.');
 const netHourly=pay>0&&hours>0&&weeks>0?pay*12/(hours*weeks):null;
 return {share:income>0?amount/income*100:null,netHourly,hours:netHourly===null?null:amount/netHourly,
  gross:deductions===null?null:amount/(1-deductions/100),annualPay:pay===null?null:pay*12};
}
function annual(amount,frequency,confirmed){if(!confirmed)throw Error('Confirm how often this expense repeats.');amount=number(amount,'cost per occurrence');const factors={weekly:52,fortnightly:26,monthly:12,quarterly:4,yearly:1};if(!factors[frequency])throw Error('Choose a frequency.');return {annual:amount*factors[frequency],monthly:amount*factors[frequency]/12};}
function cashback(amount,fees,eligible){if(!eligible)throw Error('Confirm the payment qualifies for the reward scenario.');amount=number(amount,'eligible spending');fees=number(fees,'additional costs for the same period');return [1,2,3].map(rate=>({rate,reward:amount*rate/100,net:amount*rate/100-fees}));}
function reduction(monthly,cut,surplus,confirmed){if(!confirmed)throw Error('Confirm a recurring monthly cost before projecting a reduction.');monthly=number(monthly,'monthly cost');cut=number(cut,'monthly reduction',0,monthly);return {monthly:cut,annual:12*cut,remaining:monthly-cut,surplus:surplus===null?null:number(surplus,'baseline surplus',-1e12)+cut};}
function emergency(budget,reserve,cut,essential){budget=number(budget,'essential monthly budget',.01);reserve=number(reserve,'available savings');cut=number(cut,'monthly reduction',0,budget);if(!essential)throw Error('Confirm that the reduction is included in this essential budget.');const after=budget-cut;return {before:reserve/budget,after:after>0?reserve/after:null,budget:after,targets:[3,6,12].map(months=>({months,before:budget*months,after:after*months,gap:Math.max(0,after*months-reserve)}))};}
function growth(amount,years,rate){amount=number(amount,'amount set aside');years=number(years,'years',1,80);rate=number(rate,'assumed yearly return',-100,100);const end=amount*Math.pow(1+rate/100,years);if(!Number.isFinite(end)||end>1e15)throw Error('Use a smaller amount, rate or duration.');return {end,gain:end-amount,points:Array.from({length:Math.floor(years)+1},(_,year)=>({year,value:amount*Math.pow(1+rate/100,year)}))};}
function overlaps(a,b){if(!a||!b||a.start!==b.start||a.end!==b.end)return false;return a.ids.some(id=>b.ids.includes(id));}
root.ResetExploreMath={number,spending,merchant,selection,groups,work,workTime,incomeBasis,depositedWork,annual,cashback,reduction,emergency,growth,overlaps};
})(typeof window!=='undefined'?window:globalThis);

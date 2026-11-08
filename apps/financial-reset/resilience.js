/* Spending-based scenarios and recorded cash, computed only in this browser. */
(function(root){'use strict';
const E=root.ResetEngine;
const cash=value=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:2}).format(value);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const finite=value=>typeof value==='number'&&Number.isFinite(value);
function recordedBalance(transactions){
 const rows=transactions.filter(t=>t.account==='chequing').slice().sort((a,b)=>a.row-b.row);
 const balances=rows.filter(t=>finite(t.balance));
 if(!balances.length)return {amount:null,date:null,reason:'No chequing balance column was imported.'};
 const date=balances.map(t=>t.date).sort().at(-1),latest=balances.filter(t=>t.date===date);
 const values=[...new Set(latest.map(t=>t.balance))];
 if(values.length===1)return {amount:values[0],date,reason:'Last recorded chequing balance.'};
 // Infer order only if dates are chronological and adjacent running balances
 // reconcile. A reverse-ordered export is just as valid as an ascending one.
 const candidates=[];
 for(const sequence of [rows,rows.slice().reverse()]){
  let checks=0,valid=true;
  for(let i=1;i<sequence.length;i++){
   const previous=sequence[i-1],current=sequence[i];
   if(previous.date>current.date){valid=false;break;}
   if(finite(previous.balance)&&finite(current.balance)){
    checks++;
    if(Math.abs(current.balance-previous.balance-(current.flow==='in'?current.amount:-current.amount))>.011){valid=false;break;}
   }
  }
  if(valid&&checks)candidates.push(sequence.filter(t=>t.date===date&&finite(t.balance)).at(-1).balance);
 }
 if(candidates.length&&new Set(candidates).size===1)return {amount:candidates[0],date,reason:'Running balances identify the last entry in the export.'};
 return {amount:null,date,reason:'Several balances share the latest date and their order cannot be confirmed. Enter available savings below.'};
}
function monthlyBasis(summary,start,end){
 const [sy,sm,sd]=start.split('-').map(Number),[ey,em,ed]=end.split('-').map(Number);
 const complete=sd===1&&ed===new Date(Date.UTC(ey,em,0)).getUTCDate();
 const months=complete?(ey-sy)*12+em-sm+1:summary.months;
 return {complete,months,amount:summary.expenses>0?summary.expenses/months:null};
}
function optionalAmount(value){
 if(value===null||value===undefined||String(value).trim()==='')return null;
 const n=E.number(value);if(n<0)throw Error('Use a non-negative amount.');return n;
}
function build(transactions,start,end,options={}){
 start=E.date(start);end=E.date(end);
 const summary=E.summarize(transactions,start,end),observed=monthlyBasis(summary,start,end),balance=recordedBalance(transactions);
 const enteredBudget=optionalAmount(options.essentials),enteredReserve=optionalAmount(options.reserve);
 const monthly=enteredBudget===null?observed.amount:enteredBudget>0?enteredBudget:null;
 const available=enteredReserve===null?(balance.amount===null?null:Math.max(0,balance.amount)):enteredReserve;
 const source=enteredReserve===null?'recorded':'entered',budgetSource=enteredBudget===null?'observed':'entered';
 const runway=monthly!==null&&available!==null?available/monthly:null;
 const targets=[3,6,12].map(months=>{
  const target=monthly===null?null:monthly*months;
  return {months,target,gap:target===null||available===null?null:Math.max(0,target-available),coverage:target===null||available===null?null:Math.min(100,available/target*100)};
 });
 const basis=observed.complete?`Average over ${observed.months} complete calendar month${observed.months===1?'':'s'}.`:`Scaled from ${summary.days} days to a 30.4375-day month. A short window may miss regular bills or contain unusual costs.`;
 const budgetLabel=budgetSource==='entered'?'Your essential monthly budget':'Monthly spending estimate';
 const sourceLabel=source==='entered'?'Savings available after bills, entered by you':'Recorded chequing cash before commitments';
 const period=`${start} to ${end}`;
 const cards=targets.map(t=>`<article class="reserve-target"><h4>${t.months} months</h4><strong class="reserve-target-amount">${t.target===null?'Budget needed':cash(t.target)}</strong><svg class="reserve-progress" viewBox="0 0 100 10" aria-hidden="true"><rect x="0" y="0" width="100" height="10" rx="5" fill="#e3e9e4"/>${t.coverage===null?'':`<rect x="0" y="0" width="${t.coverage.toFixed(4)}" height="10" rx="5" fill="#23665b"/>`}</svg><p>${t.coverage===null?'Coverage unknown':`${t.coverage.toFixed(1)}% covered`}</p><p class="reserve-gap">${t.gap===null?'Enter a monthly budget and available savings to calculate the gap.':t.gap>0?`${cash(t.gap)} more to reach this amount`:'This amount is covered by the cash used in this comparison.'}</p></article>`).join('');
 const html=`<div class="eyebrow">From spending to resilience</div><h3>Emergency cushion at a glance</h3><p class="calc-help">Spending window: ${esc(period)}. ${budgetSource==='observed'?esc(basis):'Uses the essential budget you entered below.'}</p><div class="reserve-metrics"><div><span>${budgetLabel}</span><strong>${monthly===null?'Unknown':cash(monthly)}</strong><small>${budgetSource==='observed'?'Net spending, before investment transfers':'Your budget overrides the spending estimate'}</small></div><div><span>Last recorded chequing balance</span><strong>${balance.amount===null?'Unknown':cash(balance.amount)}</strong><small>${balance.date?`As recorded on ${esc(balance.date)}`:'No recorded balance'}${balance.amount===null?` · ${esc(balance.reason)}`:''}</small></div><div><span>Estimated cash coverage</span><strong>${runway===null?'Unknown':`${runway.toFixed(1)} months`}</strong><small>${available===null?'Available cash not established':`${cash(available)} used in this comparison`}</small></div></div><p class="reserve-source"><strong>${sourceLabel}.</strong> ${source==='recorded'?'The CSV balance is dated, not a live bank balance. Upcoming bills may already commit some of it. Enter your available emergency savings below to use that amount instead.':'Includes any other liquid savings you counted in your entry.'}${balance.amount!==null&&balance.amount<0?' A negative recorded balance contributes no emergency cash.':''}</p><div class="reserve-targets">${cards}</div><p class="calc-help">These are 3-, 6- and 12-month scenarios at the chosen monthly budget. Adjust your essential budget below for one-off purchases, annual bills and missing expenses. Investments, card limits and expected future income are not added to cash.</p>`;
 return {summary,observed,balance,monthly,available,runway,source,budgetSource,targets,html};
}
root.ResetResilience={recordedBalance,monthlyBasis,build};
})(typeof window!=='undefined'?window:globalThis);

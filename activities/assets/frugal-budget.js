'use strict';
/*
FUTURE LIVE DATA BACKEND:
Replace the mixed sourced/illustrative seed data with a versioned, server-validated response from a same-origin budget-report API.
Suggested contract: {household, generatedAt, dataAsOf, items:[{category,monthlyCost,sourceUrl,sourceTitle,checkedAt,availability,eligibility,fees,confidence}], benefits, warnings}.
Keep provider/search keys server-side. Use permissioned APIs; respect source terms. Never promise "cheapest" without a defined comparable search scope, availability, fees and location.
Cache with expiry; label stale/missing data and offer manual entry rather than silently using sample prices. Authenticate/validate/rate-limit as appropriate; minimize personal data and set retention policy.
Use authoritative benefit rules and required household inputs; prevent overlapping benefits and subsidy double counting. Distinguish verified eligibility, estimates, waitlisted support and fictional assumptions.
Do not equate page-load time with source verification time. Render sources per item and at report end; show failures explicitly.
*/
(function(){
 const byId=id=>document.getElementById(id);
 const inputs=[byId('earnings'),byId('benefits'),...document.querySelectorAll('[data-cost]')];
 const original=inputs.map(x=>x.value);
 const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
 function update(){
  const valid=inputs.every(x=>x.value.trim()!==''&&Number.isFinite(Number(x.value))&&Number(x.value)>=0);
  byId('invalid').hidden=valid;
  if(!valid){byId('report').textContent='Report unavailable until all amounts are valid.';return;}
  const income=Number(inputs[0].value)+Number(inputs[1].value);
  const out=inputs.slice(2).reduce((s,x)=>s+Number(x.value),0);
  byId('report').replaceChildren();
  const values=[['Monthly income',income],['Spending and allocations',out],[income-out>=0?'Unallocated monthly balance':'Monthly shortfall',Math.abs(income-out)]];
  values.forEach(([label,value])=>{const p=document.createElement('p');p.className='total';p.textContent=label+': '+money(value);byId('report').appendChild(p);});
 }
 // FUTURE: bind offer selection to versioned offer IDs, quoted tax/fees and expiry, not a universal cheapest-price claim.
 document.querySelectorAll('[data-budget-set]').forEach(button=>button.addEventListener('click',()=>{
  byId('cost-'+button.dataset.budgetSet).value=button.dataset.value;update();
 }));
 inputs.forEach(x=>x.addEventListener('input',update));
 byId('reset').addEventListener('click',()=>{inputs.forEach((x,i)=>x.value=original[i]);update();});
 byId('print').addEventListener('click',()=>window.print());
 update();
})();
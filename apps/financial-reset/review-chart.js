/* Local SVG chart; no remote scripts, requests or transaction storage. */
(function(root){'use strict';
const colors=['#23665b','#b74e31','#3b6ea8','#96672c','#79529c','#39828b','#b34d78','#5a702d','#855746','#575ca4','#8b671e','#417951','#a84b50','#47728c','#786744','#8d597b','#666d75','#81513a','#47615c','#6c6591'];
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cash=value=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:2}).format(value);
function build(transactions,start,end){
 const E=root.ResetEngine,s=E.summarize(transactions,E.date(start),E.date(end));
 const entries=Object.entries(s.totals).filter(([,amount])=>amount>0).sort((a,b)=>b[1]-a[1]);
 const total=entries.reduce((sum,[,amount])=>sum+amount,0);
 let angle=-Math.PI/2;
 const slices=entries.map(([category,amount])=>{
  const fraction=amount/total,finish=angle+fraction*Math.PI*2;
  const point=a=>`${(120+105*Math.cos(a)).toFixed(6)} ${(120+105*Math.sin(a)).toFixed(6)}`;
  const path=`M 120 120 L ${point(angle)} A 105 105 0 ${fraction>.5?1:0} 1 ${point(finish)} Z`;
  const color=colors[Math.max(0,E.categories.indexOf(category))%colors.length];
  angle=finish;return {category,amount,percent:fraction*100,path,color};
 });
 const shapes=slices.map(slice=>{
  const title=`${slice.category}: ${cash(slice.amount)} (${slice.percent.toFixed(1)}%)`;
  return slices.length===1?`<circle cx="120" cy="120" r="105" fill="${slice.color}"><title>${esc(title)}</title></circle>`:`<path d="${slice.path}" fill="${slice.color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"><title>${esc(title)}</title></path>`;
 }).join('');
 const svg=total?`<svg xmlns="http://www.w3.org/2000/svg" class="review-pie" viewBox="0 0 240 240" role="img" aria-label="Spending by category. Amounts and percentages are listed beside the chart."><title>Spending by category</title>${shapes}</svg>`:'';
 const legend=slices.map(slice=>`<li><button type="button" class="review-chart-category" data-review-category="${esc(slice.category)}" aria-label="Show ${esc(slice.category)} transactions"><svg class="review-chart-swatch" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="${slice.color}"/></svg><span>${esc(slice.category)}</span><span class="review-chart-amount"><strong>${cash(slice.amount)}</strong><small>${slice.percent.toFixed(1)}%</small></span></button></li>`).join('');
 const body=total?`<div class="review-chart-layout"><figure>${svg}<figcaption><strong>${cash(total)}</strong><span>Spending shown in the pie</span></figcaption></figure><ul class="review-chart-legend">${legend}</ul></div>`:'<p class="review-chart-empty">No positive net spending in these dates. Income, investments and transfers are shown separately in the report.</p>';
 const html=`<div class="review-chart-heading"><div><h3>Spending by category</h3><p>${esc(start)} to ${esc(end)} · ${s.active.length} transactions in this window</p></div><button type="button" class="btn small light" data-review-category="all">Show all transactions</button></div>${body}<p class="calc-help">Select a category to filter the transaction table below. The pie uses all transactions in the chosen dates, regardless of table filters. Refunds reduce their categories; categories at zero or below are not slices. Income, investments, transfers and excluded rows are not spending slices.</p>`;
 return {total,slices,svg,html};
}
root.ResetReviewChart={build};
})(typeof window!=='undefined'?window:globalThis);

(function(root){'use strict';
function organize(){const report=document.getElementById('report');const fictional=[...report.children].some(n=>n.querySelector('strong')?.textContent==='Fictional demonstration report');
// The tracker is the single place for recommendations and next actions.
for(const node of [...report.children]){const title=node.querySelector('h2')?.textContent;if(title==='Insights from your transactions'){const links=node.lastElementChild,resources=report.querySelector('.tax-resources');if(links&&resources)resources.append(links);node.remove();}if(title==='Your financial turnaround report')node.remove();if(title==='Recommendations and checks'){node.querySelector('.guidance-grid')?.remove();node.querySelector('h2').textContent='Tax and benefit resources';}}
const header=report.querySelector('.report-header');header.querySelector('h2').textContent='Your financial reset';header.querySelector('.eyebrow').textContent=fictional?'Example report · fictional data':'Your financial dashboard';const explanation=[...header.querySelectorAll('p')][1];if(explanation)explanation.remove();
const spiral=report.querySelector('.spiral-summary');const paragraphs=[...spiral.children].filter(n=>n.tagName==='P');const evidence=document.createElement('details');evidence.className='dashboard-evidence';evidence.innerHTML='<summary>Why this status? View evidence and assumptions</summary>';const list=spiral.querySelector('ul');if(list)evidence.append(list);paragraphs.forEach(n=>evidence.append(n));spiral.append(evidence);
const container=document.createElement('section');container.id='report-details';container.innerHTML='<h2>Explore the supporting analysis</h2><p class="report-note">Open the sections relevant to your priorities. All analysis is included when you download or print the report.</p>';
for(const node of [...report.children]){if(node===header||node===spiral||node.id==='report-stale'||node.id==='reset-plan')continue;
 if(node.classList.contains('privacy-reminder'))continue;
 const children=node.classList.contains('report-two')?[...node.children]:[node];
 for(const child of children){const heading=child.querySelector('h2,h3');let title=heading?.textContent|| (child.classList.contains('metrics')?'Income and spending totals':child.classList.contains('quality')?(child.querySelector('strong')?.textContent||'Data quality and unresolved transactions'):'Report notes');const details=document.createElement('details');details.className='report-accordion';const summary=document.createElement('summary');summary.textContent=title;details.append(summary,child);container.append(details);}
 if(node.classList.contains('report-two'))node.remove();}
const tracker=report.querySelector('#reset-plan');tracker.insertAdjacentElement('afterend',container);
// Old free-text notes remain available without duplicating the next-action advice.
const completion=container.querySelector('.completion-card');if(completion){completion.querySelector('h2').textContent='Your notes and related lessons';completion.querySelector('.priority')?.remove();completion.querySelectorAll('.report-step').forEach(n=>n.remove());completion.parentElement.querySelector('summary').textContent='Your notes and related lessons';}
}
function withExpanded(fn){const list=[...document.querySelectorAll('#report details')],states=list.map(n=>n.open);list.forEach(n=>n.open=true);try{return fn();}finally{list.forEach((n,i)=>n.open=states[i]);}}
let printStates=[];addEventListener('beforeprint',()=>{printStates=[...document.querySelectorAll('#report details')].map(n=>[n,n.open]);printStates.forEach(([n])=>n.open=true);});addEventListener('afterprint',()=>{printStates.forEach(([n,open])=>n.open=open);printStates=[];});
root.ResetDashboard={organize,withExpanded};})(window);

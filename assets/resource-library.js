(()=>{'use strict';
const search=document.getElementById('resource-query'),count=document.getElementById('resource-count'),select=document.getElementById('resource-stage'),note=document.getElementById('resource-stage-note');
const cards=[...document.querySelectorAll('[data-resource]')],groups=[...document.querySelectorAll('[data-resource-group]')];
const names={understand:'Understand',save:'Save',resilience:'Build Resilience',preserve:'Preserve',grow:'Grow',transfer:'Transfer',give:'Give'};
const requested=new URLSearchParams(location.search).get('stage');if(select)select.value=names[requested]?requested:'all';
function update(){const query=(search?.value||'').trim().toLowerCase(),stage=select?.value||'all';let visible=0;
for(const card of cards){const show=(stage==='all'||(card.dataset.stages||'').split(' ').includes(stage))&&(!query||card.textContent.toLowerCase().includes(query));card.hidden=!show;if(show)visible++;}
for(const group of groups){group.hidden=![...group.querySelectorAll('[data-resource]')].some(card=>!card.hidden);document.querySelectorAll('.resource-tabs a').forEach(a=>{if(a.getAttribute('href')==='#'+group.id)a.hidden=group.hidden;});}
if(count)count.textContent=visible?`${visible} ${visible===1?'resource':'resources'}`:'No matching resources. Clear the search or choose All resources.';
if(note)note.textContent=names[stage]?`Showing resources related to ${names[stage]}. Choose All resources to explore the full library.`:'Showing the complete Resource Library.';}
search?.addEventListener('input',update);select?.addEventListener('change',()=>{const url=new URL(location.href);if(select.value==='all')url.searchParams.delete('stage');else url.searchParams.set('stage',select.value);history.replaceState(null,'',url);update();});update();window.addEventListener('lfmlanguagechange',update);
})();

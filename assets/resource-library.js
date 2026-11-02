(()=>{'use strict';
const search=document.getElementById('resource-query');
const count=document.getElementById('resource-count');
const cards=[...document.querySelectorAll('[data-resource]')];
const groups=[...document.querySelectorAll('[data-resource-group]')];
function update(){
 const query=(search?.value||'').trim().toLowerCase();
 let visible=0;
 for(const card of cards){
  const show=!query||card.textContent.toLowerCase().includes(query);
  card.hidden=!show;
  if(show)visible++;
 }
 for(const group of groups)group.hidden=![...group.querySelectorAll('[data-resource]')].some(card=>!card.hidden);
 if(count)count.textContent=`${visible} ${visible===1?'resource':'resources'}`;
}
search?.addEventListener('input',update);
update();
})();

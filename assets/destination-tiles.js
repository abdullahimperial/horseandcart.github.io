(()=>{'use strict';
const icons={
budget:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 9h18M15 13h6M17 15h.01M6 6l2-3h8l2 3"/>',
checklist:'<path d="M9 5h11M9 12h11M9 19h11"/><path d="m3 5 1.5 1.5L7 4M3 12l1.5 1.5L7 11M3 19l1.5 1.5L7 18"/>',
resources:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h7"/>',
snapshot:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 5M5 7l7 5"/>',
book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h7"/>',
chart:'<path d="M4 19V5m0 14h17M7 16l4-5 3 2 6-7M16 6h4v4"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
calculator:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/>',
spiral:'<path d="M12 12c0-2 3-2 3 0 0 3-4 4-6 2-3-3-1-8 3-9 5-1 9 3 9 8 0 6-5 10-11 9-7-1-11-7-10-14"/>',
drop:'<path d="M12 3s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
home:'<path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/>',
game:'<path d="M6.5 8h11a4 4 0 0 1 3.8 5.2l-1.2 4a2.5 2.5 0 0 1-4.2 1l-2-2.2h-3.8l-2 2.2a2.5 2.5 0 0 1-4.2-1l-1.2-4A4 4 0 0 1 6.5 8z"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>'
};
const rules=[[/resource library/i,'resources','book'],[/survival budget/i,'budget','tools'],[/saving practice/i,'checklist','course'],[/money snapshot/i,'snapshot','about'],[/recommendations/i,'book','course'],[/investment snowball/i,'chart','calculators'],[/statement calendar/i,'calendar','calculators'],[/true cost/i,'calculator','calculators'],[/money spiral/i,'spiral','tools'],[/tap vs/i,'drop','games'],[/mortgage prepayment/i,'home','calculators'],[/financial life/i,'game','games'],[/snakes/i,'dice','games']];
document.querySelectorAll('.pc-tool-list article[data-goal]').forEach(card=>{
 const title=card.querySelector('h3')?.textContent.trim()||'';
 const match=rules.find(([pattern])=>pattern.test(title));
 const destination=card.querySelector('.pc-link');
 if(!match||!destination)return;
 const [,iconName,category]=match;
 const tag=card.querySelector('.pc-tag')?.textContent.trim()||'';
 const description=[...card.children].filter(e=>e.tagName==='P').map(e=>e.cloneNode(true));
 const book=card.querySelector('details.book-disclosure')?.cloneNode(true);
 const href=destination.getAttribute('href');
 const action=destination.textContent.trim().replace(/[→›]\s*$/,'')||'Open';
 card.className='tool-launcher-item';
 card.replaceChildren();
 const link=document.createElement('a');
 link.className='app-card app-card--'+category+' tool-launcher-card';
 link.href=href;
 link.setAttribute('aria-label',title+'. '+action);
 const badge=document.createElement('span');
 badge.className='app-icon';
 badge.setAttribute('aria-hidden','true');
 badge.innerHTML='<svg viewBox="0 0 24 24">'+icons[iconName]+'</svg>';
 const label=document.createElement('strong');
 label.textContent=title;
 const actionLabel=document.createElement('small');
 actionLabel.textContent=action;
 link.append(badge,label,actionLabel);
 card.append(link);
 const info=document.createElement('details');
 info.className='tool-card-details';
 const summary=document.createElement('summary');
 summary.textContent='Details';
 info.append(summary);
 const body=document.createElement('div');
 body.className='tool-card-details-body';
 if(tag){const type=document.createElement('span');type.className='pc-tag';type.textContent=tag;body.append(type);}
 description.forEach(p=>body.append(p));
 if(book)body.append(book);
 info.append(body);
 card.append(info);
});
})();


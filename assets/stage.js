(()=>{'use strict';
const stages={
understand:{name:'Understand',intro:'Notice the choices, costs, and circumstances that shape a financial journey.',modules:[1,2],resources:[['Financial Life','games/financial-life.html','game','games'],['Snakes & Ladders','games/snakes-and-ladders.html','dice','games'],['True Cost of a Purchase','apps/true-cost/','calculator','calculators'],['Money Spiral','activities/money-spiral.html','chart','tools']]},
save:{name:'Save',intro:'Explore spending patterns, practical savings, and ways to make more room in a budget.',modules:[3],resources:[['Survival Budget','activities/frugal-budget.html','budget','tools'],['Saving Practice Scorecard','apps/checklist/','checklist','course'],['Tap vs. Leak','activities/tap-vs-leak.html','drop','games'],['Credit Card Statement Calendar','activities/statement-calendar.html','calendar','calculators'],['Money Snapshot','apps/financial-reset/','snapshot','about']]},
resilience:{name:'Build Resilience',intro:'Explore emergency readiness, cash-flow questions, and how a household might prepare for uncertainty.',modules:[4],resources:[['Survival Budget','activities/frugal-budget.html','budget','tools'],['Money Snapshot','apps/financial-reset/','snapshot','about'],['Credit Card Statement Calendar','activities/statement-calendar.html','calendar','calculators']]},
preserve:{name:'Preserve',intro:'Explore the course lesson on protecting the progress you have made.',modules:[5],resources:[['Mortgage Prepayment','calculators/mortgage-prepayment.html','home','calculators']]},
grow:{name:'Grow',intro:'Explore the course lesson and illustrative investment-growth scenario.',modules:[6],resources:[['Investment Snowball','apps/investment/','chart','tools']]},
transfer:{name:'Transfer',intro:'Explore the course lesson about giving the next generation a head start.',modules:[7],resources:[]},
give:{name:'Give',intro:'Explore the course lesson about using wealth for good.',modules:[8],resources:[]}
};
const icons={
book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h7"/>',
game:'<path d="M6.5 8h11a4 4 0 0 1 3.8 5.2l-1.2 4a2.5 2.5 0 0 1-4.2 1l-2-2.2h-3.8l-2 2.2a2.5 2.5 0 0 1-4.2-1l-1.2-4A4 4 0 0 1 6.5 8z"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
calculator:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/>',
chart:'<path d="M4 19V5m0 14h17M7 16l4-5 3 2 6-7M16 6h4v4"/>',
budget:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 9h18M15 13h6M17 15h.01M6 6l2-3h8l2 3"/>',
checklist:'<path d="M9 5h11M9 12h11M9 19h11"/><path d="m3 5 1.5 1.5L7 4M3 12l1.5 1.5L7 11M3 19l1.5 1.5L7 18"/>',
drop:'<path d="M12 3s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
snapshot:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 5M5 7l7 5"/>',
home:'<path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/>'
};
const root=document.getElementById('stage-root');
const icon=(name)=>'<span class="app-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+(icons[name]||icons.book)+'</svg></span>';
const titles={1:'Your financial life',2:'Put the horse before the cart',3:'Find and fix the leakages',4:'Build an emergency system',5:'Protect what you build',6:'Build a deliberate growth plan',7:'Give the next generation a head start',8:'Use wealth for good'};
const id=new URLSearchParams(location.search).get('stage'),s=stages[id];
if(!s){root.innerHTML='<header class="nav-intro"><p class="nav-kicker">Your learning journey</p><h1>Choose one of the seven stages</h1><p>Select a stage on the animation, or start with the full course.</p><a class="nav-return" href="course/index.html">Browse all nine course modules →</a></header>';return}
document.title=s.name+' · Let’s Fix Money';
const moduleLinks=s.modules.map(n=>'<a class="app-card app-card--course" href="course/module-'+n+'.html">'+icon('book')+'<strong>Module '+String(n).padStart(2,'0')+'<span class="stage-card-title">'+titles[n]+'</span></strong></a>').join('');
const resourceLinks=s.resources.map(([label,href,iconName,color])=>'<a class="app-card app-card--'+color+'" href="'+href+'">'+icon(iconName)+'<strong>'+label+'</strong></a>').join('');
const stageNo=String(['understand','save','resilience','preserve','grow','transfer','give'].indexOf(id)+1).padStart(2,'0');
root.innerHTML='<header class="nav-intro"><p class="nav-kicker">Stage '+stageNo+' · Your learning journey</p><h1>'+s.name+'</h1><p>'+s.intro+'</p></header><div class="app-launcher stage-launcher"><section class="app-section" aria-labelledby="stage-course-title"><h2 id="stage-course-title">Course lesson'+(s.modules.length>1?'s':'')+'</h2><div class="stage-resources">'+moduleLinks+'</div><a class="nav-return" href="course/index.html">See all seven stages and nine modules →</a></section>'+(s.resources.length?'<section class="app-section" aria-labelledby="stage-resources-title"><h2 id="stage-resources-title">Related tools and activities</h2><div class="stage-resources">'+resourceLinks+'</div></section>':'<p class="stage-note">This stage’s activities are included in the course lesson. You can also browse all calculators, tools, activities and games from the Explore page.</p>')+'</div><p class="stage-note">The same tool may also appear in another collection if it helps with more than one topic.</p>';
})();

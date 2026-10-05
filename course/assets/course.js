/* Static course player. All learner notes stay in this browser. */
(() => {
'use strict';
const courses = window.COURSE;
const $ = (selector, root = document) => root.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => new Intl.NumberFormat('en-CA', {style:'currency', currency:'CAD', maximumFractionDigits:2}).format(value);
let storageWorks = true;
function warnStorage() {
 storageWorks = false;
 if (!$('.storage-warning')) {
  const banner = document.createElement('div'); banner.className = 'storage-warning'; banner.setAttribute('role','status');
  banner.textContent = 'Browser storage is unavailable. You can still learn and complete activities, but notes and progress will not persist. Download your workbook before leaving.';
  document.body.prepend(banner);
 }
}
const memory = new Map();
function read(key, fallback = null) {
 if (memory.has(key)) return memory.get(key);
 try { return localStorage.getItem(key) ?? fallback; } catch { warnStorage(); return fallback; }
}
function write(key, value) {
 memory.set(key, String(value));
 try { localStorage.setItem(key, String(value)); } catch { warnStorage(); }
}
function jsonRead(key) { try { const v = JSON.parse(read(key, '{}')); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch { return {}; } }
function getNotes(id) {
 const notes = jsonRead(`pf-course-workbook-v2-m${id}`);
 if (typeof notes.fields !== 'object' || !notes.fields || Array.isArray(notes.fields)) notes.fields = {};
 if (typeof notes.quizzes !== 'object' || !notes.quizzes || Array.isArray(notes.quizzes)) notes.quizzes = {};
 if (!notes.fields.action) notes.fields.action = read(`pf-course-m${id}-action`, '');
 const previousReflection = read(`pf-course-m${id}-reflection`, '');
 if (previousReflection && !notes.fields['legacy-reflection']) notes.fields['legacy-reflection'] = previousReflection;
 return notes;
}
function svg(kind) {
 const start = '<svg class="illustration" viewBox="0 0 360 210" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#285747" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">';
 let drawing = '';
 switch (kind) {
 case 'horse': drawing = '<path d="M35 170H328" stroke="#a8ba9e"/><path d="M58 122L67 86 81 73 83 54 103 64 112 90 132 101 171 103 182 130 160 135 139 122 106 125 91 137 67 135Z" fill="#285747"/><path d="M77 132L64 165M95 133L109 165M143 126L151 165M166 131L181 165M58 120L42 137"/><path d="M198 125L203 94 309 94 319 137H204Z" fill="#e9c06d"/><circle cx="225" cy="148" r="19" fill="#fffdf8"/><circle cx="296" cy="148" r="19" fill="#fffdf8"/><path d="M180 114L207 115M227 135V161M283 148H309"/><path d="M232 54H303M294 46L304 54 294 62" stroke="#b84932"/>'; break;
 case 'bucket': drawing = '<path d="M110 63L127 173H232L250 63Z" fill="#dce8d9"/><path d="M114 94Q181 115 245 94M132 49Q180 8 226 49"/><path d="M163 134L160 147M193 119L197 139M221 146L215 157" stroke="#b84932"/><path d="M158 160Q150 178 158 182Q167 178 158 160M198 149Q190 167 198 171Q207 167 198 149M215 177Q207 195 215 199Q224 195 215 177" fill="#b84932" stroke="none"/><path d="M177 9V59M164 46L177 59 190 46"/>'; break;
 case 'shield': drawing = '<path d="M180 22Q223 52 270 55V107Q258 169 180 195Q102 169 90 107V55Q137 52 180 22Z" fill="#dce8d9"/><path d="M142 108L168 134 219 80" stroke-width="10"/><path d="M57 71L45 59M303 71L315 59M53 147L39 153M307 147L321 153" stroke="#b84932"/>'; break;
 case 'house': drawing = '<path d="M82 103L180 27 278 103" stroke-width="7"/><path d="M101 90V183H259V90" fill="#fffdf8"/><path d="M156 183V129H203V183" fill="#e9c06d"/><path d="M121 107H140V129H121ZM220 107H240V129H220Z" fill="#dce8d9"/><path d="M58 183H300M236 60V35H254V74"/>'; break;
 case 'ladder': drawing = '<path d="M93 181L258 24M124 194L288 38" stroke-width="7"/><path d="M119 158L146 170M147 132L174 144M175 106L202 118M203 80L230 92M230 54L257 66"/><path d="M65 177Q41 131 87 106Q143 93 105 58" stroke="#b84932" stroke-width="8"/><circle cx="105" cy="52" r="9" fill="#b84932" stroke="none"/><path d="M294 133L302 149 320 151 307 164 310 182 294 173 278 182 281 164 268 151 286 149Z" fill="#e9c06d" stroke="none"/>'; break;
 case 'spiral': drawing = '<path d="M173 106C180 89 200 97 198 113C195 139 151 145 138 117C115 66 189 31 231 71C297 134 213 204 145 174C72 142 78 60 132 31" stroke-width="7"/><path d="M115 28L132 31 128 48" stroke-width="7"/><path d="M276 183L305 154M285 153H306V174" stroke="#b84932"/>'; break;
 case 'network': drawing = '<path d="M180 106L76 51M180 106L282 51M180 106L76 170M180 106L282 170" stroke="#a8ba9e"/><circle cx="180" cy="106" r="38" fill="#285747"/><circle cx="76" cy="51" r="24" fill="#e9c06d"/><circle cx="282" cy="51" r="24" fill="#dce8d9"/><circle cx="76" cy="170" r="24" fill="#dce8d9"/><circle cx="282" cy="170" r="24" fill="#e9c06d"/><path d="M166 108L177 119 198 95" stroke="#fffdf8"/>'; break;
 case 'cycle': drawing = '<path d="M125 48Q205 9 260 78M245 76L261 79 263 60M277 104Q282 173 207 183M217 171L206 184 224 189M174 185Q90 183 78 110M70 127L77 109 91 120M78 81Q84 51 112 39"/><circle cx="180" cy="111" r="36" fill="#e9c06d" stroke="none"/><path d="M166 112L177 123 199 99"/>'; break;
 case 'path': drawing = '<path d="M44 158C100 158 57 61 127 61S176 153 230 153S284 46 318 46" stroke="#a8ba9e" stroke-dasharray="6 9"/><circle cx="44" cy="158" r="13" fill="#e9c06d"/><circle cx="127" cy="61" r="13" fill="#dce8d9"/><circle cx="230" cy="153" r="13" fill="#dce8d9"/><circle cx="318" cy="46" r="13" fill="#285747"/><path d="M309 16L318 6 327 16" stroke="#b84932"/>'; break;
 case 'steps': drawing = '<path d="M48 180V147H112V110H178V74H245V37H311" stroke-width="6"/><circle cx="80" cy="125" r="11" fill="#e9c06d" stroke="none"/><circle cx="145" cy="88" r="11" fill="#e9c06d" stroke="none"/><circle cx="212" cy="51" r="11" fill="#e9c06d" stroke="none"/><path d="M66 59L284 18M271 11L285 18 277 30" stroke="#b84932"/>'; break;
 case 'split': drawing = '<path d="M179 178V105M179 105L104 51M179 105L256 51" stroke-width="6"/><circle cx="104" cy="51" r="26" fill="#e9c06d" stroke="none"/><circle cx="256" cy="51" r="26" fill="#dce8d9"/><circle cx="179" cy="177" r="13" fill="#285747"/><path d="M94 51H114M245 51H267M256 40V62"/>'; break;
 default: drawing = '<rect x="71" y="29" width="94" height="65" rx="10" fill="#dce8d9"/><rect x="189" y="29" width="94" height="65" rx="10" fill="#e9c06d"/><rect x="71" y="117" width="94" height="65" rx="10" fill="#fffdf8"/><rect x="189" y="117" width="94" height="65" rx="10" fill="#dce8d9"/><path d="M105 61L116 73 139 48M221 61H252M107 149H136M224 150L235 161 255 135"/>';
 }
 return start + drawing + '</g></svg>';
}
function visual(v) {
 const labels = v.labels || [];
 let content;
 if (v.kind === 'bars') {
  const rows = labels.map(l => { const i = l.lastIndexOf('|'); return {label:l.slice(0,i), value:Number(l.slice(i+1))}; });
  const max = Math.max(...rows.map(r=>r.value),1);
  content = `<div class="bar-chart" role="img" aria-label="${esc(rows.map(r=>`${r.label}: ${r.value.toLocaleString('en-CA')}`).join('; '))}">${rows.map(r=>`<div class="chart-row"><div class="bar-label"><span>${esc(r.label)}</span></div><div class="bar-background"><div class="bar-fill" style="width:${r.value/max*100}%"></div></div></div>`).join('')}</div>`;
 } else if (v.kind === 'equation') {
  content = `<div class="equation-box">${labels.map(l=>`<div>${esc(l)}</div>`).join('')}</div>`;
 } else {
  const className = v.kind === 'split' ? 'split' : ['grid','network','path','cycle'].includes(v.kind) ? 'grid' : '';
  content = svg(v.kind) + `<ol class="diagram-labels ${className}">${labels.map((label,i)=>{
   if (v.kind === 'split') {const [title,...body]=label.split('|'); return `<li><strong>${esc(title)}</strong>${esc(body.join('|'))}</li>`;}
   return `<li>${['steps','horse','path'].includes(v.kind)?`<span class="step-index">${String(i+1).padStart(2,'0')}</span>`:''}${esc(label)}</li>`;
  }).join('')}</ol>`;
 }
 return `<figure class="visual-panel" style="margin:0">${content}<figcaption class="visual-caption">${v.kind==='bars'?'Illustrative comparison':'The idea at a glance'}</figcaption></figure>`;
}
function toast(message) {
 $('.toast')?.remove(); const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role','status'); el.textContent=message; document.body.append(el); setTimeout(()=>el.remove(),4000);
}
const specs = {
 cashflow:{fields:[['income','Monthly take-home income (CAD)',4000],['expenses','Monthly cash outflows (CAD)',3200]],help:'Surplus = income − cash outflows. This does not calculate net worth or predict returns.'},
 annualize:{fields:[['current','Current cost per occurrence (CAD)',5],['replacement','Replacement cost per occurrence (CAD)',1],['frequency','Frequency','daily','frequency']],help:'Assumes 365 daily, 52 weekly, or 12 monthly occurrences. Choose a frequency that fits the actual habit.'},
 cost:{fields:[['price','All-in purchase price (CAD)',100],['deductions','Estimated deductions from gross pay (%)',25],['wage','Gross hourly earnings (CAD)',25]],help:'Gross needed = price ÷ (1 − deduction rate). Hours = gross needed ÷ gross hourly earnings. A flat rate ignores tax brackets, credits, and many individual differences.'},
 emergency:{fields:[['expenses','Essential monthly expenses still payable (CAD)',2500],['months','Planning duration (months)',3],['cash','Accessible emergency savings (CAD)',3000]],help:'Reserve estimate = remaining monthly essentials × months. Savings gap and current runway exclude credit limits, unconfirmed benefits, and prepaid bills.'},
 savings:{fields:[['income','Monthly take-home income (CAD)',4000],['expenses','Current monthly expenses (CAD)',3500],['leaks','Leakages you can remove (CAD / month)',50],['bills','Living-cost reductions (CAD / month)',100],['benefits','Additional benefits or support (CAD / month)',0],['habits','Other habit savings (CAD / month)',50]],help:'Additional support increases income; expense reductions lower spending. Keep categories separate and only count reliable recurring amounts.'},
 weekly:{fields:[['resp','Annual RESP plan (CAD)',2500],['rdsp','Annual RDSP plan (CAD)',0],['rrsp','Annual RRSP plan (CAD)',1200],['tfsa','Annual TFSA plan (CAD)',1200],['fhsa','Annual FHSA plan (CAD)',0]],help:'Each annual amount is divided by 52. This does not determine eligibility, contribution room, grants, tax savings, or an optimal allocation. Defaults are examples, not recommendations.'},
 giving:{fields:[['amount','Planned contribution per period (CAD)',10],['frequency','Frequency','monthly','frequency']],help:'Estimate only: 365 daily, 52 weekly, or 12 monthly contributions. No donation tax credit or financial return is calculated.'}
};
function calculate(kind, values) {
 const spec=specs[kind], nums={};
 for (const [key,label,,type] of spec.fields) {
  if (type==='frequency') { if (!['daily','weekly','monthly'].includes(values[key])) throw Error('Choose a supported contribution frequency.'); nums[key]=values[key]; continue; }
  const raw=String(values[key] ?? '').trim(); const value=Number(raw);
  if (raw==='' || !Number.isFinite(value) || value<0 || value>1e9) throw Error(`Enter a valid non-negative number for “${label}” (up to 1 billion).`);
  nums[key]=value;
 }
 const n=nums, mult={daily:365,weekly:52,monthly:12};
 let items=[], explanation='';
 switch(kind) {
 case 'cashflow': {const surplus=n.income-n.expenses; items=[['Monthly cash-flow surplus',money(surplus)],['Annualized at this pace',money(surplus*12)]]; explanation=surplus>0?'You have a surplus in this example. Decide how to direct it while keeping essential needs covered.':surplus<0?'Cash outflows exceed income in this example. Look for practical income, spending, or support changes.':'This example breaks even. A buffer or savings goal will need additional room.'; break;}
 case 'annualize': {const f=mult[n.frequency]; items=[['Current yearly cost',money(n.current*f)],['Replacement yearly cost',money(n.replacement*f)],['Potential yearly difference',money((n.current-n.replacement)*f)]]; explanation=n.current>=n.replacement?'The difference assumes you consistently substitute the cheaper habit at the selected frequency.':'The replacement costs more at this frequency. Consider whether its extra value is worth the difference.'; break;}
 case 'cost': {if(n.deductions>=100)throw Error('Estimated deductions must be less than 100%.'); if(n.wage<=0)throw Error('Gross hourly earnings must be greater than zero.'); const gross=n.price/(1-n.deductions/100); items=[['Estimated gross earnings needed',money(gross)],['Working time at this wage',`${(gross/n.wage).toLocaleString('en-CA',{maximumFractionDigits:1})} hours`]]; explanation='This simplified estimate helps you compare a purchase with working time. It is not a tax calculation.'; break;}
 case 'emergency': {if(n.months<=0||n.months>120)throw Error('Choose a planning duration greater than zero and up to 120 months.'); const target=n.expenses*n.months; items=[['Illustrative reserve target',money(target)],['Gap above current savings',money(Math.max(0,target-n.cash))],['Current savings runway',n.expenses?`${(n.cash/n.expenses).toLocaleString('en-CA',{maximumFractionDigits:1})} months`:'No monthly essentials entered']]; explanation='This calculation only counts liquid savings against remaining essential bills. Your wider emergency system needs separate eligibility, timing, and risk checks.'; break;}
 case 'savings': {const cuts=n.leaks+n.bills+n.habits; if(cuts>n.expenses)throw Error('Expense reductions cannot exceed your current expenses. Check for duplicated savings.'); const before=n.income-n.expenses, after=n.income+n.benefits-(n.expenses-cuts); items=[['Estimated new monthly expenses',money(n.expenses-cuts)],['Monthly surplus before',money(before)],['Monthly surplus after',money(after)],['Annualized improvement',money((after-before)*12)]]; explanation='Benefits increase income; the other categories reduce expenses. Confirm estimates against actual statements and program eligibility.'; break;}
 case 'weekly': {const total=Object.values(n).reduce((sum,value)=>sum+value,0); items=[['Planned annual total',money(total)],['Total per weekly deposit',money(total/52)],...Object.entries(n).map(([key,value])=>[`${key.toUpperCase()} per week`,money(value/52)])]; explanation='Figures are rounded for display; reconcile the final deposit with your annual target and verified room. Employer or government contributions are not included.'; break;}
 case 'giving': items=[['Planned annual contribution',money(n.amount*mult[n.frequency])],['Average monthly amount',money(n.amount*mult[n.frequency]/12)]]; explanation='Choose a level that leaves essential obligations and your resilience plan supported.'; break;
 }
 return {items,explanation};
}
function resultHTML(result) { return `<strong>Your calculation</strong><div class="result-grid">${result.items.map(([label,value])=>`<div class="result-item"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div><p style="margin:0">${esc(result.explanation)}</p>`; }
function workbook(mods) {
 let lines=['PERSONAL FINANCE STORY — MY COURSE WORKBOOK','Based on the book by Abdullah Mohiuddin','Educational activities; personal figures and reflections entered on this device.',''];
 for (const m of mods) {
  const n=getNotes(m.id); lines.push(`MODULE ${m.id}: ${m.title}`,`Book chapter ${m.id}, p. ${m.page}`, '');
  m.activities.forEach((a,i)=>{
   lines.push(a.title,`(${a.origin})`);
   if(a.type==='reflection')a.prompts.forEach((p,j)=>lines.push(p,n.fields[`a${i}-r${j}`]||'[Not answered]'));
   if(a.type==='checklist')a.items.forEach((item,j)=>lines.push(`${n.fields[`a${i}-tick${j}`]==='yes'?'[x]':'[ ]'} ${item}`));
   if(a.type==='tool')lines.push(a.prompt, a.href);
   if(a.type==='quiz') {const q=n.quizzes[i];lines.push(a.prompt,`My answer: ${Number.isInteger(q?.selected)?a.options[q.selected]||'[Not answered]':'[Not answered]'}`,q?.checked?`Feedback: ${a.feedback}`:'[Not checked]');}
   if(a.type==='calculator') {
    const vals={}; specs[a.kind].fields.forEach(([key,label,def])=>{vals[key]=n.fields[`a${i}-c-${key}`]??String(def);lines.push(`${label}: ${vals[key]}`);});
    lines.push('Any unchanged values above are editable examples.');
    if(n.fields[`a${i}-calculated`])try {const r=calculate(a.kind,vals);r.items.forEach(([label,value])=>lines.push(`${label}: ${value}`));lines.push(r.explanation);}catch(e){lines.push(`Calculation needs review: ${e.message}`);}
   }
   lines.push('');
  });
  if(n.fields['legacy-reflection'])lines.push('Reflection retained from the earlier course:',n.fields['legacy-reflection'],'');
  lines.push('MY NEXT ACTION',n.fields.action||'[Not entered]','Review date',n.fields['review-date']||'[Not entered]',`Completion: ${read(`pf-course-module-${m.id}`)==='complete'?'Marked complete':'Not marked complete'}`,'','—'.repeat(48),'');
 }
 return lines.join('\n');
}
function download(mods) {
 const blob=new Blob([workbook(mods)],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=mods.length===1?`personal-finance-module-${mods[0].id}-workbook.txt`:'personal-finance-course-workbook.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Workbook downloaded. Keep it somewhere private.');
}
function home() {
 const done=courses.filter(m=>read(`pf-course-module-${m.id}`)==='complete').length;
 const next=courses.find(m=>read(`pf-course-module-${m.id}`)!=='complete')||courses[0];
 $('#course-home').innerHTML=`<div class="wrap"><section class="hero"><div><div class="eyebrow">A companion to the book · By Abdullah Mohiuddin</div><h1>A better relationship<br>with <em>your money.</em></h1><p class="intro">From fighting affordability to generational wealth. Explore the book’s ideas through visual lessons, thoughtful questions, and practical activities you can use in your own life.</p><div class="actions"><a class="btn primary" href="module-${next.id}.html">${done?'Continue your journey':'Start your journey'} <span aria-hidden="true">→</span></a><a class="btn light" href="#modules">Explore the modules</a></div><div class="hero-meta"><span>${courses.length} chapter-based modules</span><span>${courses.reduce((sum,m)=>sum+m.slides.length,0)} visual slides</span><span>${courses.reduce((sum,m)=>sum+m.activities.length+1,0)} activities & action plans</span></div></div><div class="hero-figure"><div class="eyebrow">Put the horse before the cart</div>${svg('horse')}<p class="figure-label">Prepare first. Move forward.</p></div></section><div class="journey-strip" aria-label="The learning journey">${['Understand','Save','Build resilience','Preserve','Grow','Transfer','Give'].map(s=>`<span>${s}</span>`).join('')}</div><section id="modules"><div class="section-heading"><div><div class="eyebrow">Small lessons. Meaningful steps.</div><h2>Your learning journey</h2><p>Follow the chapters in order, or begin with what matters to you today.</p></div><span class="tag">Free · Self-paced · No account</span></div><div class="progress-panel"><div><div class="eyebrow">Your progress</div><p>${done} of 9 modules marked complete${done===9?' · Revisit any lesson whenever you like.':''}</p></div><div class="progress-track" role="progressbar" aria-label="Modules marked complete" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="9"><span style="width:${done/9*100}%"></span></div></div><div class="course-grid">${courses.map(m=>{
 const completed=read(`pf-course-module-${m.id}`)==='complete';const position=Number(read(`pf-course-position-m${m.id}`,0)); const started=position>0;
 const kinds=['path','horse','bucket','shield','spiral','steps','network','cycle','house'];
 return `<article class="module-card"><div class="card-art"><span class="card-number">${String(m.id).padStart(2,'0')}</span>${svg(kinds[m.id-1])}</div><div class="card-body"><span class="eyebrow" style="margin:0">${esc(m.stage)}</span><h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p><div class="card-meta">${m.slides.length} slides · ${m.activities.length+1} activities · Book p. ${m.page}</div><div class="card-status">${completed?'✓ Marked complete':started?'In progress · resume where you left off':''}</div><a class="btn ${m.id===next.id?'primary':'light'}" href="module-${m.id}.html">${completed?'Revisit module':started?'Continue module':'Explore module'} <span aria-hidden="true">→</span></a></div></article>`;
 }).join('')}</div></section><section class="home-workbook"><div><div class="eyebrow">Learn → Apply → Act</div><h3>A workbook that grows with you.</h3><p>Save reflections and activity answers on this browser, revisit your decisions, and download your notes. Your next action matters more than finishing every page.</p><p class="storage-note">Notes stay on this device and browser. Clearing browser data removes them. Download a copy before switching devices. Completion is self-reported.</p></div><a class="btn light" href="../apps/financial-reset/">Try Financial Reset →</a><button class="btn light" id="download-all">Download my workbook <span aria-hidden="true">↓</span></button></section></div>`;
 $('#download-all').addEventListener('click',()=>download(courses));
}
function modulePlayer(id) {
 const m=courses.find(c=>c.id===id);if(!m)return;
 document.title=`${m.title} · Personal Finance Story`;
 const notes=getNotes(id);
 let pos=0;
 const save=()=>write(`pf-course-workbook-v2-m${id}`,JSON.stringify(notes));
 function fromHash() {
  if(location.hash==='#activities')return m.slides.length;
  const match=location.hash.match(/^#slide-(\d+)$/);
  const candidate=match?Number(match[1])-1:Number(read(`pf-course-position-m${id}`,0));
  return Number.isInteger(candidate)&&candidate>=0&&candidate<=m.slides.length?candidate:0;
 }
 pos=fromHash();
 $('#course-player').innerHTML=`<div class="wrap"><div class="course-top"><div><div class="breadcrumbs"><a href="index.html">All modules</a> <span aria-hidden="true">/</span> Module ${String(id).padStart(2,'0')} · ${esc(m.stage)}</div><p class="course-title">${esc(m.title)}</p></div><button class="btn light small menu-toggle" aria-controls="lesson-sidebar" aria-expanded="false">Lesson contents <span aria-hidden="true">☰</span></button></div><div class="player-layout"><aside class="sidebar" id="lesson-sidebar" aria-label="Lesson contents"><div class="eyebrow">In this module</div><nav class="toc" aria-label="Slides">${m.slides.map((s,i)=>`<button type="button" data-slide="${i}"><span class="toc-num">${String(i+1).padStart(2,'0')}</span><span>${esc(s.heading)}</span></button>`).join('')}<button type="button" data-slide="${m.slides.length}"><span class="toc-num">✎</span><span>Activity workshop</span></button></nav><div class="sidebar-foot">Chapter ${id} · Book p. ${m.page}<br>Slides follow the book’s headings. Some related subheadings are grouped.<br><a href="index.html" style="display:inline-block;margin-top:12px">Explore another module →</a></div></aside><div class="stage"><div class="stage-progress"><span id="position-label"></span><div class="progress-track" role="progressbar" aria-label="Position in module" aria-valuemin="0" aria-valuemax="${m.slides.length+1}"><span id="position-bar"></span></div><button class="btn light small" id="go-workshop">Activities <span aria-hidden="true">→</span></button></div><div id="slide-stage"></div><div class="player-controls"><button class="btn light" id="previous">← Previous</button><span class="control-middle">Use ← → arrow keys<br>or choose a heading</span><button class="btn primary" id="next">Next slide →</button></div><p class="storage-note">Your place and notes ${storageWorks?'are saved automatically in this browser':'are available for this session only'}. Download your workbook to keep a copy.</p></div></div><div class="print-content" id="print-content"></div></div>`;
 const stage=$('#slide-stage');
 function fieldMarkup(key,label,value,type='textarea') {
  const fieldId=`m${id}-${key}`;
  return `<label class="field" for="${esc(fieldId)}"><span class="field-label">${esc(label)}</span>${type==='textarea'?`<textarea id="${esc(fieldId)}" data-note="${esc(key)}" placeholder="Your notes…">${esc(value||'')}</textarea>`:`<input type="date" id="${esc(fieldId)}" data-note="${esc(key)}" value="${esc(value||'')}">`}</label>`;
 }
 function activityHTML(a,i) {
  const prefix=`a${i}`;
  let body='';
  if(a.type==='reflection')body=a.prompts.map((p,j)=>fieldMarkup(`${prefix}-r${j}`,p,notes.fields[`${prefix}-r${j}`])).join('')+(a.tip?`<div class="tip">${esc(a.tip)}</div>`:'');
  if(a.type==='checklist')body=`<p>${esc(a.prompt)}</p><div class="action-checklist">${a.items.map((item,j)=>`<label class="quiz-choice"><input type="checkbox" data-tick="${prefix}-tick${j}" ${notes.fields[`${prefix}-tick${j}`]==='yes'?'checked':''}><span>${esc(item)}</span></label>`).join('')}</div>`;
  if(a.type==='tool')body=`<p>${esc(a.prompt)}</p><a class="btn primary" href="${esc(a.href)}" target="_blank" rel="noopener">${esc(a.label)} <span aria-hidden="true">→</span><span class="sr-only"> (opens in a new tab)</span></a><p class="calc-help">Keep this workshop open; return here to record what you learned.</p>`;
  if(a.type==='quiz') {
   const q=notes.quizzes[i]||{};
   body=`<p>${esc(a.prompt)}</p><fieldset class="quiz-options"><legend>Choose the best answer</legend>${a.options.map((option,j)=>`<label class="quiz-choice"><input type="radio" name="quiz-${i}" value="${j}" data-quiz="${i}" ${q.selected===j?'checked':''}><span>${esc(option)}</span></label>`).join('')}</fieldset><button class="btn primary" type="button" data-check="${i}">Check my answer</button><div class="feedback ${q.checked&&q.selected!==a.answer?'retry':''}" id="feedback-${i}" role="status">${q.checked?`<strong>${q.selected===a.answer?'You’ve got it.':'Revisit the reasoning.'}</strong>${esc(a.feedback)}`:''}</div>`;
  }
  if(a.type==='calculator') {
   const spec=specs[a.kind];
   body=`<p>${esc(a.prompt)}</p><p class="calc-help">Editable example — replace the figures with your own estimates. All dollar amounts are CAD.</p><form data-calculator="${i}" novalidate><div class="calculator-grid">${spec.fields.map(([key,label,def,type])=>{
    const val=notes.fields[`${prefix}-c-${key}`]??String(def), fieldId=`m${id}-${prefix}-${key}`;
    return `<label class="field" for="${fieldId}"><span class="field-label">${esc(label)}</span>${type==='frequency'?`<select id="${fieldId}" name="${key}" data-note="${prefix}-c-${key}">${['daily','weekly','monthly'].map(v=>`<option value="${v}" ${val===v?'selected':''}>${v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select>`:`<input id="${fieldId}" name="${key}" type="number" inputmode="decimal" min="0" max="1000000000" step="any" value="${esc(val)}" data-note="${prefix}-c-${key}">`}</label>`;
   }).join('')}</div><button class="btn primary" type="submit">Calculate & compare</button><p class="calc-help">${esc(spec.help)}</p><div class="feedback" id="result-${i}" role="status"></div></form>`;
  }
  return `<section class="activity-card" aria-labelledby="activity-title-${i}"><div><span class="activity-number">${String(i+1).padStart(2,'0')}</span><span class="origin">${esc(a.origin)}</span></div><h2 id="activity-title-${i}">${esc(a.title)}</h2>${body}</section>`;
 }
 function workshop() {
  stage.innerHTML=`<div class="workshop-header"><div class="eyebrow">Chapter ${id} · Put it into practice</div><h1 tabindex="-1" id="current-heading">Your activity workshop</h1><p>Take the ideas into your own life. Activities from the book sit alongside new exercises designed to help you compare, reflect, and act. You can return to any slide while you work.</p></div><div class="workshop-tools"><button class="btn light" id="download-module">Download my notes ↓</button><button class="btn light" id="print-module">Print lesson & workbook</button></div>${m.activities.map(activityHTML).join('')}${notes.fields['legacy-reflection']?`<section class="activity-card"><span class="origin">Retained from your earlier course</span><h2>Previous reflection</h2>${fieldMarkup('legacy-reflection','Your earlier notes',notes.fields['legacy-reflection'])}</section>`:''}<section class="activity-card completion-card"><span class="origin">${m.activities.length+1} · Your next action</span><h2>One useful step is enough to begin.</h2><p>${esc(m.action)}</p>${fieldMarkup('action','What will you do, and how will you know it helped?',notes.fields.action)}${fieldMarkup('review-date','When will you review it?',notes.fields['review-date'],'date')}<div class="actions"><button class="btn primary" id="complete-module">${read(`pf-course-module-${id}`)==='complete'?'Update my completed module':'Mark module complete'} ✓</button>${id<9?`<a class="btn light" href="module-${id+1}.html">Next module →</a>`:'<a class="btn light" href="index.html">Review my journey →</a>'}</div><p class="completion-status" id="completion-status" role="status">${read(`pf-course-module-${id}`)==='complete'?'You have marked this module complete. You can keep revisiting your notes.':''}</p><p class="calc-help">Completion is your own record of learning, not a certification or financial assessment.</p></section>${m.resources.length?`<section class="activity-card"><span class="origin">Keep learning</span><h2>Check the current official information</h2><p>These links help you investigate rules and eligibility. The course does not verify your individual entitlements.</p><ul class="resource-list">${m.resources.map(r=>`<li><a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.label)} →<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul></section>`:''}`;
  stage.querySelectorAll('[data-note]').forEach(el=>{
   el.addEventListener('input',()=>{
    notes.fields[el.dataset.note]=el.value;save();
    const form=el.closest('[data-calculator]'); if(form){const idx=form.dataset.calculator;delete notes.fields[`a${idx}-calculated`];save();const result=$(`#result-${idx}`);result.innerHTML='';result.className='feedback';}
   });
  });
  stage.querySelectorAll('[data-quiz]').forEach(el=>el.addEventListener('change',()=>{
   notes.quizzes[el.dataset.quiz]={selected:Number(el.value),checked:false};save();const feedback=$(`#feedback-${el.dataset.quiz}`);feedback.innerHTML='';feedback.className='feedback';
  }));
  stage.querySelectorAll('[data-tick]').forEach(el=>el.addEventListener('change',()=>{notes.fields[el.dataset.tick]=el.checked?'yes':'no';save();}));
  stage.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('click',()=>{
   const idx=Number(el.dataset.check),a=m.activities[idx],q=notes.quizzes[idx],feedback=$(`#feedback-${idx}`);
   if(!q||!Number.isInteger(q.selected)){feedback.className='feedback error';feedback.textContent='Choose an answer before checking.';return;}
   q.checked=true;save();feedback.className=`feedback ${q.selected===a.answer?'':'retry'}`;feedback.innerHTML=`<strong>${q.selected===a.answer?'You’ve got it.':'Revisit the reasoning.'}</strong>${esc(a.feedback)}`;
  }));
  stage.querySelectorAll('[data-calculator]').forEach(form=>{
   const idx=Number(form.dataset.calculator), a=m.activities[idx];
   function run() {
    const result=$(`#result-${idx}`), values=Object.fromEntries(new FormData(form));
    try {const calculated=calculate(a.kind,values);result.className='feedback';result.innerHTML=resultHTML(calculated);for(const [key,value]of Object.entries(values))notes.fields[`a${idx}-c-${key}`]=value;notes.fields[`a${idx}-calculated`]='yes';save();}
    catch(e){result.className='feedback error';result.textContent=e.message;delete notes.fields[`a${idx}-calculated`];save();}
   }
   form.addEventListener('submit',e=>{e.preventDefault();run();});
   if(notes.fields[`a${idx}-calculated`])run();
  });
  $('#download-module').addEventListener('click',()=>download([m]));
  $('#print-module').addEventListener('click',()=>{
   $('#print-content').innerHTML=`<h1>${esc(m.title)}</h1><p>Personal Finance Story · Chapter ${id} · Abdullah Mohiuddin</p>${m.slides.map(s=>`<section><p class="slide-source">${esc(s.heading)} · Book p. ${s.page}</p><h2>${esc(s.title)}</h2><p>${esc(s.body)}</p><ul>${s.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>${visual(s.visual)}${s.note?`<p>${esc(s.note)}</p>`:''}</section>`).join('')}<section><h2>My activity workbook</h2><div class="print-answer">${esc(workbook([m]))}</div></section>`;
   window.print();
  });
  $('#complete-module').addEventListener('click',()=>{
   save();write(`pf-course-module-${id}`,'complete');write(`pf-course-m${id}-action`,notes.fields.action||'');$('#complete-module').textContent='Update my completed module ✓';$('#completion-status').textContent=storageWorks?'Module marked complete. Your notes are saved on this browser.':'Module marked complete for this session. Download your workbook to retain your notes.';toast(storageWorks?'Progress saved on this browser.':'Download your workbook before leaving.');
  });
 }
 function render(focus=false) {
  write(`pf-course-position-m${id}`,pos);
  $('.toc').querySelectorAll('button').forEach(button=>{if(Number(button.dataset.slide)===pos)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  $('#position-label').textContent=pos===m.slides.length?'Activity workshop':`Slide ${pos+1} of ${m.slides.length}`;
  $('#position-bar').style.width=`${(pos+1)/(m.slides.length+1)*100}%`;
  $('.stage-progress [role=progressbar]').setAttribute('aria-valuenow',pos+1);
  $('#previous').disabled=pos===0;
  $('#next').hidden=pos===m.slides.length;
  $('#next').textContent=pos===m.slides.length-1?'Start activities →':'Next slide →';
  $('#go-workshop').hidden=pos===m.slides.length;
  if(pos===m.slides.length)workshop();else{
   const s=m.slides[pos];
   stage.innerHTML=`<article class="slide"><div class="slide-top"><span class="eyebrow">${esc(m.stage)} · Chapter ${id}</span><span class="source">Based on the book<br>p. ${s.page}</span></div><div class="slide-grid"><div><h1 tabindex="-1" id="current-heading">${esc(s.title)}</h1><p class="slide-body">${esc(s.body)}</p><ul class="slide-points">${s.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>${visual(s.visual)}</div>${s.note?`<p class="slide-note">${esc(s.note)}</p>`:''}<div class="slide-bottom"><span>${esc(s.heading)}</span><span>${String(pos+1).padStart(2,'0')} / ${String(m.slides.length).padStart(2,'0')}</span></div></article>`;
  }
  if(focus){$('#current-heading').focus({preventScroll:true});$('.stage').scrollIntoView({behavior:'auto',block:'start'});}
 }
 function go(next,focus=true) {
  pos=Math.max(0,Math.min(next,m.slides.length));history.replaceState(null,'',pos===m.slides.length?'#activities':`#slide-${pos+1}`);
  $('#lesson-sidebar').classList.remove('is-open');$('.menu-toggle').setAttribute('aria-expanded','false');render(focus);
 }
 $('.toc').addEventListener('click',e=>{const button=e.target.closest('[data-slide]');if(button)go(Number(button.dataset.slide));});
 $('#previous').addEventListener('click',()=>go(pos-1));$('#next').addEventListener('click',()=>go(pos+1));$('#go-workshop').addEventListener('click',()=>go(m.slides.length));
 $('.menu-toggle').addEventListener('click',()=>{const open=$('#lesson-sidebar').classList.toggle('is-open');$('.menu-toggle').setAttribute('aria-expanded',String(open));});
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,textarea,select,[contenteditable=true]'))return;
  if(e.key==='ArrowRight'&&pos<m.slides.length){e.preventDefault();go(pos+1);}if(e.key==='ArrowLeft'&&pos>0){e.preventDefault();go(pos-1);}
 });
 window.addEventListener('hashchange',()=>{pos=fromHash();render(true);});render();
}
if($('#course-home'))home();
if($('#course-player'))modulePlayer(Number(document.body.dataset.module));
})();

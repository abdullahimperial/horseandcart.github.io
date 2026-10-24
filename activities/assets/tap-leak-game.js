/* Tap vs. Leak: a conceptual activity, separate from the cash-flow worksheet. */
(()=>{
  'use strict';
  const byId=id=>document.getElementById(id);
  const scenes=[
    {title:'An expensive vacation on credit',short:'Vacation',icon:'vacation',answer:'leak',detail:'You book a holiday on a credit card and carry the balance for several months.',explain:'The trip costs money, and carrying an interest-bearing balance adds financing costs. The holiday may have real personal value, but it does not create income in this scenario.',improve:['Save for the trip first and choose a budget you can afford.','Keep the same trip and make only minimum payments.'],better:0,why:'Saving first can remove the borrowing interest. The holiday still costs money; the improvement reduces a leak rather than creating income.'},
    {title:'A luxury purchase on credit',short:'Luxury',icon:'luxury',answer:'leak',detail:'You buy an expensive luxury item, pay interest, and make only the minimum card payments.',explain:'The purchase and interest are outgoing money. Looking wealthy does not bring income into the bucket. This describes the financial effect, not the item’s personal value.',improve:['Increase the credit limit so you can buy more.','Delay the purchase, save first, or choose a less costly alternative.'],better:1,why:'Reducing the price and avoiding interest can reduce the cost. A larger credit limit does not make the purchase more affordable.'},
    {title:'Investing in a diversified fund',short:'Investment',icon:'investment',answer:'both',detail:'You invest regularly in a diversified fund with fees. Its value and any distributions can fluctuate.',explain:'There is a potential tap through distributions or gains, alongside fees and the risk of losses. Moving savings into an investment is an asset purchase, not automatically a consumption leak. Growth on paper is also different from cash income.',improve:['Check fees, diversification, time horizon, and how much risk you can accept.','Assume every year will have a positive return.'],better:0,why:'Understanding costs and risk makes the decision more informed. Diversification does not guarantee profit, and returns may be negative. The bucket shows potential flows, not promised growth.'},
    {title:'Equipment for a side business',short:'Business',icon:'business',answer:'both',detail:'You buy equipment for a side business. In this example, sales bring in more than its ongoing expenses.',explain:'Sales create a tap; equipment, materials, fees, and other costs take money out. Positive ongoing cash flow does not by itself show whether the initial equipment purchase has paid for itself.',improve:['Buy the most expensive equipment before checking demand.','Test demand and compare total costs before committing.'],better:1,why:'A small trial or rented equipment can help you check demand. Include setup costs and your time when judging whether the business is worthwhile.'},
    {title:'Buying a rental property',short:'Property',icon:'property',answer:'both',detail:'The property collects rent and has mortgage payments, maintenance costs, and periods without tenants.',explain:'Rent is incoming money. Payments, repairs, and other costs create outflows; vacancies can interrupt the tap. Mortgage principal builds equity, so cash flow and changes in net worth are different questions.',improve:['Check total costs and allow for vacancies and repairs.','Count all rent as profit and ignore empty months.'],better:0,why:'Compare realistic rent with all costs and reserves. A property can have both taps and leaks; only the amounts, timing, and risks show the overall effect.'}
  ];
  const shapes={
    vacation:'<circle cx="157" cy="40" r="19" fill="#e8b75d"/><path d="M25 111Q65 90 100 111T190 111" fill="none"/><path d="M81 107L93 53M93 53Q61 25 42 53Q68 46 93 53M93 53Q119 23 142 53Q117 45 93 53" fill="none"/><path d="M25 130H193"/>',
    luxury:'<path d="M51 57H169L182 130H38Z" fill="#ecd2b4"/><path d="M79 58V40C79 9 142 9 142 40V58" fill="none"/><rect x="124" y="99" width="73" height="43" rx="7" fill="#eef2ed"/><path d="M127 110H194M136 129H153"/>',
    investment:'<path d="M37 130H188M47 113V80H75V113M94 113V61H122V113M141 113V39H169V113" fill="#c4e1d5"/><path d="M38 53L75 38L112 46L159 16M145 17L159 16L158 30" fill="none"/>',
    business:'<path d="M47 64H174V132H47Z" fill="#d7e5eb"/><path d="M83 64V43H137V64M47 87H174M98 87V101H124V87" fill="none"/><path d="M39 35L53 20L70 39L56 52Z" fill="#e7bd76"/><circle cx="173" cy="38" r="17" fill="#c4e1d5"/>',
    property:'<path d="M33 74L110 18L190 74M49 65V135H171V65" fill="#eadbc5"/><path d="M96 135V91H125V135M62 80H81V100H62ZM140 80H159V100H140Z" fill="#c4e1d5"/><path d="M155 45V24H173V57" fill="none"/>'
  };
  let position=0;const answers=new Map(),improvements=new Map();
  const tabs=byId('scenario-tabs');
  scenes.forEach((s,i)=>{const b=document.createElement('button');b.className='scenario-tab';b.textContent=`${i+1}. ${s.short}`;b.onclick=()=>show(i);tabs.append(b);});
  function animate(kind){
    byId('bucket-scene').dataset.state=kind;
    const text=kind==='tap'?'Potential money coming in.':kind==='leak'?'Purchase costs and interest let money out.':kind==='both'?'Potential income and costs: compare both sides.':'Choose a card and follow the money.';
    byId('bucket-status').textContent=text;byId('bucket-desc').textContent=text;
  }
  function show(i){
    position=i;const s=scenes[i];
    byId('scenario-title').textContent=s.title;byId('scenario-detail').textContent=s.detail;byId('scenario-number').textContent=`Choice ${i+1} of ${scenes.length}`;
    byId('scenario-art').innerHTML=`<svg viewBox="0 0 220 160" fill="none" stroke="#285747" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${shapes[s.icon]}</svg>`;
    [...tabs.children].forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===i));b.classList.toggle('explored',answers.has(j));});
    document.querySelectorAll('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(answers.get(i)===b.dataset.answer)));
    byId('scenario-feedback').hidden=!answers.has(i);animate(answers.has(i)?s.answer:'neutral');
    if(answers.has(i))feedback();
    byId('game-progress').textContent=`${answers.size} of ${scenes.length} scenarios explored`;
    byId('game-complete').hidden=answers.size!==scenes.length;
    byId('next-scenario').textContent=i===scenes.length-1?'Return to first scenario ↺':'Next scenario →';
  }
  function feedback(){
    const s=scenes[position],chosen=answers.get(position);const label={tap:'Adds a Tap',leak:'Adds a Leak',both:'Both'};
    byId('feedback-title').textContent=chosen===s.answer?`${label[s.answer]} — here’s why`:`You chose ${label[chosen]}. Let’s examine ${label[s.answer].toLowerCase()}.`;
    byId('feedback-detail').textContent=s.explain;
    const box=byId('improve-choices');box.replaceChildren();
    s.improve.forEach((t,j)=>{const b=document.createElement('button');b.className='button';b.textContent=t;b.setAttribute('aria-pressed',String(improvements.get(position)===j));b.onclick=()=>{improvements.set(position,j);feedback();};box.append(b);});
    byId('improve-feedback').textContent=improvements.has(position)?(improvements.get(position)===s.better?'That reduces risk or avoidable costs. ':'Consider the other choice. ')+s.why:'';
  }
  function answer(value){answers.set(position,value);show(position);}
  document.querySelectorAll('[data-answer]').forEach(b=>{
    b.onclick=()=>answer(b.dataset.answer);
    b.addEventListener('dragover',e=>{e.preventDefault();b.classList.add('drop-ready');});
    b.addEventListener('dragleave',()=>b.classList.remove('drop-ready'));
    b.addEventListener('drop',e=>{e.preventDefault();b.classList.remove('drop-ready');if(e.dataTransfer.getData('text/plain')==='tap-leak-scenario')answer(b.dataset.answer);});
  });
  byId('scenario-card').addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','tap-leak-scenario');e.dataTransfer.effectAllowed='move';});
  byId('next-scenario').onclick=()=>show((position+1)%scenes.length);
  byId('restart-game').onclick=()=>{answers.clear();improvements.clear();show(0);};
  show(0);
})();

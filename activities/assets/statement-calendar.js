'use strict';
(function(){
  const $ = id => document.getElementById(id);
  const purchaseInput = $('purchase-date');
  const priceInput = $('purchase-price');
  const closeInput = $('closing-day');
  const aprInput = $('apr');
  const afterDueInput = $('days-after-due');
  const weekdayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const money = amount => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:2}).format(amount);
  let dateFmt = new Intl.DateTimeFormat(window.LFM?.lang==='ur'?'ur-PK':'en-CA',{weekday:'short',year:'numeric',month:'short',day:'numeric'});
  let monthFmt = new Intl.DateTimeFormat(window.LFM?.lang==='ur'?'ur-PK':'en-CA',{year:'numeric',month:'long'});
  const localDate = (year,month,day) => new Date(year,month,day,12,0,0,0);
  const parseInputDate = value => {
    const parts = value.split('-').map(Number);
    return parts.length === 3 && parts.every(Number.isFinite) ? localDate(parts[0],parts[1]-1,parts[2]) : null;
  };
  const addDays = (date,days) => localDate(date.getFullYear(),date.getMonth(),date.getDate()+days);
  const lastDay = (year,month) => new Date(year,month+1,0,12).getDate();
  const closeInMonth = (year,month,day) => localDate(year,month,Math.min(day,lastDay(year,month)));
  const inputDate = date => [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  const sameDate = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  const format = date => dateFmt.format(date);
  const escapeText = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function fillClosingDays(){
    for(let day=1;day<=31;day++){
      const option=document.createElement('option');
      option.value=String(day);
      option.textContent='Day '+day;
      if(day===20)option.selected=true;
      closeInput.appendChild(option);
    }
  }
  function findCycle(purchase,closingDay){
    let close=closeInMonth(purchase.getFullYear(),purchase.getMonth(),closingDay);
    if(close<purchase)close=closeInMonth(purchase.getFullYear(),purchase.getMonth()+1,closingDay);
    const previousClose=closeInMonth(close.getFullYear(),close.getMonth()-1,closingDay);
    return {start:addDays(previousClose,1),close:close};
  }
  function monthCalendar(year,month,start,close,purchase,closingDay){
    const first=localDate(year,month,1);
    let html='<section class="sc-month" aria-label="'+escapeText(monthFmt.format(first))+'"><h3>'+escapeText(monthFmt.format(first))+'</h3><div class="sc-days" aria-label="'+escapeText(monthFmt.format(first))+'">';
    weekdayNames.forEach(day=>{html+='<span class="sc-weekday">'+day+'</span>';});
    const offset=first.getDay();
    const daysInMonth=lastDay(year,month);
    for(let cell=0;cell<42;cell++){
      const dayNumber=cell-offset+1;
      if(dayNumber<1||dayNumber>daysInMonth){html+='<span class="sc-day outside" aria-hidden="true"></span>';continue;}
      const date=localDate(year,month,dayNumber);
      const inside=date>=start&&date<=close;
      const isPurchase=sameDate(date,purchase);
      const isClose=sameDate(date,close);
      const classes=['sc-day'];
      if(inside)classes.push('in-period');
      if(isPurchase)classes.push('purchase');
      if(isClose)classes.push('closing');
      const labels=[format(date)];
      if(inside)labels.push('in statement period');
      if(isPurchase)labels.push('purchase date');
      if(isClose)labels.push('statement closing date');
      html+='<button type="button" role="gridcell" class="'+classes.join(' ')+'" data-date="'+inputDate(date)+'" aria-label="'+escapeText(labels.join(', '))+'" aria-pressed="'+(isPurchase?'true':'false')+'" '+(inside?'':'disabled')+'>'+dayNumber+'</button>';
    }
    return html+'</div></section>';
  }
  function paintCalendar(start,close,purchase){
    $('period-label').textContent='Statement period: '+format(start)+' – '+format(close);
    const months=[];
    let cursor=localDate(start.getFullYear(),start.getMonth(),1);
    const finalMonth=localDate(close.getFullYear(),close.getMonth(),1);
    while(cursor<=finalMonth){
      months.push(monthCalendar(cursor.getFullYear(),cursor.getMonth(),start,close,purchase,Number(closeInput.value)));
      cursor=localDate(cursor.getFullYear(),cursor.getMonth()+1,1);
    }
    $('calendars').innerHTML=months.join('');
    $('calendars').querySelectorAll('[data-date]').forEach(button=>{
      button.addEventListener('click',()=>{purchaseInput.value=button.dataset.date;update();});
    });
  }
  function update(){
    const purchase=parseInputDate(purchaseInput.value);
    const price=Number(priceInput.value);
    const closingDay=Number(closeInput.value);
    const apr=Number(aprInput.value);
    const afterDue=Number(afterDueInput.value);
    const error=$('input-error');
    const valid=!!purchase&&Number.isFinite(price)&&price>=0.01&&price<=1000000&&Number.isFinite(apr)&&apr>=0&&apr<=100;
    error.hidden=valid;
    if(!valid){error.textContent='Enter a purchase amount from $0.01 to $1,000,000 and an APR from 0% to 100%.';return;}
    const cycle=findCycle(purchase,closingDay);
    const due=addDays(cycle.close,21);
    const payoff=addDays(due,afterDue);
    const days=Math.max(0,Math.round((payoff-purchase)/86400000));
    const estimate=price*(apr/100)/365*days;
    $('out-purchase').textContent=format(purchase);
    $('out-price').textContent=money(price)+' purchase amount';
    $('out-close').textContent=format(cycle.close);
    $('out-period').textContent='Cycle begins '+format(cycle.start);
    $('out-due').textContent=format(due);
    $('out-ontime').textContent=money(0);
    $('out-interest').textContent=money(estimate);
    $('out-payoff').textContent=format(payoff);
    $('out-days').textContent=String(days);
    $('interest-note').textContent='Illustration only: '+money(price)+' × '+apr.toFixed(2)+'% ÷ 365 × '+days+' days. Assumes no payment toward this purchase before '+format(payoff)+'.';
    paintCalendar(cycle.start,cycle.close,purchase);
  }
  window.addEventListener('lfmlanguagechange',()=>{const locale=window.LFM?.lang==='ur'?'ur-PK':'en-CA';dateFmt=new Intl.DateTimeFormat(locale,{weekday:'short',year:'numeric',month:'short',day:'numeric'});monthFmt=new Intl.DateTimeFormat(locale,{year:'numeric',month:'long'});update();});
  fillClosingDays();
  const today=new Date();
  purchaseInput.value=inputDate(localDate(today.getFullYear(),today.getMonth(),today.getDate()));
  [purchaseInput,priceInput,closeInput,aprInput,afterDueInput].forEach(control=>control.addEventListener('input',update));
  [closeInput,afterDueInput].forEach(control=>control.addEventListener('change',update));
  update();
})();
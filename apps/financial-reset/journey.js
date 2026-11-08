(function(root){'use strict';
const steps=['import','review','context','snapshot','plan'];let ready=false,reported=false,current='import';
const $=id=>document.getElementById(id);
function go(step,focus=true){
 if(!steps.includes(step)||step!=='import'&&!ready||['snapshot','plan'].includes(step)&&!reported)return;
 current=step;$('import-section').hidden=step!=='import';$('review-section').hidden=step!=='review';$('context-section').hidden=step!=='context';$('report').hidden=!['snapshot','plan'].includes(step);$('report').dataset.view=step==='plan'?'plan':'snapshot';
 document.querySelectorAll('[data-step]').forEach(b=>{b.setAttribute('aria-current',b.dataset.step===step?'step':'false');b.disabled=b.dataset.step!=='import'&&!ready||['snapshot','plan'].includes(b.dataset.step)&&!reported;});
 const target=$(step==='import'?'import-section':step==='review'?'review-section':step==='context'?'context-section':step==='plan'?'reset-plan':'report');
 if(focus&&target){target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'auto'});}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b){e.preventDefault();go(b.dataset.step);}const a=e.target.closest('a[href="#review-section"]');if(a){e.preventDefault();go('review');}});
root.ResetJourney={go,imported(){ready=true;go('review');},reported(){reported=true;go('snapshot');},reset(){ready=false;reported=false;go('import',false);},full(){go('snapshot',false);$('report').dataset.view='full';document.querySelectorAll('#report details').forEach(d=>d.open=true);},refresh(){go(current,false);},current:()=>current};
go('import',false);
})(window);

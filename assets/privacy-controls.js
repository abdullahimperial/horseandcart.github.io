/* Explicit, user-triggered removal of this site's saved learning data only. */
(()=>{'use strict';
const button=document.getElementById('clear-site-learning-data'),status=document.getElementById('privacy-storage-status');
if(!button||!status)return;
const owned=key=>key.startsWith('pf-course-')||['lfm-currency','lfm-last-module','lfm-intro-seen'].includes(key);
button.addEventListener('click',()=>{
 if(!window.confirm('Delete this site’s saved course notes, answers, progress and preferences from this browser? Download anything you want to keep first. This cannot be undone.'))return;
 let removed=0,failed=false;
 for(const name of ['localStorage','sessionStorage'])try{
  const storage=window[name],keys=[];for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key&&owned(key))keys.push(key);}
  for(const key of keys){storage.removeItem(key);removed++;}
 }catch{failed=true;}
 status.textContent=failed?'Some browser storage could not be cleared. Use your browser’s site-data settings to finish.':removed?'Saved course data and preferences cleared from this browser. Downloaded files and sent emails are unchanged.':'No saved course data or preferences were found in this browser.';
});
})();

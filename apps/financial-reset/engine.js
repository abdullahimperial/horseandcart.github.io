/* Pure, browser-local CSV and financial arithmetic. No network or storage. */
(function(root){
'use strict';
const categories=['Income','Government benefits & support','Housing','Groceries','Transport','Utilities','Health & care','Education & training','Childcare','Insurance','Subscriptions','Dining & shopping','Bank fees','Financing charges','Debt payments','Giving','Other','Transfer / card payment','Exclude'];
function parseCSV(text,delimiter){
 text=String(text).replace(/^\uFEFF/,'');
 if(!delimiter){
  const first=text.split(/\r?\n/,1)[0];
  delimiter=[',',';','\t'].map(d=>[d,(first.match(new RegExp(d==='\t'?'\t':d,'g'))||[]).length]).sort((a,b)=>b[1]-a[1])[0][0];
 }
 const rows=[];let row=[],cell='',quoted=false,closed=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}
  if(c==='"'){if(cell.trim()||closed)throw Error('Unexpected quote in CSV. Export a plain CSV with a header row.');quoted=true;cell='';}
  else if(c===delimiter){row.push(cell);cell='';closed=false;}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';closed=false;}
  else{if(closed&&c.trim())throw Error('Unexpected text after a quoted CSV value.');if(!closed)cell+=c;}
 }
 if(quoted)throw Error('An opening quote has no closing quote. Check the CSV export.');
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 if(rows.length<2)throw Error('A header and at least one transaction row are required.');
 if(rows.length>10001)throw Error('Use at most 10,000 transaction rows per file.');
 if(rows[0].length<2)throw Error('No CSV columns found. Supported separators: comma, semicolon, or tab.');
 if(rows[0].length>64)throw Error('Use a transaction export with at most 64 columns.');
 return {headers:rows[0].map((x,i)=>x.trim()||`Column ${i+1}`),rows:rows.slice(1),delimiter};
}
function number(value,style='dot'){
 let s=String(value??'').trim();if(!s)return null;
 let negative=/^\(.*\)$/.test(s);if(negative)s=s.slice(1,-1);
 s=s.replace(/^([+-]?)(?:CAD\s*|C\$\s*|\$\s*)/i,'$1').replace(/[\s\u00a0]/g,'');
 if(style==='comma') {if(!/^[+-]?(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?$/.test(s))throw Error('Invalid comma-decimal amount');s=s.replace(/\./g,'').replace(',','.');}
 else {if(!/^[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/.test(s))throw Error('Invalid decimal amount');s=s.replace(/,/g,'');}
 const n=Number(s)*(negative?-1:1);if(!Number.isFinite(n)||Math.abs(n)>1e9)throw Error('Amount outside supported range');return n;
}
function date(value,format='auto'){
 const s=String(value??'').trim();let y,m,d,match;
 if((match=s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T].*)?$/))){[,y,m,d]=match;}
 else if((match=s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/))){
  const a=+match[1],b=+match[2];y=match[3];
  if(format==='auto'&&a<=12&&b<=12&&a!==b)throw Error('Ambiguous date; choose month/day or day/month');
  if(format==='dmy'||(format==='auto'&&a>12)){d=a;m=b;}else{m=a;d=b;}
 }else throw Error('Unsupported date; use ISO, month/day/year, or day/month/year');
 y=+y;m=+m;d=+d;const timestamp=Date.UTC(y,m-1,d),v=new Date(timestamp);
 if(y<1900||y>2200||v.getUTCFullYear()!==y||v.getUTCMonth()!==m-1||v.getUTCDate()!==d)throw Error('Invalid calendar date');
 return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function merchant(s){return String(s).toUpperCase().replace(/\b\d{4,}\b/g,'').replace(/[^A-Z0-9]/g,' ').replace(/\s+/g,' ').trim();}
function isBenefit(description){return /\b(?:canada child benefit|child benefit|ccb|gst(?:[ /-]*hst)? (?:credit|benefit)|hst credit|employment insurance|ei (?:benefit|payment)|income support|social assistance|welfare|disability benefit|aish|odsp|ontario works|old age security|oas|guaranteed income supplement|gis benefit|government grant|student grant|housing benefit|rent subsidy)\b/i.test(description);}
function classify(description,flow,account){
 const s=description.toLowerCase();
 if(/payment thank|thank you.*payment|credit card payment|payment.*credit card|visa payment|mastercard payment|payment.*(?:visa|mastercard)|(?:visa|mastercard).*payment|online payment.*(?:card|credit)/.test(s))return 'Transfer / card payment';
 if(/transfer|e[- ]?transfer|etransfer|xfer|cashback reward|cash back reward/.test(s))return 'Other';
 if(flow==='in'&&account==='chequing'&&isBenefit(description))return 'Government benefits & support';
 if(flow==='in')return account==='chequing'&&/payroll|salary|direct deposit.*pay|pension|child benefit|gst credit|employer pay/.test(s)?'Income':'Other';
 if(/overdraft.*interest|interest charge|purchase interest|cash advance.*interest|finance charge/.test(s))return 'Financing charges';
 if(/overdraft fee|nsf|bank fee|monthly (?:account|service) fee|service charge|late (?:payment )?fee|annual fee|account fee/.test(s))return 'Bank fees';
 if(/loan payment|mortgage payment|student loan|installment|instalment|car loan/.test(s))return 'Debt payments';
 if(/rent\b|property tax|home insurance|condo/.test(s))return 'Housing';
 if(/grocery|groceries|superstore|safeway|sobeys|save on foods|h&w|produce/.test(s))return 'Groceries';
 if(/transit|uber(?! eats)|lyft|parking|gas station|fuel|petro|esso|shell/.test(s))return 'Transport';
 if(/electric|utility|utilities|epcor|enmax|telus|internet|phone plan|koodo/.test(s))return 'Utilities';
 if(/pharmacy|dental|dentist|medical|clinic|therapy/.test(s))return 'Health & care';
 if(/tuition|course fee|college fee|university fee|training fee/.test(s))return 'Education & training';
 if(/childcare|child care|daycare|day care/.test(s))return 'Childcare';
 if(/insurance|life policy/.test(s))return 'Insurance';
 if(/netflix|spotify|disney|prime membership|subscription|gym membership|apple\.com\/bill/.test(s))return 'Subscriptions';
 if(/restaurant|coffee|cafe|tim hortons|starbucks|uber eats|doordash|shopping|amazon|clothing/.test(s))return 'Dining & shopping';
 if(/charity|donation/.test(s))return 'Giving';
 return 'Other';
}
function normalize(parsed,map,account){
 if(map.date<0||map.description<0)throw Error('Choose date and description columns.');
 if(map.mode==='signed'&&map.amount<0)throw Error('Choose an amount column.');
 if(map.mode==='separate'&&(map.debit<0||map.credit<0||map.debit===map.credit))throw Error('Choose distinct debit and credit columns.');
 const used=[map.date,map.description,...(map.descriptionExtra>=0?[map.descriptionExtra]:[]),...(map.mode==='signed'?[map.amount]:[map.debit,map.credit])];
 if(new Set(used).size!==used.length)throw Error('Date, description, and amount columns must be distinct.');
 const transactions=[],invalid=[],currencies=new Set();let zero=0;
 parsed.rows.forEach((row,i)=>{
  try{
   if(row.length!==parsed.headers.length)throw Error('Column count differs from the header');
   const dt=date(row[map.date],map.dateFormat);const description=[row[map.description],map.descriptionExtra>=0?row[map.descriptionExtra]:''].filter(Boolean).join(' ').trim().slice(0,300);if(!description)throw Error('Missing description');
   if(map.currency>=0){const c=String(row[map.currency]||'').trim().toUpperCase();if(!['CAD','CA$','C$'].includes(c))throw Error(`Currency is ${c||'missing'}; only CAD is supported`);currencies.add(c);}
   let amount,flow;
   if(map.mode==='separate'){
    const debit=number(row[map.debit],map.numberStyle)||0,credit=number(row[map.credit],map.numberStyle)||0;
    if(debit<0||credit<0||debit&&credit)throw Error('Debit/credit columns need non-negative values, with only one side populated');
    amount=debit||credit;flow=debit?'out':'in';
   }else{
    const signed=number(row[map.amount],map.numberStyle);if(signed===null)throw Error('Missing amount');
    amount=Math.abs(signed);flow=(signed>=0)===(map.positive==='out')?'out':'in';
    if(map.direction>=0){const direction=String(row[map.direction]).trim().toLowerCase();if(/^(debit|dr|purchase|withdrawal|out)$/.test(direction))flow='out';else if(/^(credit|cr|refund|deposit|in)$/.test(direction))flow='in';else throw Error('Unknown debit/credit direction value');}
   }
   if(!amount){zero++;return;}
   let balance=null;if(map.balance>=0)balance=number(row[map.balance],map.numberStyle);
   const category=classify(description,flow,account);
   transactions.push({id:`${account}-${i}`,account,row:i+2,date:dt,description,merchant:merchant(description),amount,flow,category,balance,review:'Unreviewed',ambiguous:category==='Other'});
  }catch(error){invalid.push({row:i+2,reason:error.message});}
 });
 if(!transactions.length)throw Error('No transactions imported. '+(invalid.length?invalid.slice(0,3).map(e=>`Row ${e.row}: ${e.reason}`).join('; '):'Only zero-amount rows were found. Check the column mapping and amounts.'));
 return {transactions,invalid,zero};
}
function period(transactions,start,end){return transactions.filter(t=>t.date>=start&&t.date<=end);}
function summarize(transactions,start,end){
 const days=(new Date(end+'T00:00:00Z')-new Date(start+'T00:00:00Z'))/86400000+1;
 if(!Number.isFinite(days)||days<=0||days>3660)throw Error('Choose a valid date window of up to ten years.');
 const active=period(transactions,start,end);const months=days/30.4375;let income=0,expenses=0,otherCredits=0,refunds=0,chequeIn=0,chequeOut=0,transfers=0,excluded=0;
 const totals={};
 active.forEach(t=>{
  if(t.account==='chequing'){if(t.flow==='in')chequeIn+=t.amount;else chequeOut+=t.amount;}
  if(t.category==='Exclude'){excluded++;return;}
  if(t.category==='Transfer / card payment'){transfers+=t.amount;return;}
  if(t.flow==='in'&&t.account==='chequing') {
   if(['Income','Government benefits & support'].includes(t.category)){income+=t.amount;return;}
   if(t.category==='Other'){otherCredits+=t.amount;return;}
  }
  if(['Income','Government benefits & support'].includes(t.category))return;
  const net=t.flow==='out'?t.amount:-t.amount;expenses+=net;totals[t.category]=(totals[t.category]||0)+net;
  if(t.flow==='in')refunds+=t.amount;
 });
 const included=active.filter(t=>!['Exclude','Transfer / card payment'].includes(t.category));
 const groups=new Map(),duplicates=[];
 active.forEach(t=>{const key=[t.account,t.date,t.merchant,t.amount,t.flow].join('|');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(t);});
 for(const group of groups.values())if(group.filter(t=>t.category!=='Exclude').length>1)duplicates.push(group);
 const merchants=new Map();included.filter(t=>t.flow==='out').forEach(t=>{if(!merchants.has(t.merchant))merchants.set(t.merchant,[]);merchants.get(t.merchant).push(t);});
 const recurring=[];for(const [name,items] of merchants){const dates=[...new Set(items.map(t=>t.date))].sort();if(dates.length>1){const gap=(new Date(dates[dates.length-1])-new Date(dates[0]))/86400000;if(gap>=20)recurring.push({name,items,total:items.reduce((s,t)=>s+t.amount,0)});}}
 return {active,income,expenses,otherCredits,refunds,chequeIn,chequeOut,transfers,excluded,totals,duplicates,recurring,days,months,surplus:income-expenses,monthlyIncome:income/months,monthlyExpenses:expenses/months,monthlySurplus:(income-expenses)/months,unknown:included.filter(t=>t.category==='Other'),unrecognized:active.filter(t=>t.review==='Not recognized')};
}
function contextNumbers(values){
 const n={};for(const key of ['reserve','essentials','months','threshold','confirmedSurplus','feesCut','subscriptionCut','livingCut','habitCut','benefitGain']){
  const raw=String(values[key]??'').trim();n[key]=raw===''?null:number(raw);
  if(n[key]!==null&&(n[key]<0||n[key]>1e9))throw Error('Financial context amounts must be non-negative.');
 }
 if(n.months===null||n.months<=0||n.months>120)throw Error('Reserve duration must be greater than zero and at most 120 months.');
 if(n.threshold===null||n.threshold<=0||n.threshold>100)throw Error('Choose an expensive-debt screening rate above 0% and at most 100%.');
 return n;
}
root.ResetEngine={parseCSV,number,date,merchant,classify,normalize,summarize,contextNumbers,categories,isBenefit};
})(typeof window!=='undefined'?window:globalThis);

/* Pure, browser-local CSV and financial arithmetic. No network or storage. */
(function(root){
'use strict';
const categories=['Income','Government benefits & support','Investments','Recreation','Shopping','Home renovation','Taxes','Housing','Groceries','Transport','Utilities','Health & care','Education & training','Childcare','Insurance','Subscriptions','Dining & shopping','Bank fees','Financing charges','Debt payments','Giving','Other','Transfer / card payment','Exclude'];
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
  if(c==='"'){if(cell.trim()||closed)throw Error('Unexpected quote in CSV. Export a plain CSV file.');quoted=true;cell='';}
  else if(c===delimiter){row.push(cell);cell='';closed=false;}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';closed=false;}
  else{if(closed&&c.trim())throw Error('Unexpected text after a quoted CSV value.');if(!closed)cell+=c;}
 }
 if(quoted)throw Error('An opening quote has no closing quote. Check the CSV export.');
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 if(!rows.length)throw Error('At least one transaction row is required.');
 if(rows[0].length<2)throw Error('No CSV columns found. Supported separators: comma, semicolon, or tab.');
 if(rows[0].length>64)throw Error('Use a transaction export with at most 64 columns.');
 // A date in the first cell is data, never a column heading. Keep it even
 // when the amount is malformed, so normal row validation can explain it.
 const headerless=/^(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})(?:[ T].*)?$/.test(rows[0][0].trim());
 const standard=headerless&&rows[0].length===5;
 const headers=headerless?(standard?['Date','Description','Debit','Credit','Balance']:rows[0].map((x,i)=>`Column ${i+1}`)):rows[0].map((x,i)=>x.trim()||`Column ${i+1}`);
 const data=headerless?rows:rows.slice(1);
 if(!data.length)throw Error('At least one transaction row is required.');
 if(data.length>10000)throw Error('Use at most 10,000 transaction rows per file.');
 return {headers,rows:data,delimiter,headerless,standardLayout:standard,rowOffset:headerless?1:2};
}
function dateFormatHint(rows,column){
 let mdy=false,dmy=false;
 for(const row of rows){const m=String(row[column]??'').trim().match(/^(\d{1,2})[-/](\d{1,2})[-/]\d{4}$/);if(!m)continue;const a=+m[1],b=+m[2];if(a>=1&&a<=12&&b>12&&b<=31)mdy=true;if(b>=1&&b<=12&&a>12&&a<=31)dmy=true;}
 return mdy&&!dmy?'mdy':dmy&&!mdy?'dmy':'auto';
}
function commonDateWindow(transactions){
 const dates=account=>transactions.filter(t=>t.account===account).map(t=>t.date).sort();
 const card=dates('card'),chequing=dates('chequing');
 if(!card.length||!chequing.length)return null;
 const start=card[0]>chequing[0]?card[0]:chequing[0],end=card.at(-1)<chequing.at(-1)?card.at(-1):chequing.at(-1);
 return start<=end?{start,end}:null;
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
function categorySuggestion(description,flow,account){
 const s=String(description).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const match=(category,reason)=>({category,reason});
 if(/payment thank|thank you.*payment|credit card payment|payment.*credit card|visa payment|mastercard payment|payment.*(?:visa|mastercard)|(?:visa|mastercard).*(?:payment|pymt|pmt)|online payment.*(?:card|credit)/.test(s))return match('Transfer / card payment','Card-payment wording; check the matching settlement.');
 if(/\bhome\s*depot\s*ccs\b|\bhomedepotccs\b/.test(s))return match('Transfer / card payment','Possible Home Depot card settlement, rather than a new purchase. Check the statement.');
 if(/overdraft.*interest|interest charge|purchase interest|cash advance.*interest|finance charge/.test(s))return match('Financing charges','Interest or financing-charge wording.');
 if(/overdraft fee|\bnsf\b|bank fee|monthly (?:account|service) fee|service charge|late (?:payment )?fee|annual fee|account fee|acct bal rebate|account balance rebate/.test(s))return match('Bank fees','Bank fee or account-fee rebate wording.');
 if(/\b(?:rrsp|tfsa|resp|rdsp|fhsa)\b.{0,30}\b(?:contribution|deposit|transfer|withdrawal)\b|\b(?:contribution|deposit|transfer|withdrawal)\b.{0,30}\b(?:rrsp|tfsa|resp|rdsp|fhsa)\b|\b(?:investment|brokerage) (?:transfer|contribution|deposit|withdrawal|purchase)\b|\b(?:stock|etf|mutual fund|bond) purchase\b|\btd waterhouse\b|\bquestrade\b/.test(s))return match('Investments','Investment account, brokerage or contribution wording.');
 if(flow==='in'&&account==='chequing'&&isBenefit(description))return match('Government benefits & support','Benefit or support-payment wording.');
 if(flow==='in'&&account==='chequing'&&/\b(?:payroll|salary|pension|employer pay)\b|direct deposit.*pay|\bpay$/.test(s))return match('Income','Payroll wording or the bank’s PAY deposit code.');
 if(/loan payment|mortgage payment|student loan|installment|instalment|car loan/.test(s))return match('Debt payments','Loan or mortgage-payment wording.');
 if(/cashback reward|cash back reward/.test(s))return match('Other','Cashback reward: review how to categorize this credit.');
 // Specific merchants take precedence over broad words such as INV or school.
 if(/\bpc\s*express\b|\bh\s*w\s*produce\b|grocery|groceries|superstore|safeway|sobeys|save on foods|no frills|freshco|food basics|loblaws|t\s*t supermarket|produce/.test(s))return match('Groceries','Grocery merchant or food-market wording.');
 if(/\bhome\s*depot\b|\brona\b|\blowes\b|\bhome hardware\b|renovation|building supplies|lumber|plumbing repair|roofing/.test(s))return match('Home renovation','Home-improvement merchant or repair wording; check the purchase.');
 if(/dollar\s*tree|dollarama|\bwalmart\b|\bwal mart\b|\bcostco\b|\bcanadian tire\b|\bamazon\b|\bamzn\b|clothing|shopping/.test(s)&&!/prime membership|subscription/.test(s))return match('Shopping','Retail merchant; move groceries or other purchases to their actual category.');
 if(/netflix|spotify|disney|prime membership|subscription|\bsubscr\b|chatgpt|dash\s*pass|apple com bill/.test(s))return match('Subscriptions','Subscription, membership pass or recurring-service wording.');
 if(/uber\s*eats|doordash|skip\s*the\s*dishes|restaurant|coffee|cafe|tim hortons|starbucks|\bpizza|^tst\b/.test(s))return match('Dining & shopping','Restaurant, food-delivery or restaurant-payment wording.');
 if(/landmark cinemas|cineplex|cinema|movie|theatre|theater|recreation|recreation centre|leisure|bowling|skating|swimming|swim school|swim lesson|gym|fitness|amusement|museum|\bzoo\b|ticketmaster/.test(s))return match('Recreation','Recreation, cinema, fitness or activity wording.');
 if(/transit|\buber|lyft|parking|gas station|fuel|petro|esso|\bshell\b/.test(s))return match('Transport','Ride, transit, parking or fuel wording.');
 if(/childcare|child care|daycare|day care|after school care/.test(s))return match('Childcare','Childcare or daycare wording.');
 if(/tuition|\bschool\b|course fee|college|university|training fee/.test(s))return match('Education & training','School, tuition or education wording.');
 if(/pharmacy|shoppers drug mart|rexall|dental|dentist|medical|clinic|therapy|healthcare|\bahs cnct\b/.test(s))return match('Health & care','Pharmacy, healthcare or health-service wording.');
 if(/\bedm\s*taxes\b|\btax(?:es)?\b/.test(s))return match('Taxes','Tax or municipal-tax wording, including Edmonton property taxes.');
 if(/rent\b|home insurance|condo/.test(s))return match('Housing','Housing, home-insurance or condo wording.');
 if(/electric|utility|utilities|epcor|enmax|telus|internet|phone plan|koodo|fido|shaw|rogers/.test(s))return match('Utilities','Utility, phone or internet-provider wording.');
 if(/insurance|life policy/.test(s))return match('Insurance','Insurance or policy wording.');
 if(/charity|donation|\b(?:masjid|mosque|church|temple|gurdwara|markaz)\b/.test(s))return match('Giving','Giving or community-organization wording; check whether this was a donation or a fee.');
 if(/\binv\b/.test(s)&&!(/\binvoice\b/.test(s)))return match('Investments','INV may mean investment. Confirm that it is not an invoice reference.');
 if(/transfer|etransfer|e transfer|xfer|cashback reward|cash back reward|moneygram|cash withdra/.test(s))return match('Other','Transfer, cash withdrawal or reward: its purpose needs your review.');
 return match('Other','No clear merchant or keyword match. Choose the category.');
}
function classify(description,flow,account){return categorySuggestion(description,flow,account).category;}

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
   const suggestion=categorySuggestion(description,flow,account),category=suggestion.category;
   transactions.push({id:`${account}-${i}`,account,row:i+(parsed.rowOffset??2),date:dt,description,merchant:merchant(description),amount,flow,category,categoryReason:suggestion.reason,balance,review:'Unreviewed',ambiguous:category==='Other'});
  }catch(error){invalid.push({row:i+(parsed.rowOffset??2),reason:error.message});}
 });
 if(!transactions.length)throw Error('No transactions imported. '+(invalid.length?invalid.slice(0,3).map(e=>`Row ${e.row}: ${e.reason}`).join('; '):'Only zero-amount rows were found. Check the column mapping and amounts.'));
 return {transactions,invalid,zero};
}
function period(transactions,start,end){return transactions.filter(t=>t.date>=start&&t.date<=end);}
function summarize(transactions,start,end){
 const days=(new Date(end+'T00:00:00Z')-new Date(start+'T00:00:00Z'))/86400000+1;
 if(!Number.isFinite(days)||days<=0||days>3660)throw Error('Choose a valid date window of up to ten years.');
 const active=period(transactions,start,end);const months=days/30.4375;let income=0,expenses=0,otherCredits=0,refunds=0,chequeIn=0,chequeOut=0,transfers=0,investmentOut=0,investmentIn=0,excluded=0;
 const totals={};
 active.forEach(t=>{
  if(t.account==='chequing'){if(t.flow==='in')chequeIn+=t.amount;else chequeOut+=t.amount;}
  if(t.category==='Exclude'){excluded++;return;}
  if(t.category==='Transfer / card payment'){transfers+=t.amount;return;}
  if(t.category==='Investments'){if(t.flow==='out')investmentOut+=t.amount;else investmentIn+=t.amount;return;}
  if(t.flow==='in'&&t.account==='chequing') {
   if(['Income','Government benefits & support'].includes(t.category)){income+=t.amount;return;}
   if(t.category==='Other'){otherCredits+=t.amount;return;}
  }
  if(['Income','Government benefits & support'].includes(t.category))return;
  const net=t.flow==='out'?t.amount:-t.amount;expenses+=net;totals[t.category]=(totals[t.category]||0)+net;
  if(t.flow==='in')refunds+=t.amount;
 });
 const included=active.filter(t=>!['Exclude','Transfer / card payment','Investments'].includes(t.category));
 const groups=new Map(),duplicates=[];
 active.forEach(t=>{const key=[t.account,t.date,t.merchant,t.amount,t.flow].join('|');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(t);});
 for(const group of groups.values())if(group.filter(t=>t.category!=='Exclude').length>1)duplicates.push(group);
 const merchants=new Map();included.filter(t=>t.flow==='out').forEach(t=>{if(!merchants.has(t.merchant))merchants.set(t.merchant,[]);merchants.get(t.merchant).push(t);});
 const recurring=[];for(const [name,items] of merchants){const dates=[...new Set(items.map(t=>t.date))].sort();if(dates.length>1){const gap=(new Date(dates[dates.length-1])-new Date(dates[0]))/86400000;if(gap>=20)recurring.push({name,items,total:items.reduce((s,t)=>s+t.amount,0)});}}
 return {active,income,expenses,otherCredits,refunds,chequeIn,chequeOut,transfers,investmentOut,investmentIn,excluded,totals,duplicates,recurring,days,months,surplus:income-expenses,monthlyIncome:income/months,monthlyExpenses:expenses/months,monthlySurplus:(income-expenses)/months,unknown:included.filter(t=>t.category==='Other'),unrecognized:active.filter(t=>t.review==='Not recognized')};
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
root.ResetEngine={parseCSV,dateFormatHint,commonDateWindow,number,date,merchant,classify,categorySuggestion,normalize,summarize,contextNumbers,categories,isBenefit};
})(typeof window!=='undefined'?window:globalThis);


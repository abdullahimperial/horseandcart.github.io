const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
require('../merchant-extra.js');require('../merchant-rules.js');require('../engine.js');require('../bank-files.js');
const M=globalThis.ResetMerchants,E=globalThis.ResetEngine;
const classify=(text,flow='out',account='card')=>E.categorySuggestion(text,flow,account);
test('ride, delivery and membership variants remain distinct, including joined descriptors',()=>{
 const cases=[['UBER CANADA UBERTRIP','Transport'],['UBER *TRIP HELP.UBER.COM','Transport'],['UBER CANADA UBEREATS','Dining & shopping'],['UBER EATS TRIP HELP.UBER.COM','Dining & shopping'],['UBER ONE','Subscriptions'],['UBERONE','Subscriptions'],['DOORDASHFICTIONALCAFE','Dining & shopping'],['DD DOORDASHDASHPASS','Subscriptions'],['DOORDASH DASH PASS','Subscriptions'],['PC EXPRESS','Groceries'],['PC EXPRESS PASS','Subscriptions']];
 for(const [text,category] of cases){const result=classify(text);assert.equal(result.category,category,text);assert.ok(result.merchantId,text);}
});
test('retailer departments and specific subscriptions beat umbrella brands',()=>{
 const cases=[['Costco Pharmacy','Health & care'],['Costco Food Court','Dining & shopping'],['Costco Gasoline','Transport'],['Costco Optical','Health & care'],['Costco Wholesale','Shopping'],['Walmart Pharmacy','Health & care'],['Walmart Vision Center','Health & care'],['Walmart','Shopping'],['IKEA Restaurant','Dining & shopping'],['Amazon Prime','Subscriptions'],['AMZN PRIME','Subscriptions'],['AMAZON PRIME MARKETPLACE','Shopping'],['AMAZON MUSIC UNLIMITED','Subscriptions'],['Disney+','Subscriptions']];
 for(const [text,category]of cases)assert.equal(classify(text).category,category,text);
 assert.equal(M.match('Disney Resort'),null); // Plus is meaningful, not discarded punctuation.
});
test('ambiguous billing, remittance and bank names stay unresolved',()=>{
 for(const text of ['MoneyGram','Western Union','Remitly','BMO PAYMENT','APPLE.COM/BILL','OPENAI API']){const s=classify(text);assert.equal(s.category,'Other',text);assert.ok(s.merchantId,text);}
 assert.equal(classify('OPENAI *CHATGPT SUBSCR').category,'Subscriptions');
 assert.equal(classify('OPENAI API CHATGPT').category,'Other');
 assert.equal(classify('BMO VISA PAYMENT').category,'Transfer / card payment');
});
test('financial context takes precedence while preserving matching identity evidence',()=>{
 const cases=[['AMAZON PAYROLL','in','chequing','Income'],['LYFT DRIVER EARNINGS','in','chequing','Income'],['DOORDASH PAYOUT','in','chequing','Income'],['COSTCO MASTERCARD PAYMENT','out','chequing','Transfer / card payment'],['TD WATERHOUSE MONTHLY ACCOUNT FEE','out','chequing','Bank fees'],['CI INV SERVICES','out','chequing','Investments'],['TD DIRECT INVESTING','out','chequing','Investments'],['TELUS COMM','out','chequing','Utilities'],['COE EDMTAXES TAX','out','chequing','Taxes']];
 for(const [text,flow,account,category]of cases){const s=classify(text,flow,account);assert.equal(s.category,category,text);assert.ok(s.merchantId,text);assert.match(s.sourceUrl,/^https:/);}
});
test('temporary authorizations have an explicit review explanation and are not silently deleted',()=>{
 const s=classify('LYFT *TEMP AUTH HOLD');assert.equal(s.category,'Transport');assert.match(s.reason,/temporary authorization/);assert.match(s.reason,/whether it posted/);
 const p=E.parseCSV('2024-01-15,LYFT TEMP AUTH HOLD,5,,100');const r=E.normalize(p,{date:0,description:1,descriptionExtra:-1,mode:'separate',debit:2,credit:3,balance:4,currency:-1,dateFormat:'auto',numberStyle:'dot'},'card');
 assert.equal(r.transactions.length,1);assert.equal(r.transactions[0].amount,5);assert.equal(r.transactions[0].merchantName,'Lyft');assert.equal(r.transactions[0].review,'Unreviewed');
});
test('boundaries and removed ambiguous aliases resist plausible false matches',()=>{
 for(const text of ['BK TRANSFER','EB PAYMENT','SUBWAY TRANSIT','ENTERPRISE SOFTWARE','GAP PAYMENT','ZOOM CAR','CI INVOICE SERVICES','TELUS HEALTH','PC EXPRESSWAY','STARBUCKSON','LYFTON','RONAUD'])assert.equal(M.match(text),null,text);
});
test('all additional entries have valid categories, stable unique identifiers and source links',()=>{
 assert.equal(M.rules.length,53);assert.equal(M.allRules.length,122);assert.equal(globalThis.ResetMerchantExtras.rules.length,69);
 const ids=globalThis.ResetMerchantExtras.rules.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);
 for(const r of globalThis.ResetMerchantExtras.rules){assert.ok(E.categories.includes(r.category));assert.match(r.sourceUrl,/^https:/);assert.ok(r.aliases.length);assert.ok(r.sourceName);}
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');assert.ok(html.indexOf('merchant-extra.js')<html.indexOf('merchant-rules.js'));assert.match(html,/Enrichment from Merchant Studio by Jonathan Taveras/);assert.match(html,/CC BY 4.0/);
});
test('manual categories remain authoritative, and the source link is escaped in the actual review renderer',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),nodes=new Map();
 const $=selector=>{if(!nodes.has(selector))nodes.set(selector,{value:selector==='#category-filter'?'all':'',innerHTML:'',querySelectorAll:()=>[]});return nodes.get(selector);};
 const p=E.parseCSV('2024-01-15,PC EXPRESS,5,,100'),t=E.normalize(p,{date:0,description:1,descriptionExtra:-1,mode:'separate',debit:2,credit:3,balance:4,currency:-1,dateFormat:'auto',numberStyle:'dot'},'card').transactions[0];
 t.category='Shopping';t.categoryReason='Selected by you.';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const state={E,$,transactions:[t],page:0,esc,cash:n=>String(n),invalidate(){},renderReviewChart(){},renderResiliencePreview(){}};vm.createContext(state);
 vm.runInContext(src.slice(src.indexOf('function renderTransactions('),src.indexOf('function debtRows(')),state);state.renderTransactions();
 assert.match($('#transactions').innerHTML,/Matched name: PC Express/);assert.match($('#transactions').innerHTML,/Name source/);assert.match($('#transactions').innerHTML,/Selected by you/);assert.equal(t.category,'Shopping');
 t.merchantSourceUrl='javascript:alert(1)';state.renderTransactions();assert.ok(!$('#transactions').innerHTML.includes('javascript:'));
 t.merchantName='<img src=x onerror=alert(1)>';state.renderTransactions();assert.ok(!$('#transactions').innerHTML.includes('<img'));
});

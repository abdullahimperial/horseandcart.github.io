const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
require('../merchant-rules.js');require('../engine.js');require('../bank-files.js');require('../resilience.js');
const E=globalThis.ResetEngine,B=globalThis.ResetBankFiles,R=globalThis.ResetResilience;
const trn=(id='one',amount='-25.50',name='Farm Boy',extra='',dt='20240815120000[-6:MDT]',type='DEBIT')=>`<STMTTRN><TRNTYPE>${type}</TRNTYPE><DTPOSTED>${dt}</DTPOSTED><TRNAMT>${amount}</TRNAMT><FITID>${id}</FITID><NAME>${name}</NAME>${extra}</STMTTRN>`;
const stmt=(role='chequing',rows=trn(),extra='',currency='CAD',type='CHECKING',id='9876543210')=>{
 const tag=role==='card'?'CCSTMTRS':'STMTRS',acct=role==='card'?`<CCACCTFROM><ACCTID>${id}</ACCTID></CCACCTFROM>`:`<BANKACCTFROM><BANKID>001</BANKID><ACCTID>${id}</ACCTID><ACCTTYPE>${type}</ACCTTYPE></BANKACCTFROM>`;
 return `<${tag}><CURDEF>${currency}</CURDEF>${acct}<BANKTRANLIST><DTSTART>20240801</DTSTART><DTEND>20240831</DTEND>${rows}</BANKTRANLIST>${extra}</${tag}>`;
};
const xml=(body=stmt())=>'<?xml version="1.0" encoding="UTF-8"?><?OFX OFXHEADER="200" VERSION="211" SECURITY="NONE" OLDFILEUID="NONE" NEWFILEUID="NONE"?><OFX>'+body+'</OFX>';
const sgml=body=>'OFXHEADER:100\r\nDATA:OFXSGML\r\nVERSION:102\r\nSECURITY:NONE\r\nENCODING:USASCII\r\nCHARSET:1252\r\n\r\n<OFX>'+body.replace(/<\/(TRNTYPE|DTPOSTED|TRNAMT|FITID|NAME|MEMO|BANKID|ACCTID|ACCTTYPE|CURDEF|DTSTART|DTEND|BALAMT|DTASOF|CODE|SEVERITY)>/g,'\r\n')+'</OFX>';
const imported=(body,role='chequing',name='test.ofx')=>B.normalize(B.parse(xml(body),name),0,role);
const ledger='<LEDGERBAL><BALAMT>1234.56</BALAMT><DTASOF>20240901010000[-6:MDT]</DTASOF></LEDGERBAL>';
test('OFX 2 XML and OFX 1 SGML produce identical signed transactions and a dated ledger balance',()=>{
 const body=stmt('chequing',trn()+trn('two','1000','Example Payroll','','20240816','DIRECTDEP'),ledger);
 const x=B.normalize(B.parse(xml(body),'test.ofx'),0,'chequing'),s=B.normalize(B.parse(sgml(body),'test.ofx'),0,'chequing');
 assert.deepEqual(s,x);assert.equal(x.transactions[0].flow,'out');assert.equal(x.transactions[1].flow,'in');assert.equal(x.transactions[1].category,'Income');
 assert.equal(x.transactions[0].date,'2024-08-15');assert.equal(x.transactions[0].balance,null);assert.equal(x.transactions[0].statementBalance.amount,1234.56);
 assert.deepEqual(R.recordedBalance(x.transactions),{amount:1234.56,date:'2024-09-01',reason:'Dated ledger balance from the bank export.'});
});
test('QFX and QBO card purchases, refunds and payments follow OFX signs rather than CSV conventions',()=>{
 for(const ext of ['qfx','qbo']){
  const p=B.parse(xml(stmt('card',trn()+trn('refund','5','Farm Boy')+trn('pay','300','Payment','','20240820','PAYMENT'),ledger)),`fictional.${ext}`);
  const t=B.normalize(p,0,'card').transactions;
  assert.equal(p.format,ext.toUpperCase());assert.deepEqual(t.map(x=>x.flow),['out','in','in']);assert.equal(t[2].category,'Transfer / card payment');
  const s=E.summarize(t,'2024-08-01','2024-08-31');assert.equal(s.expenses,20.5);assert.equal(s.transfers,300);assert.equal(R.recordedBalance(t).amount,null);
 }
});
test('bank transaction types identify fees, interest and dividends without guessing that all deposits are income',()=>{
 const cases=[['FEE','-3','Bank fees'],['SRVCHG','3','Bank fees'],['INT','2','Income'],['INT','-2','Financing charges'],['DIV','20','Income'],['DIRECTDEP','20','Other'],['XFER','-20','Other'],['PAYMENT','-20','Other']];
 for(const [type,n,expected] of cases)assert.equal(imported(stmt('chequing',trn(type,n,'Unspecified entry','','20240815',type))).transactions[0].category,expected,type);
});
test('multi-account files require selecting the correct account and role',()=>{
 const p=B.parse(xml(stmt('card')+stmt('chequing',trn('two'))+stmt('chequing',trn('three'),'','CAD','SAVINGS','11112222')),'multi.ofx');
 assert.equal(p.accounts.length,3);assert.equal(p.accounts.filter(x=>x.role==='chequing').length,2);
 assert.throws(()=>B.normalize(p,-1,'chequing'),/Choose an account/);
 assert.throws(()=>B.normalize(p,0,'card'),/credit-card/); // bank statements are indexed before card statements
 assert.equal(B.normalize(p,2,'card').transactions.length,1);assert.match(p.accounts[1].label,/2222/);assert.doesNotMatch(p.accounts[1].label,/11112222/);
});
test('non-CAD, missing currency, loan accounts and correction instructions block an account',()=>{
 for(const currency of ['USD',''])assert.throws(()=>imported(stmt('chequing',trn(),'',currency)),/only CAD/);
 assert.throws(()=>imported(stmt('chequing',trn(),'','CAD','CREDITLINE')),/Credit lines/);
 assert.throws(()=>imported(stmt('chequing',trn()+trn('two','-2','Store','<CORRECTFITID>old</CORRECTFITID><CORRECTACTION>REPLACE</CORRECTACTION>'))),/corrections/);
 assert.throws(()=>B.parse(xml('<INVSTMTRS><CURDEF>CAD</CURDEF></INVSTMTRS>'),'investment.ofx'),/No supported/);
});
test('only identical repeated FITIDs are omitted; distinct IDs and conflicting duplicates remain visible',()=>{
 const r=imported(stmt('chequing',trn()+trn()+trn('different')));assert.equal(r.duplicates,1);assert.equal(r.transactions.length,2);
 const conflict=imported(stmt('chequing',trn()+trn('one','-30')));assert.equal(conflict.invalid.length,1);assert.match(conflict.invalid[0].reason,/Conflicting/);
 const missing=imported(stmt('chequing',trn()+trn('','-1')));assert.equal(missing.invalid.length,1);assert.match(missing.invalid[0].reason,/FITID/);
});
test('zero and pending transactions are reported separately and available balance never becomes cash',()=>{
 const r=imported(stmt('chequing',trn()+trn('zero','0'),'<BANKTRANLISTP><STMTTRNP><TRNAMT>-99</TRNAMT></STMTTRNP></BANKTRANLISTP><AVAILBAL><BALAMT>999999</BALAMT><DTASOF>20240831</DTASOF></AVAILBAL>'));
 assert.equal(r.transactions.length,1);assert.equal(r.zero,1);assert.equal(r.pending,1);assert.equal(R.recordedBalance(r.transactions).amount,null);
});
test('OFX dates preserve written posting days and reject impossible dates or times',()=>{
 assert.equal(B.date('20240229235959.000[-7:MST]'),'2024-02-29');assert.equal(B.date('20240801'),'2024-08-01');
 for(const value of ['20230229','20241301','20240815250000','20240815120000[+99:X]','202408','not a date'])assert.throws(()=>B.date(value));
});
test('invalid amounts, repeated fields and unknown types are not silently analyzed',()=>{
 for(const bad of ['1,000.00','NaN','1e5','1000000001']){const r=imported(stmt('chequing',trn()+trn('bad',bad)));assert.equal(r.invalid.length,1);}
 const repeated=imported(stmt('chequing',trn()+trn('bad','-1','Store','<TRNAMT>-2</TRNAMT>')));assert.match(repeated.invalid[0].reason,/Repeated TRNAMT/);
 const fx=imported(stmt('chequing',trn()+trn('fx','-2','Store','<ORIGCURRENCY><CURSYM>USD</CURSYM><CURRATE>1.4</CURRATE></ORIGCURRENCY>')));assert.match(fx.invalid[0].reason,/currency conversion/);
 const type=imported(stmt('chequing',trn()+trn('bad','-1','Store','','20240815','UNDEFINED')));assert.match(type.invalid[0].reason,/transaction type/);
});
test('XML entities decode to text; hostile or malformed documents cannot execute or fetch content',()=>{
 const t=imported(stmt('chequing',trn('one','-1','A&amp;W','<MEMO>&lt;img src=x onerror=alert(1)&gt; &#233;</MEMO>'))).transactions[0];assert.match(t.description,/<img/);assert.match(t.description,/é/);assert.match(t.description,/A&W/);
 for(const broken of [xml().slice(0,-6),xml().replace('</TRNAMT>','</FITID>'),xml()+'junk','<!DOCTYPE OFX [<!ENTITY x SYSTEM "file:///etc/passwd">]>'+xml(),xml().replace('</NAME>','')])assert.throws(()=>B.parse(broken,'bad.ofx'));
 assert.throws(()=>B.parse(xml('<STATUS><CODE>2000</CODE><SEVERITY>ERROR</SEVERITY></STATUS>'+stmt()),'error.ofx'),/reports an error/);
});
test('file reader supports UTF-8, Windows-1252 and UTF-16 BOM exports, while CSV is unchanged',async()=>{
 const texts=[Buffer.from(xml(stmt('chequing',trn('one','-1','Café'))),'utf8'),Buffer.from(sgml(stmt('chequing',trn('one','-1','Café'))),'latin1'),Buffer.concat([Buffer.from([255,254]),Buffer.from(xml(stmt('chequing',trn('one','-1','Café'))),'utf16le')])];
 for(const bytes of texts){const p=await B.read({name:'example.ofx',size:bytes.length,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)});assert.match(B.normalize(p,0,'chequing').transactions[0].description,/Café/);}
 const csv='2024-08-15,FICTIONAL SHOP,12,,100';assert.deepEqual(B.parse(csv,'example.csv'),E.parseCSV(csv));
 assert.throws(()=>B.parse('!Type:Bank\nD8/15/24','example.qif'),/not supported/);await assert.rejects(B.read({size:6*1024*1024}),/5 MB/);
});
test('record and file limits prevent oversized exports from being partially imported',()=>{
 assert.throws(()=>B.parse(xml(stmt('chequing',Array(10001).fill(trn()).join(''))),'large.ofx'),/10,000/);
 assert.throws(()=>B.parse(' '.repeat(5*1024*1024+1),'large.ofx'),/5 MB/);
});
test('sourced merchants have identifiers and specific branches override generic retailers',()=>{
 const examples=[['FARM BOY 001','Groceries'],['LONGO’S TORONTO','Groceries'],['MARCHE ADONIS','Groceries'],['Costco Pharmacy 42','Health & care'],['Costco Food Court 42','Dining & shopping'],['Walmart Pharmacy 99','Health & care'],['Mary Brown’s 007','Dining & shopping'],['HomeDepot 007','Home renovation'],['Landmark Cinemas','Recreation']];
 for(const [text,category] of examples){const s=E.categorySuggestion(text,'out','card');assert.equal(s.category,category,text);assert.ok(s.merchantId,text);assert.equal(s.source,'Name Suggestion Index');}
 for(const text of ['FARM BOYER','RONAUD STORE','METRO TAXI','IGA CONTRACTING'])assert.equal(globalThis.ResetMerchants.match(text),null,text);
 assert.equal(E.classify('COSTCO WHOLESALE','out','card'),'Shopping');assert.equal(E.classify('VISA PAYMENT FARM BOY','out','chequing'),'Transfer / card payment');assert.equal(E.classify('Farm Boy Payroll','in','chequing'),'Income');
 const t=imported(stmt()).transactions[0];t.category='Recreation';assert.equal(E.summarize([t],'2024-08-01','2024-08-31').totals.Recreation,25.5);
});
test('SIC is retained as bank metadata and never interpreted as a card MCC',()=>{
 const t=imported(stmt('chequing',trn('one','-1','Unspecified entry','<SIC>5411</SIC>'))).transactions[0];assert.equal(t.category,'Other');assert.equal(t.sic,'5411');
});
function uiState(){
 const nodes=new Map(),$=s=>{if(!nodes.has(s))nodes.set(s,{value:'',innerHTML:'',disabled:true,hidden:true,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},scrollIntoView(){}});return nodes.get(s);};
 const state={parsed:{},names:{},loads:{},transactions:[],quality:{},page:0,demoMode:false,E,$,esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),cash:n=>`CAD ${n}`,window:{ResetBankFiles:B},status(text,error){state.message=text;state.error=error;},invalidate(){state.stale=true;},renderTransactions(){},renderReviewChart(){},renderResiliencePreview(){},mapValues(){return {date:0,description:1,descriptionExtra:-1,mode:'separate',debit:2,credit:3,amount:-1,balance:4,currency:-1,direction:-1,positive:'out',numberStyle:'dot',dateFormat:'auto'};}};
 const src=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');vm.createContext(state);
 vm.runInContext(src.slice(src.indexOf('function updateImportReady('),src.indexOf('function mapValues('))+src.slice(src.indexOf('async function load('),src.indexOf('function renderResiliencePreview(')),state);
 state.mapping=account=>state.bankMapping(account);
 return state;
}
test('import UI requires an explicit choice for multiple compatible accounts and escapes file labels',()=>{
 const state=uiState();state.parsed.card=B.parse(xml(stmt('card')),'example.qbo');state.names.card='<img src=x onerror=alert(1)>.qbo';
 state.parsed.chequing=B.parse(xml(stmt()+stmt('chequing',trn('other'),'','CAD','SAVINGS','1111')),'example.ofx');state.names.chequing='example.ofx';
 state.bankMapping('card');state.bankMapping('chequing');assert.equal(state.$('#import').disabled,true);assert.equal(state.parsed.chequing.selection,-1);
 assert.ok(!state.$('#card-mapping').innerHTML.includes('<img'));assert.match(state.$('#card-mapping').innerHTML,/&lt;img/);
 const selector=state.$('#chequing-bank-account');selector.value='1';selector.listeners.change();assert.equal(state.$('#import').disabled,false);
 state.transactions=[{}];selector.value='0';selector.listeners.change();assert.equal(state.$('#analyze').disabled,true);assert.equal(state.stale,true);
});
test('actual import handler mixes CSV and QBO and shows omitted pending and duplicate counts',()=>{
 const state=uiState();state.parsed.card=B.parse(xml(stmt('card',trn()+trn(),'<BANKTRANLISTP><STMTTRNP><TRNAMT>-20</TRNAMT></STMTTRNP></BANKTRANLISTP>')),'example.qbo');state.parsed.card.selection=0;
 state.parsed.chequing=E.parseCSV('2024-08-15,FICTIONAL PAY,,2000,3000');state.importTransactions();
 assert.equal(state.transactions.length,2);assert.equal(state.$('#analyze').disabled,false);assert.match(state.$('#import-quality').innerHTML,/1 identical repeated bank transaction IDs omitted · 1 pending records excluded/);
 assert.equal(state.$('#start-date').value,'2024-08-15');assert.equal(state.$('#coverage').checked,false);
});
test('actual import handler blocks analysis of conflicting FITIDs and explains the record',()=>{
 const state=uiState();state.parsed.card=B.parse(xml(stmt('card',trn()+trn('one','-99'))),'example.qfx');state.parsed.card.selection=0;state.parsed.chequing=E.parseCSV('2024-08-15,FICTIONAL PAY,,2000,3000');
 state.importTransactions();assert.equal(state.$('#analyze').disabled,true);assert.match(state.$('#import-quality').innerHTML,/Conflicting transactions/);assert.match(state.$('#import-quality').innerHTML,/Analysis is blocked/);
});
test('invalid currency or wrong account role keeps the import button disabled',()=>{
 for(const body of [stmt('card'),stmt('chequing',trn(),'','USD')]){
  const state=uiState();state.parsed.card=B.parse(xml(stmt('card')),'card.ofx');state.names.card='card.ofx';state.parsed.chequing=B.parse(xml(body),'other.ofx');state.names.chequing='other.ofx';
  state.bankMapping('card');state.bankMapping('chequing');assert.equal(state.$('#import').disabled,true);
 }
});
test('asynchronous file loading keeps the latest selection when an earlier read finishes late',async()=>{
 const state=uiState();let release;const slow=new Promise(resolve=>release=resolve);
 const first=state.load('card',{name:'old.ofx',size:100,text:()=>slow});
 await state.load('card',{name:'new.qbo',size:100,text:async()=>xml(stmt('card',trn('new','-10')))});
 release(xml(stmt('card',trn('old','-90'))));await first;
 assert.equal(state.names.card,'new.qbo');assert.equal(state.parsed.card.accounts[0].records[0].signed,-10);
});
test('all sourced aliases carry provenance and belong to valid editable categories',()=>{
 assert.equal(globalThis.ResetMerchants.rules.length,53);
 for(const rule of globalThis.ResetMerchants.rules){assert.ok(rule.nsi);assert.match(rule.source,/^data\/brands\//);assert.ok(E.categories.includes(rule.category));for(const alias of rule.aliases)assert.ok(globalThis.ResetMerchants.match(alias),alias);}
});

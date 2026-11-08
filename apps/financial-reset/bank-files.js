/* Local OFX 1 SGML / OFX 2 XML reader. No network, bank login or paid SDK. */
(function(root){'use strict';
const LIMIT=5*1024*1024, MAX_ROWS=10000;
const fail=message=>{throw Error(message);};
const local=name=>name.split(':').at(-1).toUpperCase();
const leaves=new Set(('CODE SEVERITY MESSAGE DTSERVER LANGUAGE ORG FID INTU.BID INTU.USERID TRNUID STATUSCUR CURDEF BANKID BRANCHID ACCTID ACCTTYPE ACCTKEY DTSTART DTEND TRNTYPE DTPOSTED DTUSER DTAVAIL TRNAMT FITID CORRECTFITID CORRECTACTION SRVRTID CHECKNUM REFNUM SIC PAYEEID NAME MEMO BALAMT DTASOF ADDR1 ADDR2 ADDR3 CITY STATE POSTALCODE COUNTRY PHONE CURRENCY CURRATE CURSYM DTEXPIRE CLTCOOKIE USERKEY DTSUCCESS PROFUP DTSIGNUP').split(' '));
function decode(text){
 return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi,(all,key)=>{
  if(key[0]!=='#')return {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[key.toLowerCase()];
  const n=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1));
  if(!n||n>0x10ffff||n>=0xd800&&n<=0xdfff)fail('Invalid character reference in the bank file.');
  return String.fromCodePoint(n);
 });
}
function tree(text){
 if(/<!DOCTYPE|<!ENTITY/i.test(text))fail('External definitions and entities are not supported. Export a plain OFX, QFX or QBO file.');
 const start=text.search(/<(?:[\w.-]+:)?OFX(?:\s|>)/i);
 if(start<0)fail('This is not an OFX bank export. Choose a CSV, OFX, QFX or QBO transaction file.');
 const header=text.slice(0,start),xml=/<\?xml\b|VERSION\s*[:=]\s*["']?2\d\d/i.test(header);
 if(!/^(?:\s|<\?[^?]*\?>|[A-Z][A-Z0-9.]*:[^\r\n]*(?:\r?\n|$))*$/i.test(header.replace(/^\uFEFF/,'')))fail('Unrecognized content before the OFX statement.');
 const doc={name:'DOCUMENT',text:'',children:[]},stack=[doc];let count=0;
 const tokens=text.slice(start).match(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<[^>]*>|[^<]+|</g)||[];
 for(const token of tokens){
  if(token.startsWith('<!--')||token.startsWith('<?'))continue;
  if(token.startsWith('<![CDATA[')){if(stack.length<2)fail('Text outside the statement.');stack.at(-1).text+=token.slice(9,-3);continue;}
  if(token[0]!=='<'){
   if(stack.length===1&&token.trim())fail('Unexpected text outside the statement.');
   stack.at(-1).text+=decode(token);continue;
  }
  const closing=token.match(/^<\/([\w.:-]+)\s*>$/);
  if(closing){
   const name=local(closing[1]);
   if(!xml&&stack.length>1&&stack.at(-1).name!==name&&stack.at(-1).children.length===0&&(leaves.has(stack.at(-1).name)||stack.at(-1).text.trim()))stack.pop();
   if(stack.length<2||stack.at(-1).name!==name)fail('The bank file has incomplete or mismatched tags. Export it again.');
   stack.pop();continue;
  }
  const opening=token.match(/^<([\w.:-]+)(?:\s+[^<>]*)?\s*\/?\s*>$/);
  if(!opening)fail('Invalid tag in the bank export.');
  if(!xml&&stack.length>1&&stack.at(-1).children.length===0&&(leaves.has(stack.at(-1).name)||stack.at(-1).text.trim()))stack.pop();
  const node={name:local(opening[1]),text:'',children:[]};
  if(++count>250000||stack.length>40)fail('The bank file is too complex. Export a shorter window.');
  stack.at(-1).children.push(node);if(!/\/\s*>$/.test(token))stack.push(node);
 }
 if(stack.length!==1||doc.children.length!==1||doc.children[0].name!=='OFX')fail('The bank file is incomplete. Export it again.');
 return doc.children[0];
}
const children=(n,name)=>n.children.filter(c=>c.name===name);
function all(n,name){const out=[];for(const c of n.children){if(c.name===name)out.push(c);out.push(...all(c,name));}return out;}
function value(n,name,required=false){
 const a=children(n,name);if(a.length>1)fail(`Repeated ${name} field. Export a fresh statement.`);
 const text=a[0]?.text.trim()||'';
 if(required&&!text)fail(`Missing ${name} in the bank export.`);
 return text;
}
function date(raw){
 const m=String(raw).match(/^(\d{4})(\d{2})(\d{2})(?:(\d{2})(\d{2})(\d{2})(?:\.\d{1,6})?)?(?:\[([+-]?\d{1,2}(?:\.\d+)?)(?::[^\]\r\n]+)?\])?$/);
 if(!m||m[4]&&(+m[4]>23||+m[5]>59||+m[6]>59)||m[7]&&Math.abs(+m[7])>14)fail('Invalid OFX date.');
 // Keep the posting day written by the bank; do not shift it into browser time.
 return root.ResetEngine.date(`${m[1]}-${m[2]}-${m[3]}`);
}
function amount(raw){
 if(!/^[+-]?\d+(?:\.\d{1,5})?$/.test(raw)||!Number.isFinite(+raw)||Math.abs(+raw)>1e9)fail('Invalid OFX amount.');
 return +raw;
}
function parseStatement(node){
 const role=node.name==='CCSTMTRS'?'card':'chequing',accountNode=children(node,role==='card'?'CCACCTFROM':'BANKACCTFROM')[0];
 const acct=accountNode?value(accountNode,'ACCTID'):'';
 const type=role==='card'?'CREDITCARD':accountNode?value(accountNode,'ACCTTYPE'):'';
 const result={role,type,label:`${type||'Unknown account'}${acct?` · ending ${acct.slice(-4)}`:''}`,currency:value(node,'CURDEF'),records:[],invalid:[],pending:all(node,'STMTTRNP').length,balance:null,error:null,zero:0,duplicates:0};
 try{
  if(!accountNode||!acct)fail('Missing account identification. Export this account again.');
  if(role==='chequing'&&!['CHECKING','SAVINGS','MONEYMRKT'].includes(type))fail('Only deposit accounts are supported here. Credit lines, loans and investment statements are not cash accounts.');
  if(result.currency!=='CAD')fail(`Currency is ${result.currency||'missing'}; only CAD statements are supported.`);
  if(all(node,'CORRECTFITID').length||all(node,'CORRECTACTION').length)fail('This export contains transaction corrections. Download a fresh complete CSV statement for this period so old entries are not counted twice.');
  const lists=children(node,'BANKTRANLIST');
  if(lists.length!==1)fail('Expected one posted transaction list for this account.');
  const list=lists[0];
  result.start=value(list,'DTSTART')?date(value(list,'DTSTART')):null;
  result.end=value(list,'DTEND')?date(value(list,'DTEND')):null;
  if(result.start&&result.end&&result.start>result.end)fail('Statement dates are reversed.');
  const ledger=children(node,'LEDGERBAL');if(ledger.length>1)fail('Repeated statement balance.');
  if(ledger[0])result.balance={amount:amount(value(ledger[0],'BALAMT',true)),date:date(value(ledger[0],'DTASOF',true)),type:'ledger'};
  const seen=new Map();
  children(list,'STMTTRN').forEach((t,i)=>{
   try{
    const id=value(t,'FITID',true),signed=amount(value(t,'TRNAMT',true)),dt=date(value(t,'DTPOSTED',true)),trnType=value(t,'TRNTYPE',true);
    if(!/^(CREDIT|DEBIT|INT|DIV|FEE|SRVCHG|DEP|ATM|POS|XFER|CHECK|PAYMENT|CASH|DIRECTDEP|DIRECTDEBIT|REPEATPMT|OTHER)$/.test(trnType))fail('Unknown OFX transaction type.');
    if(all(t,'CURRENCY').length||all(t,'ORIGCURRENCY').length)fail('Transaction has currency conversion fields. Use a CAD CSV export showing the settled CAD amount.');
    const payee=children(t,'PAYEE')[0],name=value(t,'NAME')||(payee?value(payee,'NAME'):'');
    const memo=value(t,'MEMO'),description=[name,memo&&memo!==name?memo:''].filter(Boolean).join(' · ')||`Bank transaction (${trnType})`;
    const record={fitid:id,date:dt,description,signed,trnType,sic:value(t,'SIC'),row:i+1};
    const fingerprint=JSON.stringify([dt,description,signed,trnType,record.sic]);
    if(seen.has(id)){if(seen.get(id)!==fingerprint)fail('Conflicting transactions share the same FITID. Export a fresh statement.');result.duplicates++;return;}
    seen.set(id,fingerprint);if(!signed){result.zero++;return;}result.records.push(record);
   }catch(error){result.invalid.push({row:i+1,reason:error.message});}
  });
  if(!result.records.length)fail('No non-zero posted transactions were found in this account.');
 }catch(error){result.error=error.message;}
 return result;
}
function parse(text,filename=''){
 if(typeof text!=='string'||text.length>LIMIT)fail('File is larger than 5 MB. Export a shorter window.');
 const ext=filename.split('.').at(-1).toLowerCase(),structured=/^(ofx|qfx|qbo)$/.test(ext)||/<(?:[\w.-]+:)?OFX(?:\s|>)/i.test(text);
 if(!structured){if(ext&&ext!=='csv')fail('Choose CSV, OFX, QFX or QBO. QIF, IIF, PDF and accounting backup files are not supported.');return root.ResetEngine.parseCSV(text);}
 const doc=tree(text);
 for(const status of all(doc,'STATUS'))if(value(status,'SEVERITY')==='ERROR'||value(status,'CODE')&&value(status,'CODE')!=='0')fail('The bank export reports an error. Download a successful statement export.');
 if(all(doc,'STMTTRN').length+all(doc,'STMTTRNP').length>MAX_ROWS)fail('More than 10,000 transaction records. Export a shorter window.');
 const nodes=[...all(doc,'STMTRS'),...all(doc,'CCSTMTRS')];
 if(!nodes.length)fail('No supported bank or credit-card statement was found. Investment and loan exports are not supported.');
 const accounts=nodes.map(parseStatement);
 return {format:['ofx','qfx','qbo'].includes(ext)?ext.toUpperCase():'OFX',accounts};
}
async function read(file){
 if(file.size>LIMIT)fail('File is larger than 5 MB. Export a shorter window.');
 let text;
 if(typeof file.arrayBuffer==='function'){
  const bytes=new Uint8Array(await file.arrayBuffer());if(bytes.length>LIMIT)fail('File is larger than 5 MB.');
  const head=new TextDecoder('windows-1252').decode(bytes.slice(0,2048));
  const charset=head.match(/CHARSET\s*:\s*([^\s]+)/i)?.[1]?.toUpperCase();
  const encoding=head.match(/encoding\s*=\s*["']([^"']+)/i)?.[1]?.toLowerCase();
  let label='utf-8';
  if(bytes[0]===255&&bytes[1]===254)label='utf-16le';else if(bytes[0]===254&&bytes[1]===255)label='utf-16be';
  else if(bytes[0]===239&&bytes[1]===187&&bytes[2]===191)label='utf-8';
  else if(encoding)label=encoding;
  else if(['1252','WINDOWS-1252','ISO-8859-1','8859-1','ANSI'].includes(charset))label='windows-1252';
  else if(charset&&!['NONE','UTF-8','UTF8','USASCII','US-ASCII','65001'].includes(charset))fail('Unsupported file encoding. Export UTF-8 or Windows-1252.');
  if(!['utf-8','utf-16le','utf-16be','windows-1252','iso-8859-1','us-ascii'].includes(label))fail('Unsupported file encoding. Export UTF-8 or Windows-1252.');
  try{text=new TextDecoder(label,{fatal:true}).decode(bytes);}catch{fail('The file encoding could not be read. Export UTF-8 or choose another supported bank format.');}
 }else text=await file.text();
 return parse(text,file.name);
}
function normalize(parsed,index,role){
 const a=parsed?.accounts?.[index];if(!a)fail('Choose an account from the bank file.');
 if(a.role!==role)fail(`Choose a ${role==='card'?'credit-card':'deposit-account'} statement for this input.`);
 if(a.error)fail(a.error);
 const transactions=a.records.map((r,i)=>{
  const flow=r.signed<0?'out':'in';let suggestion=root.ResetEngine.categorySuggestion(r.description,flow,role);
  if(['FEE','SRVCHG'].includes(r.trnType))suggestion={category:'Bank fees',reason:'Bank export identifies a fee or service charge.'};
  else if(r.trnType==='INT')suggestion={category:flow==='out'?'Financing charges':role==='chequing'?'Income':'Other',reason:'Bank export identifies interest. Check whether this is a charge, income or a reversal.'};
  else if(r.trnType==='DIV'&&flow==='in'&&role==='chequing')suggestion={category:'Income',reason:'Bank export identifies an incoming dividend.'};
  else if(r.trnType==='PAYMENT'&&flow==='in'&&role==='card')suggestion={category:'Transfer / card payment',reason:'Bank export identifies an incoming credit-card payment.'};
  const category=suggestion.category;
  return {id:`${role}-${i}`,account:role,row:r.row,date:r.date,description:r.description,merchant:root.ResetEngine.merchant(r.description),amount:Math.abs(r.signed),flow,category,categoryReason:suggestion.reason,merchantId:suggestion.merchantId||null,merchantName:suggestion.merchantName||null,merchantSource:suggestion.source||null,merchantSourceUrl:suggestion.sourceUrl||null,categorySource:suggestion.source||null,balance:null,statementBalance:i===0?a.balance:null,review:'Unreviewed',ambiguous:category==='Other',sourceFormat:parsed.format,fitid:r.fitid,bankTransactionType:r.trnType,sic:r.sic};
 });
 return {transactions,invalid:a.invalid,zero:a.zero,duplicates:a.duplicates,pending:a.pending};
}
root.ResetBankFiles={read,parse,normalize,date};
})(typeof window!=='undefined'?window:globalThis);

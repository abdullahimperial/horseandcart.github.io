const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../app/build/generated/assets/site');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.nativeMessages=[];window.MoneySnapshotAndroid={postMessage:s=>window.nativeMessages.push(JSON.parse(s))};});
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  const target=path.resolve(root,'.'+decodeURIComponent(url.pathname.replace(/^\/assets\/site/,'')));
  if(url.hostname!=='appassets.androidplatform.net'||!target.startsWith(root+'/')||!fs.existsSync(target)){missing.push(url.href);return route.abort();}
  const ext=path.extname(target);await route.fulfill({path:target,contentType:({'.js':'application/javascript','.css':'text/css','.html':'text/html','.json':'application/json'})[ext]||'text/plain'});
 });
 await page.goto('https://appassets.androidplatform.net/assets/site/apps/financial-reset/index.html');
 for(const scenario of ['recovery','deficit','growth','family']){
  await page.locator('.guided-steps [data-step="import"]').click();
  await page.selectOption('#demo-scenario',scenario);await page.click('#demo');
  await page.waitForSelector('#report:not([hidden])');
  const text=await page.locator('#report').textContent();assert.ok(text.includes('Spending surplus'),scenario);
 }
 await page.locator('#download-report').click();
 await page.waitForFunction(()=>window.nativeMessages.some(m=>m.type==='save'));
 let messages=await page.evaluate(()=>window.nativeMessages);
 assert.ok(messages.find(m=>m.type==='save').text.includes('Spending surplus'));
 await page.locator('.guided-steps [data-step="plan"]').click();
 await page.locator('#save-plan').click();
 await page.waitForFunction(()=>window.nativeMessages.some(m=>m.filename?.endsWith('.json')));
 messages=await page.evaluate(()=>window.nativeMessages);
 assert.ok(JSON.parse(messages.find(m=>m.filename?.endsWith('.json')).text));
 await page.locator('.guided-steps [data-step="snapshot"]').click();
 await page.locator('#print-report').click();await page.waitForFunction(()=>window.nativeMessages.some(m=>m.type==='print'));
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
 await page.screenshot({path:path.resolve(__dirname,'../app/build/android-preview.png'),fullPage:false});
 // A fresh file upload must clear the demo; user transactions never mix with samples.
 await page.locator('.guided-steps [data-step="import"]').click();
 await page.setInputFiles('#card-file',{name:'card.csv',mimeType:'text/csv',buffer:Buffer.from('Date,Description,Amount\n2026-09-01,FARM BOY,100\n2026-09-10,PAYMENT RECEIVED,-100')});
 await page.setInputFiles('#chequing-file',{name:'chequing.csv',mimeType:'text/csv',buffer:Buffer.from('Date,Description,Amount\n2026-09-01,PAYROLL,1000\n2026-09-09,CREDIT CARD PMT,-100\n2026-09-10,TELUS PAYMENT,-20')});
 await page.click('#import');await page.waitForSelector('#review-section:not([hidden])');
 await page.getByText('Review transactions and suggested categories',{exact:true}).click();
 assert.equal(await page.locator('#transactions > tr').count(),5);
 for(const description of ['PAYMENT RECEIVED','CREDIT CARD PMT']){
  assert.equal(await page.getByLabel(new RegExp('^Category for '+description+' on ')).inputValue(),'Transfer / card payment');
 }
 assert.ok((await page.locator('#import-quality').innerText()).includes('5 non-zero transactions'));
 const summary=await page.evaluate(()=>window.ResetReviewChart.build([
  ...window.ResetEngine.normalize(window.ResetEngine.parseCSV('Date,Description,Amount\n2026-09-01,FARM BOY,100\n2026-09-10,PAYMENT RECEIVED,-100'),{date:0,description:1,amount:2,mode:'signed',positive:'out'},'card').transactions,
  ...window.ResetEngine.normalize(window.ResetEngine.parseCSV('Date,Description,Amount\n2026-09-01,PAYROLL,1000\n2026-09-09,CREDIT CARD PMT,-100'),{date:0,description:1,amount:2,mode:'signed',positive:'in'},'chequing').transactions
 ],'2026-09-01','2026-09-30').total);
 assert.equal(summary,100);assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 console.log(JSON.stringify({demos:4,nativeExports:2,nativePrint:true,importedRows:5,spendingWithRepayment:summary,errors,missing,screenshot:path.resolve(__dirname,'../app/build/android-preview.png')}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});

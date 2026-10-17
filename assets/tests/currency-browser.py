"""Detection, preference lifecycle, fixed-data boundaries and privacy checks."""
from playwright.sync_api import sync_playwright
import os
base=os.environ.get('APP_TEST_URL','http://localhost:8034')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for zone,locale,code in [('America/Edmonton','en-US','CAD'),('Europe/London','en-US','GBP'),('Asia/Karachi','en-US','PKR'),('Asia/Dhaka','en-US','BDT'),('Australia/Sydney','en-US','AUD'),('Europe/Tallinn','en-US','EUR'),('UTC','en-IN','INR')]:
  ctx=b.new_context(locale=locale,timezone_id=zone);page=ctx.new_page();page.goto(base+'/');assert page.evaluate('SiteCurrency.code')==code,(zone,code);assert page.locator('#site-currency').input_value()=='auto';ctx.close()
 ctx=b.new_context(locale='en-GB',timezone_id='Europe/London',viewport={'width':430,'height':844});page=ctx.new_page();errors=[];external=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:external.append(r.url) if not r.url.startswith(base) else None)
 page.goto(base+'/apps/investment/');page.select_option('#site-currency','JPY');page.reload();assert page.evaluate('SiteCurrency.code')=='JPY'
 page.goto(base+'/apps/financial-reset/');assert page.evaluate('SiteCurrency.code')=='JPY';assert 'CAD only' in page.locator('.currency-scope').inner_text();assert page.locator('.currency-page-note').inner_text()=='This page: CAD';assert page.locator('#currency-help').text_content().find('CAD')>=0
 page.goto(base+'/games/financial-life.html');assert 'CAD' in page.locator('.currency-page-note').inner_text();assert page.locator('#total').inner_text()=='$0';page.select_option('#site-currency','auto');assert page.evaluate('SiteCurrency.code')=='GBP';assert page.evaluate('localStorage.getItem("lfm-currency")') is None
 page.locator('.site-currency summary').click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.evaluate('localStorage.setItem("lfm-currency","INVALID")');page.reload();assert page.evaluate('SiteCurrency.code')=='GBP'
 ctx.close()
 # Blocked storage must not prevent the website from starting or changing currency.
 ctx=b.new_context(locale='en-GB',timezone_id='Europe/London');ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('Unavailable')}})");page=ctx.new_page();page.goto(base+'/apps/investment/');assert page.evaluate('SiteCurrency.code')=='GBP';page.select_option('#site-currency','EUR');assert page.evaluate('SiteCurrency.code')=='EUR';assert page.locator('#total').inner_text()=='€1,200.00';ctx.close()
 assert not external,external;assert not errors,errors;b.close()
 print('Country/device defaults, saved/manual/automatic currency, fixed CAD boundaries, unavailable storage, privacy and mobile control passed.')

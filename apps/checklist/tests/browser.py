from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1280,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(os.environ.get('APP_TEST_URL','http://localhost:8032')+'/apps/checklist/')
 assert page.locator('fieldset').count()==43
 page.click('#show-report');assert 'No applicable answers' in page.locator('#scorecard').inner_text()
 for id,value in [('0-0','yes'),('0-1','part'),('0-2','no'),('0-3','na')]:page.locator(f'input[name="q-{id}"][value="{value}"]').check()
 assert '50%' in page.locator('.score-overview').inner_text();assert 'Provisional' in page.locator('.score-overview').inner_text();assert '3 applicable' in page.locator('#completion').inner_text()
 assert 'incorrect or unexpected charges' in page.locator('.focus-list li').first.inner_text()
 for field,value in [('income','3000'),('expenses','2500'),('leakage','50'),('living','100'),('benefits','100'),('habits','50')]:page.fill('#money-'+field,value)
 assert '$800.00' in page.locator('#money-result').inner_text();assert '$9,600.00' in page.locator('#money-result').inner_text();assert '$300.00/month' in page.locator('#money-result').inner_text()
 page.fill('#money-living','3000');assert 'exceed' in page.locator('#money-result').inner_text();page.fill('#money-living','100');page.fill('#money-benefits','');assert 'Complete all six' in page.locator('#money-result').inner_text();page.fill('#money-benefits','100')
 page.fill('#action-1','Review bank fees');page.fill('#date-1','2026-11-01');page.evaluate("window.dispatchEvent(new Event('beforeprint'))");page.emulate_media(media='print');assert page.locator('[data-print="0-0"]').is_visible();assert page.locator('#print-action-1').is_visible();assert 'Review bank fees' in page.locator('#print-action-1').inner_text();assert not page.locator('.answer-options').first.is_visible();page.pdf(path='/tmp/book-checklist.pdf');page.emulate_media(media='screen')
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.on('dialog',lambda d:d.accept());page.click('#reset');assert '0 of 43' in page.locator('#completion').inner_text();assert page.locator('#scorecard').is_hidden()
 page.locator('input[value="na"]').evaluate_all('(nodes)=>nodes.forEach(n=>{n.checked=true;n.dispatchEvent(new Event("change",{bubbles:true}));})');page.click('#show-report');assert 'No applicable answers' in page.locator('.score-overview').inner_text()
 page.locator('input[value="yes"]').evaluate_all('(nodes)=>nodes.forEach(n=>{n.checked=true;n.dispatchEvent(new Event("change",{bubbles:true}));})');assert '100%' in page.locator('.score-overview').inner_text();assert 'Completed self-review' in page.locator('.score-overview').inner_text();assert not errors,errors;b.close()
 print('43 checklist items, partial/full/N/A scores, focus report, savings math, printable answers, reset and mobile passed.')

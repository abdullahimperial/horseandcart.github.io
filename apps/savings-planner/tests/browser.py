from pathlib import Path
from playwright.sync_api import sync_playwright
import os,fitz
BASE=os.environ.get('APP_TEST_URL','http://localhost:8040')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(locale='en-CA',timezone_id='America/Edmonton',viewport={'width':1440,'height':1000});errors=[];external=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
 page.goto(BASE+'/apps/savings-planner/');assert page.locator('[data-suggestion]').count()==120;assert page.locator('#download-plan').is_disabled();assert page.locator('tbody tr').count()==15
 ids=['c1-p0-s0','c1-p1-s0','c2-p0-s0','c3-p0-s0']
 for id in ids:page.locator('[data-suggestion="'+id+'"]').check()
 assert page.locator('.planner-action').count()==4
 page.fill('#c1-p0-s0-current','65');page.fill('#c1-p0-s0-target','45');assert '$20.00' in page.locator('[data-estimate="c1-p0-s0"]').inner_text()
 page.fill('#c1-p1-s0-estimate','10');assert 'Utilities' in page.locator('.overlap-note').inner_text();assert 'Not combined yet' in page.locator('.combined-estimate').inner_text()
 page.check('#totals-confirmed');assert '$30.00/month' in page.locator('.combined-estimate').inner_text();assert '$360.00/year' in page.locator('.combined-estimate').inner_text()
 for id in ids[:3]:page.check(f'[data-action="{id}"][data-field="priority"]')
 page.locator('[data-id="c3-p0-s0"] > summary').click();page.click('[data-action="c3-p0-s0"][data-field="priority"]');assert not page.locator('[data-action="c3-p0-s0"][data-field="priority"]').is_checked();assert '3/3 priorities' in page.locator('#plan-count').inner_text()
 # Remove+undo cannot create a fourth priority after choosing another.
 page.click('[data-remove="c2-p0-s0"]');page.check('[data-action="c3-p0-s0"][data-field="priority"]');page.click('#undo-remove');assert '3/3 priorities' in page.locator('#plan-count').inner_text();assert not page.locator('[data-action="c2-p0-s0"][data-field="priority"]').is_checked()
 page.fill('#c1-p0-s0-title','Review phone plan <img src=x onerror=alert(1)>');page.fill('#c1-p0-s0-notes','Keep receipts — café £ €');assert page.locator('#action-cards img').count()==0
 page.select_option('#site-currency','GBP');assert page.locator('#c1-p0-s0-current').input_value()=='65';assert page.locator('#c1-p0-s0-notes').input_value()=='Keep receipts — café £ €';assert not page.locator('#totals-confirmed').is_checked();assert 'GBP' in page.locator('.action-money legend').first.inner_text()
 page.check('#totals-confirmed');assert '£30.00/month' in page.locator('.combined-estimate').inner_text()
 page.fill('#c1-p0-s0-current','-1');page.click('#download-plan');assert 'highlighted number' in page.locator('#export-status').inner_text();page.fill('#c1-p0-s0-current','65');page.check('#totals-confirmed')
 with page.expect_download() as dl:page.click('#download-plan')
 path=dl.value.path();pdf=fitz.open(path);assert len(pdf)>=1;assert all(p.rect.height>p.rect.width for p in pdf);assert pdf[0].get_images();pdf[0].get_pixmap(matrix=fitz.Matrix(1,1)).save('/tmp/savings-personal-pdf.png');pdf.close();assert Path(path).read_bytes().startswith(b'%PDF-1.4');assert dl.value.suggested_filename.endswith('.pdf')
 with page.expect_download() as dl:page.click('#download-blank')
 pdf=fitz.open(dl.value.path());assert len(pdf)==4;assert all(p.rect.width>p.rect.height for p in pdf);pdf[0].get_pixmap().save('/tmp/savings-blank-pdf.png');pdf.close()
 page.evaluate("window.dispatchEvent(new Event('beforeprint'))");page.emulate_media(media='print');assert page.locator('#print-surface').is_visible();assert 'Review phone plan <img src=x onerror=alert(1)>' in page.locator('#print-surface').inner_text();assert not page.locator('#ideas').is_visible();page.pdf(path='/tmp/savings-selectable-plan.pdf');assert 'Review phone' in ''.join(p.get_text() for p in fitz.open('/tmp/savings-selectable-plan.pdf'));page.emulate_media(media='screen')
 page.locator('#category-form').evaluate('(n)=>n.parentElement.open=true');page.fill('#new-category','Pet care');page.click('#category-form button');assert page.locator('tbody tr').count()==1;assert 'Pet care' in page.locator('tbody tr th').inner_text();page.click('[data-own-pillar="0"]');page.fill('#custom-title','Compare safe pet care');page.click('#custom-form button');assert page.locator('.planner-action').count()==5
 page.select_option('#category-filter','all');assert page.locator('tbody tr').count()==16
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.select_option('#category-filter','c1');assert page.locator('.mobile-pillar').first.is_visible();page.screenshot(path='/tmp/savings-planner-mobile.png',full_page=True)
 page.set_viewport_size({'width':1440,'height':1000});page.screenshot(path='/tmp/savings-planner-desktop.png',full_page=True)
 assert not errors,errors;assert not external,external;b.close()
 print('120 suggestions, editable actions, priority limits/undo, non-overlapping estimates, currency state, real PDFs, printable text, custom categories, safe text and mobile passed.')

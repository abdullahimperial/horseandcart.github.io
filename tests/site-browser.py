from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from playwright.sync_api import sync_playwright
import os
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('SITE_TEST_URL','http://localhost:8010')
class Links(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['a','link','script','img']:
   val=a.get('href') or a.get('src')
   if val:self.urls.append(val)
files=list(ROOT.rglob('*.html'));checked=0
for path in files:
 parser=Links();parser.feed(path.read_text())
 for url in parser.urls:
  parsed=urlsplit(url)
  if parsed.scheme or not parsed.path:continue
  target=(path.parent/unquote(parsed.path)).resolve()
  if target.is_dir():target=target/'index.html'
  assert target.exists(),f'{path.relative_to(ROOT)}: broken destination {url}'
  checked+=1
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 aliases=['financial_life.html','financial_life.html.html']
 for width in [1440,390]:
  page.set_viewport_size({'width':width,'height':1000 if width==1440 else 844})
  for path in files:
   if path.name in aliases:continue
   rel=path.relative_to(ROOT).as_posix();page.goto(BASE+'/'+rel);assert page.locator('.site-notice').is_visible(),rel;assert page.locator('.site-header').count()==1,rel;assert page.locator('.site-footer').count()==1,rel;assert page.locator('.site-links a').count()==6,rel;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),rel
   if rel=='index.html':page.screenshot(path=f'/tmp/site-home-{width}.png',full_page=True)
 page.goto(BASE+'/contact.html?topic=workshop');page.locator('#inquiry-name').fill('Sample coordinator');page.locator('#inquiry-org').fill('<img src=x onerror=alert(1)>');page.locator('#inquiry-message').fill('Discuss a fictional workshop for 12 participants.');page.locator('#inquiry-form button').click();assert 'NOT SENT' in page.locator('#inquiry-preview').input_value();assert page.locator('#inquiry-preview img').count()==0
 with page.expect_download() as info:page.locator('#download-inquiry').click()
 assert info.value.suggested_filename=='horse-and-cart-inquiry.txt';page.locator('#inquiry-message').fill('Revised');assert page.locator('#download-inquiry').is_disabled();page.goto(BASE+'/course/module-2.html');assert page.locator('.site-next a[href="../apps/true-cost/index.html"]').count()==1;page.goto(BASE+'/');page.locator('.site-links a').first.click();assert page.url.endswith('/start-here.html');assert not errors,errors;b.close()
print(f'{len(files)} pages checked; {checked} local links/assets resolved; desktop/mobile navigation, course connections and inquiry draft passed')

"""Repeatable fixture test: never loads a real YouTube video or changes the catalog."""
import os
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

BASE = os.environ.get('SITE_TEST_URL', 'http://localhost:8010').rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE', p.chromium.executable_path), headless=True)
    for width in [320, 390, 1280]:
        for lang in ['en', 'ur']:
            page = browser.new_page(viewport={'width':width, 'height':900}, reduced_motion='reduce')
            requests = []
            page.on('request', lambda request: requests.append(request.url))
            page.route('https://www.youtube-nocookie.com/**', lambda route: route.fulfill(status=200,content_type='text/html',body='<p>Local test player</p>'))
            page.goto(f'{BASE}/course/module-3.html?lang={lang}#slide-5')
            page.wait_for_selector('#current-heading')
            expected = page.evaluate("CourseVideos.forLesson(3,5).map(v => 'https://www.youtube.com/shorts/' + v.videoId)")
            assert page.locator('.lesson-video-link').evaluate_all('(links) => links.map(a => a.href)') == expected
            page.evaluate("CourseVideos.mount(document.querySelector('#lesson-video-slot'),3,5,{})")
            assert page.locator('#lesson-video-slot').is_hidden()
            assert not any('youtube' in url for url in requests)
            page.evaluate("""() => {
              CourseVideos.published.O11 = {videoId:'TEST_ONLY01',title:'Test video <b>not markup</b>'};
              CourseVideos.mount(document.querySelector('#lesson-video-slot'),3,5);
              window.LFM?.refresh();
            }""")
            assert page.locator('.lesson-video h3').inner_text() == 'Test video <b>not markup</b>'
            assert page.locator('.lesson-video h3 b').count() == 0
            assert page.locator('.lesson-video-link').get_attribute('href') == 'https://www.youtube.com/shorts/TEST_ONLY01'
            assert page.locator('.lesson-video iframe').count() == 0
            assert not any('youtube' in url for url in requests)
            load = page.locator('.lesson-video button')
            assert load.locator('.video-load-label').inner_text() == ('Load video' if lang=='en' else 'ویڈیو لوڈ کریں')
            load.focus(); page.keyboard.press('Enter')
            frame = page.locator('.lesson-video iframe')
            frame.wait_for()
            assert frame.get_attribute('src') == 'https://www.youtube-nocookie.com/embed/TEST_ONLY01?playsinline=1&cc_load_policy=1'
            assert frame.get_attribute('referrerpolicy') == 'strict-origin-when-cross-origin'
            bounds = frame.bounding_box()
            assert bounds['width'] >= 200 and bounds['height'] >= 200, bounds
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width,lang)
            page.locator('#next').click()
            assert page.locator('iframe').count() == 0
            assert page.locator('.lesson-video-link').count() == page.evaluate('CourseVideos.forLesson(3,6).length')
            requests.clear()
            page.goto(f'{BASE}/?lang={lang}')
            channel = page.locator('footer a[href="https://www.youtube.com/@letsfixmoneycom"]')
            assert channel.is_visible() and channel.locator('svg').count() == 1
            assert page.locator('iframe, .lesson-video, .video-library').count() == 0
            assert not page.evaluate("'CourseVideos' in window")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width,lang)
            page.locator('#lfm-skip').click()
            page.locator('.app-card--youtube').click()
            directory = page.locator('#videos')
            links = directory.locator('#video-lesson-list a')
            links.first.wait_for()
            catalog = page.evaluate('CourseVideos.catalog()')
            assert links.count() == len(catalog) and len(catalog) >= 4
            assert directory.locator('h2').inner_text() == ('Video lessons' if lang == 'en' else 'ویڈیو اسباق')
            assert page.locator('iframe, .video-load').count() == 0
            assert not any('youtube' in url for url in requests)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width,lang)
            for index, video in enumerate(catalog):
                link = links.nth(index)
                dest = urlsplit(link.get_attribute('href'))
                assert dest.path.endswith(f"module-{video['module']}.html") and dest.fragment == f"slide-{video['lesson']}"
                link.press('Enter')
                card = page.locator('.lesson-video').filter(has=page.get_by_role('heading',name=video['title'],exact=True))
                card.wait_for()
                assert page.locator('iframe').count() == 0
                card.locator('.video-load').click()
                assert '/embed/' + video['videoId'] in card.locator('iframe').get_attribute('src')
                page.go_back()
                links.first.wait_for()
            page.goto(f'{BASE}/?lang={lang}#videos')
            page.wait_for_url(f'**/course/index.html?lang={lang}#videos')
            assert links.first.is_visible() and page.locator('html').get_attribute('lang') == lang
            page.close()
            print(f'PASS width={width} language={lang}: homepage, directory, lesson embeds, bookmarks and keyboard access')
    browser.close()

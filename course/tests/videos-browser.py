"""Repeatable fixture test: never loads a real YouTube video or changes the catalog."""
import os
from pathlib import Path
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
            assert load.inner_text() == ('Load video' if lang=='en' else 'ویڈیو لوڈ کریں')
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
            page.goto(f'{BASE}/course/index.html?lang={lang}')
            assert page.locator('.course-video-channel a').get_attribute('href') == 'https://www.youtube.com/@letsfixmoneycom/shorts'
            if lang=='ur':
                assert page.locator('.course-video-channel a').inner_text()=='یوٹیوب پر مختصر ویڈیوز'
            page.close()
            print(f'PASS width={width} language={lang}: pending hidden, click-to-load, keyboard, layout, navigation, channel link')
    browser.close()

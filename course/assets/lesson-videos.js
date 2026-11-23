/* Public YouTube links only. Publication receipts and account data stay private. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CourseVideos = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  // Module and lesson numbers are one-based, matching module-N.html#slide-N.
  // O01–O12 are the original set; N01–N50 are the new set. Never equate them.
  const planned = [
    ['O01',2,1], ['O02',2,6], ['O03',2,7], ['O04',2,3],
    ['O05',2,3], ['O06',3,2], ['O07',3,7], ['O08',3,6],
    ['O09',3,3], ['O10',3,4], ['O11',3,5], ['O12',3,6],
    ['N01',3,4], ['N02',3,7], ['N03',3,8], ['N04',3,9],
    ['N05',3,11], ['N06',3,10], ['N07',3,13], ['N08',3,13],
    ['N09',3,13], ['N10',3,14], ['N11',3,15], ['N12',3,16],
    ['N13',3,10], ['N14',3,12], ['N15',3,15], ['N16',4,1],
    ['N17',4,3], ['N18',4,5], ['N19',4,7], ['N20',4,8],
    ['N21',4,6], ['N22',5,4], ['N23',5,2], ['N24',5,2],
    ['N25',5,3], ['N26',5,5], ['N27',5,8], ['N28',6,8],
    ['N29',6,4], ['N30',6,12], ['N31',6,13], ['N32',6,4],
    ['N33',6,6], ['N34',3,12], ['N35',6,15], ['N36',6,16],
    ['N37',6,10], ['N38',6,1], ['N39',9,9], ['N40',9,8],
    ['N41',5,6], ['N42',9,2], ['N43',7,2], ['N44',7,6],
    ['N45',7,7], ['N46',7,4], ['N47',8,2], ['N48',8,9],
    ['N49',8,4], ['N50',8,5]
  ].map(([key, module, lesson]) => ({key, module, lesson}));

  // Register public narrated uploads by their planned key.
  const published = {
    O01: {videoId: 'smArxMmswFM', title: 'Put the Horse Before the Cart | Save First, Then Buy', verifiedOn: '2026-11-20', coverTitle: 'Save first, then buy'},
    O02: {videoId: 'OD3ZF6pPTrA', title: 'A $100 Purchase Can Take $140 of Earnings | The True Cost', verifiedOn: '2026-11-20', coverTitle: 'The true cost'},
    O11: {videoId: 'XdHPFFxMaDs', title: 'When $20 Cashback Costs $35 in Interest', verifiedOn: '2026-11-18', coverTitle: 'Cashback vs. interest'},
    O12: {videoId: 'aPTh_ZN4j0M', title: 'Repair or Replace? A $20 Fix Versus a $200 Chair', verifiedOn: '2026-11-20', coverTitle: 'Repair or replace?'}
  };
  const validId = id => typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id);

  function catalog(registry = published) {
    return planned.flatMap(plan => {
      const video = registry[plan.key];
      return video && validId(video.videoId) && typeof video.title === 'string' && video.title.trim()
        ? [{...video, ...plan}] : [];
    });
  }

  function forLesson(moduleNumber, lessonNumber, registry = published) {
    return catalog(registry).filter(v => v.module === moduleNumber && v.lesson === lessonNumber);
  }

  function element(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function englishTitle(tag, video) {
    const title = element(tag, '', video.title);
    title.lang = 'en';
    title.dir = 'ltr';
    title.translate = false;
    return title;
  }

  function videoCard(video) {
    const card = element('article', 'lesson-video');
    const title = englishTitle('h3', video);
    const player = element('div', 'lesson-video-player');
    const load = element('button', 'video-load');
    load.type = 'button';
    const cover = element('span', 'video-cover');
    cover.setAttribute('aria-hidden', 'true');
    cover.dataset.key = video.key;
    cover.append(element('span', 'video-cover-brand', 'Let’s Fix Money'),
      element('strong', 'video-cover-title', video.coverTitle || video.title));
    load.append(cover);
    load.append(element('span', 'video-load-label', 'Load video'));
    player.append(load);
    load.addEventListener('click', () => {
      const frame = element('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + video.videoId + '?playsinline=1&cc_load_policy=1';
      frame.title = video.title;
      frame.translate = false;
      frame.lang = 'en';
      frame.allow = 'encrypted-media; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.tabIndex = 0;
      player.replaceChildren(frame);
      frame.focus();
    }, {once:true});
    const details = element('div', 'video-details');
    const links = element('div', 'video-links');
    const youtube = element('a', 'lesson-video-link', 'Watch on YouTube');
    youtube.href = 'https://www.youtube.com/shorts/' + video.videoId;
    links.append(youtube);
    details.append(title, links, element('p', 'lesson-video-note', 'Loading the player connects to YouTube.'));
    card.append(player, details);
    return card;
  }

  function mount(container, moduleNumber, lessonNumber, registry = published) {
    if (!container) return;
    container.replaceChildren();
    const videos = forLesson(moduleNumber, lessonNumber, registry);
    container.hidden = videos.length === 0;
    if (container.hidden) return;
    const section = element('section', 'lesson-videos');
    const heading = element('h2', '', 'Watch a related Short');
    heading.id = 'lesson-videos-heading';
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading, element('p', '', 'English narration and on-screen captions.'));
    for (const video of videos) section.append(videoCard(video));
    container.append(section);
  }

  function listVideoLessons(list) {
    for (const video of catalog()) {
      const link = element('a');
      link.href = 'module-' + video.module + '.html#slide-' + video.lesson;
      const number = element('bdi', 'lesson-number', video.module + '.' + video.lesson);
      number.dir = 'ltr';
      const title = video.coverTitle ? element('span', '', video.coverTitle) : englishTitle('span', video);
      link.append(number, title);
      const item = element('li');
      item.append(link);
      list.append(item);
    }
  }

  if (typeof document !== 'undefined') {
    const list = document.getElementById('video-lesson-list');
    if (list) listVideoLessons(list);
  }
  return {planned, published, validId, catalog, forLesson, mount};
});

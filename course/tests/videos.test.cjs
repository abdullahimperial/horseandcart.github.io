const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const videos = require('../assets/lesson-videos.js');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'course/assets/course-data.js'),'utf8'),context);

test('all 62 video plans refer to existing lessons with unique stable identities', () => {
  assert.equal(videos.planned.length,62);
  assert.equal(new Set(videos.planned.map(v=>v.key)).size,62);
  for(const v of videos.planned){
    assert.match(v.key,/^(O(0[1-9]|1[0-2])|N(0[1-9]|[1-4][0-9]|50))$/);
    assert.ok(context.window.COURSE.find(m=>m.id===v.module)?.slides[v.lesson-1],v.key);
  }
});

test('planned entries are hidden until a valid public video is registered', () => {
  assert.deepEqual(videos.forLesson(3,5,{}),[]);
  for(const videoId of [null,'','https://youtube.com/shorts/TEST_ONLY01','<script>x</script>','123']){
    assert.deepEqual(videos.forLesson(3,5,{O11:{videoId,title:'Fixture'}}),[]);
  }
  const registry={O11:{videoId:'TEST_ONLY01',title:'Cashback test'},N19:{videoId:'TEST_ONLY02',title:'Dates test'}};
  assert.deepEqual(videos.forLesson(3,5,registry).map(v=>v.key),['O11']);
  assert.deepEqual(videos.forLesson(4,7,registry).map(v=>v.key),['N19']);
  assert.deepEqual(videos.forLesson(1,1,registry),[]);
});

test('every module loads the video renderer and copy before their consumers', () => {
  for(let i=1;i<=9;i++){
    const html=fs.readFileSync(path.join(root,`course/module-${i}.html`),'utf8');
    assert.ok(html.indexOf('video-copy.js')<html.indexOf('i18n.js'));
    assert.ok(html.indexOf('lesson-videos.js')<html.indexOf('assets/course.js'));
    assert.ok(html.includes('lesson-videos.css'));
  }
  const copyContext={window:{LFM_UR:{}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'course/assets/video-copy.js'),'utf8'),copyContext);
  for(const label of ['Watch a related Short','English narration and on-screen captions.','Load video','Loading the player connects to YouTube.','Watch on YouTube','Short videos on YouTube','Follow the channel for short explanations from the book.']){
    assert.match(copyContext.window.LFM_UR[label],/[\u0600-\u06FF]/);
  }
});

const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

test('the article link stays hidden during deployment and appears only after verification', async () => {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {hidden:true,value:'',textContent:'',className:'',classList:{add(){},remove(){}},setAttribute(){},removeAttribute(key){delete this[key]}});
    return elements.get(id);
  };
  element('username').value='Joe';element('password').value='test-password';
  let checks=0;
  const timers=[];
  const context={
    document:{querySelector:s=>element(s.slice(1)),querySelectorAll:()=>[],addEventListener(){}},
    window:{addEventListener(){}},history:{replaceState(){}},location:{search:'?draft=test-post',pathname:'/blog/editor/'},
    URLSearchParams,Date,encodeURIComponent,btoa:s=>Buffer.from(s).toString('base64'),
    setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout(){},
    fetch:async url=>({ok:true,json:async()=>url.endsWith('/session')?{user:'Joe'}:url.endsWith('/publication')?(++checks===1?{state:'building'}:{state:'live',url:'https://joenewbry.com/blog/2026/09/08/test-post/?v=revision'}):{slug:'test-post',title:'Test',body:'Article',version:1,status:'published',published_url:'https://joenewbry.com/blog/2026/09/08/test-post/'}})
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../blog/editor/editor.js'),'utf8'),context);
  await element('loginForm').onsubmit({preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(element('publishedLink').hidden,true);
  assert.equal(element('publishedLink').href,undefined);
  assert.match(element('publicationState').textContent,/Waiting/);
  assert.equal(timers.length,1);
  await timers.shift()();
  assert.equal(element('publishedLink').hidden,false);
  assert.equal(element('publishedLink').href,'https://joenewbry.com/blog/2026/09/08/test-post/?v=revision');
  assert.equal(element('publicationState').textContent,'Live on your website.');
});

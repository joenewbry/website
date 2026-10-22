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

function downloadHarness(failure=false){
  const elements=new Map(),buttons=[],downloads=[],requests=[],timers=[];
  const source='https://ir.spacex.com/files/content_files/SpaceX-Reports-Third-Quarter-2026-Results.pdf';
  const link={href:source+'#page=3',insertAdjacentElement(position,button){buttons.push(button);}};
  const element=id=>{if(!elements.has(id))elements.set(id,{hidden:true,value:'',textContent:'',className:'',classList:{add(){},remove(){}},setAttribute(){},removeAttribute(){},querySelectorAll:()=>[link]});return elements.get(id);};
  element('username').value='Joe';element('password').value='test-password';
  class BrowserURL extends URL{static createObjectURL(){return 'blob:private-pdf';}static revokeObjectURL(url){downloads.push({revoked:url});}}
  const context={document:{querySelector:s=>element(s.slice(1)),querySelectorAll:()=>[],addEventListener(){},body:{appendChild(){}},createElement(tag){return {tag,click(){downloads.push({href:this.href,filename:this.download});},remove(){}};}},
    window:{addEventListener(){}},history:{replaceState(){}},location:{search:'?draft=test-post',pathname:'/blog/editor/'},URLSearchParams,URL:BrowserURL,Date,encodeURIComponent,btoa:s=>Buffer.from(s).toString('base64'),setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout(){},
    fetch:async(url,options)=>{requests.push({url,options});
      if(url.includes('/documents/'))return {ok:!failure,blob:async()=>new Blob(['%PDF-1.7\nsource\n%%EOF'],{type:'application/pdf'})};
      return {ok:true,json:async()=>url.endsWith('/session')?{user:'Joe'}:url.endsWith('/preview')?{html:'<p>source</p>',documents:{[source]:'/documents/spacex-q3-2026'}}:{slug:'test-post',title:'Test',body:'Draft',version:1,status:'draft'}};
    }};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../blog/editor/editor.js'),'utf8'),context);
  return {element,buttons,downloads,requests,timers};
}

test('PDF button downloads authenticated bytes without saving or publishing',async()=>{
  const h=downloadHarness();await h.element('loginForm').onsubmit({preventDefault(){}});await h.element('previewTab').onclick();
  assert.equal(h.buttons.length,1);await h.buttons[0].onclick();
  const request=h.requests.find(r=>r.url.includes('/documents/'));
  assert.match(request.options.headers.Authorization,/^Basic /);
  assert.equal(h.downloads[0].filename,'spacex-q3-2026.pdf');assert.equal(h.downloads[0].href,'blob:private-pdf');
  assert.equal(h.buttons[0].textContent,'Download again');assert.equal(h.buttons[0].disabled,false);
  assert.equal(h.requests.some(r=>r.options?.method==='PUT'||r.url.includes('/publish')),false);
  h.timers[0]();assert.equal(h.downloads[1].revoked,'blob:private-pdf');
});

test('failed PDF fetch offers retry and never downloads an error page',async()=>{
  const h=downloadHarness(true);await h.element('loginForm').onsubmit({preventDefault(){}});await h.element('previewTab').onclick();await h.buttons[0].onclick();
  assert.equal(h.downloads.length,0);assert.equal(h.buttons[0].textContent,'Retry PDF download');assert.equal(h.buttons[0].disabled,false);
  assert.match(h.element('message').textContent,/could not be downloaded/);
});

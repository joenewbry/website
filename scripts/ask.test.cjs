const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const vm = require('node:vm');
const root = resolve(__dirname, '..');
const source = readFileSync(resolve(root,'ask/ask.js'),'utf8');
const prompt = readFileSync(resolve(root,'ask/prompt.txt'),'utf8');

async function mount({response=prompt,ok=true,clipboardError=false}={}) {
  const requests=[],copied=[];
  const elements = Object.fromEntries(['question','prompt-preview','open-codex','copy-prompt','prompt-status','prompt-details'].map(id=>[id,{
    hidden:true, value:'', defaultValue:'Default question?', handlers:{},
    addEventListener(event,fn){this.handlers[event]=fn;},
    focus(){this.focused=true;},select(){this.selected=true;}
  }]));
  const suggestion={dataset:{question:'Suggested question?'},handlers:{},addEventListener(event,fn){this.handlers[event]=fn;}};
  vm.runInNewContext(source,{
    document:{getElementById:id=>elements[id],querySelectorAll:()=>[suggestion]},
    navigator:{clipboard:{writeText:async value=>{if(clipboardError)throw Error('Denied');copied.push(value);}}},
    fetch:async url=>{requests.push(url);return {ok,text:async()=>response};},
    encodeURIComponent
  });
  await new Promise(setImmediate);
  return {elements,requests,copied,suggestion};
}
test('handoff uses only the public prompt; custom Unicode and URL punctuation survive encoding',async()=>{
 const {elements:e,requests}=await mount();
 e.question.value='iOS & AI? #1 — sources + gaps';e.question.handlers.input();
 const url=new URL(e['open-codex'].href);
 assert.equal(url.protocol,'codex:');assert.equal(url.hostname,'new');
 assert.equal(url.searchParams.get('prompt'),e['prompt-preview'].value);
 assert.ok(e['prompt-preview'].value.endsWith('My question: iOS & AI? #1 — sources + gaps'));
 assert.deepEqual(requests,['/ask/prompt.txt']);
 assert.equal(e['open-codex'].hidden,false);
});
test('empty question gets a usable default; suggestion updates the actual handoff',async()=>{
 const {elements:e,suggestion}=await mount();
 e.question.value='  ';e.question.handlers.input();
 assert.ok(e['prompt-preview'].value.endsWith('My question: Default question?'));
 suggestion.handlers.click();
 assert.ok(new URL(e['open-codex'].href).searchParams.get('prompt').endsWith('My question: Suggested question?'));
});
test('copy contains exactly the previewed instructions and question',async()=>{
 const {elements:e,copied}=await mount();await e['copy-prompt'].handlers.click();
 assert.equal(copied[0],e['prompt-preview'].value);
 assert.match(e['prompt-status'].textContent,/Prompt copied/);
});
test('clipboard denial opens and selects the manual copy fallback',async()=>{
 const {elements:e}=await mount({clipboardError:true});await e['copy-prompt'].handlers.click();
 assert.equal(e['prompt-details'].open,true);assert.equal(e['prompt-preview'].selected,true);
 assert.match(e['prompt-status'].textContent,/blocked/);
});
for(const [name,options] of [['HTTP failure',{ok:false}],['HTML fallback',{response:'<!doctype html><title>Not found</title>'}]]){
 test(name+' leaves launch and copy unavailable with a readable fallback',async()=>{
  const {elements:e}=await mount(options);
  assert.equal(e['open-codex'].hidden,true);assert.equal(e['copy-prompt'].hidden,true);
  assert.match(e['prompt-status'].textContent,/could not be loaded/);
 });
}
test('question-like markup remains plain prompt text; never executes as HTML',async()=>{
 const {elements:e}=await mount();e.question.value='<img src=x onerror=alert(1)>';e.question.handlers.input();
 assert.ok(new URL(e['open-codex'].href).searchParams.get('prompt').endsWith(e.question.value));
 assert.equal(e['prompt-preview'].innerHTML,undefined);
});

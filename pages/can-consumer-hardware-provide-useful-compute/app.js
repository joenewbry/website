'use strict';
const $ = id => document.getElementById(id);
let data, family = 'mac';
const explain = {
 mac: ['Mac · Llama 2 7B, 4-bit', 'Single-stream generation with llama.cpp. Select Base, Pro or Max to see why chip tier matters. This older model is a hardware reference, not a reasoning recommendation.', 'M2–M4 use the same older build; M5 uses newer software. Rates are published configurations, not a promise for a 16 GB or 32 GB machine. The M3/M4 rows represent possible chip families for the newer Mac.'],
 iphone: ['iPhone · TinyLlama 1.1B, 4-bit', 'Same small non-reasoning model across available generations. Exact tested phones are shown; the 17-generation result is from an iPhone Air, not a 17 Pro.', 'Your assumed iPhone 16 is not confirmed as a Pro. These short-run speeds are not estimates for Qwen or DeepSeek. The A19 result uses newer software; heat and app memory limits matter.'],
 android: ['Android · Snapdragon flagship examples', 'Mixed workloads: read each model label. Only the Galaxy S25 and S26 pair uses the same Qwen3-1.7B model, precision and 512-token context. This is not a generational speed ranking.', 'Blue = community benchmark; green = vendor benchmark; striped = vendor “up to” claim. Qualcomm’s public page data supplies the two GenieX rates. At 4K context those rates are 30.2 and 29.7 tokens/s. Snapdragon is one Android chip family, not all Android phones.']
};
function makeRows(items, max) {
 return items.map(r => {
 const src = data.sources[r.source];
 const klass = r.kind === 'Vendor claim' ? 'claim' : r.kind === 'Vendor benchmark' ? 'vendor' : '';
 return `<div class="chart-row"><div class="row-label">${r.label}<span class="row-detail">${r.detail}</span></div>${r.rate === null ? '<div class="no-result">No verified result</div>' : `<div class="bar-cell"><div class="bar-track" aria-hidden="true"><div class="bar ${klass}" style="width:${r.rate / max * 100}%"></div></div><span class="rate">${r.kind === 'Vendor claim' ? '≤' : ''}${r.rate.toFixed(1)}<span class="visually-hidden"></span></span></div>`}<a class="chart-citation" href="${src.url}">${r.kind} · source ↗</a></div>`;
 }).join('');
}
function draw(){
 $('tier-control').hidden = family !== 'mac';
 const [title, description, caveat] = explain[family];
 $('chart-title').textContent=title; $('chart-description').textContent=description; $('chart-caveat').textContent=caveat;
 const rows=family==='mac'?data.mac[$('tier').value]:data[family];
 // One shared 0–125 scale across family tabs and Mac tiers.
 $('generation-chart').innerHTML=makeRows(rows,125);
 document.querySelectorAll('[data-family]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.family===family)));
}
function calc(){
 const speed=Number($('speed').value), thought=Number($('thinking').value), answer=256;
 $('speed-value').textContent=`${speed.toFixed(1)} tokens/s`;
 $('thinking-value').textContent=thought.toLocaleString('en-US');
 const seconds=(thought+answer)/speed;
 $('total-time').textContent=seconds<120?`${seconds.toFixed(1)} seconds`:`${(seconds/60).toFixed(1)} minutes`;
 $('time-breakdown').textContent=`Thinking: ${(thought/speed).toFixed(1)} s · Final answer: ${(answer/speed).toFixed(1)} s`;
 $('thinking-bar').style.width=`${100*thought/(thought+answer)}%`;
 $('answer-bar').style.width=`${100*answer/(thought+answer)}%`;
}
fetch('data.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{
 data=d;draw();$('reason-chart').innerHTML=makeRows(data.reasoning,125);
 document.querySelectorAll('[data-family]').forEach(b=>b.addEventListener('click',()=>{family=b.dataset.family;draw()}));
 $('tier').addEventListener('change',draw);
}).catch(()=>{$('generation-chart').innerHTML='<p>Chart data could not load. <a href="report.md">Read the full benchmark table in the research notes.</a></p>';});
['speed','thinking'].forEach(id=>$(id).addEventListener('input',calc));
document.querySelectorAll('[data-speed]').forEach(b=>b.addEventListener('click',()=>{$('speed').value=b.dataset.speed;calc()}));
calc();

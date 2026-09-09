(() => {
'use strict';
const API='https://ai.digitalsurfacelabs.com/blog-editor/api';
const $=s=>document.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let auth='',current=null,dirty=false,busy=false,publicationTimer=null,publicationRun=0;
function say(text,error=false){$('#message').textContent=text;$('#message').className=error?'error':'ok';}
function view(id){for(const s of ['login','library','writing'])$('#'+s).hidden=s!==id;}
async function api(path,options={}){const r=await fetch(API+path,{...options,headers:{'Authorization':'Basic '+auth,'X-Blog-Request':'1',...(options.body?{'Content-Type':'application/json'}:{}),...options.headers},cache:'no-store'});let d;try{d=await r.json()}catch{}if(!r.ok)throw new Error(d?.detail||'The request could not finish. Your writing is still in the editor.');return d;}
function lock(on){busy=on;for(const id of ['saveDraft','publishPost','confirmPublish','newPost','draftsButton','logout','postTitle','postBody'])$('#'+id).disabled=on;}
function changed(){dirty=true;$('#saveState').textContent='Unsaved changes';$('#wordCount').textContent=($('#postBody').value.trim().match(/\S+/g)||[]).length+' words';}
function guard(){return !dirty||confirm('You have unsaved writing. Leave without saving?');}
function draftFromFields(){return {title:$('#postTitle').value,body:$('#postBody').value,version:current?.version||0};}
function slugify(s){return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,85).replace(/-$/,'');}
function writeMode(){ $('#writePane').hidden=false;$('#previewPane').hidden=true;$('#writeTab').classList.add('selected');$('#previewTab').classList.remove('selected');$('#writeTab').setAttribute('aria-pressed','true');$('#previewTab').setAttribute('aria-pressed','false');}
function stopPublicationCheck(){publicationRun++;clearTimeout(publicationTimer);publicationTimer=null;}
function watchPublication(d){
  stopPublicationCheck();
  const run=publicationRun,started=Date.now();
  $('#publishedLink').hidden=true;$('#publishedLink').removeAttribute('href');
  $('#checkPublication').hidden=true;$('#publicationState').hidden=!d.published_url;
  if(!d.published_url)return;
  $('#publicationState').textContent='Publishing to your website…';
  async function check(){
    if(run!==publicationRun||!auth)return;
    let state;
    try{state=await api('/drafts/'+encodeURIComponent(d.slug)+'/publication');}catch{}
    if(run!==publicationRun)return;
    if(state?.state==='live'){
      $('#publishedLink').href=state.url;$('#publishedLink').hidden=false;
      $('#publicationState').textContent='Live on your website.';$('#checkPublication').hidden=true;return;
    }
    $('#publicationState').textContent='Your post is saved. Waiting for your website to finish publishing…';
    if(Date.now()-started<300000)publicationTimer=setTimeout(check,5000);
    else{$('#publicationState').textContent='Your post is saved, but publication is taking longer than expected.';$('#checkPublication').hidden=false;}
  }
  check();
}
$('#checkPublication').onclick=()=>{if(current)watchPublication(current);};
function showDraft(d){current=d;dirty=false;$('#postTitle').value=d.title||'';$('#postBody').value=d.body||'';$('#saveState').textContent=d.version?'Saved':'New draft';$('#wordCount').textContent=(d.body.trim().match(/\S+/g)||[]).length+' words';$('#modeTitle').textContent=d.status==='published'?'Post':'Draft';$('#publishedNote').hidden=d.status!=='published';watchPublication(d);writeMode();view('writing');history.replaceState(null,'',d.slug?'?draft='+encodeURIComponent(d.slug):location.pathname);}
async function openDraft(slug){if(!guard())return;try{showDraft(await api('/drafts/'+encodeURIComponent(slug)));say('');}catch(e){say(e.message,true);}}
async function library(){if(!guard())return;try{const r=await api('/drafts');$('#draftList').innerHTML=r.drafts.length?r.drafts.map(d=>`<div class="draft"><button data-slug="${escape(d.slug)}">${escape(d.title)}</button><p class="small">${d.status==='published'?(d.has_unpublished_changes?'Submitted · unpublished edits':'Submitted to website'):'Draft'} · ${new Date(d.updated).toLocaleDateString()}</p></div>`).join(''):'<p>No drafts yet. Start with a post.</p>';document.querySelectorAll('[data-slug]').forEach(b=>b.onclick=()=>openDraft(b.dataset.slug));stopPublicationCheck();view('library');current=null;dirty=false;history.replaceState(null,'',location.pathname);say('');}catch(e){say(e.message,true);}}
$('#loginForm').onsubmit=async e=>{e.preventDefault();$('#signIn').disabled=true;auth=btoa($('#username').value+':'+$('#password').value);try{await api('/session');$('#password').value='';$('#draftsButton').hidden=false;$('#logout').hidden=false;const slug=new URLSearchParams(location.search).get('draft');if(slug)await openDraft(slug);else await library();}catch(e){auth='';say(e.message,true);}finally{$('#signIn').disabled=false;}};
$('#logout').onclick=()=>{if(!guard())return;stopPublicationCheck();auth='';current=null;dirty=false;$('#postTitle').value='';$('#postBody').value='';$('#previewPane').innerHTML='';$('#draftList').innerHTML='';$('#draftsButton').hidden=true;$('#logout').hidden=true;view('login');say('Signed out.');};
$('#draftsButton').onclick=library;$('#newPost').onclick=()=>{if(guard()){showDraft({title:'',body:'',version:0,status:'draft'});$('#postTitle').focus();}};
$('#postTitle').oninput=changed;$('#postBody').oninput=changed;$('#writeTab').onclick=writeMode;
$('#previewTab').onclick=async()=>{try{const d=draftFromFields();if(!d.title.trim()){say('Give the post a title first.',true);return;}const r=await api('/preview',{method:'POST',body:JSON.stringify(d)});$('#previewPane').innerHTML='<h1>'+escape(d.title)+'</h1>'+r.html;$('#writePane').hidden=true;$('#previewPane').hidden=false;$('#writeTab').classList.remove('selected');$('#previewTab').classList.add('selected');$('#writeTab').setAttribute('aria-pressed','false');$('#previewTab').setAttribute('aria-pressed','true');say('');}catch(e){say(e.message,true);}};
async function saveDraft(){if(busy)return null;const d=draftFromFields();if(!d.title.trim()){say('Give the post a title first.',true);return null;}const slug=current.slug||slugify(d.title);if(!slug){say('Use a title containing letters or numbers.',true);return null;}lock(true);try{const saved=await api('/drafts/'+slug,{method:'PUT',body:JSON.stringify(d)});current=saved;dirty=false;$('#saveState').textContent='Saved just now';history.replaceState(null,'','?draft='+encodeURIComponent(slug));say('Draft saved.');return saved;}catch(e){say(e.message,true);return null;}finally{lock(false);}}
$('#saveDraft').onclick=saveDraft;
$('#publishPost').onclick=async()=>{if(dirty||!current.version){if(!await saveDraft())return;}$('#publishTitle').textContent=current.title;$('#publishDialog').showModal();};
$('#cancelPublish').onclick=()=>$('#publishDialog').close();
$('#confirmPublish').onclick=async()=>{lock(true);say('Publishing…');try{const d=await api('/drafts/'+current.slug+'/publish',{method:'POST',body:JSON.stringify({version:current.version,confirm:true})});$('#publishDialog').close();showDraft(d);say('Post saved. The article link will appear when publication finishes.');}catch(e){$('#publishDialog').close();say(e.message,true);}finally{lock(false);}};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='s'&&!$('#writing').hidden){e.preventDefault();saveDraft();}});

})();

"""Owner-only draft storage and explicit publication to Joe's existing GitHub Pages blog."""
import base64, hashlib, hmac, json, os, re, subprocess, threading, time, uuid
from urllib.request import Request as URLRequest, urlopen
from urllib.error import HTTPError, URLError
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from markdown_it import MarkdownIt

DATA=Path(os.environ.get('BLOG_DATA','/ssd/blog-editor/data'))
CONFIG=Path(os.environ.get('BLOG_CONFIG','/etc/blog-editor/config.json'))
REPO=Path(os.environ.get('BLOG_REPO','/ssd/blog-editor/website'))
LOCK=threading.Lock()
RENDER=MarkdownIt('commonmark',{'html':False,'breaks':False})
SLUG=re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
ORIGINS=['https://joenewbry.com','https://www.joenewbry.com']
if os.environ.get('BLOG_DEV')=='1': ORIGINS+=['http://127.0.0.1:8138']
app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)


def config():return json.loads(CONFIG.read_text())
def now():return datetime.now(timezone.utc).isoformat()
def valid(slug):
    if not SLUG.fullmatch(slug) or len(slug)>100:raise HTTPException(400,'Use a short URL slug with lowercase letters, numbers, and hyphens.')
    return slug

def read(slug):
    p=DATA/'drafts'/(valid(slug)+'.json')
    if not p.exists():raise HTTPException(404,'Draft not found.')
    return json.loads(p.read_text())

def atomic(path,value):
    path.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
    tmp=path.with_name('.'+path.name+'.'+uuid.uuid4().hex)
    with open(tmp,'w') as out:
        out.write(value);out.flush();os.fsync(out.fileno())
    os.chmod(tmp,0o600);os.replace(tmp,path)
    fd=os.open(path.parent,os.O_RDONLY)
    try:os.fsync(fd)
    finally:os.close(fd)

def save(d):
    data=json.dumps(d,ensure_ascii=False,indent=2)+'\n'
    atomic(DATA/'history'/d['slug']/(str(d['version'])+'.json'),data)
    atomic(DATA/'drafts'/(d['slug']+'.json'),data)
    atomic(DATA/'markdown'/(d['slug']+'.md'),'# '+d['title']+'\n\n'+d['body']+'\n')
    return d


def authenticated(request):
    try:
        scheme,value=request.headers.get('authorization','').split(' ',1)
        if scheme.lower()!='basic':return False
        name,password=base64.b64decode(value,validate=True).decode().split(':',1)
        cfg=config()
        if not hmac.compare_digest(name,cfg.get('username','Joe')):return False
        # Runtime uses Python 3.10 on Atlas. PBKDF2 avoids platform-specific crypt.
        import hashlib
        digest=hashlib.pbkdf2_hmac('sha256',password.encode(),bytes.fromhex(cfg['salt']),600000).hex()
        return hmac.compare_digest(digest,cfg['password_digest'])
    except (ValueError,KeyError,UnicodeError):return False


@app.middleware('http')
async def guard(request:Request,call_next):
    if not authenticated(request):
        return JSONResponse({'detail':'Sign in with your Joe account.'},status_code=401,headers={'Cache-Control':'private, no-store'})
    if request.method not in ('GET','HEAD'):
        if request.headers.get('x-blog-request')!='1' or request.headers.get('origin') not in ORIGINS:
            return JSONResponse({'detail':'Request verification failed.'},status_code=403)
        try:length=int(request.headers.get('content-length','0'))
        except ValueError:length=9999999
        if length>600000:return JSONResponse({'detail':'Post is too large.'},status_code=413)
    response=await call_next(request)
    response.headers['Cache-Control']='private, no-store'
    response.headers['X-Content-Type-Options']='nosniff'
    return response

# Outer middleware answers CORS preflight before authentication; content still always requires auth.
app.add_middleware(CORSMiddleware,allow_origins=ORIGINS,allow_methods=['GET','POST','PUT'],allow_headers=['Authorization','Content-Type','X-Blog-Request'])


class Draft(BaseModel):
    title:str=Field(min_length=1,max_length=200)
    body:str=Field(max_length=200000)
    version:int=Field(ge=0)

class Publish(BaseModel):
    version:int=Field(ge=1)
    confirm:bool=False


@app.get('/api/session')
def session():return {'user':'Joe'}

@app.get('/api/drafts')
def drafts():
    result=[]
    for path in (DATA/'drafts').glob('*.json'):
        d=json.loads(path.read_text());result.append({k:v for k,v in d.items() if k!='body'})
    return {'drafts':sorted(result,key=lambda d:d['updated'],reverse=True)}

@app.get('/api/drafts/{slug}')
def get_draft(slug:str):return read(slug)

@app.put('/api/drafts/{slug}')
def put_draft(slug:str,incoming:Draft):
    valid(slug)
    if not incoming.title.strip():raise HTTPException(400,'Give the post a title.')
    with LOCK:
        try:old=read(slug)
        except HTTPException as e:
            if e.status_code!=404:raise
            old={'slug':slug,'version':0,'created':now(),'status':'draft'}
        if old['version']!=incoming.version:raise HTTPException(409,'This draft changed in another tab. Copy your writing, then reopen the saved version.')
        if old['status']=='publishing':raise HTTPException(409,'Publishing is in progress.')
        d=old|{'title':incoming.title.strip(),'body':incoming.body,'version':old['version']+1,'updated':now()}
        if old.get('published_version'):d['has_unpublished_changes']=True
        return save(d)

@app.post('/api/preview')
def preview(incoming:Draft):
    return {'html':RENDER.render(incoming.body)}


def git(*args):
    result=subprocess.run(['git','-C',str(REPO),*args],env=os.environ|{'GIT_TERMINAL_PROMPT':'0','GIT_SSH_COMMAND':'ssh -i /etc/blog-editor/github-deploy-key -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/etc/blog-editor/known_hosts'},capture_output=True,text=True,timeout=60)
    if result.returncode:raise RuntimeError('Git operation failed')
    return result.stdout.strip()


def publish_to_github(d):
    # Dedicated machine checkout; only this process writes it, under LOCK.
    git('fetch','origin','main')
    git('checkout','-B','editor-publish','origin/main')
    day=d.get('published_date') or datetime.now(ZoneInfo('America/Los_Angeles')).strftime('%Y-%m-%d')
    path=Path('_posts')/(day+'-'+d['slug']+'.md')
    full=REPO/path;full.parent.mkdir(exist_ok=True)
    # Liquid is not needed in user Markdown; reject it rather than invoking Jekyll template code.
    if '{%' in d['body'] or '{{' in d['body']:raise ValueError('Remove Liquid template tags before publishing.')
    revision=hashlib.sha256((d['title']+'\0'+d['body']).encode()).hexdigest()
    route='/blog/'+day.replace('-','/')+'/'+d['slug']+'/'
    body='---\ntitle: '+json.dumps(d['title'],ensure_ascii=False)+'\nlayout: post\npermalink: '+route+'\neditor_revision: '+revision+'\n---\n\n'+d['body']+'\n'
    full.write_text(body)
    git('add','--',str(path))
    if git('diff','--cached','--name-only'):
        git('-c','user.name=Joe Newbry','-c','user.email=joenewbry@users.noreply.github.com','commit','-m','Publish blog post: '+d['slug'])
        git('push','origin','HEAD:main')
    return {'published_date':day,'published_url':'https://joenewbry.com'+route,'published_revision':revision,'commit':git('rev-parse','HEAD')}


@app.post('/api/drafts/{slug}/publish')
def publish(slug:str,incoming:Publish):
    if not incoming.confirm:raise HTTPException(400,'Confirm publication first.')
    with LOCK:
        d=read(slug)
        if d['version']!=incoming.version:raise HTTPException(409,'Save your latest changes before publishing.')
        try:publication=publish_to_github(d)
        except ValueError as e:raise HTTPException(400,str(e))
        except Exception:raise HTTPException(502,'Publishing could not finish. Your draft is saved. Retry after checking GitHub.')
        d=d|publication|{'status':'published','published_version':d['version'],'has_unpublished_changes':False,'updated':now()}
        save(d)
        return d


@app.get('/api/drafts/{slug}/publication')
def publication(slug:str):
    d=read(slug)
    if not d.get('published_date'):return {'state':'draft'}
    day=d['published_date']
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',day):raise HTTPException(400,'Invalid publication date.')
    # Only check our own generated URL; never follow a draft-supplied hostname.
    url='https://joenewbry.com/blog/'+day.replace('-','/')+'/'+valid(slug)+'/'
    revision=d.get('published_revision')
    try:
        request=URLRequest(url+'?editor_check='+str(int(time.time())),headers={'User-Agent':'JoeBlogEditor/1.0','Cache-Control':'no-cache'})
        with urlopen(request,timeout=8) as response:
            body=response.read(2_000_000).decode('utf-8',errors='replace')
            ready=response.status==200 and '<article>' in body
            if revision:ready=ready and ('name="blog-editor-revision" content="'+revision+'"') in body
    except (HTTPError,URLError,TimeoutError,OSError):return {'state':'building'}
    if not ready:return {'state':'building'}
    # A revision query avoids a browser's cached 404 or old copy after republishing.
    return {'state':'live','url':url+'?v='+(revision or d.get('commit','published'))}

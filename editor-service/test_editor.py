import base64,hashlib,json
import pytest
from fastapi.testclient import TestClient
import app

@pytest.fixture
def client(tmp_path,monkeypatch):
    monkeypatch.setattr(app,'DATA',tmp_path/'data')
    salt=b'test-fixture-salt';digest=hashlib.pbkdf2_hmac('sha256',b'test-password',salt,600000).hex()
    monkeypatch.setattr(app,'config',lambda:{'username':'Joe','salt':salt.hex(),'password_digest':digest})
    with TestClient(app.app) as c:yield c

def headers():return {'Authorization':'Basic '+base64.b64encode(b'Joe:test-password').decode(),'X-Blog-Request':'1','Origin':'https://joenewbry.com'}
def draft(c,version=0,body='A **private** draft.'):
    return c.put('/api/drafts/test-post',headers=headers(),json={'title':'Test post','body':body,'version':version})

def test_auth_and_cors(client):
    assert client.get('/api/drafts').status_code==401
    assert client.get('/api/session',headers=headers()).json()=={'user':'Joe'}
    wrong=headers()|{'Authorization':'Basic '+base64.b64encode(b'Paul:test-password').decode()}
    assert client.get('/api/session',headers=wrong).status_code==401
    r=client.options('/api/drafts',headers={'Origin':'https://joenewbry.com','Access-Control-Request-Method':'PUT','Access-Control-Request-Headers':'authorization,content-type,x-blog-request'})
    assert r.status_code==200 and r.headers['access-control-allow-origin']=='https://joenewbry.com'
    assert client.options('/api/drafts',headers={'Origin':'https://evil.example','Access-Control-Request-Method':'PUT'}).status_code==400
    assert client.put('/api/drafts/test',headers=headers()|{'Origin':'https://evil.example'},json={'title':'a','body':'b','version':0}).status_code==403

def test_drafts_persist_conflicts_and_no_publish(client,monkeypatch):
    def forbidden(d):raise AssertionError('Saving must never publish')
    monkeypatch.setattr(app,'publish_to_github',forbidden)
    r=draft(client);assert r.status_code==200
    assert r.json()['status']=='draft' and r.json()['version']==1
    assert (app.DATA/'markdown/test-post.md').read_text().startswith('# Test post')
    assert (app.DATA/'history/test-post/1.json').exists()
    assert draft(client).status_code==409
    assert draft(client,1,'Second version').json()['version']==2
    assert client.get('/api/drafts/test-post',headers=headers()).json()['body']=='Second version'
    assert client.get('/api/drafts',headers=headers()).json()['drafts'][0]['slug']=='test-post'
    assert client.post('/api/drafts/test-post/publish',headers=headers(),json={'version':2,'confirm':False}).status_code==400

def test_safe_preview_and_slug(client):
    r=client.post('/api/preview',headers=headers(),json={'title':'Title','body':'<script>alert(1)</script>\n\n[bad](javascript:alert(1))','version':0})
    assert r.status_code==200
    assert '<script>' not in r.json()['html'] and 'href="javascript:' not in r.json()['html']
    assert client.put('/api/drafts/INVALID',headers=headers(),json={'title':'Title','body':'x','version':0}).status_code==400

def test_explicit_publish_and_private_later_edits(client,monkeypatch):
    draft(client)
    monkeypatch.setattr(app,'publish_to_github',lambda d:{'published_url':'https://joenewbry.com/blog/2026/09/08/test-post/','published_date':'2026-09-08','commit':'fixture'})
    assert client.post('/api/drafts/test-post/publish',headers=headers(),json={'version':2,'confirm':True}).status_code==409
    r=client.post('/api/drafts/test-post/publish',headers=headers(),json={'version':1,'confirm':True})
    assert r.json()['status']=='published'
    r=draft(client,1,'Private change')
    assert r.json()['has_unpublished_changes'] and r.json()['published_version']==1


def test_publication_waits_for_exact_revision(client,monkeypatch):
    from urllib.error import HTTPError,URLError
    draft(client)
    endpoint='/api/drafts/test-post/publication'
    assert client.get(endpoint).status_code==401
    assert client.get(endpoint,headers=headers()).json()=={'state':'draft'}
    d=app.read('test-post')|{'published_date':'2026-09-08','published_revision':'new-revision','status':'published'}
    app.save(d)
    def missing(*a,**k):raise HTTPError('https://joenewbry.com',404,'Not found',{},None)
    monkeypatch.setattr(app,'urlopen',missing)
    assert client.get(endpoint,headers=headers()).json()=={'state':'building'}
    class Response:
        status=200
        def __init__(self,body):self.body=body
        def __enter__(self):return self
        def __exit__(self,*args):pass
        def read(self,limit):return self.body.encode()
    monkeypatch.setattr(app,'urlopen',lambda *a,**k:Response('<article>Old published version</article><meta name="blog-editor-revision" content="old-revision">'))
    assert client.get(endpoint,headers=headers()).json()=={'state':'building'}
    monkeypatch.setattr(app,'urlopen',lambda *a,**k:Response('<article>New version</article><meta name="blog-editor-revision" content="new-revision">'))
    r=client.get(endpoint,headers=headers()).json()
    assert r=={'state':'live','url':'https://joenewbry.com/blog/2026/09/08/test-post/?v=new-revision'}
    def offline(*a,**k):raise URLError('temporarily unavailable')
    monkeypatch.setattr(app,'urlopen',offline)
    assert client.get(endpoint,headers=headers()).json()=={'state':'building'}


def test_publisher_writes_verifiable_permalink(tmp_path,monkeypatch):
    monkeypatch.setattr(app,'REPO',tmp_path)
    calls=[]
    def fake_git(*args):
        calls.append(args)
        return 'commit-id' if args==('rev-parse','HEAD') else ('changed' if args==('diff','--cached','--name-only') else '')
    monkeypatch.setattr(app,'git',fake_git)
    d={'slug':'a-stable-slug','title':'A title changed by the author','body':'Actual article','published_date':'2026-09-08'}
    result=app.publish_to_github(d)
    post=(tmp_path/'_posts/2026-09-08-a-stable-slug.md').read_text()
    assert 'permalink: /blog/2026/09/08/a-stable-slug/' in post
    assert 'editor_revision: '+result['published_revision'] in post
    assert ('push','origin','HEAD:main') in calls
    changed=app.publish_to_github(d|{'body':'Revised article'})
    assert changed['published_revision']!=result['published_revision']

#!/usr/bin/env python3
"""Check built production output and the separately built draft preview."""
from pathlib import Path
import json,sys,re,xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
root=Path(__file__).resolve().parents[1]
prod=Path(sys.argv[1]); preview=Path(sys.argv[2])
archive=json.loads((root/'_data/bear_archive.json').read_text())
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.links=[];self.ids=set();self.headings=[];self.feed(path.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.add(a['id'])
  if tag in ['h1','h2']:self.headings.append(tag)
  for key in ['href','src']:
   if a.get(key):self.links.append(a[key])
for build in [prod,preview]:
 page=Page(build/'blog/index.html')
 assert page.headings.count('h1')==1
 assert len([p for p in archive if p['url'] in page.links])==15
 for ref in page.links:
  u=urlsplit(ref)
  if u.scheme or not u.path:continue
  p=build/unquote(u.path).lstrip('/')
  if p.is_dir():p/='index.html'
  assert p.is_file(),f'Missing {ref}'
 ET.parse(build/'blog/feed.xml')
 assert not (build/'_data').exists()
 assert not (build/'_drafts').exists()
 assert not (build/'README.md').exists()
 assert not (build/"Joe_Newbry's_Resume_AI (2025).txt").exists()
 assert not (build/'ask').exists()
assert not list(prod.glob('blog/**/secretary/index.html'))
assert 'New posts will appear here' in (prod/'blog/index.html').read_text()
posts=list(preview.glob('blog/**/secretary/index.html'));assert len(posts)==1
text=posts[0].read_text();assert '<strong>Secretary</strong>' in text and 'Draft preview' in text and re.search(r'<code[^>]*>trust.md</code>',text)
assert len(ET.parse(prod/'blog/feed.xml').findall('.//item'))==0
assert len(ET.parse(preview/'blog/feed.xml').findall('.//item'))==1
print('PASS: 15 archive links, post Markdown rendering, draft isolation, production/preview RSS, local links and excluded source files')

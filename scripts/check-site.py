#!/usr/bin/env python3
"""Check the public routes, local assets, anchors and deployment exclusions."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ['index.html', 'ask/index.html', 'how-it-works/index.html']
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.refs, self.ids, self.meta = path, [], set(), {}
        self.h1 = 0
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f'Duplicate id: {self.path}: {a["id"]}'
            self.ids.add(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'meta': self.meta[a.get('name', a.get('property'))] = a.get('content')
        if tag == 'img': assert a.get('alt'), f'Missing alt: {self.path}'
        for key in ('src', 'href'):
            if key in a: self.refs.append(a[key])
        assert not any(k.startswith('on') for k in a), 'Inline event handler'

pages = {name: Page(ROOT / name) for name in ROUTES}
for name, page in pages.items():
    assert page.h1 == 1, name
    for key in ('description', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:card'):
        assert page.meta.get(key), f'{name}: missing {key}'
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        path = ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/') else page.path.parent / unquote(url.path)
        if not url.path: path = page.path
        if path.is_dir(): path /= 'index.html'
        assert path.is_file(), f'{name}: missing target {ref}'
        if url.fragment and path.suffix == '.html':
            target = pages.get(str(path.relative_to(ROOT))) or Page(path)
            assert unquote(url.fragment) in target.ids, f'{name}: missing anchor {ref}'
for name in ('work.md', 'trust.md', 'llms.txt', 'ask/prompt.txt'):
    text = (ROOT/name).read_text()
    assert text.strip(), name
    for target in re.findall(r'https://joenewbry.com(/[^\s)>]*)', text):
        url = urlsplit(target.rstrip(".,;:"))
        path = ROOT / url.path.lstrip('/')
        if path.is_dir(): path /= 'index.html'
        assert path.is_file(), f'{name}: missing {target}'
    assert not re.search(r'(?:\+1\d{10}|192\.168\.|/home/kronos|/Users/joe|BEGIN.*PRIVATE KEY)',text), f'Private material in {name}'
assert (ROOT/'CNAME').read_text().strip() == 'joenewbry.com'
assert not (ROOT/'.nojekyll').exists()
config = (ROOT/'_config.yml').read_text()
for name in ('scripts', 'design-reviews', '_review', "Joe_Newbry's_Resume_AI (2025).txt"):
    assert name in config, f'Missing Pages exclusion: {name}'
js = (ROOT/'ask/ask.js').read_text()
assert 'innerHTML' not in js and 'localStorage' not in js
assert js.count('fetch(') == 1 and "fetch('/ask/prompt.txt'" in js
print('PASS: public routes, local links/assets/anchors, metadata, agent sources, privacy checks, Pages exclusions')

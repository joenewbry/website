# Joe’s website and Markdown blog

The homepage retains its original HTML/CSS design. GitHub Pages renders the
public blog with Jekyll. Public reading needs no JavaScript; the private editor
uses a small JavaScript client and a separate authenticated service.

## Write a post

Create `_posts/YYYY-MM-DD-title.md`:

```markdown
---
title: "A title"
description: "Optional short description."
---

Write ordinary Markdown here.
```

After merging to main, the post appears automatically at
`/blog/YYYY/MM/DD/title/`, on the dated index, and in `/blog/feed.xml`.
Future-dated posts and `_drafts/` are not published. The Secretary essay in
`_drafts/secretary.md` is a review draft, not a published article. Move it to
`_posts/` with a dated filename and remove `draft: true` when ready.
Drafts are excluded from Pages, but this Git repository is public: do not put
private material in draft source files.

## Earlier writing

`_data/bear_archive.json` contains 15 verified title/date links from
https://newbry.bearblog.dev/blog/, read September 8, 2026. Posts remain hosted
on Bear Blog. Display dates preserve the existing archive’s visible dates.
This is an archive link index, not a content migration or live sync.

## Preview

Use Jekyll 3.10 (the GitHub Pages-compatible version):

```sh
gem install jekyll -v 3.10.0
gem install kramdown-parser-gfm -v 1.1.0
jekyll serve --host 127.0.0.1 --port 8881
# Include review drafts locally:
jekyll serve --drafts --host 127.0.0.1 --port 8881
```

`_config.yml` excludes internal notes, development artifacts and the obsolete
resume file from the public Pages build. Do not add `.nojekyll`.

## Private browser editor

Open `https://joenewbry.com/blog/editor/`. The editor follows the blog's existing
simple design: title, Markdown body, preview, Save draft and an explicit Publish
confirmation. `?draft=<slug>` opens a particular editable draft after sign-in.

The static editor shell lives on GitHub Pages. The protected API runs on Atlas
at `https://ai.digitalsurfacelabs.com/blog-editor/api`, with CORS restricted to
`https://joenewbry.com` and `https://www.joenewbry.com`. Draft contents are never
embedded in the public editor HTML, query string, or public Git repository.
The editor accepts only Joe's account; family mail accounts have no access.
The browser keeps login credentials in memory until the page closes or signs
out. Sign-in uses the existing Joe mail password; do not record its value here.

The dedicated `blog-editor.service` binds loopback port 8137. Runtime secrets
live in `/etc/blog-editor/`, owned by the service user, outside source and the
web roots. It uses PBKDF2-SHA256 for password verification. Its SSH deploy key
has write access to this website repository only. The key's known-host entries
come from GitHub's metadata API. No personal GitHub token is exposed to the web.

Private state is under `/ssd/blog-editor/data/`: `drafts/<slug>.json`,
`markdown/<slug>.md`, and versioned `history/<slug>/<version>.json`. Writes are
atomic, and saves reject stale versions instead of overwriting another tab's
work. Keep this directory backed up separately from the public website.

Publish commits the selected Markdown post to `_posts/` on `main` through a
dedicated checkout at `/ssd/blog-editor/website`, which triggers GitHub Pages.
Publication is public in both the website and repository. Later edits remain
private until explicitly published again. A saved draft is not a publication.
Publishing errors retain the draft; the UI reports that Pages can take a few
minutes to update. Publication is not exercised against a real article in the
automated tests.

Service source: `editor-service/` (excluded from the Pages build). Requirements
and the systemd unit are included. Deploy a dated release under
`/ssd/blog-editor/releases`, point `/ssd/blog-editor/current` at it, and restart
only `blog-editor.service`. The scratchpad nginx runbook remains in
`/Users/joe/dev/information-projects/hosting/ai-scratchpad/README.md`.
Local service tests: `pytest -q editor-service/test_editor.py`.

Publication links remain hidden until the public page returns 200 with the exact published revision marker. The editor checks for up to five minutes, then offers Check publication. Revision query strings bypass cached 404 responses and old post versions. Older posts without a marker are checked for a successful article page. Tests cover a 404 during deployment, stale content during republishing, completion, and temporary network failure.

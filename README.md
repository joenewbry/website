# Joe’s website and Markdown blog

The homepage retains its original HTML/CSS design. GitHub Pages renders the
blog with Jekyll. No client-side framework, database or JavaScript is needed.

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

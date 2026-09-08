# Joe Newbry's personal site

Static HTML, CSS, JavaScript, and Markdown, deployed by the existing GitHub
Pages source configuration (main branch, repository root). No framework, API
key, server-side model, payment processor, or private-data service is required.

## Run and verify

```sh
python3 -m http.server 8879 --bind 127.0.0.1
python3 scripts/check-site.py
node --test scripts/ask.test.cjs
```

The prompt links intentionally use the canonical production URLs. They become
fetchable by a visitor's Codex after this branch is merged and Pages publishes.
Local preview verifies UI and prompt construction; it does not claim the new
production source URLs are already live.

## Content ownership

- `work.md`: the authoritative curated public work record; keep the homepage
  summary consistent when changing dates, projects, or claims.
- `trust.md`: readable answer rules and explicit scope; not an authentication
  mechanism or a grant to private evidence.
- `llms.txt`: public discovery index.
- `ask/prompt.txt`: default agent handoff. `ask/ask.js` changes only its question.
- `how-it-works/index.html`: today's public flow and the proposed private flow.
- `_review/`: content review and proposed owner-access protocol, not Pages content.

`_config.yml` excludes review/development files and the obsolete résumé from
Jekyll output. Do not introduce `.nojekyll` or a raw-root upload that bypasses
these exclusions. Source repository history is public; never put private
history, credentials, internal host records, or confidential drafts in it.

## Review and publication

Open `design-reviews/2026-09-08-personal-site-refresh/index.html` for captured
routed pages and caveats. Merge only after reviewing the public work/rules;
merging to main triggers the existing Pages deployment. After publishing,
verify `/`, `/ask/`, `/how-it-works/`, `/work.md`, `/trust.md`, `/llms.txt`, and
`/ask/prompt.txt`, then try the Codex handoff manually. Confirm the excluded
legacy résumé is no longer served. Git history copies are unaffected.

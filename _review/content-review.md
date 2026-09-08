# Personal site content review — 2026-09-08

## Positioning

Lead with a builder whose work connects mobile products, personal context, and
agent access. The site should answer three questions quickly: what has Joe
built, how does he think, and how do I talk to him about a role?

The old homepage led with an undifferentiated preference for early stage
startups, followed by a long chronological résumé and ten equally weighted
projects. The refresh puts three connected projects first, makes contact
visible, and lets a reader ask a follow-up using a bounded public source set.

## Changes in this proposal

- Clear iOS/AI positioning and a visible job-inquiry button; mailto opens a
  visitor-controlled draft with company, role, mission, fit, location, and
  optional compensation fields. No message is sent by the site.
- Three selected projects with public repositories: Inspectable Trust, Memex,
  Open Arcade. Avoid claiming old dashboard URLs are still functioning demos.
- A concise work timeline, with education and surfing retained as personal
  context. Removed the empty “misc” placeholder and excessive whitespace.
- Agent-readable work.md, trust.md, llms.txt, and a copyable prompt. Source
  guidance explicitly calls the résumé self-reported and labels inference.
- An explanation of payment, inference location, and the limits of a prose
  policy. The private-history extension is clearly proposed, not available.
- Per-route titles, descriptions, canonical URLs, social metadata using the
  existing headshot, alt text, keyboard focus, reduced-motion and print styles.
- Exclude development notes and the obsolete contact-bearing résumé file from
  the GitHub Pages artifact. Exclusion does not remove historical Git copies.

## Editorial checks still needed from Joe

1. Confirm Walmart's end date or current status; the old site said “2024–”.
   The proposal says “Started 2024,” and the public record states the gap.
2. Verify the barcode project's 40% accuracy and ~$1.2M annual savings claims,
   including baseline, methodology, Joe's contribution, and publishability.
   Omitted from this proposal until substantiated.
3. Confirm the Screen Timelapse chronology. The old 2023 entry combined an
   MCP claim with ChromaDB in a way that needs correction. Keep the stable
   screenshot/OCR contribution while reconstructing integration dates.
4. Verify old Microsoft framework claims before reusing them. The résumé and
   homepage disagree in detail; the refresh describes receipt detection and
   GPS state machines without speculative framework/version specificity.
5. Decide which roles to prioritize and confirm location/remote preferences.
   Current copy invites engineering roles and early stage teams broadly.
6. Review blog reachability. The automated audit received HTTP 403. The refresh
   preserves the known public blog link; no unread articles are promoted.

## Best next content, in order

| Piece | Evidence to prepare | Reader outcome | Suggested action |
| --- | --- | --- | --- |
| **Why my personal site has a trust.md** | Public rules, a real permitted Q&A, an honest missing-answer example | Understand the thesis and try it immediately | Try the public Q&A |
| **A month of building, reconstructed from my own history** | Owner-reviewed timeline, 3 decisions, 2 discarded approaches, selected redacted evidence | See judgment and execution, not only a list of tools | Talk about a role |
| **From screen history to useful memory** | Capture → OCR → retrieval diagram, a reproducible query, latency and failure cases | Understand what Memex solves and where it fails | Run a synthetic demo |
| **An agent asked. My server said no.** | Synthetic permitted/denied/escalated examples, revocation test, access receipts | See how prose policy becomes enforced boundaries | Try the protocol example |
| **Shipping a better barcode scanner** | Cleared architecture sketch, baseline, measured outcome, individual contribution | Assess production iOS judgment | Contact Joe |
| **Run your own work-history agent** | Tested container setup, sample corpus, upgrade/backup/restore instructions | Reproduce the project on their own hardware | Self-host and report friction |

Publish the first essay with the public Q&A. Publish the self-hosting tutorial
only when a stranger can reproduce it. Keep raw screen history, third-party
information, and employer-confidential material out of the articles. Generate
candidate case studies privately; Joe selects the evidence released publicly.

## Distribution and learning

- Use joenewbry.com as the demonstration, and the existing Inspectable Trust
  repository as the protocol discussion point. Avoid another brand/repository
  until the reusable component has a clear boundary.
- Prepare a 60–90 second demo: public question → cited answer → private request
  denied → owner scopes a synthetic grant → revoke → next request denied.
- Draft a technical launch post for Hacker News Show HN only after the runnable
  artifact exists. Share a concise build thread on X and a hiring-oriented
  case study on LinkedIn. These are recommendations; nothing has been posted.
- Invite a small group of developers to try self-hosting. Measure time to first
  permitted answer and where installation fails, not only stars and visits.
- Site measures to add later: ask-page visits, prompt-copy/open intent,
  contact-link intent, and qualified inbound conversations. A click is not a
  completed AI chat or a sent email. Never log question contents or prompts.
- Keep direct email available in every version; AI is optional for recruiters.

# Owner-controlled agent access — protocol proposal 0.1

Status: design proposal, not a deployed service or a security certification.
Thesis: humans control the data; agents manage access.

## Two products with one source-ownership model

The public version publishes an explicit work record and answer rules; the
visitor runs their own Codex. Public documents need no access grant and can be
copied irreversibly. The website does not bill the visitor or run inference.

The deeper version is an owner-hosted query service with an owner-only lookback
first. Outside visitors receive scoped answers, not filesystem access. A
requester's agent negotiates with the owner's policy agent. A deterministic
server gate controls retrieval, provider egress, execution, and output release.
Prose interprets purpose; code enforces ceilings. Buying compute never buys
broader access.

## Reuse before building

Inspectable Trust already demonstrates an OPEN → HANDSHAKE → GRANT → WORK →
CLOSE lifecycle. Reuse its vocabulary and synthetic sessions. Do not treat
personal-knowledge probe questions or model confidence as authentication.
Use proven identity credentials where a grant requires identity; an anonymous
public request needs no identity claim. MCP can be a tool adapter; it should
not be mistaken for the application authorization policy itself.

The existing one-owner Surface alpha offers a candidate storage/ingest/query
base, with separate capture and owner credentials and cross-person sharing off.
Extract a small reference server from that work only after auditing its
licensing, dependency footprint, and data boundaries. Do not turn on public
sharing by placing a reverse proxy in front of the owner interface.

## Minimum HTTP contract (proposed)

Every message carries protocol_version, request_id, and a bounded body size.
Use TLS, authenticated grants where required, and a stable owner identity key.
Use machine-readable envelopes with plain-language purpose and policy text.
Transport adapters must preserve the same authorization and spend semantics.

| Operation | Required inputs | Result |
| --- | --- | --- |
| GET discovery | none | Protocol versions, public source index, public policy digest, supported operations; no private categories or credentials |
| POST request | question, purpose, desired public category, date bounds, requested output type, identity proof if needed, max spend, currency, idempotency key | deny, narrower counter-offer, pending owner review, or a grant proposal and bounded quote |
| POST accept | request ID, quote ID, accepted scope/policy digest, authenticated requester, payment authorization if required | Short-lived opaque grant bound to requester, scope, quote, and policy version |
| POST answer | grant, bounded question, idempotency key | Job ID; retrieval and model run remain subject to the grant |
| GET result | job ID and matching requester/grant | Approved answer, permitted citations, uncertainty, metered usage, receipt; or denied/expired/review-required state |
| POST revoke | authenticated owner and grant ID | Future retrieval, running release, and follow-ups denied; cancellation recorded |

A grant fixes: identity, purpose, source/category allowlist, date window,
permitted fields, maximum records/bytes, output form, model/provider egress,
expiry, request count, and cost ceiling. Grants are stored and checked on the
server; a bearer string alone must not imply a reusable owner credential.

Quotes fix: currency, maximum total authorized charge, rate version, permitted
model/provider, expiry, and what happens on cancellation/failure. Bind quote,
request, grant, payer, and idempotency key. Verify payment provider events on
the server. Enforce a prepaid/reserved ceiling before each model call, settle
actual permitted usage at most once, and release unused reservations. No raw
card data. Do not assume a visitor's Codex subscription can pay the owner's API
bill; that is a distinct payment flow requiring a billing integration.

## Evidence and execution boundaries

- Capture/OCR text is untrusted evidence. Screenshot instructions never change
  policy, become system instructions, or invoke tools.
- Private owner policy is separate from the published trust.md. Publishing the
  public policy must not disclose sensitive folder names or dataset existence.
- Ingest credentials can append but cannot query. A visitor grant cannot use
  owner shell, browse raw paths, enumerate files, or execute generated code.
- Retrieval filters run before content reaches a model. The model sees only
  a bounded candidate evidence set; output is checked against the grant before
  release. Sensitive or ambiguous requests escalate to the human or fail closed.
- Under a cloud inference option, permitted excerpts leave the host for that
  provider. The policy must authorize this explicitly. A local-only policy
  cannot silently fall back to a hosted model.
- Every follow-up is a new checked operation. Recheck current policy and
  revocation before retrieval and immediately before release, including streams.
- Public citations point only to released evidence. Private citations are
  authenticated, expiring references with no raw path or cross-user identifiers.
- Prevent cumulative disclosure across individually small requests: rate limits,
  per-purpose disclosure budgets, session history, and conservative escalation.
- Revocation stops future access; it cannot claw back an answer already copied.

## Access receipt

Owner-visible: request and requester IDs, purpose, scope, decision and reason,
policy digest, source IDs (private to owner), provider/model, timestamps,
usage/charge, redactions, review decision, answer digest, and revocation state.
Visitor-visible: only their grant/quote, decision, permitted answer/citations,
usage/charge, and a receipt ID. Never include forbidden source identifiers.
An append-only log with hashes aids inspection; do not call it tamper-proof.

## Make self-hosting easy

1. A synthetic sample archive starts without credentials or an external model.
2. One container-compose service with persistent data and separate secret
   storage; local binding by default. Provide x86_64 and ARM64 images.
3. Setup asks the owner to choose sources, review trust.md, choose local or
   cloud inference, and create an owner credential. Never print secret values.
4. An owner-only lookback answers “what did I work on?” with dates and evidence.
5. An explicit publishing step selects sanitized public summaries; importing
   an archive never silently makes it externally queryable.
6. A constrained visitor endpoint is separately enabled after policy review,
   TLS, identity, spend controls, and the conformance tests below pass.
7. Include doctor, export, backup, restore, upgrade, revoke-all, and uninstall
   instructions; show the storage cost and provider-egress choice plainly.

The first useful milestone is a personal lookback, even with public sharing
turned off. That produces owner-reviewed case-study material for the website
and a useful tool before the paid visitor protocol is complete.

## Release tests and acceptance criteria

- Unknown identity cannot get an identity-bound grant; knowledge probes cannot
  impersonate an owner. Tokens cannot replay across owners, grants, or jobs.
- Injected screenshot text cannot alter policy, trigger tools, or choose URLs.
- Attempts to enumerate or infer forbidden categories return a uniform denial.
- Narrowing a request cannot increase source scope or spending authority.
- Revocation and policy changes invalidate an in-flight answer before release.
- Expired quotes, duplicated requests/webhooks, timeout, crash, and retry cannot
  double-charge or exceed the authorized ceiling.
- Returned evidence/citations contain no prohibited fields or source paths.
- Repeated small queries cannot reconstruct an otherwise forbidden record.
- Cloud egress is denied under local-only policy; failure never broadens access.
- Restore on a clean machine reproduces the permitted/denied decisions.
- A new operator can run the synthetic demo and revoke a grant without help.

## Launch sequence

Public site + essay → owner-only lookback → synthetic protocol demo → small
self-hosting pilot → scoped visitor answers → paid runs. Publish installation
and policy failure cases alongside the successful demo. Do not advertise paid
private access until each boundary has a tested implementation.

References: https://github.com/joenewbry/inspectable-trust;
https://developers.openai.com/codex/auth/;
https://learn.chatgpt.com/docs/reference/commands#deep-links.

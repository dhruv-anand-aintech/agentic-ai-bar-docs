---
title: Security model
description: Required controls for credentials, tools, approvals, events, generative UI, artifacts, and voice.
---

# Security model

Agentic UI is a trust boundary. Treat model output and tool arguments as untrusted, keep provider credentials server-side, and make every external side effect pass a structured policy check.

## Required controls

### Authentication and authorization

- Authenticate every run, status, trace, and decision endpoint.
- Authorize session ownership independently of knowing a request ID.
- Use same-origin or CSRF defenses for browser decisions.
- Scope service credentials to the provider and environment that need them.

### Provider routing

- Resolve model IDs through a server-owned catalog.
- Never accept an arbitrary provider base URL, API key, or upstream model from the browser.
- Set timeouts, response-size limits, concurrency limits, and retry budgets.
- Redact authorization headers and sensitive provider errors from traces.
- Keep every provider and gateway key server-side; never expose one through catalog data, browser configuration, or an MCP App resource.

### Tool execution

- Register explicit tools with schemas and risk classes.
- Validate tool arguments using a structured schema.
- Separate read-only execution from mutating proposal creation.
- Give each side-effect class a dedicated preview and executor.
- Keep unrestricted shell execution outside the generic approval path.
- Bind an approval to the canonicalized tool name and input, consume it immediately before execution, and reject replay.
- Remember exact denied fingerprints so an agent cannot repeatedly ask for the same rejected call.

### File changes

- Configure one canonical workspace root.
- Reject absolute paths, traversal, protected names, and symlink escapes.
- Bind approvals to exact content and original file hashes.
- Recheck state at apply time, create backups, and write atomically.
- Expire and consume approvals once.

### Browser data

- Collect only named storage keys by default.
- Let users review screenshot annotations and submitted notes.
- Do not capture cookies, authorization headers, password fields, or full storage by default.
- Put retention and access controls around screenshots, diagnostics, and traces.

### Events, persistence, and sync

- Validate the event protocol version and envelope before rendering or persistence.
- Authorize thread, run, checkpoint, artifact, and sync access independently of knowing an ID.
- Enforce expected versions transactionally; in-memory optimistic checks are not distributed locks.
- Scope idempotency keys to an authenticated actor and operation.
- Treat resume tokens, cursors, artifact URLs, and sync ETags as potentially sensitive.

### Generative UI and MCP Apps

- Register resources from a trusted allowlist; never let model output select imports or executable host code.
- Render HTML resources in an isolated sandbox with restrictive script, navigation, and network policy.
- Do not bridge credentials, cookies, filesystem access, or unrestricted host functions.
- Validate and version AG-UI custom event payloads.

### Voice

- Start microphone capture only after explicit user action and keep stop controls visible.
- Minimize audio and transcript retention and apply message-level access controls.
- Mint short-lived client media tokens server-side when direct realtime transport is required.

## Threats and mitigations

| Threat | Mitigation |
| --- | --- |
| Prompt injection requests a destructive tool | Tool policy and structured approval independent of model text |
| Browser alters a proposal after review | Decision endpoint accepts ID and decision only |
| File changes between preview and apply | Original hash revalidated at apply time |
| Approval replay | One-time state transition and expiry |
| Path escapes workspace | Canonical root checks and symlink rejection |
| Model ID routes to an unexpected host | Server-owned model catalog and fixed adapter configuration |
| Trace leaks secrets | Structured redaction before persistence and rendering |
| Replayed tool approval | Exact fingerprint match and one-time consumption |
| Stale distributed update | Transactional expected-version check and conflict handling |
| Malicious generated UI | Resource allowlist, schema validation, and sandbox isolation |
| Resume token theft | Opaque short-lived tokens, secure storage, and no URL/log exposure |

## Deployment checklist

- [ ] All credentials are server-side.
- [ ] Catalog endpoints expose no internal secrets or arbitrary routing.
- [ ] Decision endpoints authenticate, authorize, and enforce CSRF protection.
- [ ] Mutating tools create proposals; they do not execute during preview.
- [ ] Approval records are immutable, expiring, and one-time.
- [ ] Filesystem roots and denied paths are tested.
- [ ] Logs, screenshots, and traces have retention and redaction policies.
- [ ] UI labels accurately describe scope and irreversibility.
- [ ] Failure paths are tested without real provider or production API calls.
- [ ] Event protocol and persisted schema versions are validated.
- [ ] MCP App resources run under an explicit sandbox and origin policy.
- [ ] Voice capture has consent, interruption, retention, and text fallback controls.

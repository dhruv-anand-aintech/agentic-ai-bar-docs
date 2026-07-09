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

### Tool execution

- Register explicit tools with schemas and risk classes.
- Validate tool arguments using a structured schema.
- Separate read-only execution from mutating proposal creation.
- Give each side-effect class a dedicated preview and executor.
- Keep unrestricted shell execution outside the generic approval path.

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


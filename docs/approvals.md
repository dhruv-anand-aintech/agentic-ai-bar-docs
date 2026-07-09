# Approval flow

Approval is a binding authorization for one previously stored operation. It is not a confirmation dialog wrapped around arbitrary input.

## File-change lifecycle

1. **Propose**: the agent supplies a workspace-relative path, desired content or deletion, and rationale.
2. **Validate**: the server resolves the path beneath its configured root, rejects denied paths and symlink escapes, checks size limits, and records the current file hash.
3. **Present**: the UI renders action, risk, target, rationale, diff, and expiry.
4. **Decide**: an authenticated endpoint accepts only the stored proposal ID and `approved` or `rejected`.
5. **Revalidate**: apply checks the approval state, expiry, target path, symlinks, and original file hash again.
6. **Apply once**: the executor creates a backup where applicable, writes atomically, and consumes the approval.
7. **Audit**: the final record includes actor, timestamps, result, and any safe error description.

```js
const request = await approvals.proposeFileChange({
  path: "config/retention.json",
  content: JSON.stringify({ days: 30 }, null, 2) + "\n",
  rationale: "Match the operator's approved retention policy",
  sessionId,
  runId,
});
```

## Decision endpoint

The browser must never send replacement operation arguments with its decision:

```ts
type ApprovalDecisionBody = {
  approvalId: string;
  decision: "approved" | "rejected";
};
```

The host should authenticate the request, authorize access to the request's session, enforce same-origin or CSRF protection, rate-limit decisions, then call `decide(approvalId, decision, actorId)`.

## Risk display

| Risk | Typical operation | UI expectation |
| --- | --- | --- |
| Medium | Create a new non-sensitive workspace file | Diff and explicit decision |
| High | Update or delete an existing file | Strong target labeling and expiry |
| Critical | Broad, external, or irreversible side effect | Separate executor and stronger policy; file approval alone is insufficient |

## What file approvals do not authorize

- Arbitrary shell commands
- Network requests to user-supplied destinations
- Writes outside the configured root
- Secret or credential changes
- Recursive directory deletion
- A later operation whose content differs from the stored proposal

Each new side-effect class needs its own structured proposal schema, validator, preview, and executor. Shell execution in particular needs an argv allowlist or OS-level sandbox; a generic approval prompt does not make it safe.


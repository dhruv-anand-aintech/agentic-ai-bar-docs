---
title: Approvals and continuation
description: Bind decisions to exact tool operations and consume authorization once before execution.
---

# Approvals and continuation

An approval authorizes one exact, previously presented operation. It is not a generic confirmation prompt around mutable arguments.

Agentic AI Bar v0.2.0 has two related approval layers:

- `tool-runtime` manages continuation parts and exact one-time authorization for arbitrary structured tool calls.
- `approval-server` is the Node-only file proposal store and executor with workspace, stale-file, backup, and atomic-write checks.

## Tool approval lifecycle

1. Validate the proposed tool name and JSON input.
2. Call `addToolApprovalRequest`; it computes a stable fingerprint from the name and canonicalized input.
3. Persist the returned state and emit the returned `tool-approval-request` part.
4. An authenticated user approves or rejects by approval ID.
5. Call `decideToolApproval` and persist its `tool-approval-response` continuation part.
6. Immediately before execution, call `consumeApprovedTool` with the same tool name and input.
7. Execute only from the consumed authorization record. Persist the consumed state and audit result.

```ts
import {
  addToolApprovalRequest,
  consumeApprovedTool,
  createToolApprovalState,
  decideToolApproval,
} from "@ainorthstar/agentic-ai-bar/tool-runtime";

let state = createToolApprovalState();
const request = addToolApprovalRequest(state, {
  approvalId: "approval-demo-2",
  toolCallId: "call-demo-2",
  toolName: "update-record",
  input: { recordId: "record-demo-8", owner: "team-demo" },
  summary: "Assign the fictional record",
  risk: "medium",
  createdAt: new Date().toISOString(),
});
state = request.state;

state = decideToolApproval(state, {
  approvalId: request.part.approvalId,
  decision: "approved",
  decidedAt: new Date().toISOString(),
}).state;

const consumed = consumeApprovedTool(
  state,
  request.part.approvalId,
  request.part.toolName,
  request.part.input,
);
state = consumed.state;
```

`canInvokeApprovedTool` is only a status helper. Executors must call `consumeApprovedTool`. A mismatched name or input, missing or rejected decision, or replayed approval raises a structured authorization error. An exact rejected fingerprint is remembered so the agent cannot repeatedly ask for the same denied operation.

Persist continuation state with the thread or run. In-memory state alone is insufficient across server restarts or multiple replicas.

## Decision endpoint

The browser decision body should contain no replacement tool arguments:

```ts
type ApprovalDecisionBody = {
  approvalId: string;
  decision: "approved" | "rejected";
};
```

The host authenticates the actor, authorizes access to the request's thread/run, enforces same-origin or CSRF protection, rate-limits decisions, and writes the decision once.

## Node file changes

For file operations, `createAgenticApprovalStore` adds workspace-specific checks:

1. Propose a workspace-relative path, desired content or deletion, and rationale.
2. Resolve beneath the configured root, reject denied paths and symlink escapes, enforce size limits, and record the current file hash.
3. Present action, target, rationale, diff, risk, and expiry.
4. Decide by stored proposal ID only.
5. Revalidate approval, expiry, path, symlinks, and original hash.
6. Create a backup where applicable, apply atomically, and consume once.

```js
import { createAgenticApprovalStore } from "@ainorthstar/agentic-ai-bar/approval-server";

const approvals = await createAgenticApprovalStore({ root: process.cwd() });
const proposal = await approvals.proposeFileChange({
  path: "config/example-policy.json",
  content: JSON.stringify({ reviewWindowDays: 14 }, null, 2) + "\n",
  rationale: "Apply the fictional review window requested by the operator",
});
```

## Not authorized

Neither approval layer by itself authorizes unrestricted shell commands, arbitrary outbound network requests, writes outside the configured root, credential changes, recursive deletion, or a later operation whose arguments differ from the stored request. Each side-effect class needs a schema, validator, preview, policy, and narrow executor.

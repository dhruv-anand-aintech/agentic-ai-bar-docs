# Threads, background runs, and sync

## Durable threads

`AgenticThreadStore` defines persistence operations for threads and message branches. `InMemoryAgenticThreadStore` is a reference implementation for tests, demos, and single-process integrations.

```ts
import { InMemoryAgenticThreadStore } from "@ainorthstar/agentic-ai-bar/thread-runtime";

const threads = new InMemoryAgenticThreadStore();
let thread = await threads.create({ title: "Fictional policy review" });

thread = await threads.appendMessage(thread.id, {
  role: "user",
  content: "Review record DEMO-7",
}, { expectedVersion: thread.version });

thread = await threads.appendMessage(thread.id, {
  role: "assistant",
  content: "The fictional record needs one correction.",
}, { expectedVersion: thread.version });

thread = await threads.regenerate(
  thread.id,
  thread.activeLeafId!,
  "The fictional record needs a date correction.",
  { expectedVersion: thread.version },
);

const activeBranch = await threads.getActiveBranch(thread.id);
```

Edits and regenerations append replacement messages instead of overwriting history. `selectBranch` chooses the active leaf; `listAlternatives` finds sibling branches. Mutations accept `expectedVersion` for optimistic concurrency. `serialize` and `hydrate` provide a versioned snapshot boundary, but applications should implement the same interface over a durable database for production.

Thread methods also cover pagination, resume, cancellation, active-branch reads, and metadata. Authorize thread ownership before every operation.

## Background runs

`AgenticBackgroundRunStore` models queued, running, detached, paused, completed, failed, and cancelled states. The in-memory implementation enforces lifecycle transitions and optimistic versions.

```ts
import { InMemoryAgenticBackgroundRunStore } from "@ainorthstar/agentic-ai-bar/background-runs";

const runs = new InMemoryAgenticBackgroundRunStore();
let run = await runs.create({ threadId: "thread-demo-1" });
run = await runs.start(run.id, run.version);
run = await runs.checkpoint(run.id, {
  label: "fictional-batch-25",
  cursor: "cursor-demo-25",
  state: { processed: 25 },
}, run.version);
run = await runs.detach(run.id, run.version);
```

Checkpoints are application state, not automatic process snapshots. Keep them small, serializable, non-secret, and safe to replay. Durable workers should make steps idempotent and persist status before acknowledging work.

## Remote runs

`AgenticRemoteRunner` is a host-implemented contract for starting, inspecting, streaming, detaching, resuming, and cancelling a remote run. Start requests require an idempotency key. Lifecycle mutations require an expected version; resumable systems may issue an opaque resume token.

The client must treat resume tokens as credentials and avoid logging or exposing them in browser URLs.

## Synchronization

`AgenticSyncAdapter` defines paged pull and idempotent push operations for versioned records. A sync version carries a revision, origin, update time, and optional ETag.

```ts
import { resolveSyncConflict } from "@ainorthstar/agentic-ai-bar/sync-adapter";

const resolution = resolveSyncConflict(conflict, "manual");
if (resolution.action === "unresolved") {
  // Present both fictional versions to an authorized operator.
}
```

Conflict strategies are `local-wins`, `remote-wins`, `newest-wins`, and `manual`. `newest-wins` remains unresolved when timestamps are invalid or tied. For high-value or destructive data, prefer manual or domain-aware merging over clock-based selection.

## Production persistence requirements

- Authenticate and authorize every thread/run/sync operation.
- Enforce optimistic versions transactionally in the database.
- Make remote start and sync push idempotency keys unique per authenticated scope.
- Retain ordered events long enough to support reconnect and audit requirements.
- Encrypt sensitive state and define deletion/retention policy.
- Use distributed leases or queue semantics for multi-worker execution.
- Do not rely on in-memory stores across processes or restarts.

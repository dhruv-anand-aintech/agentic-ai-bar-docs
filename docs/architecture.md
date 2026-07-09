# Architecture and events

Agentic AI Bar is a presentation and protocol layer between an application, provider adapters, agent tools, and a human operator. Provider requests and privileged execution stay behind host-controlled boundaries.

```text
Browser / React Native
  composer | timeline | tool parts | approvals | artifacts | voice
                              |
                              v
Authenticated host API / Worker / local agent
  threads | v0.2 events | policy | trace redaction | run control
             |                       |                |
             v                       v                v
      provider runtime         tool executors    persistence / sync
```

## Responsibilities

### UI package

- Renders prompts, models, run progress, sources, tools, approvals, artifacts, telemetry, and voice controls.
- Captures explicit decisions and control-policy choices.
- Does not hold provider credentials or execute privileged tools.

### Host application

- Authenticates users and authorizes access to threads, runs, events, artifacts, and approvals.
- Resolves catalog IDs to trusted adapters and credentials.
- Persists threads, background runs, events, and audit records using application infrastructure.
- Registers tool schemas, classifies risk, validates arguments, and owns executors.
- Redacts traces before storage or delivery to the UI.

### Runtime modules

- Provider runtime: native request serialization, model discovery, capability validation, normalized results and errors.
- Event runtime: versioned envelopes, validation, SSE/WebSocket/async-iterable parsing, and reconnect helpers.
- Thread runtime: optimistic versioning, branches, serialize/hydrate, resume, and cancellation.
- Background and sync runtime: checkpoints, lifecycle transitions, remote-run contracts, synchronization, and conflict policy.

## Event protocol

`AGENTIC_EVENT_PROTOCOL_VERSION` is `"0.2"`. Every event includes:

```ts
type EventEnvelope = {
  protocolVersion: "0.2";
  eventId: string;
  runId: string;
  threadId?: string;
  sequence: number;
  timestamp: string;
  metadata?: Readonly<Record<string, unknown>>;
};
```

The shipped event union covers:

| Area | Event types |
| --- | --- |
| Text and reasoning | `text.delta`, `reasoning.delta` |
| Tools | `tool.input.delta`, `tool.result` |
| Approval | `approval.requested`, `approval.resolved` |
| Artifacts | `artifact.created`, `artifact.updated` |
| Metering | `usage` |
| Failure | `error`, `run.failed` |
| Run lifecycle | `run.created`, `run.started`, `run.paused`, `run.detached`, `run.resumed`, `run.completed`, `run.cancelled` |

Create ordered events at the trusted runtime boundary:

```ts
import { createAgenticEventFactory } from "@ainorthstar/agentic-ai-bar/runtime-events";

const events = createAgenticEventFactory({ runId: "run-demo-1", threadId: "thread-demo-1" });

const started = events.create({ type: "run.started", status: "running" });
const delta = events.create({ type: "text.delta", messageId: "message-demo-1", delta: "Review" });
```

Parse untrusted serialized events with `parseAgenticEvent`. Consume transports with `agenticEventsFromSse`, `agenticEventsFromWebSocket`, or `agenticEventsFromAsyncIterable`. Reconnect support resumes after an observed sequence; the durable event source must retain and replay ordered events.

## Run flow

1. The composer submits a prompt, catalog model ID, attachments, and policy.
2. The host resolves the model and validates explicit capability limits.
3. The provider adapter produces a normalized completion or the host streams v0.2 events.
4. Read-only tools may run under policy. Mutations create exact approval requests.
5. The host records the decision; execution consumes the matching approval once.
6. Results, artifacts, usage, and terminal run state are emitted and persisted.

## Deployment shapes

| Shape | Suitable for | Constraint |
| --- | --- | --- |
| Browser + app server | SaaS and internal tools | Secrets and executors stay server-side |
| Browser + Cloudflare Worker | Edge feedback and streaming | Filesystem operations need a separate trusted executor |
| Local web UI + local agent | Workspace automation | Scope the root, process permissions, and approval policy |
| React Native + API | Mobile support and field workflows | Host supplies native screenshot and voice services |

The package supplies in-memory stores for integration and testing, not a production database, queue, distributed lock, or security sandbox.

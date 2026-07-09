---
title: Events and streaming
description: Canonical run events over SSE, WebSocket, and async iterables with validation and replay-safe reconnects.
---

# Events and streaming

`AGENTIC_EVENT_PROTOCOL_VERSION` is `"0.2"`. Every event carries a stable ID, run ID, sequence, timestamp, and optional thread context. Consumers must reject unknown protocol versions and malformed type-specific payloads before rendering or persistence.

## Event families

| Area | Event types |
| --- | --- |
| Run lifecycle | `run.created`, `run.started`, `run.paused`, `run.detached`, `run.resumed`, `run.completed`, `run.failed`, `run.cancelled` |
| Output | `text.delta`, `reasoning.delta` |
| Tools | `tool.input.delta`, `tool.result` |
| Human control | `approval.requested`, `approval.resolved` |
| Artifacts | `artifact.created`, `artifact.updated` |
| Metering and failure | `usage`, `error` |

## Create ordered events

```ts
import { createAgenticEventFactory } from "@ainorthstar/agentic-ai-bar/runtime-events";

const events = createAgenticEventFactory({
  runId: "run-demo-events",
  threadId: "thread-demo-events",
});

const started = events.create({ type: "run.started", status: "running" });
const delta = events.create({
  type: "text.delta",
  messageId: "message-demo",
  delta: "Fictional result",
});
```

Create events at the trusted runtime boundary, not from browser-supplied envelopes.

## Transport adapters

The event module exposes equivalent readers for SSE, WebSocket, and async iterables. The SSE parser handles chunk boundaries and multiline data. Reconnect helpers resume after the last accepted sequence, discard replayed events, and fail closed on gaps.

```ts
for await (const event of agenticEventsFromSse(response.body!)) {
  persistValidatedEvent(event);
}
```

Use an abort signal for navigation, cancellation, and shutdown. Persist the last accepted sequence transactionally with the event to avoid advancing a reconnect cursor without storing the data.

## Delivery contract

- Event IDs are globally unique within the host's retention window.
- Sequence numbers are strictly increasing within a run.
- Replayed sequences are idempotent; gaps require recovery rather than silent skipping.
- Usage values are nonnegative telemetry, not billing authority.
- Tool results, provider errors, and metadata are untrusted and may contain sensitive data.

See the [runtime example source](https://github.com/dhruv-anand-aintech/agentic-ai-bar-docs/blob/main/examples/runtime-events.ts) and [architecture](./architecture).


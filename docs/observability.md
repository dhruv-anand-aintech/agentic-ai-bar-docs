---
title: Observability
description: Normalize traces, usage, cost, retries, cache behavior, and latency while redacting sensitive attributes.
---

# Observability

The observability module models provider-neutral spans, usage, estimated cost, cache behavior, retries, latency, and run attributes without requiring a telemetry vendor.

```ts
import { redactRunTrace, summarizeRunObservability } from "@ainorthstar/agentic-ai-bar/observability";

const safeTrace = redactRunTrace(trace, {
  attributeKeys: ["authorization", "api_key", "cookie"],
  replacement: "[redacted]",
  redactRequestIds: true,
});

const summary = summarizeRunObservability(safeTrace);
```

Redact before persistence, export, and UI delivery. A denied-key list cannot identify every sensitive prompt, URL, provider error, or tool result; avoid collecting unnecessary values and add domain-specific transforms.

`summarizeRunObservability` produces the compact input used by `AgenticRunObservability`. Estimated cost is telemetry rather than billing authority. Provider invoices remain the source of truth.

See the [fictional observability example](https://github.com/dhruvanand-aintech/agentic-ai-bar-docs/blob/main/examples/observability-voice.ts).


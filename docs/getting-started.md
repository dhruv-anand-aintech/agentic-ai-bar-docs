---
title: Getting started
description: Install the private package, select a narrow export, and connect it to a trusted host.
---

# Getting started

Agentic AI Bar is distributed to authorized private consumers. The public repository documents the integration contract and contains fictional examples; it does not contain the package implementation.

## Prerequisites

- Node.js 20 or newer for server and build tooling.
- React 18 or newer when using the React exports.
- A trusted server, Worker, or local agent for provider credentials and tool execution.
- Application-owned authentication, authorization, persistence, and audit storage.

## Choose the smallest export

Existing applications can keep the v0.1 root, React, React Native, Worker, and approval-server imports. New v0.2 capabilities use additive subpaths:

```ts
import { createAgenticRuntime, liteLLM } from "@ainorthstar/agentic-ai-bar/provider-runtime";
import { createAgenticEventFactory } from "@ainorthstar/agentic-ai-bar/runtime-events";
import { InMemoryAgenticThreadStore } from "@ainorthstar/agentic-ai-bar/thread-runtime";
```

This keeps unused provider, persistence, voice, and UI code out of existing bundles.

## Connect a gateway

```ts
const runtime = createAgenticRuntime(liteLLM({
  baseURL: process.env.LITELLM_BASE_URL!,
  apiKey: process.env.LITELLM_API_KEY,
}));

const models = await runtime.listModels();
const result = await runtime.complete({
  model: models[0].id,
  text: "Summarize the fictional review record",
});
```

Keep `baseURL`, headers, and credentials in trusted configuration. Never let a browser select an arbitrary gateway URL.

## Add the React surface

```tsx
import { AgenticComposer, AgenticStageTimeline } from "@ainorthstar/agentic-ai-bar/react";
import { AgenticToolPartView } from "@ainorthstar/agentic-ai-bar/react-runtime";
import "@ainorthstar/agentic-ai-bar/react.css";
import "@ainorthstar/agentic-ai-bar/react-runtime.css";
```

The host supplies controlled state and authenticated callbacks. Rendering an approval control never authorizes a tool by itself.

## Continue

- [Understand the trust boundary](./architecture)
- [Configure providers and catalogs](./providers)
- [Stream canonical runtime events](./events)
- [Implement exact approvals](./approvals)
- [Review package exports](./api)


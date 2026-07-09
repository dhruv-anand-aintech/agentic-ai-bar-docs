---
title: Provider adapters
description: OpenAI, Anthropic, OpenAI-compatible, and LiteLLM adapters with normalized catalogs and results.
---

# Provider adapters

Agentic AI Bar v0.2.0 treats OpenAI Responses, OpenAI Chat Completions, native Anthropic Messages, and OpenAI-compatible gateways as first-class transports. The runtime normalizes catalog discovery, capability validation, completion results, usage, tool calls, and errors without pretending the wire protocols are identical.

Import the provider runtime from its dedicated subpath:

```ts
import {
  anthropicMessages,
  createAgenticRuntime,
  liteLLM,
  openAIChatCompletions,
  openAICompatible,
  openAIResponses,
} from "@ainorthstar/agentic-ai-bar/provider-runtime";
```

## Adapters

```ts
const responses = openAIResponses({ apiKey: process.env.OPENAI_API_KEY });
const chat = openAIChatCompletions({ apiKey: process.env.OPENAI_API_KEY });
const messages = anthropicMessages({ apiKey: process.env.ANTHROPIC_API_KEY });

const compatible = openAICompatible({
  baseURL: process.env.COMPATIBLE_API_BASE_URL!,
  apiKey: process.env.COMPATIBLE_API_KEY,
  transport: "openai-chat-completions",
});

// One adapter line for LiteLLM.
const gateway = liteLLM({
  baseURL: process.env.LITELLM_BASE_URL!,
  apiKey: process.env.LITELLM_API_KEY,
});
```

All values above must be supplied by trusted server configuration. Do not accept `baseURL`, headers, or API keys from the browser.

## Runtime and catalog

```ts
const runtime = createAgenticRuntime(gateway, {
  catalogTtlMs: 300_000,
  overrides: [
    {
      id: "support-fast",
      label: "Support Fast",
      inputModalities: ["text"],
      outputModalities: ["text"],
      tools: true,
    },
  ],
});

const catalog = await runtime.listModels();
const model = await runtime.getModel("support-fast");

runtime.validateInput(model, {
  inputModalities: ["text"],
  tools: true,
  inputTokens: 2_000,
  outputTokens: 500,
});
```

A normalized model records its stable ID, label, provider, upstream model, supported transports, input and output modalities, tool/structured-output/reasoning support, context and output limits, pricing metadata, deprecation state, and raw provider metadata. Overrides let the host repair or enrich incomplete discovery results without putting routing rules in UI code.

Catalog methods cache by default. Use `listModels({ forceRefresh: true })`, `getModel(id, { forceRefresh: true })`, or `clearCatalogCache()` when trusted configuration changes.

## Non-streaming completion

```ts
const result = await runtime.complete({
  model: "support-fast",
  system: "Use only the supplied fictional policy notes.",
  text: "Summarize the review state.",
  tools: [
    {
      name: "lookup-review",
      description: "Read a fictional review record",
      inputSchema: {
        type: "object",
        properties: { recordId: { type: "string" } },
        required: ["recordId"],
      },
    },
  ],
});

console.log(result.text, result.toolCalls, result.usage);
```

The completion surface is intentionally non-streaming. Provider streams should be translated into the [v0.2 event protocol](./events) by the host so UI and persistence code remain provider-neutral.

## Errors

Provider failures are normalized as `AgenticProviderError` with a stable `code`, provider, HTTP status where available, retryability, and optional details. Stable codes include authentication, authorization, invalid request, model not found, rate limit, timeout, network, unsupported capability, and provider errors.

Treat `details` as sensitive. Redact it before persistence or display.

## Protocol choice

| Transport | Use when |
| --- | --- |
| OpenAI Responses | Native response items, Responses lifecycle, structured output, or built-in tool concepts are required |
| OpenAI Chat Completions | The model or gateway is centered on messages and choices |
| Anthropic Messages | Native Anthropic content blocks, tools, and usage semantics matter |
| OpenAI-compatible | A trusted gateway implements the expected endpoint closely enough for the selected feature set |

Compatibility is a transport choice, not proof of feature equivalence. Validate every capability used by the application, especially streaming events, tool schemas, structured output, reasoning controls, and usage fields.

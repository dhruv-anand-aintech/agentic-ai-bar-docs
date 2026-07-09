# Provider adapters

Provider support should normalize orchestration without erasing meaningful protocol differences. OpenAI Responses, OpenAI Chat Completions, and Anthropic Messages are distinct transports. OpenAI-compatible gateways reuse the Chat Completions request path with configurable routing.

> The adapter contract and catalog below are reference designs for host applications. The public examples build request objects but make no network calls.

## Normalized catalog

Keep catalog data independent of credentials and UI code:

```ts
type ModelCatalogEntry = {
  id: string;
  label: string;
  provider: "openai" | "anthropic" | "gateway" | string;
  transport: "openai-responses" | "openai-chat-completions" | "anthropic-messages";
  upstreamModel?: string;
  capabilities: Array<"text" | "vision" | "tools" | "reasoning" | "json">;
  contextWindow?: number;
  maxOutputTokens?: number;
  baseURL?: string;
};
```

The UI sends the catalog `id`. The trusted host resolves it to `transport`, `upstreamModel`, credentials, and limits. Do not accept arbitrary base URLs or provider keys from browser input.

## Transport contract

A host adapter should provide three small operations:

```ts
interface ProviderAdapter {
  buildRequest(input: NormalizedRunInput, model: ModelCatalogEntry): ProviderRequest;
  parseStream(chunk: Uint8Array): NormalizedAgentEvent[];
  normalizeError(error: unknown): NormalizedProviderError;
}
```

Normalized events should distinguish at least `text.delta`, `text.done`, `tool.call`, `tool.result`, `usage`, `error`, and `run.done`. Preserve provider event IDs and raw event types in metadata for debugging.

## OpenAI Responses

Use Responses when the selected model and workflow benefit from its native input items, response lifecycle, built-in tool concepts, or multi-modal request structure. See [the mock request builder](../examples/openai-responses.ts).

## OpenAI Chat Completions

Use Chat Completions for models and gateways centered on the messages-and-choices protocol. See [the mock request builder](../examples/openai-chat-completions.ts).

## Anthropic Messages

Use Anthropic's native Messages protocol for Anthropic models when native semantics, content blocks, tool-use events, and usage fields matter. The OpenAI compatibility endpoint can reduce migration work, but it should not be treated as production-equivalent to Messages without testing every required feature. See [the mock request builder](../examples/anthropic-messages.ts).

## LiteLLM and compatible gateways

Gateway routing should be configuration, not a new UI branch:

```ts
const gateway = openAICompatible({ baseURL: process.env.LITELLM_BASE_URL!, apiKey: process.env.LITELLM_API_KEY! });
```

Catalog entries can then point to gateway model aliases while the adapter remains `openai-chat-completions`. See [the LiteLLM mock](../examples/litellm-gateway.ts).

## Capability gating

Before a run, validate the requested input against catalog capabilities:

- Disable image attachments when `vision` is absent.
- Exclude tools when `tools` is absent.
- Enforce context and output limits server-side.
- Do not infer JSON-schema support from generic tool support.
- Treat reasoning controls as transport-specific optional metadata.

Catalog values are operational configuration. Version them, log the resolved entry ID, and expose a safe catalog endpoint rather than shipping credentials or internal routing rules to the browser.


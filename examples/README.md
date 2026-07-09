# Mock examples

These files are public documentation fixtures. They contain fictional identifiers and data, build local objects only, and never call `fetch`, provider SDKs, private endpoints, or external APIs.

## Provider request fixtures

| Example | Protocol |
| --- | --- |
| [`openai-responses.ts`](openai-responses.ts) | OpenAI Responses request shape |
| [`openai-chat-completions.ts`](openai-chat-completions.ts) | OpenAI Chat Completions request shape |
| [`anthropic-messages.ts`](anthropic-messages.ts) | Native Anthropic Messages request shape |
| [`litellm-gateway.ts`](litellm-gateway.ts) | LiteLLM through an OpenAI-compatible base URL |

The shared [`provider-contract.ts`](provider-contract.ts) is an independent mock contract. The private v0.2 package ships the production provider runtime described in [Provider adapters](../docs/providers.md); no library implementation is copied here.

## Runtime use cases

| Example | Demonstrates |
| --- | --- |
| [`runtime-events.ts`](runtime-events.ts) | Ordered v0.2 run and usage events |
| [`thread-branching.ts`](thread-branching.ts) | Append-only message editing and branch selection |
| [`tool-approval-continuation.ts`](tool-approval-continuation.ts) | Exact one-time tool authorization |
| [`artifact-ag-ui.ts`](artifact-ag-ui.ts) | Versioned artifact plus sandboxed MCP App resource |
| [`observability-voice.ts`](observability-voice.ts) | Redacted telemetry summary and voice reducer |

Runtime examples show authorized package imports for documentation. They are illustrative integration code, not bundled library source. Provider keys remain server-side in all real deployments.

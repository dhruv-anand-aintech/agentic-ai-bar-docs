# Mock provider examples

These examples are documentation fixtures. They build request descriptions and never call `fetch`, provider SDKs, or external APIs.

| Example | Protocol |
| --- | --- |
| [`openai-responses.ts`](openai-responses.ts) | OpenAI Responses |
| [`openai-chat-completions.ts`](openai-chat-completions.ts) | OpenAI Chat Completions |
| [`anthropic-messages.ts`](anthropic-messages.ts) | Native Anthropic Messages |
| [`litellm-gateway.ts`](litellm-gateway.ts) | LiteLLM through an OpenAI-compatible base URL |

The shared [`provider-contract.ts`](provider-contract.ts) defines a small request-only contract suitable for evaluating catalog and adapter design. Replace these fixtures with authenticated server-side clients in a real host application.


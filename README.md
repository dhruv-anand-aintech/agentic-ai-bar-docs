# Agentic AI Bar

Documentation and integration examples for an embeddable agent command surface: model selection, streaming runs, trace timelines, citations, screenshot-based site feedback, and server-enforced approvals.

> [!IMPORTANT]
> This is the public documentation repository. The library implementation and production applications are maintained in private repositories. Every screenshot and data sample here is invented.

![Agent console with a model selector, trace timeline, and cited answer](assets/agent-console.png)

## What it provides

- **Composable React surfaces** for prompts, attachments, mentions, citations, sessions, traces, modalities, voice I/O, and approval decisions.
- **Reference provider contracts** for OpenAI Responses, OpenAI Chat Completions, native Anthropic Messages, and OpenAI-compatible gateways.
- **A proposed normalized model catalog** that keeps transport, capabilities, context limits, and gateway routing out of UI code.
- **Approval-bound file changes** with immutable proposals, expiry, one-time decisions, stale-file checks, backups, and atomic writes.
- **Site feedback controls** that capture a viewport, annotate it, attach diagnostics, and report progress without handing the browser unrestricted control.
- **Shared web, Worker, CLI, and React Native concepts** around one event and policy model.

## Integration map

| Need | Surface |
| --- | --- |
| Prompt, models, attachments, mentions | `AgenticComposer` |
| Run progress | `AgenticStageTimeline` |
| Sources | `AgenticCitationList` |
| Tool and model trace | `AgenticTracePanel` |
| Human authorization | `AgenticApprovalPanel` + server approval store |
| Screenshot feedback | `AgenticSiteFixButton` |
| Autonomy controls | `AgenticSiteControlPanel` |
| Worker ingestion | `handleSiteFixLogIngest`, `handleSiteFixStatus` |
| React Native feedback | `AgenticSiteFixButtonNative` |

## Quick start

The package is currently distributed privately. Authorized consumers can install it through the configured package registry, then compose only the surfaces they need:

```tsx
import { useState } from "react";
import {
  AgenticApprovalPanel,
  AgenticComposer,
  AgenticStageTimeline,
} from "@ainorthstar/agentic-ai-bar/react";
import "@ainorthstar/agentic-ai-bar/react.css";

export function SupportAgent() {
  const [prompt, setPrompt] = useState("");

  return (
    <main>
      <AgenticStageTimeline stages={[]} />
      <AgenticApprovalPanel requests={[]} onDecision={console.log} />
      <AgenticComposer
        value={prompt}
        onChange={setPrompt}
        onSubmit={() => console.log({ prompt })}
        models={[]}
      />
    </main>
  );
}
```

Host applications own authentication, conversation persistence, provider credentials, tool execution, and decision endpoints. The bar supplies reusable UI and protocol helpers; it is not an autonomous runtime or security sandbox.

## Provider adapter reference design

The current package exports model/request helpers for its existing OpenAI-oriented transports. The catalog and native Anthropic/gateway adapters below are a reference design for the broader provider surface, not a claim that those adapters ship today.

Treat provider protocols as first-class transports instead of hiding every service behind a lowest-common-denominator schema:

```ts
const catalog = [
  { id: "reasoning-large", provider: "openai", transport: "openai-responses", capabilities: ["text", "vision", "tools"] },
  { id: "chat-fast", provider: "openai", transport: "openai-chat-completions", capabilities: ["text", "tools"] },
  { id: "analysis-pro", provider: "anthropic", transport: "anthropic-messages", capabilities: ["text", "vision", "tools"] },
] as const;
```

In the reference design, an OpenAI-compatible gateway such as LiteLLM becomes a single configuration line while retaining the model catalog:

```ts
const gateway = openAICompatible({ baseURL: process.env.LITELLM_BASE_URL!, apiKey: process.env.LITELLM_API_KEY! });
```

See [Provider adapters](docs/providers.md) and the request-only [mock examples](examples/README.md). Native Anthropic Messages is documented separately; Anthropic's OpenAI compatibility layer is useful for migrations but is not presented as behaviorally equivalent to the native API.

## Approval flow

![A file-change proposal with a diff and explicit Reject and Approve once actions](assets/approval-flow.png)

```js
import { createAgenticApprovalStore } from "@ainorthstar/agentic-ai-bar/approval-server";

const approvals = await createAgenticApprovalStore({ root: process.cwd() });
const proposal = await approvals.proposeFileChange({
  path: "config/retention.json",
  content: "{\n  \"days\": 30\n}\n",
  rationale: "Apply the retention period requested by the operator",
});

// The authenticated host decides using only the proposal id and decision.
approvals.decide(proposal.id, "approved", "operator-42");
await approvals.apply(proposal.id);
```

The server stores the exact operation before approval. A decision cannot replace its path, content, or action. Applying a request revalidates the target and consumes approval once. Read [Approval flow](docs/approvals.md) before exposing write tools.

## Documentation

- [Architecture](docs/architecture.md)
- [Provider adapters and model catalog](docs/providers.md)
- [Approval flow](docs/approvals.md)
- [React and platform components](docs/components.md)
- [Security model](docs/security.md)
- [Mock provider examples](examples/README.md)

## Repository scope

This repository intentionally contains only documentation, independent mock request builders, and screenshots rendered from fictional data. It contains no library implementation, production data, traces, credentials, customer identifiers, or internal filesystem paths.

## License

Documentation and mock examples in this repository are available under the [MIT License](LICENSE).

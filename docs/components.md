# Components

Import web components from `@ainorthstar/agentic-ai-bar/react` and the shared stylesheet from `@ainorthstar/agentic-ai-bar/react.css`.

## Conversation

| Component | Purpose | Key host inputs |
| --- | --- | --- |
| `AgenticComposer` | Prompt, model, images, mentions, keyboard behavior | Controlled value, model catalog, submit handler |
| `AgenticMarkdown` | GFM answer rendering | Markdown text |
| `AgenticCitationList` | Collapsible source list and active-source state | Normalized citations |
| `AgenticMentionPillList` | Context references selected by the user | Mention options and removal handler |

## Runs and observability

| Component | Purpose | Key host inputs |
| --- | --- | --- |
| `AgenticStageTimeline` | Pending, running, complete, and failed stages | Normalized stages |
| `AgenticTracePanel` | Tool and model events | Sanitized trace events |
| `AgenticThreadSidebar` | Thread selection, creation, and sharing | Thread metadata and callbacks |
| `AgenticSessionList` | Runs within a conversation | Session metadata |
| `AgenticModalityBar` | Input, output, tool, and UI channel state | Normalized modality state |
| `AgenticVoiceIOPanel` | Push-to-talk and speech output controls | Host speech services and callbacks |

## v0.2 runtime views

Import the additive runtime components and stylesheet separately:

```tsx
import {
  AgenticArtifactList,
  AgenticRunObservability,
  AgenticToolPartView,
  AgenticVoiceControls,
} from "@ainorthstar/agentic-ai-bar/react-runtime";
import "@ainorthstar/agentic-ai-bar/react-runtime.css";
```

| Component | Purpose | Key host inputs |
| --- | --- | --- |
| `AgenticToolPartView` | Generic structured tool state and exact approval actions | Tool part, optional descriptor, approve/reject callbacks |
| `AgenticArtifactList` | Versioned artifact list with preview/open actions | Artifact manifests and authorized open callback |
| `AgenticRunObservability` | Token, cost, cache, retry, and duration summary | Redacted observability summary |
| `AgenticVoiceControls` | Voice pipeline phase and user controls | Voice state and connect/listen/interrupt callbacks |

Use the separate CSS entry point to avoid changing v0.1 styling implicitly. Approval callbacks must call a trusted endpoint; a rendered button or local state transition is not authorization.

## Human control

| Component | Purpose | Key host inputs |
| --- | --- | --- |
| `AgenticApprovalCard` | One structured proposal and decision actions | Approval request and decision handler |
| `AgenticApprovalPanel` | Pending proposal collection | Requests, busy state, per-request errors |
| `AgenticSiteControlPanel` | Autonomy, run location, scope, and approval policy | Controlled policy and change handler |
| `AgenticSiteFixButton` | Viewport capture, annotation, diagnostics, submission, status | Endpoints, policy, capture and payload hooks |

## Site control policy

The host can expose a normalized policy with:

- control level: `observe`, `diagnose`, `propose`, `personalize`, or `publish`
- run location: browser, edge worker, app server, local agent, or cloud agent
- change scope: personal, team, or global
- user access: none, disable, configure, or compose
- approval requirements, screenshot and diagnostics collection, and automatic-change limits

Global changes should default to global approval. The host remains responsible for enforcement; rendering a policy control is not enforcement by itself.

## Platform exports

- `@ainorthstar/agentic-ai-bar/approval-server`: Node-only file approval store.
- `@ainorthstar/agentic-ai-bar/worker`: Cloudflare Worker site-feedback ingest and status handlers.
- `@ainorthstar/agentic-ai-bar/react-native`: native stage timeline and site-fix button; the host supplies screenshot capture.
- CLI binary: connects to the same agent stream endpoint and records local JSONL run traces.

Runtime data modules are documented in [Architecture](architecture.md), [Runtime](runtime.md), [Tools and artifacts](tools-and-artifacts.md), and [Observability and voice](observability-and-voice.md).

# Architecture

Agentic AI Bar is a presentation and protocol layer between an application, an agent runtime, and a human operator. It keeps provider-specific request logic and privileged tool execution behind host-controlled boundaries.

```text
Browser / React Native
  composer | timeline | citations | trace | approvals | site feedback
                         |
                         v
Authenticated host API / Worker
  session state | event stream | decision endpoint | diagnostics ingest
                         |
              +----------+----------+
              |                     |
              v                     v
       Provider adapters       Tool registry
       Responses               read tools
       Chat Completions        proposed writes
       Messages                approved executor
       compatible gateways
```

## Responsibilities

### UI package

- Renders input, model selection, run progress, sources, traces, and approvals.
- Captures user intent and optional screenshots or diagnostics.
- Emits explicit decisions and control-policy choices.
- Does not hold provider credentials or execute privileged tools.

### Host application

- Authenticates users and authorizes access to sessions.
- Maps catalog entries to provider transports.
- streams normalized run events to the UI.
- Registers tools and classifies their risk.
- Exposes a narrow decision endpoint that accepts a proposal ID and decision.

### Provider adapter

- Converts normalized input into the provider's native request schema.
- Preserves provider-specific features where the normalized contract allows them.
- Converts stream events into stable text, tool-call, usage, and error events.
- Keeps retry, timeout, and observability policy outside React components.

### Approval store and executor

- Creates an immutable proposal before the user is asked to decide.
- Binds the proposal to the target, operation, content hash, expiry, and actor context.
- Revalidates filesystem state at apply time.
- Creates a backup and applies the approved operation atomically.

## Event flow

1. The composer submits a prompt, selected catalog model, attachments, and policy.
2. The host resolves the catalog entry to a transport and credential scope.
3. The adapter streams normalized events for text, tool calls, usage, and errors.
4. Read-only tools can run under host policy. Mutating tools create proposals.
5. The UI renders proposal details; the authenticated decision endpoint records the user's choice.
6. The executor consumes an approved proposal once and streams its result back into the run.

## Deployment shapes

The same UI can front several runtimes:

| Shape | Suitable for | Constraint |
| --- | --- | --- |
| Browser + app server | SaaS and internal tools | Secrets and tools stay server-side |
| Browser + Cloudflare Worker | Lightweight feedback and streaming | Privileged filesystem tools require a separate executor |
| Local web UI + local agent | Workspace automation | Scope the root and preserve user approval |
| React Native + API | Mobile support and field workflows | Supply a native screenshot capture function |

The package does not prescribe a database, agent framework, or queue. These are host concerns connected through narrow event, provider, and approval contracts.


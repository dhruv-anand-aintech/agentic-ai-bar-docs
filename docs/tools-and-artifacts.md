---
title: Tools, artifacts, AG-UI, and MCP Apps
description: Structured tool states, versioned outputs, generative UI events, and sandboxed MCP App resources.
---

# Tools, artifacts, AG-UI, and MCP Apps

## Structured tool parts

`AgenticToolPart` represents a tool call from streamed input through approval, execution, completion, or failure. `createToolRendererRegistry` lets a host render known tools specially while retaining a safe generic descriptor for unknown tools.

```ts
import { createToolRendererRegistry } from "@ainorthstar/agentic-ai-bar/tool-runtime";

const renderers = createToolRendererRegistry({
  "lookup-review": (part) => ({
    kind: "review-result",
    title: "Fictional review lookup",
    status: part.status,
    record: part.output,
  }),
});

const view = renderers.resolve({
  type: "tool",
  toolCallId: "call-demo-3",
  toolName: "lookup-review",
  input: { recordId: "record-demo-9" },
  status: "running",
});
```

Tool inputs and outputs remain untrusted. Validate them before rendering and executing; avoid rendering returned HTML directly.

## Versioned artifacts

Artifact manifests describe documents, spreadsheets, charts, images, audio, video, code, or application-defined outputs. They include version, previews, downloads, lineage, metadata, creation time, and optional creator information.

```ts
import { createArtifactManifest, nextArtifactVersion } from "@ainorthstar/agentic-ai-bar/artifacts";

const report = createArtifactManifest({
  artifactId: "artifact-demo-report",
  title: "Fictional review summary",
  kind: "document",
  version: 1,
  createdAt: new Date().toISOString(),
  previews: [{
    kind: "text",
    uri: "/demo/artifacts/review-summary.md",
    mediaType: "text/markdown",
  }],
  metadata: { fixture: true },
});

const revised = nextArtifactVersion(report, {
  createdAt: new Date().toISOString(),
  description: "One fictional correction recorded.",
});
```

Use `selectArtifactPreview` to negotiate a supported preview, `sanitizeArtifactUri` before exposing preview/download links, `artifactVersionKey` for stable identity, and `resolveArtifactLineage` for related outputs. The host must still authorize artifact access and sign private URLs with short expiries.

## AG-UI events

The generative UI module defines a small AG-UI-compatible event union for run state, messages, tool calls, state snapshots/deltas, and custom events. Keep application-defined custom payloads versioned and schema-validated. Never let model output select arbitrary React components, module imports, or executable code.

## MCP App resources

`createMcpAppResourceBridge` registers and resolves explicitly supplied MCP App resources. Each resource includes a URI, media type, content, and sandbox policy. `defaultMcpAppSandbox` starts from a restricted policy.

```ts
import { createMcpAppResourceBridge, defaultMcpAppSandbox } from "@ainorthstar/agentic-ai-bar/generative-ui";

const bridge = createMcpAppResourceBridge();
bridge.register({
  uri: "ui://demo/review-panel",
  name: "Fictional review panel",
  mediaType: "text/html",
  html: "<main><h1>Fictional review</h1></main>",
  sandbox: defaultMcpAppSandbox,
});
```

Registration does not make arbitrary HTML trusted. The shipped default supports scripted MCP Apps but denies external sources and host permissions; remove `allow-scripts` for static resources and tighten the policy for each app. Restrict navigation and network origins, sanitize surrounding metadata, and authorize every resource URI. Never bridge provider credentials, cookies, auth headers, filesystem access, or unrestricted host APIs into the resource.

## React runtime views

Import runtime-oriented components and their separate stylesheet:

```tsx
import {
  AgenticArtifactList,
  AgenticRunObservability,
  AgenticToolPartView,
  AgenticVoiceControls,
} from "@ainorthstar/agentic-ai-bar/react-runtime";
import "@ainorthstar/agentic-ai-bar/react-runtime.css";
```

`AgenticToolPartView` can show exact approve/reject controls when a part is approval-required. Callbacks must invoke an authenticated decision endpoint; UI state alone never authorizes execution.

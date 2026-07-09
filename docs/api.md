---
title: Package exports
description: Public package entry points for v0.2.0 and their intended runtime boundaries.
---

# Package exports

Import narrow subpaths. This makes runtime boundaries explicit and keeps unused capabilities out of existing bundles.

| Export | Environment | Purpose |
| --- | --- | --- |
| `@ainorthstar/agentic-ai-bar` | Browser / Worker | Existing models, request helpers, SSE, browser shell, site-feedback helpers |
| `/react` and `/react.css` | React browser apps | Composer, timelines, citations, approvals, sessions, trace, site feedback |
| `/react-native` | React Native | Native site-feedback and shared stage surfaces |
| `/approval-server` | Node only | Exact file-change proposals, decisions, backups, and atomic application |
| `/worker` | Cloudflare Worker | Site-feedback ingestion and status handlers |
| `/provider-runtime` | Trusted server / Worker | Provider adapters, discovery, capability validation, normalized completion |
| `/runtime-events` | Server and client | Canonical event types and transport readers |
| `/thread-runtime` | Server / tests | Thread-store contract and in-memory reference store |
| `/background-runs` | Server / tests | Background lifecycle and checkpoint contract |
| `/sync-adapter` | Server and sync clients | Version/conflict and remote-run contracts |
| `/tool-runtime` | Trusted host and UI state | Tool parts, renderers, exact approval continuation |
| `/artifacts` | Server and client | Versioned preview/download manifests and lineage |
| `/generative-ui` | Trusted host and sandbox bridge | AG-UI events and MCP App resources |
| `/observability` | Trusted host | Trace normalization, redaction, and summaries |
| `/voice-runtime` | Server and client | Deterministic voice state and transcript correction |
| `/react-runtime` and `/react-runtime.css` | React browser apps | Tool, artifact, telemetry, and voice views |

## Compatibility

v0.2.0 is additive over v0.1.x. Existing entry points remain available. New modules are not re-exported from the root, so upgrading does not implicitly increase current browser or Worker bundles.

See [versioning](./versioning), [components](./components), and [security](./security).


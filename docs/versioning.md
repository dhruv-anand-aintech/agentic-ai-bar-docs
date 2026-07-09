---
title: Versioning and compatibility
description: SemVer, event protocol versions, additive v0.2 exports, and upgrade guidance.
---

# Version and compatibility notes

## v0.2.0

v0.2.0 is an additive minor release over v0.1.x. Existing root, React, React Native, CSS, site-feedback, Worker, and Node approval entry points remain available. New runtime features are isolated behind subpath exports so existing consumers do not pull them into their bundle unless imported.

New subpaths:

- `provider-runtime`
- `runtime-events`
- `thread-runtime`
- `background-runs`
- `sync-adapter`
- `tool-runtime`
- `artifacts`
- `generative-ui`
- `observability`
- `voice-runtime`
- `react-runtime`
- `react-runtime.css`

The event protocol has its own version, `"0.2"`, carried on every event envelope. Package SemVer and event protocol versions are related but independent: applications should reject unsupported event protocol versions explicitly.

## Upgrade guidance

1. Keep existing v0.1 imports unchanged.
2. Add new capabilities through their dedicated subpaths.
3. Persist thread, run, approval, event, artifact, and sync schema versions with stored data.
4. Gate event consumers on `protocolVersion` and handle unknown metadata fields.
5. Run the host application's existing build, typecheck, and mocked tests before rollout.
6. Roll out server adapters and persistence before exposing matching browser controls.

## Capability compatibility

Catalog discovery may omit capability metadata. Unknown capability metadata is allowed because some providers do not publish it. An explicitly unsupported capability fails preflight validation. Hosts that require strict guarantees should add trusted catalog overrides and validate inputs before provider calls.

Normalized non-streaming `complete()` results include text, tool calls, token usage when reported, resolved model, provider, transport, and the raw provider payload. Consumers should use normalized fields for behavior and raw data only for redacted diagnostics.

## Deprecation policy

New runtime APIs are added via subpaths. Breaking changes to an existing public export require a major package version. Event-envelope or persisted-snapshot incompatibilities require explicit protocol/schema version handling even when the package API itself remains source-compatible.

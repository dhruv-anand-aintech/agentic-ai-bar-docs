---
title: Site fixes and feedback
description: Capture annotated website feedback while keeping diagnosis and code changes behind explicit control policy.
---

# Site fixes and feedback

`AgenticSiteFixButton` gives an existing website a reusable feedback surface for viewport capture, annotation, diagnostics, submission, and progress. It does not grant the browser unrestricted filesystem or deployment access.

```tsx
import { AgenticSiteFixButton } from "@ainorthstar/agentic-ai-bar/react";
import "@ainorthstar/agentic-ai-bar/react.css";

<AgenticSiteFixButton
  statusEndpoint="/api/bug-report-status"
  controlPolicy={{
    controlLevel: "propose",
    runLocation: "local-agent",
    changeScope: "global",
    requireApproval: true,
    userCanDisableFeature: true,
  }}
/>
```

## Control policy

The request records what the downstream agent may do:

- control level: observe, diagnose, propose, personalize, or publish
- run location: browser, edge Worker, app server, local agent, or cloud agent
- change scope: personal, team, or global
- user access: none, disable, configure, or compose
- screenshot, diagnostics, approval, and automatic-change limits

The host must enforce the policy again. Browser state is descriptive input, not authorization.

## Data handling

Collect named storage keys by default. Exclude cookies, authorization headers, password fields, unrelated storage, and sensitive globals. Let the user inspect annotations and notes before submission, and define retention for screenshots and diagnostics.

Cloudflare Workers can use the dedicated ingestion/status export. React Native hosts provide their own screenshot capture implementation.

## Turning feedback into a change

1. Authenticate the report and authorize its application/site scope.
2. Reproduce the issue using trusted logs and source context.
3. Store an exact proposed operation.
4. Present the diff or structured change for approval.
5. Recheck current state and consume approval once before applying.
6. Build, test, deploy, and verify the deployed version independently.

See [approvals](./approvals) and the [security model](./security).


---
layout: page
sidebar: false
aside: false
title: Agentic AI Bar
description: Provider-neutral runtime contracts and interface primitives for agents that act safely.
---

<div class="docs-home">
  <section class="docs-home-intro">
    <div class="docs-home-kicker">Private package / public integration contract / v0.2.0</div>
    <h1>Agentic AI Bar</h1>
    <p class="docs-home-lede">Provider-neutral runtime contracts and interface primitives for agents that stream work, call tools, create artifacts, and pause for exact human approval.</p>
    <div class="docs-home-actions">
      <a class="docs-home-primary" href="./getting-started">Start integrating</a>
      <a class="docs-home-secondary" href="./architecture">Read the architecture</a>
    </div>
    <div class="docs-home-command" aria-label="LiteLLM adapter example">
      <span>Gateway in one line</span>
      <code>createAgenticRuntime(liteLLM({ baseURL, apiKey }))</code>
    </div>
  </section>

  <figure class="docs-home-console">
    <img src="/agentic-ai-bar-docs/images/agent-console.png" alt="Agent console showing model selection, run stages, citations, and an answer" width="1200" height="720">
    <figcaption>One surface for provider choice, run progress, sources, tools, and operator control.</figcaption>
  </figure>

  <section class="docs-home-grid" aria-label="Core capabilities">
    <article><span>01</span><h2>Provider portable</h2><p>Use OpenAI Responses, Chat Completions, Anthropic Messages, or a LiteLLM-compatible gateway behind one normalized catalog.</p><a href="./providers">Provider runtime</a></article>
    <article><span>02</span><h2>Durable by design</h2><p>Persist canonical events, branch conversations, checkpoint background runs, and reconnect without duplicating replayed work.</p><a href="./runtime">Threads and runs</a></article>
    <article><span>03</span><h2>Human controlled</h2><p>Bind decisions to the exact presented tool name and input, then consume approval once immediately before execution.</p><a href="./approvals">Approval model</a></article>
  </section>

  <section class="docs-home-boundary">
    <div><span>Library</span><strong>UI, contracts, validation, reducers, adapters</strong></div>
    <div aria-hidden="true" class="docs-home-boundary-line"></div>
    <div><span>Host application</span><strong>Identity, credentials, persistence, executors, policy</strong></div>
  </section>

  <section class="docs-home-approval">
    <div>
      <div class="docs-home-kicker">Side effects require a boundary</div>
      <h2>Approval is an operation, not a button.</h2>
      <p>The UI presents a proposal. The trusted host stores the immutable operation, authenticates the decision, rechecks current state, and consumes authorization once.</p>
      <a href="./security">Review the security model</a>
    </div>
    <img src="/agentic-ai-bar-docs/images/approval-flow.png" alt="Approval request showing a file diff and explicit reject and approve once actions" width="1200" height="720">
  </section>
</div>


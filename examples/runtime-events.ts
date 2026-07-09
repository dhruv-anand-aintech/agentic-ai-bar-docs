import { createAgenticEventFactory } from "@ainorthstar/agentic-ai-bar/runtime-events";

const factory = createAgenticEventFactory({
  runId: "run-demo-events",
  threadId: "thread-demo-events",
});

export const fictionalRunEvents = [
  factory.create({ type: "run.started", status: "running" }),
  factory.create({ type: "text.delta", messageId: "message-demo-events", delta: "Fictional" }),
  factory.create({
    type: "usage",
    inputTokens: 120,
    outputTokens: 18,
    totalTokens: 138,
    costUsd: 0.0004,
    provider: "gateway-demo",
    model: "support-fast",
  }),
  factory.create({ type: "run.completed", status: "completed", result: { reviewed: 1 } }),
];

import { InMemoryAgenticThreadStore } from "@ainorthstar/agentic-ai-bar/thread-runtime";

export async function buildFictionalThread() {
  const store = new InMemoryAgenticThreadStore();
  let thread = await store.create({ id: "thread-demo-branch", title: "Fictional review" });

  thread = await store.appendMessage(thread.id, {
    id: "message-demo-user",
    role: "user",
    content: "Review record DEMO-12",
  }, { expectedVersion: thread.version });

  thread = await store.appendMessage(thread.id, {
    id: "message-demo-answer-a",
    role: "assistant",
    content: "No mock issues found.",
  }, { expectedVersion: thread.version });

  thread = await store.regenerate(
    thread.id,
    "message-demo-answer-a",
    "One fictional date issue found.",
    { expectedVersion: thread.version },
  );

  return {
    thread,
    activeBranch: await store.getActiveBranch(thread.id),
    alternatives: await store.listAlternatives(thread.id, thread.activeLeafId!),
  };
}

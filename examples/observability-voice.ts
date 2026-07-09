import { redactRunTrace, summarizeRunObservability } from "@ainorthstar/agentic-ai-bar/observability";
import { createVoiceState, reduceVoiceState } from "@ainorthstar/agentic-ai-bar/voice-runtime";

const fictionalTrace = {
  schemaVersion: "1.0" as const,
  traceId: "trace-demo",
  runId: "run-demo-trace",
  startedAt: "2030-01-01T12:00:00.000Z",
  completedAt: "2030-01-01T12:00:01.200Z",
  attributes: { environment: "demo", authorization: "Bearer fake-value" },
  spans: [],
};

export const safeSummary = summarizeRunObservability(redactRunTrace(fictionalTrace, {
  attributeKeys: ["authorization"],
  replacement: "[redacted]",
}));

let voice = createVoiceState("asr-agent-tts");
voice = reduceVoiceState(voice, { type: "CONNECT" });
voice = reduceVoiceState(voice, { type: "CONNECTED" });
voice = reduceVoiceState(voice, { type: "START_LISTENING" });

export const fictionalVoiceState = voice;

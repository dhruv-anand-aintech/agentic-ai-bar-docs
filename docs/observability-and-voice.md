# Observability and voice

This former combined page is retained for existing links. The current documentation separates [observability](./observability) from the [voice runtime](./voice).

## Run traces

The observability module models token usage, estimated cost, cache behavior, retries, spans, and run attributes without requiring a specific telemetry vendor.

```ts
import { redactRunTrace, summarizeRunObservability } from "@ainorthstar/agentic-ai-bar/observability";

const safeTrace = redactRunTrace(trace, {
  attributeKeys: ["authorization", "api_key", "cookie"],
  replacement: "[redacted]",
});

const summary = summarizeRunObservability(safeTrace);
```

Redaction must happen before persistence, export, and UI delivery. Configure denied keys for application-specific secrets and personal data. Do not assume a generic list removes sensitive prompt text, tool results, URLs, or provider error details; avoid collecting those fields or transform them with a domain policy first.

`summarizeRunObservability` produces a compact usage/cost/cache/retry/duration summary suitable for `AgenticRunObservability`. Cost is telemetry, not billing authority; provider invoices remain the source of truth.

## Voice state

The voice runtime is a deterministic reducer for ASR, realtime, and ASR-agent-TTS pipelines. It models connecting, listening, transcribing, thinking, speaking, interruption, failure, transcript segments, and fallback behavior.

```ts
import { createVoiceState, reduceVoiceState } from "@ainorthstar/agentic-ai-bar/voice-runtime";

let voice = createVoiceState("asr-agent-tts");
voice = reduceVoiceState(voice, { type: "CONNECT" });
voice = reduceVoiceState(voice, { type: "CONNECTED" });
voice = reduceVoiceState(voice, { type: "START_LISTENING" });
voice = reduceVoiceState(voice, {
  type: "TRANSCRIPT",
  segment: { id: "segment-demo-1", text: "Review the fictional record", final: true },
});
```

The reducer does not capture audio, call an ASR/TTS provider, request microphone permission, or persist transcripts. The host owns those services and maps their lifecycle into reducer events.

## Voice security and accessibility

- Ask for microphone access only after an explicit user action.
- Display listening and speaking state continuously and provide immediate stop/interruption controls.
- Avoid recording by default; disclose retention before capture.
- Treat transcripts as potentially sensitive and apply the same authorization, deletion, and redaction policy as messages.
- Provide text input/output fallbacks and keyboard-accessible controls.
- Keep provider keys and realtime session minting server-side; issue short-lived, narrowly scoped client tokens only where the provider requires direct media transport.

---
title: Voice runtime
description: Deterministic ASR, realtime, and TTS state with interruption, correction, and fallback.
---

# Voice runtime

The voice runtime is a deterministic reducer for ASR, realtime, and ASR-agent-TTS pipelines. It models connection, listening, transcription, thinking, speaking, interruption, failure, transcript correction, and fallback behavior.

```ts
import { createVoiceState, reduceVoiceState } from "@ainorthstar/agentic-ai-bar/voice-runtime";

let voice = createVoiceState("asr-agent-tts");
voice = reduceVoiceState(voice, { type: "CONNECT" });
voice = reduceVoiceState(voice, { type: "CONNECTED" });
voice = reduceVoiceState(voice, { type: "START_LISTENING" });
```

The reducer does not capture audio, request microphone permission, call a provider, or persist transcripts. The host owns those services and maps their lifecycle into reducer events.

## Safety and accessibility

- Request microphone access only after an explicit user action.
- Keep listening and speaking state visible with immediate stop and interruption controls.
- Avoid recording by default and disclose retention before capture.
- Apply message-level authorization, deletion, and redaction policy to transcripts.
- Provide text input/output fallbacks and keyboard-accessible controls.
- Mint short-lived media tokens server-side when direct realtime transport is required.

Use `AgenticVoiceControls` from `react-runtime` for an accessible state-driven control surface.


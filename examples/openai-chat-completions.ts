import type { ModelCatalogEntry, MockProviderRequest, RunInput } from "./provider-contract";
import { bearerHeaders } from "./provider-contract";

export const model: ModelCatalogEntry = {
  id: "chat-fast",
  label: "Chat Fast",
  provider: "openai",
  transport: "openai-chat-completions",
  upstreamModel: "example-chat-model",
  capabilities: ["text", "tools"],
};

export function buildRequest(input: RunInput): MockProviderRequest {
  return {
    url: "https://api.openai.com/v1/chat/completions",
    headers: bearerHeaders("OPENAI_API_KEY"),
    body: {
      model: model.upstreamModel,
      messages: [
        ...(input.system ? [{ role: "system", content: input.system }] : []),
        { role: "user", content: input.prompt },
      ],
      stream: true,
    },
  };
}


import type { ModelCatalogEntry, MockProviderRequest, RunInput } from "./provider-contract";

export const model: ModelCatalogEntry = {
  id: "analysis-pro",
  label: "Analysis Pro",
  provider: "anthropic",
  transport: "anthropic-messages",
  upstreamModel: "example-anthropic-model",
  capabilities: ["text", "vision", "tools"],
};

export function buildRequest(input: RunInput): MockProviderRequest {
  return {
    url: "https://api.anthropic.com/v1/messages",
    headers: {
      "content-type": "application/json",
      "x-api-key": "${ANTHROPIC_API_KEY}",
      "anthropic-version": "2023-06-01",
    },
    body: {
      model: model.upstreamModel,
      system: input.system,
      messages: [{ role: "user", content: input.prompt }],
      max_tokens: 2048,
      stream: true,
    },
  };
}


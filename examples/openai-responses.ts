import type { ModelCatalogEntry, MockProviderRequest, RunInput } from "./provider-contract";
import { bearerHeaders } from "./provider-contract";

export const model: ModelCatalogEntry = {
  id: "reasoning-large",
  label: "Reasoning Large",
  provider: "openai",
  transport: "openai-responses",
  upstreamModel: "example-responses-model",
  capabilities: ["text", "vision", "tools", "reasoning"],
};

export function buildRequest(input: RunInput): MockProviderRequest {
  return {
    url: "https://api.openai.com/v1/responses",
    headers: bearerHeaders("OPENAI_API_KEY"),
    body: {
      model: model.upstreamModel,
      instructions: input.system,
      input: [{ role: "user", content: [{ type: "input_text", text: input.prompt }] }],
      stream: true,
    },
  };
}


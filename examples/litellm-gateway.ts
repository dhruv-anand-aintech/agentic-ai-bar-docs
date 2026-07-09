import type { ModelCatalogEntry, RunInput } from "./provider-contract";
import { openAICompatible } from "./provider-contract";

export const model: ModelCatalogEntry = {
  id: "gateway-support-fast",
  label: "Support Fast",
  provider: "gateway",
  transport: "openai-chat-completions",
  upstreamModel: "support-fast",
  capabilities: ["text", "tools"],
};

// One line switches the same adapter to LiteLLM or another compatible gateway.
const gateway = openAICompatible({ baseURL: "${LITELLM_BASE_URL}", apiKeyName: "LITELLM_API_KEY" });

export function buildRequest(input: RunInput) {
  return gateway(model, input);
}


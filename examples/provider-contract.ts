export type Capability = "text" | "vision" | "tools" | "reasoning" | "json";

export type Transport =
  | "openai-responses"
  | "openai-chat-completions"
  | "anthropic-messages";

export type ModelCatalogEntry = {
  id: string;
  label: string;
  provider: string;
  transport: Transport;
  upstreamModel: string;
  capabilities: Capability[];
  baseURL?: string;
};

export type MockProviderRequest = {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
};

export type RunInput = {
  prompt: string;
  system?: string;
};

export function bearerHeaders(apiKeyName: string) {
  return {
    "content-type": "application/json",
    authorization: `Bearer \${${apiKeyName}}`,
  };
}

export function openAICompatible(config: { baseURL: string; apiKeyName: string }) {
  return (model: ModelCatalogEntry, input: RunInput): MockProviderRequest => ({
    url: `${config.baseURL.replace(/\/$/, "")}/chat/completions`,
    headers: bearerHeaders(config.apiKeyName),
    body: {
      model: model.upstreamModel,
      messages: [
        ...(input.system ? [{ role: "system", content: input.system }] : []),
        { role: "user", content: input.prompt },
      ],
      stream: true,
    },
  });
}


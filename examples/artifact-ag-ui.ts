import { createArtifactManifest } from "@ainorthstar/agentic-ai-bar/artifacts";
import {
  createMcpAppResourceBridge,
  defaultMcpAppSandbox,
} from "@ainorthstar/agentic-ai-bar/generative-ui";

export const fictionalArtifact = createArtifactManifest({
  artifactId: "artifact-demo-summary",
  title: "Fictional review summary",
  kind: "document",
  version: 1,
  createdAt: "2030-01-01T11:00:00.000Z",
  previews: [{
    kind: "text",
    uri: "/demo/artifacts/review-summary.md",
    mediaType: "text/markdown",
  }],
  metadata: { fixture: true },
});

export const fictionalResources = createMcpAppResourceBridge();
fictionalResources.register({
  uri: "ui://demo/review-summary",
  name: "Fictional review summary",
  mediaType: "text/html",
  html: "<main><h1>Fictional review</h1><p>No production data.</p></main>",
  sandbox: defaultMcpAppSandbox,
});

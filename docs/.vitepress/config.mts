import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";

const repository = "https://github.com/dhruv-anand-aintech/agentic-ai-bar-docs";
const imagesDirectory = fileURLToPath(new URL("../public/images/", import.meta.url));

export default defineConfig({
  title: "Agentic AI Bar",
  description:
    "Provider-neutral agent UI, approvals, durable threads, tools, artifacts, and observability.",
  lang: "en-US",
  base: "/agentic-ai-bar-docs/",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://dhruv-anand-aintech.github.io/agentic-ai-bar-docs/",
    transformItems: (items) => items.filter((item) => item.url !== "404"),
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^\/agentic-ai-bar-docs\/images\//,
          replacement: imagesDirectory,
        },
      ],
    },
  },
  head: [
    ["meta", { name: "theme-color", content: "#0f766e" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Agentic AI Bar documentation" }],
    ["meta", { property: "og:site_name", content: "Agentic AI Bar" }],
    ["meta", { property: "og:url", content: "https://dhruvanand-aintech.github.io/agentic-ai-bar-docs/" }],
    ["meta", { property: "og:image", content: "https://dhruvanand-aintech.github.io/agentic-ai-bar-docs/images/agent-console.png" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Documentation for provider-neutral agent UI, approvals, durable threads, tools, and observability.",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "icon", href: "/agentic-ai-bar-docs/favicon.svg", type: "image/svg+xml" }],
  ],
  themeConfig: {
    siteTitle: "Agentic AI Bar",
    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "Providers", link: "/providers" },
      { text: "Runtime", link: "/runtime" },
      { text: "Security", link: "/security" },
      { text: "Examples", link: "/examples" },
      { text: "v0.2.0", link: "/versioning" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Getting started", link: "/getting-started" },
          { text: "Architecture", link: "/architecture" },
        ],
      },
      {
        text: "Runtime",
        items: [
          { text: "Provider adapters", link: "/providers" },
          { text: "Events and streaming", link: "/events" },
          { text: "Threads and background runs", link: "/runtime" },
        ],
      },
      {
        text: "Human control",
        items: [
          { text: "Approvals and continuation", link: "/approvals" },
          { text: "Tools and artifacts", link: "/tools-and-artifacts" },
        ],
      },
      {
        text: "Interfaces",
        items: [
          { text: "Components and platforms", link: "/components" },
          { text: "Site fixes", link: "/site-fixes" },
        ],
      },
      {
        text: "Operations",
        items: [
          { text: "Observability", link: "/observability" },
          { text: "Voice runtime", link: "/voice" },
          { text: "Security model", link: "/security" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Package exports", link: "/api" },
          { text: "Mock examples", link: "/examples" },
          { text: "Versioning", link: "/versioning" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: repository }],
    editLink: {
      pattern: `${repository}/edit/main/docs/:path`,
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    outline: {
      level: [2, 3],
      label: "On this page",
    },
    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },
    docFooter: {
      prev: "Previous",
      next: "Next",
    },
    footer: {
      message: "Documentation and mock examples released under the MIT License.",
      copyright: "Agentic AI Bar",
    },
  },
});

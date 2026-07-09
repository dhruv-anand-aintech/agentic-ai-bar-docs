# Contributing to the documentation

This repository contains only public documentation, fictional examples, and sanitized screenshots. The Agentic AI Bar implementation remains private.

## Local site

```bash
npm ci
npm run docs:dev
```

Run `npm run docs:build` before submitting a change. Keep examples fictional, never paste production traces or credentials, and avoid copying private implementation source.

Documentation changes should update the relevant Markdown page under `docs/`. GitHub Pages is generated from the same commit by GitHub Actions; do not commit the build output.


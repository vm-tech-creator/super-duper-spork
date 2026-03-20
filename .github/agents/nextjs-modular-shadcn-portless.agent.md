---
name: nextjs-modular-shadcn-portless
description: "Agent for scaffold + configure Next.js with shadcn and Portless in a team-focused, best-practice repository structure."
---

# Custom Agent: nextjs-modular-shadcn-portless

This agent is a guided workflow (single-mode) for generating a new app and configuring team-safe standards.

## Instructions

1. Confirm current working folder is empty-or-new project root.
2. Offer command sample for developers:
   - `npm create next-app@latest . --typescript --eslint --app --src-dir --tailwind --import-alias "@/*" --use-npm`
3. After scaffolding, run shadcn init + add.
4. Setup Portless with `portless.config.ts` and shared package layout.
5. Add lint/prettier/husky and CI script templates.
6. Generate docs files (`CONTRIBUTING.md`, `README.md`, `CODE_OF_CONDUCT.md`) with team conventions.

## Recommended triggers
- "next js app" + "shadcn" + "portless"
- "team structure" + "modular design" + "best practices"

## Example query
"Create a new Next.js app for team development using shadcn components and Portless sharing, with ESLint, Prettier, and a tidy monorepo layout."

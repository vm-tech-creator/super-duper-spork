---
name: nextjs-modular-shadcn-portless
summary: "Generate a new Next.js app with modular shadcn UI, TypeScript, linting, formatting, and a team-ready structure including Portless integration."
---

# Skill: Next.js modular shadcn + Portless generator

Use when:
- starting a new Next.js project with modern architecture and team-friendly conventions
- you want `shadcn/ui` modular component system built-in
- you want Portless setup ready for microfrontends or multi-repo shared UI
- you want a structured repo with clear source layout, docs, and CI/quality gates

## Steps

1. scaffold Next.js app
   - `npx create-next-app@latest . --typescript --eslint --app --src-dir --tailwind --import-alias "@/*" --use-npm`
   - if `--use-npm` not desired, replace with `--use-yarn`/`pnpm`.

2. add shadcn/ui
   - `npx shadcn-ui@latest init` (choose `app`, TypeScript, Tailwind, and desired components path)
   - `npx shadcn-ui@latest add button card dialog input toast` (or profile team component list)

3. add Portless or equivalent
   - install: `npm install @portless/core @portless/react` (or package manager choice)
   - add `portless.config.ts` with team share conventions and version pinning
   - ensure `src/components/shared` and `packages/ui` are configured for Portless package exposure

4. implement team folder structure
   - `src/app` (routes + layout)
   - `src/components` (shadcn and shared components)
   - `src/lib` (helpers, types, constants)
   - `src/(ui|design-system)` symlinked from `packages/ui` when using Portless
   - `packages/ui` (design system / shared components / tokens)

5. add tooling and best practices
   - `eslint`, `prettier`, and `lint-staged` config
   - `turbo` or `nx` app monorepo scaffolding if multi-package teamwork
   - `commitlint` and `husky` with `pre-commit` and `pre-push` hooks
   - `storybook` with `@storybook/nextjs` + shadcn theme

6. add docs
   - `docs/README.md` describing install, branching, git flow, code style
   - `CONTRIBUTING.md` for team onboarding
   - `CODE_OF_CONDUCT.md` and `SECURITY.md`

7. optional:
   - `docker` + `docker-compose` with `next build` / `next start`
   - `vercel.json` for Vercel deployment with Portless config
   - `azure-static-web-apps` or `netlify` setup

## Outputs
- ready-to-code Next app with modular UI
- shadcn component set configured
- Portless cross-package component sharing scaffolded
- team collaboration guidelines and CI baseline

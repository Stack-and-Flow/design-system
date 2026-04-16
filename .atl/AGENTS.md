# Agent Context — Stack-and-Flow Design System

This file is injected automatically as context for all agents working in this project.
Keep it minimal — detailed workflows live in skills (`.atl/skills/`).

---

## Project

**Stack-and-Flow Design System** — open-source, educational React component library.

| Key | Value |
|-----|-------|
| Package | `@stack-and-flow/design-system` |
| Repo | https://github.com/Stack-and-Flow/design-system |
| Storybook | https://sf-design-system.netlify.app/ |
| Guidelines | [`docs/GUIDELINES.md`](../docs/GUIDELINES.md) |
| Contributing | [`docs/CONTRIBUTING.md`](../docs/CONTRIBUTING.md) |
| Visual Design | [`docs/DESIGN.md`](../docs/DESIGN.md) |

**Stack**: React 19 · TypeScript strict · Tailwind v4 `@theme` · Radix UI · CVA · Storybook 8 · Biome · Lefthook · Vite · pnpm

**Available tooling**:
- `compilot-cli` — scaffolds the 5-file component structure
- `pnpm run storybook` — starts Storybook with hot reload
- `pnpm run test` — runs Vitest unit tests
- `pnpm run test:coverage` — runs tests with coverage report

---

## Structure

Components live in `src/components/{atoms|molecules|organisms}/{kebab-name}/` with exactly 5 files:

| File | Role |
|------|------|
| `ComponentName.tsx` | Presentational — JSX only, consumes the hook |
| `useComponentName.ts` | Logic — state, effects, handlers, CVA class calls |
| `types.ts` | Types + CVA variants |
| `index.ts` | Public API re-exports |
| `ComponentName.stories.tsx` | Storybook stories |

---

## Non-negotiable rules

- `type` always — never `interface`
- Never `any` — use `unknown` or narrow properly
- Never hardcode colors, spacing or fonts — use tokens from `src/styles/theme.css`
- Token reference: `docs/DESIGN.md` — read it before building any component
- Never modify `theme.css` without explicit user confirmation
- Never add dependencies without explicit user confirmation
- English only — code, comments, stories
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

---

## Skills

Load the relevant skill for detailed workflows:

| Trigger | Skill |
|---------|-------|
| Implementing a component from a GitHub issue spec | [`component-contributor`](.atl/skills/component-contributor/SKILL.md) |

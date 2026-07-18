# Agent Context — Stack-and-Flow Design System

This file is injected automatically as context for all agents working in this project.
Keep it minimal — detailed workflows live in skills (`skills/`).

---

## Project

**Stack-and-Flow Design System** — open-source, educational React component library.

| Key           | Value                                             |
| ------------- | ------------------------------------------------- |
| Package       | `@stack-and-flow/design-system`                   |
| Repo          | <https://github.com/Stack-and-Flow/design-system>   |
| Storybook     | <https://sf-design-system.netlify.app/>             |
| Guidelines    | [`docs/GUIDELINES.md`](docs/GUIDELINES.md)       |
| Contributing  | [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)   |
| Visual Design | [`docs/DESIGN.md`](docs/DESIGN.md)               |

**Stack**: React 19 · TypeScript strict · Tailwind v4 `@theme` · Radix UI · CVA · Storybook 8 · Biome · Lefthook · Vite · pnpm 10.34.1

**Available tooling**:

- `pnpm run build` — builds the publishable package and sanitizes generated declarations
- `pnpm run verify:package` — builds, packs, and verifies real React 18 + React 19 consumers
- `pnpm run storybook` — starts Storybook with hot reload
- `pnpm run test` — runs Vitest unit tests
- `pnpm run test:coverage` — runs tests with coverage report

---

## Structure

Implemented components live in `src/components/{atoms|molecules|organisms}/{kebab-name}/` with exactly 6 files by default. `primitive` remains a catalog tier, but `src/components/primitives/...` is only valid when a validated cataloging decision explicitly approves primitive implementation support and path:

| File                        | Role                                              |
| --------------------------- | ------------------------------------------------- |
| `ComponentName.tsx`         | Presentational — JSX only, consumes the hook      |
| `useComponentName.ts`       | Logic — state, effects, handlers, CVA class calls |
| `types.ts`                  | Types + CVA variants                              |
| `ComponentName.test.tsx`    | Complete test suite (hook + component tests)      |
| `ComponentName.stories.tsx` | Storybook stories (documentation only, no tests)  |
| `index.ts`                  | Public API re-exports                             |

---

## Non-negotiable rules

- `type` always — never `interface`
- Never `any` — use `unknown` or narrow properly
- Never hardcode colors, spacing or fonts — use tokens from `src/styles/theme.css`
- Use Tailwind token classes directly — NEVER `[var(--token)]` when the token exists in `@theme` (e.g. `text-brand-light`, `rounded-pill`, `bg-red-tint-subtle`)
- `var()` is FORBIDDEN in component source files (`src/components/**/*.ts`, `src/components/**/*.tsx`)
- If a token or mixed visual treatment does not exist, define it centrally in `src/styles/theme.css` or `src/styles/base.css` as a reusable token-backed utility/class, then consume that class from the component
- If a token does not exist for a value, CREATE it in `theme.css` first — never use raw `rgba()`, hex, or px values inline
- `var()` is only acceptable inside the style system (`src/styles/theme.css`, `src/styles/base.css`) to define reusable utilities such as `bg-gradient-*`, `shadow-glow-*`, or semantic component helper classes
- Token reference: `docs/DESIGN.md` — read it before building any component
- Never modify `theme.css` without explicit user confirmation
- Never add dependencies without explicit user confirmation
- Repo package manager contract is `pnpm@10.34.1`; when docs, scripts, or workflows pin pnpm, use the exact version, not only `10`
- For package-facing changes (package output, exports, generated declarations, peer ranges, React major upgrades, or CI/package distribution policy), require `pnpm run build`; require `pnpm run verify:package` when published output or consumer compatibility can change. Tests/Storybook alone are not enough for React major upgrades.
- Generated declarations must not leak internal path aliases or CSS side-effect imports into the published `.d.ts` output
- English only — code, comments, stories
- Paired repository docs are bilingual: base `*.md` files are Spanish and matching `*.en.md` files are English. When editing docs under `docs/` or root README files, preserve that split, update both language variants when the content changes, and never replace the Spanish base file with English prose.
- Commit messages must follow the commitlint-enforced Conventional Commit format: `<type>(<optional scope>): <description>`. PR titles should follow the same format for review consistency. Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`. Use scopes for domains such as `a11y`, `tokens`, or `infra` instead of inventing custom types.

---

## Skills

Load the relevant skill for detailed workflows:

| Trigger                                                                                                                | Skill                                                                |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Contributor shares a GitHub issue URL or component spec and asks to implement it                                       | [`component-contributor`](skills/component-contributor/SKILL.md)     |
| User provides a capture-first component idea or reference-component-first URL and wants a validated issue spec before coding | [`component-spec-proposer`](skills/component-spec-proposer/SKILL.md) |
| Validating a proposed component spec against catalog tiers, existing components, and reuse/extraction opportunities before approval | [`component-spec-cataloging-validator`](skills/component-spec-cataloging-validator/SKILL.md) |
| Creating or reusing child issues from a validated component cataloging decision for independently reviewable primitives/atoms/molecules/organisms | [`component-child-issues`](skills/component-child-issues/SKILL.md)   |
| Reviewing an existing component — code quality, visual states, tokens, accessibility                                   | [`components-auditor`](skills/components-auditor/SKILL.md)           |
| Auditing the design system package — token architecture, folder structure, npm distributable standards                 | [`system-auditor`](skills/system-auditor/SKILL.md)                   |
| External project wants to use Stack-and-Flow as a base and customize its tokens                                        | [`bootstrapping`](skills/bootstrapping/SKILL.md)                     |
| Contributor asks if their PR is ready for review, or agent must validate implementation before handoff, including package evidence when package-facing changes exist | [`pr-reviewer`](skills/pr-reviewer/SKILL.md)                         |
| Creating or auditing GitHub Project board tasks — issues, fields, phases, team assignments                                                                 | [`github-project-tasks`](skills/github-project-tasks/SKILL.md)       |
| Creating a release, bumping versions, generating changelogs, publishing to npm                                                                             | [`release-changeset`](skills/release-changeset/SKILL.md)             |
| Preparing or auditing package distribution policy — exports map, package.json hygiene, package verification, consumer compatibility, TypeScript declarations | [`npm-architect`](skills/npm-architect/SKILL.md)                     |
| Visual review — component states, glow, transitions, focus rings, contrast, accessibility visuals                    | [`visual-review`](skills/visual-review/SKILL.md)                     |
| Creating git worktrees or isolated writer checkouts for this repo                                                     | [`worktree-location`](skills/worktree-location/SKILL.md)             |

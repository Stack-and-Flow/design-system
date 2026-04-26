# Skill Registry — Stack-and-Flow Design System

## Project Skills

| Skill | Trigger | Delegable from SDD | Path |
|-------|---------|-------------------|------|
| `component-contributor` | Contributor shares a GitHub issue URL or component spec and asks to implement it | `sdd-apply` | [SKILL.md](skills/component-contributor/SKILL.md) |
| `components-auditor` | Reviewing an existing component — code quality, visual states, tokens, accessibility | `sdd-verify` | [SKILL.md](skills/components-auditor/SKILL.md) |
| `auditor` | Auditing the design system itself — token architecture, folder structure, npm distributable standards | `sdd-verify`, `sdd-explore` | [SKILL.md](skills/auditor/SKILL.md) |
| `bootstrapping` | External project wants to use Stack-and-Flow as a base and customize its tokens | `sdd-apply` | [SKILL.md](skills/bootstrapping/SKILL.md) |
| `pr-reviewer` | Contributor asks if their PR is ready for review, or agent must validate implementation before handoff | `sdd-verify` | [SKILL.md](skills/pr-reviewer/SKILL.md) |
| `github-project-tasks` | Creating or auditing GitHub Project board tasks — issues, fields, phases, team assignments | `sdd-apply`, `sdd-explore` | [SKILL.md](skills/github-project-tasks/SKILL.md) |
| `release-changeset` | Creating a release, bumping versions, generating changelogs, publishing to npm | `sdd-apply` | [SKILL.md](skills/release-changeset/SKILL.md) |
| `npm-architect` | Preparing the package for npm distribution — exports map, vite lib mode, package.json hygiene, TypeScript declarations | `sdd-apply`, `sdd-design` | [SKILL.md](skills/npm-architect/SKILL.md) |
| `visual-review` | Reviewing component visual quality, auditing interactive states, verifying glow/blur/gradient/transition rules | loaded by `components-auditor` | [SKILL.md](skills/visual-review/SKILL.md) |

---

## SDD Integration Map

```
SDD Orchestrator
├── sdd-explore  → auditor (scope: tokens | structure | npm | all)
├── sdd-explore  → github-project-tasks (audit board state, field values, issue format)
├── sdd-apply    → component-contributor (implement a component)
├── sdd-apply    → bootstrapping (setup external project)
├── sdd-apply    → github-project-tasks (create issues, assign fields, track phases)
├── sdd-apply    → release-changeset (bump versions, generate changelog, publish)
├── sdd-apply    → npm-architect (make package distributable on npm)
├── sdd-design   → npm-architect (design exports strategy, lib build config)
├── sdd-verify   → components-auditor (verify a component change)
├── sdd-verify   → auditor (verify system-level changes)
└── sdd-verify   → pr-reviewer (pre-review checklist before human review)
```

**How delegation works:**
Each skill has a "When Delegated by SDD Orchestrator" section that defines:
- What it receives (change name, tasks, artifact store mode)
- What phases to skip (onboarding/intro)
- What format to return (SDD return envelope)

---

## Compact Rules Reference

### component-contributor
**Load when**: contributor shares a GitHub issue URL or spec and asks to implement a component.

**Workflow**: Phase 0 (onboarding) → Phase 1 (read spec) → Phase 1.5 (spec review — critique before committing) → Phase 2 (plan + confirm) → Phase 3 (implement 6 files) → Phase 4 (explain inline) → Phase 5 (visual review)

**When delegated from SDD**: skip Phase 0, start from Phase 1, return SDD envelope.

**File order**: `types.ts` → `useComponentName.ts` → `ComponentName.tsx` → `ComponentName.test.tsx` → `ComponentName.stories.tsx` → `index.ts`

**Non-negotiables**:
- CVA variants ONLY in `types.ts`
- Logic ONLY in `useComponentName.ts`
- JSX ONLY in `ComponentName.tsx`
- Complete tests in `ComponentName.test.tsx` — hook tests + component tests, NO play functions in stories
- Stories in `ComponentName.stories.tsx` — documentation only, use `@storybook/addon-actions`, NO play functions
- Tokens from the style system only (`theme.css` / `base.css`) — no hardcoded values, no `[var(--token)]` when token exists in `@theme`, and no direct `var()` in component source files
- Reusable/systemic prop types belong in `src/types`; `component/types.ts` is only for component-specific types and CVA contracts
- `type` always, never `interface`, never `any`
- Explain every decision after each file
- `Default` story args must NOT override `defaultVariants`
- Phase 5 visual review is MANDATORY

---

### components-auditor
**Load when**: reviewing an existing component — code, visual states, tokens, or accessibility.

**Workflow**: Phase 1 (code audit) → Phase 2 (visual audit via `visual-review` skill) → Phase 3 (report)

**When delegated from SDD**: run all phases, return SDD verification envelope.

**Severity levels**: CRITICAL (a11y failure) → MAJOR (compositional violation) → MINOR (spec inconsistency) → SUGGESTION

**Non-negotiables**:
- NEVER flag a token without checking `theme.css` first
- NEVER fix issues — only report; fixes belong in `component-contributor`
- Visual audit requires loading `visual-review` skill

---

### auditor
**Load when**: auditing the design system as a whole — tokens, folder structure, npm config, build output.

**Workflow**: Phase 1 (token architecture) → Phase 2 (folder structure) → Phase 3 (npm config) → Phase 4 (propose improvements) → Phase 5 (summary report)

**When delegated from SDD**: run requested scope, return SDD return envelope.

**Non-negotiables**:
- Every issue must have a concrete before/after proposal
- NEVER suggest aesthetic changes — this is a standards audit
- Check actual `theme.css` values before flagging token issues
- Flag breaking changes explicitly when proposing API changes

---

### bootstrapping
**Load when**: external project wants to install and customize Stack-and-Flow.

**Workflow**: Phase 0 (project discovery) → Phase 1 (installation) → Phase 2 (Tailwind v4 config) → Phase 3 (token overrides) → Phase 4 (verification) → Phase 5 (handoff notes)

**When delegated from SDD**: skip Phase 0, return SDD return envelope.

**Scope boundary**: token customization ONLY — no component modifications, no forking.

**Non-negotiables**:
- ALWAYS verify Tailwind v4 (v3 is incompatible)
- ALWAYS check CSS import order — overrides AFTER base import
- ALWAYS flag WCAG AA contrast issues for consumer brand colors
- NEVER suggest copying component source files

---

### pr-reviewer
**Load when**: contributor asks "is my PR ready?", "can I submit this?", or agent must validate implementation before handing off to human review.

**Workflow**: Automatic rejection check (hard stops) → 10-section detailed checklist → severity-classified report → verdict (APPROVED / NEEDS WORK / REJECTED)

**When delegated from SDD**: run all checks against provided files, return SDD verification envelope.

**Non-negotiables**:
- Run automatic rejection check FIRST — if any trigger hits, stop and report immediately
- NEVER approve a PR with a BLOCKER or CRITICAL issue
- NEVER fix issues — only report; fixes belong in `component-contributor`
- Report must include a concrete `Fix:` instruction for every issue found

---

### visual-review
**Load when**: reviewing component visual quality, auditing interactive states, checking hover/focus/active/disabled, verifying glow/blur/gradient/transition rules.

**Loaded by**: `components-auditor` (Phase 2) — rarely used standalone.

**Workflow**: Read COMPONENTS.md → Check all 6 protocol sections → Report issues by severity

**Non-negotiables**:
- Focus ring ALWAYS via `box-shadow`, never `outline`
- Disabled state ALWAYS via `opacity: 0.4`, never color substitution
- `backdrop-filter: blur` ONLY on floating elements
- Gradient borders ALWAYS via `::before`, never `border-image`
- NEVER `transition: all`
- Button Primary glow: exactly 4 layers at rest, amplified on hover
- Verify token values in `theme.css` before flagging a raw value as wrong

---

### github-project-tasks
**Load when**: creating GitHub Project board tasks, auditing existing issues for field completeness, or assigning team/category/phase fields.

**Modes**: `CREATE` (new issue + add to board + set fields) | `AUDIT` (check existing issues for format/field problems)

**Non-negotiables**:
- NEVER use `--body` with inline markdown in PowerShell — always write to a temp file first
- Emojis (🎯, 📝, etc.) corrupt to `���` with `gh` CLI on Windows — use ASCII only in issue bodies
- Always set all 3 custom fields: `Status`, `Team`, `Category`
- Field IDs are documented in the skill — do not query them again unless they change

---

### release-changeset
**Load when**: creating a release, bumping package versions, generating a changelog, or publishing to npm.

**Workflow**: Phase 1 (setup if needed) → Phase 2 (detect unreleased changes) → Phase 3 (generate changeset) → Phase 4 (version bump + changelog) → Phase 5 (publish)

**Non-negotiables**:
- `@changesets/cli` may not be installed — check before running any `changeset` command
- NEVER publish without running the build first
- NEVER bump version manually — always via `pnpm changeset version`
- Conventional commits map to bump type: `feat` → minor, `fix` → patch, `BREAKING CHANGE` → major

---

### npm-architect
**Load when**: preparing the design system package for npm distribution — exports map, vite lib mode, `package.json` hygiene, TypeScript declarations.

**Workflow**: Phase 1 (audit) → Phase 2 (root entry point) → Phase 3 (exports map) → Phase 4 (vite lib config) → Phase 5 (package.json hygiene) → Phase 6 (TS declarations) → Phase 7 (verify)

**Non-negotiables**:
- NEVER modify `vite.config.ts` — it is used by Storybook; create `vite.config.lib.ts` instead
- `react` and `react-dom` must be in `peerDependencies`, NOT `dependencies`
- `preserveModules: true` is required for per-component tree-shaking
- Each atom must have its own entry point in the `exports` map
- `sideEffects: false` is required for bundler tree-shaking support

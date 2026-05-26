---
name: components-auditor
description: >
  Reviews existing components against Stack-and-Flow standards — both code quality and visual correctness.
  Covers: 6-file pattern compliance, TypeScript conventions, token usage, CVA structure, tests, Storybook stories,
  and full visual state audit (glow, transitions, focus rings, accessibility).
  Trigger: When reviewing an existing component — code quality, visual states, tokens, or accessibility.
  Also delegable from sdd-verify as the verification gate for a component change.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- Someone asks to "review", "audit", or "check" an existing component
- A PR review requires validating a component against project standards
- After implementing a component (as the final quality gate)
- Delegated from `sdd-verify` as part of a larger SDD change

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-verify`:

- **Change name**: the SDD change being verified
- **Component(s) to audit**: which component(s) are in scope
- **Artifact store mode**: `engram | openspec | hybrid | none`

When delegated: run ALL audit phases and return in the SDD return envelope format:

```markdown
## Verification Report

**Change**: {change-name}
**Components audited**: {list}

### Compliance Matrix

| Check                  | Status  | Notes |
| ---------------------- | ------- | ----- |
| 6-file pattern         | ✅ / ❌ |       |
| TypeScript conventions | ✅ / ❌ |       |
| Token usage            | ✅ / ❌ |       |
| CVA structure          | ✅ / ❌ |       |
| Test coverage          | ✅ / ❌ |       |
| Stories coverage       | ✅ / ❌ |       |
| Visual states          | ✅ / ❌ |       |
| Accessibility          | ✅ / ❌ |       |

### Issues Found

**CRITICAL**: {list or "None"}
**MAJOR**: {list or "None"}
**MINOR**: {list or "None"}
**SUGGESTION**: {list or "None"}

### Verdict

{PASS / PASS WITH WARNINGS / FAIL}
```

---

## Before You Start

Always read in this order:

1. `docs/GUIDELINES.md` — coding conventions and TypeScript rules
2. `docs/DESIGN.md` — visual token reference and component specs
3. `src/styles/theme.css` — source of truth for every token value
4. `docs/COMPONENTS.md` — state-by-state spec for every component (if it exists)
5. `.atl/skills/component-contributor/references/stories.md` — canonical Storybook autodocs/actions/controls conventions (if it exists)

> **Never flag a token value as wrong without checking `theme.css` first.**

---

## Phase 1 — Code Audit

### 1.1 — 6-File Pattern

Every component must have exactly these 6 files and nothing else:

- [ ] `types.ts` — exists
- [ ] `useComponentName.ts` — exists
- [ ] `ComponentName.tsx` — exists
- [ ] `ComponentName.test.tsx` — exists
- [ ] `ComponentName.stories.tsx` — exists
- [ ] `index.ts` — exists
- [ ] No extra files, no barrel re-exports outside `index.ts`

### 1.2 — `types.ts` compliance

- [ ] Only `type` declarations — never `interface`
- [ ] Shared/systemic prop types are imported from `src/types` when available; `component/types.ts` only defines component-specific types
- [ ] ALL CVA variants defined here — none in `.tsx` or hook files
- [ ] `cva` imported from `class-variance-authority`
- [ ] `VariantProps<typeof componentVariants>` used to derive the props type
- [ ] Every public prop exposed in Storybook has JSDoc annotations: `@control type` and `@default value` (if applicable)
- [ ] JSDoc format: annotations only, no prose descriptions required
  ```typescript
  /**
   * @control text
   * @default Example
   */
  propName?: string
  ```
- [ ] No logic, no side effects, and no React value imports in `types.ts` (type-only React imports are acceptable when needed for public prop typing)

### 1.3 — `useComponentName.ts` compliance

- [ ] Contains ALL logic — state, refs, effects, event handlers
- [ ] Calls `componentVariants(...)` and returns the computed `className`
- [ ] Returns a typed object — never `any`, never untyped return
- [ ] No JSX — not even fragments
- [ ] No direct DOM manipulation (use refs)
- [ ] No imports from `react-dom`

### 1.4 — `ComponentName.tsx` compliance

- [ ] Contains ONLY JSX — zero logic, zero state, zero CVA calls
- [ ] Calls the hook at the top: `const { ... } = use{ComponentName}(props)`
- [ ] `FC<ComponentProps>` typing on the component
- [ ] No inline styles
- [ ] No hardcoded class strings that belong in CVA

### 1.5 — `ComponentName.test.tsx` compliance

- [ ] Contains both hook tests (with `renderHook`) and component tests (with `render/screen/userEvent`)
- [ ] All required mocks declared BEFORE component imports
- [ ] Tests cover: hook logic, DOM rendering, ARIA attributes, user interactions, disabled states
- [ ] No tests against internal CSS class strings
- [ ] No animation/ripple/spinner implementation tests

### 1.6 — Token usage

- [ ] No hardcoded hex values (`#ff0036`, `#060C13`, etc.) anywhere in the component files
- [ ] No hardcoded arbitrary spacing values unless they live in `types.ts` CVA definitions for an explicitly approved compact/dense size variant; arbitrary colors remain forbidden
- [ ] Custom fractional spacing tokens from `theme.css` use Tailwind v4 dash utility names, never dotted names:
  - Correct: `p-0-75`, `p-1-25`, `min-w-4-5`, `h-4-5`
  - Wrong: `p-0.75`, `p-1.25`, `min-w-4.5`, `h-4.5`
  - Keep built-in half-step utilities such as `p-0.5`, `gap-1.5`, `px-2.5` unchanged unless `theme.css` defines a dash-named custom token for that exact value.
- [ ] No `[var(--token)]` when the token exists in `@theme` as a Tailwind utility class
  - Wrong: `bg-[var(--color-surface-dark)]`
  - Right: `bg-surface-dark`
- [ ] No `var()` inside component source files (`src/components/**/*.ts`, `src/components/**/*.tsx`)
- [ ] If a component needs token-backed `color-mix()`, gradients, or multi-layer shadows, those values are defined in `src/styles/theme.css` / `src/styles/base.css` and consumed through semantic classes/utilities
- [ ] All tokens referenced actually exist in `src/styles/theme.css`

### 1.7 — `ComponentName.stories.tsx` compliance

- [ ] Component-level docs are a JSDoc block immediately above `const meta`; `parameters.docs.description.component` is not used
- [ ] Component-level JSDoc includes `## Description` and only includes `## Dependencies` / `## Usage Guide` when applicable
- [ ] Every story block has a concise English JSDoc block immediately above its `export const StoryName`
- [ ] Story canvases do not render documentation cards, panels, helper text blocks, or usage notes; documentation belongs in JSDoc above `meta` or the relevant story export
- [ ] `Default` story has `args` that do NOT override `defaultVariants`
- [ ] `Disabled` story present for every interactive component
- [ ] One story per key variant axis (not one story mixing all variants)
- [ ] No DOM manipulation in module scope (use `decorators` if needed)
- [ ] English only — titles, descriptions, JSDoc, comments, story names, and arg labels
- [ ] If project `autodocs` is enabled, manual `argTypes` in `meta` or individual stories are forbidden unless a documented project exception exists
- [ ] Story actions use `@storybook/addon-actions` (`action(...)`) only; no mixed conventions across stories
- [ ] No inline no-op handlers such as `() => undefined` in story args
- [ ] No `[var(--token)]` in stories when equivalent Tailwind utilities exist in `@theme`
- [ ] Story conventions match the canonical project reference/component pattern
- [ ] NO `play` functions — all interaction tests belong in `ComponentName.test.tsx`

### 1.8 — `index.ts` compliance

- [ ] Re-exports the named component: `export { ComponentName } from './ComponentName'`
- [ ] Re-exports types: `export * from './types'`
- [ ] Nothing else

### 1.9 — TypeScript global rules

- [ ] `strict: true` compliance — no implicit `any`, no loose types
- [ ] No `as` type assertions unless absolutely unavoidable (comment why)
- [ ] No `// @ts-ignore` or `// @ts-expect-error` without a comment explaining why

---

## Phase 2 — Visual Audit

Load the `visual-review` skill for the full visual review protocol.

Apply ALL 6 sections of the visual review protocol:

1. **State completeness** — base, hover, focus, active/pressed, disabled
2. **Glow correctness** — layer counts, always-on vs hover-only rules
3. **Blur vs. gradient rule** — `backdrop-filter` only on floating elements
4. **Transition correctness** — no `transition: all`, no layout-forcing properties
5. **Gradient border check** — `::before` technique, never `border-image`
6. **Accessibility** — touch targets, focus rings, contrast, reduced motion

---

## Phase 3 — Report

Classify every finding with severity:

- **CRITICAL** — Accessibility failure: missing focus ring, insufficient contrast, no disabled state, undocumented interactive element below the required target size, `outline: none` without alternative, WCAG AA failure
- **MAJOR** — Compositional rule violation: wrong file structure, CVA in wrong file, `[var(--token)]` bypass, `transition: all`, `border-image`, blur+gradient on same element, wrong glow layer count, rendered documentation UI inside story canvases
- **MINOR** — Spec inconsistency: wrong transition duration, missing transition property, hover tint value slightly off, missing JSDoc control annotation, incomplete prop/story JSDoc, non-canonical story actions/autodocs usage when it does not break behavior
- **SUGGESTION** — Enhancement: `will-change` on entrance animations, extracting a repeated pattern to a token, improving story coverage

### Report format

```
[SEVERITY] ComponentName — File or State/Element
Problem: [What is wrong — specific file, property, or value]
Expected: [What the standard requires]
Found: [What is in the code]
Rule: [Which guideline, section, or principle this violates]
```

### Summary table

After listing all issues, provide a summary:

```markdown
## Audit Summary — {ComponentName}

| Category               | Status       | Issues  |
| ---------------------- | ------------ | ------- |
| 6-file pattern         | ✅ / ⚠️ / ❌ | {count} |
| TypeScript conventions | ✅ / ⚠️ / ❌ | {count} |
| Token usage            | ✅ / ⚠️ / ❌ | {count} |
| CVA structure          | ✅ / ⚠️ / ❌ | {count} |
| Test coverage          | ✅ / ⚠️ / ❌ | {count} |
| Stories coverage       | ✅ / ⚠️ / ❌ | {count} |
| Visual states          | ✅ / ⚠️ / ❌ | {count} |
| Accessibility          | ✅ / ⚠️ / ❌ | {count} |

**CRITICAL**: {N} | **MAJOR**: {N} | **MINOR**: {N} | **SUGGESTION**: {N}

### Verdict

**PASS** — no CRITICAL or MAJOR issues
**PASS WITH WARNINGS** — no CRITICAL, has MAJOR or MINOR issues
**FAIL** — has CRITICAL issues; must fix before merging
```

---

## Rules

- NEVER flag a token value as wrong without reading `theme.css` first
- NEVER suggest replacing a working pattern with a different one unless it violates a documented rule
- NEVER fix issues in this skill — only report them; fixes belong in `component-contributor` or a separate task
- When delegated from SDD, use the SDD return envelope — do not return a free-form report

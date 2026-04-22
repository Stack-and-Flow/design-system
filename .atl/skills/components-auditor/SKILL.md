---
name: components-auditor
description: >
  Reviews existing components against Stack-and-Flow standards — both code quality and visual correctness.
  Covers: 5-file pattern compliance, TypeScript conventions, token usage, CVA structure, Storybook stories,
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
| Check | Status | Notes |
|-------|--------|-------|
| 5-file pattern | ✅ / ❌ | |
| TypeScript conventions | ✅ / ❌ | |
| Token usage | ✅ / ❌ | |
| CVA structure | ✅ / ❌ | |
| Stories coverage | ✅ / ❌ | |
| Visual states | ✅ / ❌ | |
| Accessibility | ✅ / ❌ | |

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

> **Never flag a token value as wrong without checking `theme.css` first.**

---

## Phase 1 — Code Audit

### 1.1 — 5-File Pattern

Every component must have exactly these 5 files and nothing else:

- [ ] `types.ts` — exists
- [ ] `useComponentName.ts` — exists
- [ ] `ComponentName.tsx` — exists
- [ ] `ComponentName.stories.tsx` — exists
- [ ] `index.ts` — exists
- [ ] No extra files, no barrel re-exports outside `index.ts`

### 1.2 — `types.ts` compliance

- [ ] Only `type` declarations — never `interface`
- [ ] ALL CVA variants defined here — none in `.tsx` or hook files
- [ ] `cva` imported from `class-variance-authority`
- [ ] `VariantProps<typeof componentVariants>` used to derive the props type
- [ ] JSDoc `/** @control select|text|boolean */` present on props that need Storybook controls
- [ ] No logic, no imports from React, no side effects

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

### 1.5 — Token usage

- [ ] No hardcoded hex values (`#ff0036`, `#060C13`, etc.) anywhere in the component files
- [ ] No hardcoded spacing values (`px-4`, `mt-2` are fine as utilities; `mt-[13px]` is not)
- [ ] No `[var(--token)]` when the token exists in `@theme` as a Tailwind utility class
  - Wrong: `bg-[var(--color-surface-dark)]`
  - Right: `bg-surface-dark`
- [ ] `var()` is ONLY acceptable for: `bg-gradient-*` tokens and `shadow-glow-*` tokens (multi-layer values Tailwind cannot express)
- [ ] All tokens referenced actually exist in `src/styles/theme.css`

### 1.6 — `ComponentName.stories.tsx` compliance

- [ ] `parameters.docs.description.component` present and in English
- [ ] `Default` story has `args` that do NOT override `defaultVariants`
- [ ] `Disabled` story present for every interactive component
- [ ] One story per key variant axis (not one story mixing all variants)
- [ ] No DOM manipulation in module scope (use `decorators` if needed)
- [ ] English only — titles, descriptions, arg labels

### 1.7 — `index.ts` compliance

- [ ] Exports the component as default: `export { default } from './ComponentName'`
- [ ] Re-exports types: `export * from './types'`
- [ ] Nothing else

### 1.8 — TypeScript global rules

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

- **CRITICAL** — Accessibility failure: missing focus ring, insufficient contrast, no disabled state, interactive element below 44px, `outline: none` without alternative, WCAG AA failure
- **MAJOR** — Compositional rule violation: wrong file structure, CVA in wrong file, `[var(--token)]` bypass, `transition: all`, `border-image`, blur+gradient on same element, wrong glow layer count
- **MINOR** — Spec inconsistency: wrong transition duration, missing transition property, hover tint value slightly off, missing JSDoc control annotation
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

| Category | Status | Issues |
|----------|--------|--------|
| 5-file pattern | ✅ / ⚠️ / ❌ | {count} |
| TypeScript conventions | ✅ / ⚠️ / ❌ | {count} |
| Token usage | ✅ / ⚠️ / ❌ | {count} |
| CVA structure | ✅ / ⚠️ / ❌ | {count} |
| Stories coverage | ✅ / ⚠️ / ❌ | {count} |
| Visual states | ✅ / ⚠️ / ❌ | {count} |
| Accessibility | ✅ / ⚠️ / ❌ | {count} |

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

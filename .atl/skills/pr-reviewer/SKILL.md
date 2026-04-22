---
name: pr-reviewer
description: >
  Runs a complete pre-review checklist against a PR before requesting human review.
  Verifies code structure, TypeScript rules, token usage, tests, Storybook, accessibility, and git hygiene.
  Trigger: When a contributor asks "is my PR ready for review?", "review my PR", or "check my PR before I submit".
  Also delegable from sdd-verify to validate implementation against project standards.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- Contributor asks "is this ready for review?", "can I open the PR?", or similar
- Agent finishes implementing a component and must validate before handing off
- Delegated from `sdd-verify` to run the full project checklist against an implementation

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-verify`:

- **Change name**: the SDD change being validated
- **Files to review**: list of files or the component directory to check
- **Spec reference**: path to the delta spec to validate against

When delegated: run all checks below and return your result in the SDD return envelope:

```markdown
## PR Review Result

**Change**: {change-name}
**Files reviewed**: {list}
**Verdict**: APPROVED / NEEDS WORK / REJECTED

### Automatic rejection triggers hit
{list or "None"}

### Approval criteria — status
{table: criterion | pass/fail | notes}

### Issues found
{list: [SEVERITY] file:line — description — fix required}

### Recommendation
{Approve with minor fixes / Request changes / Reject — reason}
```

---

## Automatic Rejection Check (run first)

These are hard stops. If ANY is true, the PR is rejected WITHOUT further review.
Report the failing criterion and stop — do not continue with the detailed checklist.

| Check | How to verify |
|-------|--------------|
| CI is failing | Look for test, build, or lint failures in the PR |
| No linked issue | PR description must contain `Closes #NNN` |
| `interface` used | Grep for `interface ` in all `.ts` / `.tsx` files |
| `any` used explicitly | Grep for `: any` or `as any` in all `.ts` / `.tsx` files |
| Container/Presentational mixed | Logic (useState, useRef, handlers, CVA calls) found in `.tsx` file |
| Hardcoded Tailwind arbitrary values | Grep for `p-[`, `m-[`, `text-[#`, `bg-[#`, `border-[#` in component files |
| Missing tests | No `.test.tsx` file in the component directory |
| Missing Storybook story | No `.stories.tsx` file in the component directory |

---

## Detailed Checklist

Run these only AFTER the automatic rejection check passes.

### 1 — File structure

- [ ] Exactly 5 files: `types.ts`, `useComponentName.ts`, `ComponentName.tsx`, `ComponentName.stories.tsx`, `index.ts`
- [ ] Directory name is `kebab-case` matching the component name
- [ ] Correct atomic tier: `atoms/` | `molecules/` | `organisms/`
- [ ] `index.ts` re-exports the component default and all types

### 2 — TypeScript

- [ ] All imports of types use `import type`
- [ ] All exports of types use `export type`
- [ ] No `interface` — only `type`
- [ ] No `any` — if present, must have documented justification
- [ ] No `!` non-null assertion — use optional chaining or guards
- [ ] No `Array<T>` — use `T[]` shorthand
- [ ] `ComponentProps<'element'>` intersection present in hook input type
- [ ] Props that conflict with native HTML props use `Omit`

### 3 — Token usage

- [ ] No raw hex values in className strings (`#`, `rgba()`, `rgb()`)
- [ ] No arbitrary pixel values for spacing/sizing (`p-[14px]`, `w-[320px]`)
- [ ] Dark mode paired tokens present: `bg-surface-light dark:bg-surface-dark`
- [ ] Focus ring uses `box-shadow` with `--glow-focus-dark` token — never `outline` alone
- [ ] Disabled state uses `opacity-40` + `pointer-events-none` — no color substitution
- [ ] All tokens traceable to `src/styles/theme.css`

### 4 — Architecture

- [ ] `types.ts` — all CVA variants defined here, all props typed, JSDoc controls present
- [ ] `useComponentName.ts` — all state, effects, handlers, CVA calls live here; no JSX
- [ ] `ComponentName.tsx` — only JSX; consumes hook; zero `useState`, `useRef`, or CVA calls
- [ ] `cn()` imported from `@/lib/utils` — not `clsx` or `twMerge` directly
- [ ] `...rest` spread on the native element (passes through data-*, aria-*, form attrs)

### 5 — Radix (if used)

- [ ] Imported as namespace alias (`import * as XxxPrimitive from '@radix-ui/...'`)
- [ ] Floating content wrapped in `Portal`
- [ ] `asChild={true}` on `Trigger`
- [ ] Animations use `data-[state=open/closed]` — not manual state class toggling

### 6 — Accessibility

- [ ] All interactive elements have an accessible name (`aria-label`, `aria-labelledby`, or visible text)
- [ ] Minimum touch target `44×44px` on interactive elements
- [ ] `aria-disabled` mirrors `disabled` prop
- [ ] `role` attribute present where semantic HTML is insufficient
- [ ] `focus-visible` selector used for focus styling — not `:focus` alone
- [ ] `prefers-reduced-motion` guard if transforms or animations are used

### 7 — Tests

- [ ] Hook tested with `renderHook` — all returned values and computed functions covered
- [ ] Component tested with `render/screen/userEvent` — rendering, ARIA, interaction, disabled states
- [ ] All mocks declared BEFORE component imports (`lucide-react/dynamic`, `spinners-react`, CSS files)
- [ ] No tests against internal CSS class strings
- [ ] Interactive component has a `play` function in its story

### 8 — Storybook

- [ ] English only — titles, descriptions, arg labels, comments
- [ ] `parameters.docs.description.component` present and descriptive
- [ ] `Default` story has `args` set; does NOT override `defaultVariants`
- [ ] At least: `Default`, `Disabled`, one story per key variant
- [ ] Each story demonstrates ONE axis — no mixed-variant stories

### 9 — Visual states

- [ ] Hover state implemented — at least one visible property changes
- [ ] Focus ring: `box-shadow` only, merged with existing shadows
- [ ] Active/pressed: `scale(0.98)` on buttons
- [ ] Disabled: `opacity: 0.4` + `pointer-events: none`
- [ ] No `transition: all` — specific properties enumerated

### 10 — Git hygiene

- [ ] Branch name follows convention: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`
- [ ] Conventional commit messages — `feat:`, `fix:`, etc.
- [ ] PR description contains `Closes #NNN`
- [ ] PR template fully filled — no placeholder sections left empty
- [ ] Branch is up to date with `main`

---

## Severity classification

When reporting issues:

| Severity | Meaning |
|----------|---------|
| **BLOCKER** | Automatic rejection trigger — PR cannot be submitted |
| **CRITICAL** | Accessibility or TypeScript safety violation — must fix before review |
| **MAJOR** | Architecture rule broken — reviewer will reject |
| **MINOR** | Spec inconsistency or style issue — fix recommended |
| **SUGGESTION** | Optional improvement — no review impact |

---

## Report format

```
## PR Review — {ComponentName}

**Verdict**: APPROVED / NEEDS WORK / REJECTED

### Blockers (automatic rejection)
- [BLOCKER] {criterion} — {what was found}

### Issues to fix before review
- [CRITICAL] {file}:{line} — {problem} — Fix: {what to do}
- [MAJOR] {file}:{line} — {problem} — Fix: {what to do}

### Recommendations (optional)
- [MINOR] {file}:{line} — {suggestion}

### Checklist summary
{table: section | pass / fail / n/a}
```

If there are NO blockers and NO critical/major issues:

```
## PR Review — {ComponentName}

**Verdict**: APPROVED ✅

All checks passed. Ready for human review.
```

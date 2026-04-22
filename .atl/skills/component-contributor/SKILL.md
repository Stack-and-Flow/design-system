---
name: component-contributor
description: >
  Guides an AI agent through implementing a design system component from a GitHub issue spec.
  Covers the full contributor workflow: onboarding → read spec → plan → implement (5-file pattern) → explain decisions → visual review.
  Trigger: When a contributor provides a GitHub issue URL or pastes a component spec and asks to implement it.
  Also delegable from sdd-apply when implementing a component as part of a larger SDD change.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "2.1"
---

## When to Use

- A contributor shares a GitHub issue URL with a component spec
- A contributor pastes the content of an issue and asks to implement it
- Someone says "implement this component", "help me build this", or similar
- Delegated from `sdd-apply` as part of a larger SDD change

---

## When Delegated by SDD Orchestrator

You may receive this delegation from `sdd-apply`:

- **Change name**: the SDD change being processed
- **Tasks assigned**: which tasks from `tasks.md` to execute
- **Artifact store mode**: `engram | openspec | hybrid | none`

When delegated: **skip Phase 0** (the contributor already has context) and start directly from Phase 1.
Return your result in the SDD return envelope format:

```markdown
## Implementation Progress

**Change**: {change-name}
**Tasks completed**: {list}
**Files changed**: {table: file | action | what was done}
**Deviations from design**: {list or "None"}
**Issues found**: {list or "None"}
**Remaining tasks**: {list or "None"}
**Status**: {N}/{total} tasks complete. Ready for verify / Blocked by X
```

---

## Phase 0 — Contributor Onboarding

> Run this phase ONLY when working directly with a contributor (not when delegated from SDD).

Before touching the spec, make sure the contributor understands the stack they are about to work with. Ask them to confirm they are familiar with:

1. **React + TypeScript strict** — `type` always, never `interface`, never `any`
2. **Tailwind v4 `@theme`** — token classes only (`text-brand-light`, `bg-surface-dark`); never raw hex, never `[var(--token)]` when the token exists in `@theme`
3. **CVA (class-variance-authority)** — all variants live in `types.ts`, nowhere else
4. **The 5-file pattern** — each component has exactly: `types.ts`, `useComponentName.ts`, `ComponentName.tsx`, `ComponentName.stories.tsx`, `index.ts`
5. **Storybook 8** — stories are the living documentation AND the test suite

If the contributor is unfamiliar with any of these, briefly explain the concept before moving on. Do NOT assume knowledge — a contributor who copies code without understanding it is a liability, not an asset.

Point them to:
- `docs/GUIDELINES.md` — full coding conventions
- `docs/DESIGN.md` — visual token reference
- `src/styles/theme.css` — the source of truth for every token

---

## Phase 1 — Read the Spec

Before writing a single line of code, extract from the issue:

1. **Component name** and **atomic tier** (atom / molecule / organism)
2. **Props** — name, type, default, required/optional
3. **Variants** — CVA variant keys and values
4. **States** — default, hover, focus, disabled, loading, error, etc.
5. **Accessibility requirements** — aria attributes, keyboard behavior, roles
6. **Reference URL** — study the linked implementation (HeroUI, Radix, etc.)
7. **Design notes** — any visual or interaction specifics

If any of these are missing or ambiguous, **ask the contributor to clarify before proceeding**.
Do NOT invent props or behaviors that are not in the spec.

---

## Phase 1.5 — Spec Review (critique before committing)

> This phase runs AFTER reading the spec and BEFORE planning. Its purpose is to surface gaps, risks, and improvements **while there is still time to adjust** — not after the code is written.

You are not a passive executor. You are a senior contributor reviewing the spec with a critical eye. Present your findings in this format:

```
## Spec Review — {ComponentName}

### Gaps found
- {Item}: {What is missing and why it matters}
  Suggestion: {Concrete proposal}

### Risks found
- {Item}: {What could go wrong during implementation or in production}
  Suggestion: {How to mitigate}

### Improvements proposed
- {Item}: {What could be better, even if technically correct as-is}
  Suggestion: {Concrete proposal}

### Ready to proceed
{Yes / No — and why if No}
```

**What to look for:**

#### Accessibility gaps
- Interactive elements without keyboard behavior described (Enter, Space, Escape, Arrow keys)
- Missing ARIA roles, `aria-label`, `aria-expanded`, `aria-controls`, `aria-live` for dynamic content
- No mention of focus management (e.g. modals, dropdowns — where does focus go on open/close?)
- No `prefers-reduced-motion` consideration when animations or transforms are involved
- Touch target size not mentioned for interactive components

#### Stories gaps
- Missing stories for edge cases: empty state, loading, error, long text overflow, RTL
- No story for each CVA variant axis (a variant without a story is invisible to consumers)
- Missing story for the keyboard/focus interaction if the component has complex behavior
- No story for dark mode if the component has dark-specific visuals

#### Spec clarity issues
- Ambiguous variant names (`large` vs `lg`, `primary` vs `default`)
- Props without clear defaults specified
- Behavior described in prose but not mapped to concrete props or states
- Token references that do not exist in `theme.css` (check before assuming they exist)

#### Architecture concerns
- Component doing too much — multiple responsibilities that should be split into separate components
- State that belongs in the parent being forced into the component
- Composability: should this accept `children` or render its own content? Is the spec explicit?
- Missing `ref` forwarding for elements consumers will need to control programmatically

**Rules for this phase:**
- Be direct. Flag problems clearly — don't soften every suggestion into a question.
- Only flag things that have a real impact: a11y failures, missing stories for documented variants, broken composability. Do NOT nitpick style preferences.
- If the spec is solid and nothing critical is missing, say so explicitly — "No blocking issues found."
- Do NOT start implementing until the contributor has acknowledged your findings (or confirmed they want to proceed as-is).

---

## Phase 2 — Plan (explain before coding)

Before writing any file, present a clear plan to the contributor:

```
## Implementation Plan

**Component**: {ComponentName}
**Tier**: atoms / molecules / organisms
**Directory**: src/components/{tier}/{kebab-name}/

### Token modules loaded
- colors.md — [reason]
- spacing-typography.md — [reason]
- effects.md (partial: focus glow) — [reason]

### Files to create
1. `types.ts` — {X} props, {Y} CVA variants ({list variants})
2. `useComponentName.ts` — {describe logic: state, handlers, aria}
3. `ComponentName.tsx` — presentational, consumes hook
4. `ComponentName.stories.tsx` — {N} stories: Default, Disabled, {variants}
5. `index.ts` — re-exports

### Design decisions
- Tokens used: {list tokens from theme.css}
- CVA variants: {explain variant structure}
- Radix primitive: {yes/no — which one if yes}
- Dark mode: {how it's handled}

### Accessibility
- {aria attributes and roles planned}
- {keyboard behavior}
```

Wait for the contributor to confirm or adjust the plan before proceeding.

### Token modules — load by intent

After reading the spec in Phase 1, declare which modules you need and read them before Phase 2 (Plan). Do not load modules that are not relevant to this component.

| Module | Path | Load when |
|--------|------|-----------|
| `colors` | `tokens/colors.md` | Component uses color, backgrounds, borders, dark mode, or status states |
| `spacing-typography` | `tokens/spacing-typography.md` | Component has layout, padding, text sizing, font weight, or border radius |
| `effects` | `tokens/effects.md` | Component uses glows, shadows, gradients, animations, or backdrop blur |

### Reference modules — load by intent

Load these BEFORE writing the relevant file. They contain canonical patterns extracted from the actual codebase.

| Module | Path | Load when |
|--------|------|-----------|
| `testing` | `references/testing.md` | Writing any test file — Vitest or Storybook play function |
| `html-extension` | `references/html-extension.md` | Component wraps a native HTML element (button, input, select, a, textarea) |
| `radix-patterns` | `references/radix-patterns.md` | Component uses any `@radix-ui/*` primitive |
| `tailwind-merge` | `references/tailwind-merge.md` | Component combines CVA output with conditional or external `className` |
| `biome-rules` | `references/biome-rules.md` | Before writing any TypeScript/TSX file — always load for code quality enforcement |
| `git-workflow` | `references/git-workflow.md` | Before opening a PR or when explaining the contribution workflow to a contributor |

**Mandatory loads (always):**
- `biome-rules` — load before writing any `.ts` or `.tsx` file
- `html-extension` — load for any component that renders a native element

**Matching rules by component type:**

| Component type | Colors | Spacing & Typography | Effects |
|----------------|--------|----------------------|---------|
| Button (primary) | ✅ | ✅ | ✅ |
| Button (secondary / ghost) | ✅ | ✅ | ✅ |
| Badge / Tag / Chip | ✅ | ✅ | — |
| Input / Textarea / Select | ✅ | ✅ | partial (focus glow only) |
| Card | ✅ | ✅ | ✅ |
| Dropdown / Menu | ✅ | ✅ | partial (shadow only) |
| Modal / Dialog | ✅ | ✅ | ✅ |
| Avatar / Icon | ✅ | — | — |
| Spinner / Loader | ✅ | — | partial (animation only) |
| Typography / Heading | ✅ | ✅ | — |
| Navbar / Sidebar | ✅ | ✅ | ✅ |

---

## Phase 3 — Implement (5-file pattern)

Implement files in this order: `types.ts` → `useComponentName.ts` → `ComponentName.tsx` → `ComponentName.stories.tsx` → `index.ts`

After each file, explain what was done and why (Phase 4 runs inline).

### File 1: `types.ts`

**Rules:**
- ALL `type` definitions here — never `interface`
- ALL CVA variants here — never in `.tsx` or `.ts` hook files
- JSDoc `/** @control select */` on every prop that needs a Storybook control
- Import CVA from `class-variance-authority`

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

export const componentVariants = cva(
  'base-class token-class',
  {
    variants: {
      variant: {
        default: 'token-based-classes',
        outlined: 'token-based-classes',
      },
      size: {
        sm: 'token-based-classes',
        md: 'token-based-classes',
        lg: 'token-based-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export type ComponentProps = VariantProps<typeof componentVariants> & {
  /** @control text */
  label?: string
  /** @control boolean */
  disabled?: boolean
  /** Accessibility label for screen readers */
  ariaLabel?: string
}
```

### File 2: `useComponentName.ts`

**Rules:**
- ALL logic here — state, refs, effects, event handlers
- Calls `componentVariants(...)` and returns the className
- Returns a typed object — never `any`
- No JSX, no imports from React DOM

```typescript
import { useRef } from 'react'
import { type ComponentProps, componentVariants } from './types'

type UseComponentReturn = {
  className: string
  ariaLabel: string
  ref: React.RefObject<HTMLElement>
}

const useComponent = (props: ComponentProps): UseComponentReturn => {
  const { variant, size, disabled, ariaLabel, label } = props
  const ref = useRef<HTMLElement>(null)

  const className = componentVariants({ variant, size })

  return {
    className,
    ariaLabel: ariaLabel ?? label ?? 'component',
    ref,
  }
}

export default useComponent
```

### File 3: `ComponentName.tsx`

**Rules:**
- ONLY JSX — zero logic, zero state, zero CVA calls
- Consumes the hook via `use{ComponentName}(props)`
- `FC<ComponentProps>` typing always

```typescript
import type { FC } from 'react'
import useComponent from './useComponent'
import type { ComponentProps } from './types'

const Component: FC<ComponentProps> = (props) => {
  const { className, ariaLabel, ref } = useComponent(props)

  return (
    <div
      ref={ref}
      className={className}
      aria-label={ariaLabel}
    >
      {props.children}
    </div>
  )
}

export default Component
```

### File 4: `ComponentName.stories.tsx`

**Rules:**
- English only — titles, descriptions, arg labels
- Mandatory `parameters.docs.description.component`
- Mandatory `args` on `Default` story — must NOT hardcode props that override `defaultVariants`
- Always include: `Default`, `Disabled`, one story per key variant
- Each story demonstrates ONE axis only — no mixed props across variants in the same story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import Component from './Component'

const meta: Meta<typeof Component> = {
  title: 'Atoms/Component',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'Concise English description of what this component does and when to use it.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = {
  args: {
    label: 'Example',
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}
```

### File 5: `index.ts`

```typescript
import ComponentName from './ComponentName'
export * from './types'
export default ComponentName
```

---

## Phase 4 — Explain (inline, after each file)

After writing each file, add a short explanation:

```
### Why this file looks like this

- **[Decision]**: [Reason] — e.g. "CVA variants are in `types.ts`, not here, because the hook file owns logic, not appearance contracts"
- **[Token used]**: [Why this token and not another] — e.g. "`bg-surface-dark` for the card background because it sits one level above the canvas"
- **[Aria attribute]**: [What it communicates to screen readers]
```

This is the learning layer — the contributor must understand every decision, not just copy it.

---

## Phase 5 — Visual Review

After all 5 files are written, run a visual quality check before calling the component done.
This is not optional — a component that compiles without errors can still be visually broken.

Load the `visual-review` skill for the full review protocol. At minimum, apply these checks:

### 5.1 — State completeness

Every interactive component must have all applicable states:

- [ ] **Base** — background, border, shadow/glow, text color all defined
- [ ] **Hover** — tonal shift upward (lighter, more elevated); at least one visible property changes
- [ ] **Focus** — `box-shadow` focus ring present; `outline: none` NEVER naked
- [ ] **Active/pressed** — `transform: scale(0.98)` on buttons; shadow reduced
- [ ] **Disabled** — `opacity: 0.4` + `pointer-events: none` + `cursor: not-allowed`; colors unchanged

### 5.2 — Glow correctness

- **Button Primary** — always-on 4-layer glow at base, amplified on hover, focus ring as outermost layer
- **Button Secondary** — always-on 3-layer glow (no tight ring — has a real border), amplified on hover
- **Cards / badges / nav** — glow appears only on hover/focus; no `box-shadow` at rest

### 5.3 — Transition correctness

- [ ] No `transition: all` — enumerate specific properties
- [ ] No layout-forcing properties animated: `width`, `height`, `top`, `left`, `margin`, `padding`

### 5.4 — Accessibility spot check

- [ ] All interactive elements: minimum `44×44px` touch target
- [ ] Focus ring: `box-shadow: 0 0 0 3px rgba(255, 0, 54, 0.40)` (dark) / `rgba(219, 20, 60, 0.35)` (light)
- [ ] Focus ring **merged** with existing `box-shadow` layers — never replaces them
- [ ] Light mode text color: minimum `#cc0030` — NEVER `#ff0036` on white (fails WCAG AA)
- [ ] `@media (prefers-reduced-motion: reduce)` disables transforms and scroll animations

### Reporting

```
[SEVERITY] Component — State/Element
Problem: [exact property and value that is wrong]
Expected: [what the spec requires]
Found: [what is in the code]
```

Severity: **CRITICAL** (a11y failure) → **MAJOR** (compositional rule broken) → **MINOR** (spec inconsistency) → **SUGGESTION**

Fix all CRITICAL and MAJOR before marking the component complete.

---

## Checklist before finishing

**Structure**
- [ ] `types.ts` — all props typed, all CVA variants defined, JSDoc controls present
- [ ] `useComponentName.ts` — all logic, no JSX, returns typed object
- [ ] `ComponentName.tsx` — only JSX, consumes hook, no logic
- [ ] `ComponentName.stories.tsx` — Default + Disabled + variant stories, English, description present, no overriding defaultVariants in Default args
- [ ] `index.ts` — re-exports correct

**Tokens & theming**
- [ ] All tokens from `theme.css` — no hardcoded values
- [ ] Dark mode handled — paired `dark:` classes where applicable

**Visual states**
- [ ] Hover state implemented and tonally correct
- [ ] Focus ring: `box-shadow` only, merged with existing shadows, never naked `outline`
- [ ] Active/pressed: `scale(0.98)` on buttons
- [ ] Disabled: `opacity: 0.4` + `pointer-events: none`, no color substitution
- [ ] No `transition: all` — specific properties enumerated

**Accessibility**
- [ ] Aria attributes from spec implemented
- [ ] Minimum touch target `44×44px` on interactive elements
- [ ] `prefers-reduced-motion` handled if transforms are used

**Learning**
- [ ] Explained every decision to the contributor after each file

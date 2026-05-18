---
name: component-contributor
description: >
  Guides an AI agent through implementing a design system component from a GitHub issue spec.
  Covers the full contributor workflow: onboarding → read spec → specification review → visual preflight → plan → implement (6-file pattern) → explain decisions → visual review → component review before PR.
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

## Contributor Workflow Overview

Follow the phases in order. Do not compress or skip the pre-implementation gates just because the component looks simple.

1. **Onboarding** — confirm the contributor understands the stack and project conventions.
2. **Read the spec** — extract props, variants, states, accessibility, reference URL, and design notes.
3. **Specification review** — critique gaps, risks, and improvements before committing to an implementation shape.
4. **Visual preflight** — load design sources and map the component to tokens, surfaces, states, transitions, focus, and disabled treatment before planning.
5. **Plan** — explain files, tokens, CVA variants, accessibility, stories, and testing before coding.
6. **Implement + explain** — build the 6-file pattern and teach the reasoning after each file.
7. **Visual review** — verify state completeness, glow, transitions, contrast, focus, and reduced motion.
8. **Component review before PR** — run an explicit component audit to catch architecture, story, token, test, and accessibility inconsistencies before opening a pull request.

---

## Phase 0 — Contributor Onboarding

> Run this phase ONLY when working directly with a contributor (not when delegated from SDD).

Before touching the spec, make sure the contributor understands the stack they are about to work with. Ask them to confirm they are familiar with:

1. **React + TypeScript strict** — `type` always, never `interface`, never `any`
2. **Tailwind v4 `@theme`** — token classes only (`text-brand-light`, `bg-surface-dark`); never raw hex, never `[var(--token)]` when the token exists in `@theme`, and never `var()` inside component source files
3. **CVA (class-variance-authority)** — all variants live in `types.ts`, nowhere else
4. **The 6-file pattern** — each component has exactly: `types.ts`, `useComponentName.ts`, `ComponentName.tsx`, `ComponentName.test.tsx`, `ComponentName.stories.tsx`, `index.ts`
5. **Storybook 8** — stories are the living documentation (not the test suite — tests live in `.test.tsx`)
6. **Project story conventions** — autodocs behavior, action helper, and controls must match the repo's canonical stories exactly

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

If the issue came from GitHub and the rendered page does not expose comments, fetch the issue comments via the GitHub API (`/repos/{owner}/{repo}/issues/{number}/comments`) or `gh api` before extracting the spec. The validated spec may live in a comment thread.

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

## Phase 1.75 — Visual Design Alignment

Before planning implementation, load and apply the project visual sources:

1. `docs/DESIGN.md` — visual identity, surfaces, typography, color usage, and component direction
2. `docs/COMPONENTS.md` — state-by-state visual rules, transitions, touch target, focus, disabled behavior
3. `src/styles/theme.css` — source of truth for available Tailwind v4 token utilities

Extract the relevant visual decisions for this component:

- Surface pattern: opaque, raised, tinted, or floating/frosted — never guess
- Text, background, border, radius, spacing, glow, and focus tokens
- Base, hover, focus, active, disabled, empty/loading/error states that apply
- Transition constraints: no `transition-all`, no layout-forcing animated properties
- Accessibility visuals: `44px` touch target, `box-shadow` focus ring, disabled `opacity: 0.4` + `cursor-not-allowed` + `pointer-events-none`
- Dark mode pairings and contrast requirements

Do this before writing the Implementation Plan. The later visual review still runs, but development must start visually aligned.

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
4. `ComponentName.test.tsx` — complete component test suite (hook tests + component tests)
5. `ComponentName.stories.tsx` — {N} stories: Default, Disabled, {variants}
6. `index.ts` — re-exports

### Design decisions
- Tokens used: {list tokens from theme.css}
- CVA variants: {explain variant structure}
- Radix primitive: {yes/no — which one if yes}
- Dark mode: {how it's handled}

### Visual alignment
- Surface pattern: {opaque / raised / tinted / floating — and why}
- States planned: {base, hover, focus, active, disabled, loading/error/empty if applicable}
- Focus ring: {token/class from theme.css}
- Disabled treatment: opacity + cursor + pointer-events, with colors unchanged
- Transitions: {enumerated properties only; no layout-forcing properties}
- Touch target: {how 44px minimum is satisfied for interactive elements}

### Accessibility
- {aria attributes and roles planned}
- {keyboard behavior}
```

Wait for the contributor to confirm or adjust the plan before proceeding.

### Token modules — load by intent

After reading the spec in Phase 1, declare which modules you need and read them before Phase 2 (Plan). Do not load modules that are not relevant to this component.

| Module               | Path                           | Load when                                                                 |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `colors`             | `tokens/colors.md`             | Component uses color, backgrounds, borders, dark mode, or status states   |
| `spacing-typography` | `tokens/spacing-typography.md` | Component has layout, padding, text sizing, font weight, or border radius |
| `effects`            | `tokens/effects.md`            | Component uses glows, shadows, gradients, animations, or backdrop blur    |

### Reference modules — load by intent

Load these BEFORE writing the relevant file. They contain canonical patterns extracted from the actual codebase.

| Module           | Path                           | Load when                                                                                      |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `testing`        | `references/testing.md`        | Writing any test file — Vitest tests in `.test.tsx`                                            |
| `stories`        | `references/stories.md`        | Writing or reviewing any `*.stories.tsx` file; Storybook autodocs/actions/controls conventions |
| `html-extension` | `references/html-extension.md` | Component wraps a native HTML element (button, input, select, a, textarea)                     |
| `radix-patterns` | `references/radix-patterns.md` | Component uses any `@radix-ui/*` primitive                                                     |
| `tailwind-merge` | `references/tailwind-merge.md` | Component combines CVA output with conditional or external `className`                         |
| `biome-rules`    | `references/biome-rules.md`    | Before writing any TypeScript/TSX file — always load for code quality enforcement              |
| `git-workflow`   | `references/git-workflow.md`   | Before opening a PR or when explaining the contribution workflow to a contributor              |

**Mandatory loads (always):**

- `biome-rules` — load before writing any `.ts` or `.tsx` file
- `docs/DESIGN.md` — load before Phase 2 for every component
- `src/styles/theme.css` — load before Phase 2 for every component
- `docs/COMPONENTS.md` — load before Phase 2 for every interactive or visual component
- `html-extension` — load for any component that renders a native element

**Mandatory story convention check:**

- Before writing `types.ts` or `ComponentName.stories.tsx`, read the project `stories` reference if it exists.
- If no dedicated `stories` reference exists, inspect at least ONE mature atom story already accepted in the repo and mirror its conventions exactly.
- Do NOT invent Storybook conventions from generic knowledge.

**Matching rules by component type:**

| Component type             | Colors | Spacing & Typography | Effects                   |
| -------------------------- | ------ | -------------------- | ------------------------- |
| Button (primary)           | ✅     | ✅                   | ✅                        |
| Button (secondary / ghost) | ✅     | ✅                   | ✅                        |
| Badge / Tag / Chip         | ✅     | ✅                   | —                         |
| Input / Textarea / Select  | ✅     | ✅                   | partial (focus glow only) |
| Card                       | ✅     | ✅                   | ✅                        |
| Dropdown / Menu            | ✅     | ✅                   | partial (shadow only)     |
| Modal / Dialog             | ✅     | ✅                   | ✅                        |
| Avatar / Icon              | ✅     | —                    | —                         |
| Spinner / Loader           | ✅     | —                    | partial (animation only)  |
| Typography / Heading       | ✅     | ✅                   | —                         |
| Navbar / Sidebar           | ✅     | ✅                   | ✅                        |

---

## Phase 3 — Implement (6-file pattern)

Implement files in this order: `types.ts` → `useComponentName.ts` → `ComponentName.tsx` → `ComponentName.test.tsx` → `ComponentName.stories.tsx` → `index.ts`

After each file, explain what was done and why (Phase 4 runs inline).

### File 1: `types.ts`

**Rules:**

- ALL `type` definitions here — never `interface`
- Before declaring a new public/shared prop type in `component/types.ts`, check `src/types/index.ts` first; reusable design-system types must live in `src/types`
- Only keep types in `component/types.ts` when they are truly component-specific and not reusable across multiple components
- ALL CVA variants here — never in `.tsx` or `.ts` hook files
- Every PUBLIC prop exposed in stories MUST have `@control` and `@default` (if applicable) JSDoc annotations
- JSDoc format for Storybook controls:
  ```typescript
  /**
   * @control controlType
   * @default defaultValue
   */
  propName?: Type
  ```
- Props without defaults (e.g. callbacks, optional content) may omit `@default`
- Import CVA from `class-variance-authority`
- Never use `[var(--token)]` when an equivalent Tailwind utility exists in `@theme`
- Never use `var()` directly in component source files; if Tailwind cannot express a token-backed visual treatment, define a reusable class/token in `src/styles/theme.css` or `src/styles/base.css` first

**Available control types:**

- `@control text` — freeform text input
- `@control boolean` — toggle switch
- `@control number` — numeric input
- `@control range` — slider (specify min/max in description if needed)
- `@control select` — dropdown for single selection (requires `options` defined separately or inferred from type)
- `@control radio` — radio buttons for single selection
- `@control inline-radio` — inline radio buttons
- `@control check` — checkboxes for multiple selection
- `@control inline-check` — inline checkboxes
- `@control color` — color picker
- `@control date` — date picker
- `@control file` — file upload
- `@control object` — JSON editor for complex objects

```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const componentVariants = cva("base-class token-class", {
  variants: {
    variant: {
      default: "token-based-classes",
      outlined: "token-based-classes",
    },
    size: {
      sm: "token-based-classes",
      md: "token-based-classes",
      lg: "token-based-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type ComponentProps = VariantProps<typeof componentVariants> & {
  /**
   * @control text
   * @default Example
   */
  label?: string;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control text
   */
  ariaLabel?: string;
};
```

### File 2: `useComponentName.ts`

**Rules:**

- ALL logic here — state, refs, effects, event handlers
- Calls `componentVariants(...)` and returns the className
- Returns a typed object — never `any`
- No JSX, no imports from React DOM

```typescript
import { useRef } from "react";
import { type ComponentProps, componentVariants } from "./types";

type UseComponentReturn = {
  className: string;
  ariaLabel: string;
  ref: React.RefObject<HTMLElement>;
};

const useComponent = (props: ComponentProps): UseComponentReturn => {
  const { variant, size, disabled, ariaLabel, label } = props;
  const ref = useRef<HTMLElement>(null);

  const className = componentVariants({ variant, size });

  return {
    className,
    ariaLabel: ariaLabel ?? label ?? "component",
    ref,
  };
};

export default useComponent;
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

### File 4: `ComponentName.test.tsx`

**Rules:**

- ALL tests here — both hook tests and component behavior tests
- Must test: hook logic with `renderHook`, component rendering with `render/screen`, ARIA attributes, user interactions with `userEvent`, disabled states
- All mocks declared BEFORE component imports
- Never test internal CSS class strings
- Load `references/testing.md` before writing this file

```typescript
import { renderHook } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Component from './Component'
import useComponent from './useComponent'

// Mocks first
vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: () => null
}))

describe('useComponent — hook logic', () => {
  it('returns default variant', () => {
    const { result } = renderHook(() => useComponent({}))
    expect(result.current.variant).toBe('default')
  })
})

describe('Component — behavior', () => {
  it('renders correctly', () => {
    render(<Component label="Test" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Component label="Click" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### File 5: `ComponentName.stories.tsx`

**Rules:**

- HARD RULE: all Storybook documentation must be in English, including JSDoc headings, descriptions, comments, story names, and arg labels
- Mandatory component documentation as a JSDoc block immediately above `const meta`; do not put component docs in `parameters.docs.description.component`
- The component-level JSDoc block must use the canonical English story header structure:
  - `## Description` — required for every component; explain what it does and when to use it
  - `## Dependencies` — include only when the story/component uses other design-system components or external primitives; list the dependency and why it is used
  - `## Usage Guide` — include only when usage is complex; explain composition, constraints, or non-obvious behavior
- Every story block must have concise English JSDoc immediately above its `export const StoryName`
- Do NOT render documentation cards, panels, helper text blocks, or usage notes inside the story canvas; move that text into component-level or story-level JSDoc
- Mandatory `args` on `Default` story — must NOT hardcode props that override `defaultVariants`
- Always include: `Default`, `Disabled`, one story per key variant
- Each story demonstrates ONE axis only — no mixed props across variants in the same story
- If `autodocs` is enabled for the project, do NOT define manual `argTypes` in `meta` or individual stories unless the project reference explicitly allows an exception
- Event handlers in stories must use `@storybook/addon-actions` (`action(...)`) — never invent a different helper
- Never use inline no-op handlers such as `() => undefined` in story args
- Token styling in stories must use Tailwind utility classes or reusable semantic classes from the style system; do not bypass them with `[var(--token)]` or inline `var()` in story/component source
- Story conventions must match the canonical repo pattern for autodocs, controls, and actions
- NO `play` functions — interaction testing belongs in `.test.tsx`

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import Component from "./Component";

/**
 * ## Description
 * Concise English description of what this component does and when to use it.
 *
 * ## Dependencies
 * Include only when the story/component uses other design-system components or external primitives.
 *
 * ## Usage Guide
 * Include only when usage is complex or has non-obvious constraints.
 */
const meta: Meta<typeof Component> = {
  title: "Atoms/Component",
  component: Component,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Component>;

/**
 * Shows the default component configuration using its default variants.
 */
export const Default: Story = {
  args: {
    label: "Example",
  },
};

/**
 * Shows the component in a non-interactive disabled state.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
```

### File 6: `index.ts`

```typescript
export { ComponentName } from "./ComponentName";
export * from "./types";
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

After all 6 files are written, run a visual quality check before calling the component done.
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

## Phase 6 — Component Review Before PR

Before opening a PR, run a fresh component review to catch inconsistencies that implementation and visual review may have missed.
This is mandatory for AI-generated or AI-assisted component work.

Load the `components-auditor` skill and audit the component against:

- 6-file pattern and file responsibilities
- TypeScript conventions (`type`, no `interface`, no `any`, strict return types)
- CVA structure and variant placement
- Token usage (`theme.css` utilities, no raw hex, no direct `var()` in component source)
- Storybook conventions (`autodocs`, actions, controls, docs header sections)
- Tests (hook logic + component behavior, accessibility, disabled, keyboard)
- Visual states and accessibility (focus visibility, touch target, contrast, reduced motion)

Report findings before PR in this format:

```markdown
## Pre-PR Component Review — {ComponentName}

**Verdict**: PASS / PASS WITH WARNINGS / BLOCKED

### Blocking issues

- {issue or "None"}

### Warnings

- {issue or "None"}

### Evidence

- `npm test -- --run src/components/{tier}/{component}/{Component}.test.tsx`: {result}
- `npm run build` or project-required check: {result}
- Storybook/manual visual check: {result or "not run — reason"}
```

Rules:

- Do NOT open a PR with CRITICAL or MAJOR audit issues.
- If warnings remain, document why they are acceptable or create follow-up issues.
- Link the component issue in the PR and include the review evidence in the PR body.

---

## Checklist before finishing

**Structure**

- [ ] `types.ts` — all props typed, all CVA variants defined, full JSDoc present, JSDoc controls present where needed
- [ ] `useComponentName.ts` — all logic, no JSX, returns typed object
- [ ] `ComponentName.tsx` — only JSX, consumes hook, no logic
- [ ] `ComponentName.test.tsx` — complete test suite (hook tests with renderHook + component tests with render/screen/userEvent)
- [ ] `ComponentName.stories.tsx` — Default + Disabled + variant stories, fully English JSDoc above `meta`, `## Description` present, optional `## Dependencies` / `## Usage Guide` used when applicable, no overriding defaultVariants in Default args, canonical autodocs/actions conventions followed, NO play functions
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

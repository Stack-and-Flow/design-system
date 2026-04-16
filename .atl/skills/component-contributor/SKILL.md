---
name: component-contributor
description: >
  Guides an AI agent through implementing a design system component from a GitHub issue spec.
  Covers the full contributor workflow: read spec → plan → implement (5-file pattern) → explain decisions.
  Trigger: When a contributor provides a GitHub issue URL or pastes a component spec and asks to implement it.
license: Apache-2.0
metadata:
  author: stack-and-flow
  version: "1.0"
---

## When to Use

- A contributor shares a GitHub issue URL with a component spec
- A contributor pastes the content of an issue and asks to implement it
- Someone says "implement this component", "help me build this", or similar

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

## Phase 2 — Plan (explain before coding)

Before writing any file, present a clear plan to the contributor:

```
## Implementation Plan

**Component**: {ComponentName}
**Tier**: atoms / molecules / organisms
**Directory**: src/components/{tier}/{kebab-name}/

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
  // base classes using tokens only
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
  // ... handlers
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
- Spreads hook return onto the element
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
- Mandatory `args` on `Default` story
- Always include: `Default`, `Disabled`, one story per key variant
- No DOM manipulation in module scope — use decorators if needed

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
    variant: 'default',
    size: 'md',
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

- **[Decision]**: [Reason]. Example: "CVA variants are in `types.ts`, not here, because..."
- **[Token used]**: [Why this token and not another]. Example: "`bg-primary` for the main action because..."
- **[Aria attribute]**: [What it communicates to screen readers]. Example: "`aria-disabled` instead of the HTML `disabled` attribute because..."
```

This is the learning layer — the contributor must understand every decision, not just copy it.

---

## Design System Tokens

Always use tokens from `src/styles/theme.css`. Never hardcode values.
Full visual reference: `docs/DESIGN.md` — read it before building any component.

### Colors — Brand (Crimson Red)
| Token | Value | Use for |
|-------|-------|---------|
| `color-brand-light` | `#db143c` | Primary brand — light mode |
| `color-brand-dark` | `#ff0036` | Primary brand — dark mode (more vibrant on black) |
| `color-primary` | `#db143c` | Semantic alias — use this in components |
| `color-primary-hover` | `#b60f32` | Hover state |
| `color-primary-active` | `#8c0b26` | Active/pressed state |
| `color-red-100` → `color-red-900` | Light → Dark scale | State backgrounds, error tints |

### Colors — Dark mode surfaces
| Token | Use for |
|-------|---------|
| `color-background-dark` (`#060C13`) | Page canvas — deep blue-slate, NOT pure black |
| `color-surface-dark` (`#0B131E`) | Cards, code blocks, dropdowns — opaque |
| `color-surface-raised-dark` (`#0F1824`) | Table headers, elevated panels |
| `color-border-dark` (`#172230`) | Standard borders |
| `color-border-strong-dark` (`#202C3C`) | Interactive / focus borders |
| `color-text-dark` | Primary text (white, 21:1 contrast) |
| `color-text-secondary-dark` | Secondary text |
| `color-text-tertiary-dark` | Tertiary / muted text |
| `color-text-disabled-dark` | Disabled states |

### Colors — Light mode surfaces
| Token | Use for |
|-------|---------|
| `color-background-light` (`#ffffff`) | Page canvas |
| `color-surface-light` (`#f4f5f7`) | Cards, containers |
| `color-surface-raised-light` (`#eaecf0`) | Elevated surfaces |
| `color-border-light` | Standard borders (rgba) |
| `color-border-strong-light` | Interactive borders (rgba) |
| `color-text-light` | Primary text |
| `color-text-secondary-light` | Secondary text |
| `color-text-disabled-light` | Disabled states |

### Colors — Transparencies (tint system)
| Token | Use for |
|-------|---------|
| `color-red-tint-subtle` | Secondary button background |
| `color-red-tint-low` | Active menu item |
| `color-red-tint-high` | Glow base, code highlight |
| `color-white-tint-faint` | Subtle hover background |
| `color-white-tint-high` | Interactive border |
| `color-black-tint-heavy` | Modal overlay backdrop |

### Colors — Semantic (status)
| Token | Use for |
|-------|---------|
| `color-success` / `color-success-light` | Success states (dark/light mode) |
| `color-warning` / `color-warning-light` | Warning states |
| `color-error` / `color-error-light` | Error states (`#ff0036` / `#db143c`) |
| `color-info` / `color-info-light` | Info states |

### Glows & Shadows
| Token | Use for |
|-------|---------|
| `glow-btn-primary` | Primary button neon glow (multi-layer) |
| `glow-btn-primary-hover` | Primary button hover glow |
| `glow-btn-secondary` | Secondary button subtle glow |
| `glow-focus-dark` / `glow-focus-light` | Focus ring (WCAG AA) |
| `shadow-dropdown` | Dropdown menus |
| `shadow-dropdown-light` | Dropdown menus — light mode |

### Gradients
| Token | Use for |
|-------|---------|
| `gradient-btn-primary` | Primary button background |
| `gradient-btn-primary-hover` | Primary button hover |
| `gradient-background-dark` | Page background — dark |
| `grid-bg-dark` / `grid-bg-light` | Technical grid canvas (40×40px) |

### Spacing (8px base scale)
| Token | Value | Use for |
|-------|-------|---------|
| `spacing-xxs` / `spacing-1` | 4px | Micro gaps (icon + label) |
| `spacing-xs` / `spacing-2` | 8px | Tight padding |
| `spacing-sm` / `spacing-3` | 12px | Standard padding small |
| `spacing-md` / `spacing-4` | 16px | Default padding/gap |
| `spacing-lg` / `spacing-6` | 24px | Section spacing |
| `spacing-xl` / `spacing-8` | 32px | Large section spacing |
| `spacing-2xl` / `spacing-12` | 48px | XL section spacing |
| `spacing-3xl` / `spacing-20` | 80px | Hero/page-level spacing |

### Typography (Space Grotesk Variable only)
| Token | Use for |
|-------|---------|
| `font-primary` | All text — only one font in this system |
| `font-weight-medium` (300) | Body text baseline |
| `font-weight-semibold` (500) | Buttons, badges, labels |
| `font-weight-bold` (700) | Headings h1–h6 |
| `text-display` (56px) | Hero landing titles |
| `text-h1` → `text-h6` | Section headings |
| `text-body` (16px) | Default body text |
| `text-small` (14px) | Captions, labels |
| `text-xs` (12px) | Badges, micro tags |
| `leading-tight` / `leading-relaxed` | Line height control |
| `tracking-ui` | Buttons, nav links |

### Border radius
| Token | Value | Use for |
|-------|-------|---------|
| `radius-xs` | 3px | Micro badges, "New" labels |
| `radius-sm` | 6px | Dropdown items, menu links |
| `radius-md` | 8px | Cards, inputs, secondary buttons |
| `radius-lg` | 12px | Large cards, pagination |
| `radius-pill` | 9999px | Primary CTA buttons |

### Animations
| Token | Use for |
|-------|---------|
| `animate-fadeIn` / `animate-fadeOut` | Mount/unmount transitions |
| `animate-rotation-360` | Loading spinners |
| `animate-badgeIn` / `animate-badgeOut` | Badge appear/disappear |

### Dark mode pattern
```typescript
// Always pair dark/light tokens using the dark variant
'bg-color-background-light dark:bg-color-background-dark'
'text-color-text-light dark:text-color-text-dark'
'border-color-border-light dark:border-color-border-dark'
// For interactive borders:
'border-color-border-strong-light dark:border-color-border-strong-dark'
```

---

## Anti-patterns — never generate these

| Anti-pattern | Why |
|---|---|
| Logic or state in `ComponentName.tsx` | Violates Container/Presentational pattern |
| `cva()` in `.tsx` or `useHook.ts` | CVA belongs exclusively in `types.ts` |
| `export interface` | Project uses `type` exclusively |
| `any` type | Type safety is non-negotiable |
| `#hex`, `px`, `rem` hardcoded in classes | Breaks the token system |
| Arbitrary values (`p-[14px]`, `text-[#fff]`) | Same |
| Spanish text in code, comments, or stories | English only |
| DOM APIs in module scope of stories | Breaks Storybook SSR |
| `aria-label` hardcoded as string literal | Must be a prop so consumers can translate |
| Skipping the explanation after each file | Learning is mandatory, not optional |

---

## Visual States — Mandatory Rules

Every interactive component MUST implement all states that apply. No exceptions.

### Focus
```
focus-visible:outline-none
focus-visible:shadow-[var(--glow-focus-dark)]
dark:focus-visible:shadow-[var(--glow-focus-dark)]
```
- NEVER `outline` for focus rings — always `box-shadow`
- Use token `--glow-focus-dark` / `--glow-focus-light`

### Disabled
```
disabled:pointer-events-none disabled:opacity-40
```
- NEVER change color to indicate disabled — only opacity
- NEVER `opacity-50` or other values — always `opacity-40`

### Hover
- Always transition specific properties — NEVER `transition-all`
- Enumerate: `transition-[background,color,box-shadow] duration-200 ease-[ease]`
- Hover MUST change at least one visible property (bg, border, shadow, or color)

### Active / Pressed
```
active:scale-[0.98]
```
- Buttons always have subtle press feedback via scale
- Active shadow should be less than hover shadow (press = contained energy)

### Loading
- Use `disabled` + spinner — never change button shape or size
- `pointer-events-none` while loading

### Transitions
| Property | Duration | Easing |
|----------|----------|--------|
| `box-shadow` | 250ms | `ease` |
| `background` | 250ms | `ease` |
| `color`, `border-color` | 200ms | `ease` |
| `opacity` | 200ms | `ease` |
| `transform` | 150ms | `ease` |

### Backdrop blur — restricted use
`backdrop-filter: blur()` ONLY on floating elements: navbar, modals, sidebars, tooltips.
NEVER on cards, inputs, buttons, or static content.

### Gradient borders
Use `::before` pseudo-element — NEVER `border-image`:
```
before:absolute before:inset-[-1.5px] before:rounded-[inherit] before:z-[-1]
before:bg-[linear-gradient(135deg,...)]
```
The parent needs: `relative overflow-visible isolate border border-transparent`

---

## Checklist before finishing

- [ ] `types.ts` — all props typed, all CVA variants defined, JSDoc controls present
- [ ] `useComponentName.ts` — all logic, no JSX, returns typed object
- [ ] `ComponentName.tsx` — only JSX, consumes hook, no logic
- [ ] `ComponentName.stories.tsx` — Default + Disabled + variant stories, English, description present
- [ ] `index.ts` — re-exports correct
- [ ] All tokens from `theme.css` — no hardcoded values
- [ ] Dark mode handled — paired `light/dark:` classes
- [ ] Aria attributes from spec implemented
- [ ] Explained every decision to the contributor

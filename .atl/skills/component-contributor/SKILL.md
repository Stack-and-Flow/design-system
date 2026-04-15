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

### Colors — Brand
| Token | Value | Use for |
|-------|-------|---------|
| `primary` | `#830213` | Main brand actions, primary buttons |
| `secondary` | `#b41520` | Secondary brand, hover states |
| `accent` | `#d61e2b` | Highlights, focus rings |
| `red-100` → `red-900` | Light → Dark reds | State colors, error backgrounds |

### Colors — Dark mode surfaces
| Token | Use for |
|-------|---------|
| `background-dark` | Page/app background |
| `gray-dark-700` | Card/panel background |
| `gray-dark-600` | Elevated surfaces, borders |
| `gray-dark-400` | Disabled text, placeholders |
| `text-dark` | Primary text (white) |
| `secondary-dark` | Secondary text, icons |

### Colors — Light mode surfaces
| Token | Use for |
|-------|---------|
| `background-light` | Page/app background |
| `gray-light-200` | Card/panel background |
| `gray-light-400` | Borders, dividers |
| `text-light` | Primary text (near-black) |
| `secondary-light` | Secondary text |

### Colors — Semantic (status)
| Token | Use for |
|-------|---------|
| `green` / `green-light` / `green-dark` | Success states |
| `yellow` / `yellow-light` / `yellow-dark` | Warning states |
| `blue` / `blue-light` / `blue-dark` | Info states |
| `orange` / `orange-light` / `orange-dark` | Caution states |

### Spacing
| Token | Value | Use for |
|-------|-------|---------|
| `xxs` | 0.25rem | Micro gaps (icon + label) |
| `xs` | 0.5rem | Tight padding |
| `sm` | 0.75rem | Standard padding small |
| `md` | 1rem | Default padding/gap |
| `lg` | 1.5rem | Section spacing |
| `xl` | 2rem | Large section spacing |

### Typography
| Token | Use for |
|-------|---------|
| `font-primary` ("WildWolf") | Headings, brand text |
| `font-secondary` ("Univia") | Body text, UI labels |
| `font-secondary-bold` ("UniviaBold") | Emphasis, CTA labels |
| `text-h1` → `text-h6` | Heading sizes |
| `text-base` | Body text |
| `text-small` | Captions, helper text |

### Shadows
| Token | Use for |
|-------|---------|
| `shadow-custom-sm` | Subtle elevation (cards on hover) |
| `shadow-custom-md` | Medium elevation (dropdowns, popovers) |
| `shadow-custom-lg` | High elevation (modals, toasts) |

### Animations
| Token | Use for |
|-------|---------|
| `animate-fadeIn` / `animate-fadeOut` | Mount/unmount transitions |
| `animate-rotation-360` | Loading spinners |
| `animate-badgeIn` / `animate-badgeOut` | Badge appear/disappear |

### Dark mode pattern
```typescript
// Always pair dark/light tokens using the dark variant
'bg-background-light dark:bg-background-dark'
'text-text-light dark:text-text-dark'
'border-gray-light-400 dark:border-gray-dark-600'
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

# Technical Guidelines

Welcome to the Stack-and-Flow Design System codebase. We strictly adhere to **Atomic Design** combined with the **Container/Presentational pattern**. Following these guidelines is **MANDATORY** for any PR.

---

## Architecture: Atomic Design

Our UI is broken down into three main levels of complexity:

- **Atoms**: The basic building blocks (e.g., `Button`, `Badge`, `Input`). They do not depend on other components in the system, except utility functions.
- **Molecules**: Groups of atoms bonded together to form a functional unit (e.g., `Modal` typically uses buttons, typography, etc.).
- **Organisms**: Complex UI components forming distinct sections of an interface (e.g., a `Header` comprising a logo, search molecule, and navigation atoms).

---

## Pattern: Container & Presentational

Every single component MUST be split into logic (Container) and rendering (Presentational). We achieve this through custom hooks and `.tsx` files.

### 5-File Structure

Every component MUST live inside a kebab-case directory (`src/components/atoms/button/`) and contain EXACTLY these five files:

| File | Purpose | Rule |
| ---- | ------- | ---- |
| `Button.tsx` | Presentational Component | ONLY JSX and rendering logic. Consumes the hook. |
| `useButton.ts` | Container Hook | Contains ALL logic, state, and `cva` class generation. |
| `types.ts` | Types & Variants | Defines component props using `type`, and exports `cva` variants. |
| `index.ts` | Public API | Re-exports the component and types. |
| `Button.stories.tsx` | Documentation | Contains Storybook definition, `args`, and `parameters.docs`. |

### 1. Types & Variants (`types.ts`)
ALL `cva` variants go here, never in the hook or component.
Use JSDoc comments to automatically generate Storybook controls.

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  ['flex items-center justify-center font-secondary-bold'],
  {
    variants: {
      variant: {
        primary: 'bg-secondary text-text-dark',
        ghost: 'bg-transparent text-text-light'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

export type ButtonProps = {
  /**
   * @control select
   * @default primary
   */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  className?: string;
  disabled?: boolean;
};
```

### 2. Container Hook (`useButton.ts`)
The hook returns everything the element needs: CSS classes, event handlers, mapped props, and `aria` attributes.

```typescript
import { buttonVariants, type ButtonProps } from './types';

export const useButton = ({
  variant = 'primary',
  className,
  disabled = false,
  ...props
}: ButtonProps) => {
  // Logic here (refs, state, effects)
  const buttonClass = buttonVariants({ variant, className });

  return {
    buttonClass,
    disabled,
    ...props
  };
};
```

### 3. Presentational Component (`Button.tsx`)
It only destructures what it needs from the hook and renders it.

```tsx
import type { FC, ComponentProps } from 'react';
import type { ButtonProps } from './types';
import { useButton } from './useButton';

const Button: FC<ButtonProps & ComponentProps<'button'>> = ({ ...props }) => {
  const { buttonClass, disabled, children } = useButton(props);

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
```

### 4. Public API (`index.ts`)
```typescript
import Button from './Button';
export * from './types';
export default Button;
```

---

## TypeScript Rules

- **`type` over `interface`**: ALWAYS use `export type ComponentProps = {}`. Do NOT use `interface`.
- **No `any`**: Explicit `any` is strictly prohibited. If you don't know the type, use `unknown` or narrow it down properly.
- **Explicit Props**: Never implicitly type props. Everything MUST be explicitly defined in `types.ts`.
- **Component definition**: Use `FC<ComponentProps>` and `export default Component`.

---

## Storybook Rules

- **English only**: All stories must be written in English.
- **Mandatory Controls**: Use JSDoc comments (`/** @control text */`) in `types.ts` to power the controls.
- **Mandatory Description**: Every component story MUST include a docs description:
  ```typescript
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component used to trigger actions.'
      }
    }
  }
  ```
- **Args**: Define default `args` for the base story.

---

## System Tokens & Styling

We use Tailwind v4 with `@theme` configurations defined in `src/styles/theme.css`.

- **MANDATORY**: You MUST use the design system's CSS custom properties (tokens) via Tailwind classes.
- **NO HARDCODING**: Never hardcode colors (e.g., `#FF0000`), spacing (`16px`, `1rem`), or fonts in inline styles or arbitrary Tailwind classes (e.g., `text-[#fce9ea]`).
- Use the predefined classes: `text-text-dark`, `bg-secondary`, `gap-sm`, `fs-h1`, etc.

---

## Accessibility (a11y)

Accessibility is a core feature, not an afterthought.

- **ARIA Attributes**: Interactive elements MUST have appropriate ARIA attributes (`aria-expanded`, `aria-pressed`, `aria-hidden`, etc.).
- **Dynamic `aria-label`**: Do not hardcode `aria-label`. Expose it as a prop so consumers can customize it for translation/context.
- **Roles**: Explicitly define `role` when semantics require it (e.g., `role="status"` on Badge, `role="switch"` on toggleable buttons).
- **Keyboard Navigation**: Ensure elements are focusable and visually outline focus (`focus-visible`). Our global styles handle focus rings natively.

---

## Naming Conventions

- **Directories**: `kebab-case` (e.g., `src/components/atoms/date-picker/`).
- **Components & Files**: `PascalCase` (e.g., `DatePicker.tsx`, `DatePicker.stories.tsx`).
- **Hooks**: `camelCase` with a `use` prefix (e.g., `useDatePicker.ts`).
- **Types**: `PascalCase` (e.g., `DatePickerProps`).
- **CVA Variants**: `camelCase` with a `Variants` suffix (e.g., `datePickerVariants`).

---

## Strict Anti-Patterns (What is NOT Allowed)

The following practices will result in PR rejection:

1. **NO** combining Presentational and Container logic in the same `.tsx` file.
2. **NO** putting `cva` inside the `.tsx` or `useHook.ts` file (it belongs in `types.ts`).
3. **NO** `export interface` in TypeScript.
4. **NO** arbitrary values in Tailwind (`p-[14px]`, `text-[#000]`).
5. **NO** Spanish code or documentation (variables, comments, stories must be in English).
6. **NO** `any` types.
7. **NO** skipped accessibility (`aria-*` or missing keyboard focus).
8. **NO** multiple components exported from a single file. One component = one directory.
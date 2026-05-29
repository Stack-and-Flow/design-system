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

### 6-File Structure

Every component MUST live inside a kebab-case directory (`src/components/atoms/button/`) and contain EXACTLY these six files:

| File | Purpose | Rule |
| ---- | ------- | ---- |
| `types.ts` | Types & Variants | Defines component props using `type`, Storybook JSDoc controls, and `cva` variants. |
| `useButton.ts` | Container Hook | Contains ALL logic, state, refs, handlers, and `cva` class generation. |
| `Button.tsx` | Presentational Component | ONLY JSX. Consumes the hook. No state or `cva` calls. |
| `Button.test.tsx` | Tests | Covers hook logic and observable component behavior. |
| `Button.stories.tsx` | Documentation | Contains Storybook autodocs, `args`, and JSDoc blocks above `const meta` and story exports. |
| `index.ts` | Public API | Re-exports the named component and type exports. |

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

export { Button };
```

### 4. Public API (`index.ts`)
```typescript
export { Button } from './Button';
export type * from './types';
```

---

## TypeScript Rules

- **`type` over `interface`**: ALWAYS use `export type ComponentProps = {}`. Do NOT use `interface`.
- **No `any`**: Explicit `any` is strictly prohibited. If you don't know the type, use `unknown` or narrow it down properly.
- **Explicit Props**: Never implicitly type props. Everything MUST be explicitly defined in `types.ts`.
- **Component definition**: Use `FC<ComponentProps>` and named component exports — never default component exports.

---

## Storybook Rules

- **English only**: All stories must be written in English.
- **Mandatory Controls**: Use JSDoc comments (`/** @control text */`) in `types.ts` to power the controls.
- **Mandatory Description**: Every component story MUST include a JSDoc block immediately above `const meta` with `## Description` required. Use `## Dependencies` and `## Usage Guide` only when applicable.
- **No `parameters.docs.description.component`**: component docs live in JSDoc above `const meta`, not in `parameters.docs.description.component`.
- **Story-level docs**: add concise JSDoc immediately above every `export const StoryName`.
- **Args**: Define default `args` for the base story without overriding `defaultVariants`.

---

## System Tokens & Styling

We use Tailwind v4 with `@theme` configurations defined in `src/styles/theme.css`.

- **MANDATORY**: You MUST use the design system's CSS custom properties (tokens) via Tailwind classes.
- **NO HARDCODING**: Never hardcode colors (e.g., `#FF0000`) or arbitrary values in inline styles. Arbitrary Tailwind sizing/typography classes are allowed only inside `types.ts` CVA definitions for explicitly approved compact/dense variants; arbitrary colors remain forbidden.
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

## Testing

Every component in the design system MUST have a corresponding test file that follows these conventions.

### Strategy

We follow the Container/Presentational split in testing:

| Layer | Tool | What to test |
|-------|------|-------------|
| `useComponentName.ts` (Hook) | `renderHook` | Pure logic: default values, computed props, event handlers, return shape |
| `ComponentName.tsx` (Component) | `render` + `screen` + `userEvent` | Observable behavior: accessibility, disabled state, loading, click handling |

**Never test implementation details**: do NOT assert on CSS class strings, internal ref values, or which variant string is applied to the DOM. Test what a real user (or screen reader) would observe.

### File Location & Naming

Place the test file alongside the component — not in a separate `__tests__` directory:

```
src/components/atoms/button/
  Button.tsx
  useButton.ts
  types.ts
  index.ts
  Button.stories.tsx
  Button.test.tsx   ← here
```

### Minimum Required Coverage

Every component test file MUST cover:

1. **Default state** — the component renders without required props
2. **`disabled` prop** — the element is disabled when `disabled={true}`
3. **`isLoading` prop** — the element is disabled when `isLoading={true}` (even if `disabled={false}`)
4. **`onClick` handler** — called when interactive and not loading; NOT called when loading
5. **`aria-label`** — accessible name is applied correctly
6. **Hook defaults** — `disabled: false` and `isLoading: false` are returned by default

### Required Mocks

Mock only the packages that the component imports. `lucide-react/dynamic.js` and `spinners-react` can break jsdom through dynamic modules or CSS animations, but each mock should exist only when the component actually uses that package:

```typescript
vi.mock('lucide-react/dynamic.js', () => ({
  DynamicIcon: () => null
}));

// Only if the component imports spinners-react
vi.mock('spinners-react', () => ({
  SpinnerCircular: () => null
}));
```

When a component renders a loading spinner, it must use `SpinnerCircular` from `spinners-react`, following `Button` as the reference. Do not implement component-local CSS spinners.

Also mock any CSS files imported directly from the component:

```typescript
vi.mock('@/components/utils/styles/index.css', () => ({}));
```

### Reference Examples

**Hook test** — use `renderHook`:
```typescript
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useButton } from './useButton';

describe('useButton — logic', () => {
  it('returns disabled: false by default', () => {
    const { result } = renderHook(() => useButton({}));
    expect(result.current.disabled).toBe(false);
  });

  it('returns the correct variant when variant: ghost is passed', () => {
    const { result } = renderHook(() => useButton({ variant: 'ghost' }));
    expect(result.current.variant).toBe('ghost');
  });
});
```

**Component test** — use `render` + `screen` + `userEvent`:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button — component behavior', () => {
  it('is disabled when isLoading is true', () => {
    render(<Button text="Loading" isLoading disabled={false} />);
    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled();
  });

  it('does NOT call onClick when isLoading is true', async () => {
    const handleClick = vi.fn();
    render(<Button text="Saving" isLoading onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Saving' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Running Tests

```bash
pnpm run test            # single run
pnpm run test:watch      # watch mode
pnpm run test:coverage   # with coverage report
```

---

## Strict Anti-Patterns (What is NOT Allowed)

The following practices will result in PR rejection:

1. **NO** combining Presentational and Container logic in the same `.tsx` file.
2. **NO** putting `cva` inside the `.tsx` or `useHook.ts` file (it belongs in `types.ts`).
3. **NO** `export interface` in TypeScript.
4. **NO** arbitrary Tailwind colors (`text-[#000]`). Arbitrary sizing/typography values are allowed only in CVA (`types.ts`) for explicitly approved compact/dense variants.
5. **NO** Spanish code or documentation (variables, comments, stories must be in English).
6. **NO** `any` types.
7. **NO** skipped accessibility (`aria-*` or missing keyboard focus).
8. **NO** multiple components exported from a single file. One component = one directory.

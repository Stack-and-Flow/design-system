# Reference: HTML Extension & ComponentProps

> Canonical source: `src/components/atoms/button/useButton.ts`, `src/components/atoms/input/Input.tsx`

---

## The problem

A component that does not extend its native HTML element **silently swallows** standard HTML props.

```tsx
// ❌ WRONG — users cannot pass onChange, onBlur, name, form, etc.
type ButtonProps = {
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
};
```

A button implemented this way will reject `type="submit"`, `form="my-form"`, `aria-expanded`, and every other standard HTML attribute. The TypeScript compiler will not warn the user — it will just error at the call site with no hint about why.

---

## The pattern: ComponentProps intersection

Every component MUST intersect `ComponentProps<'element'>` to inherit all native HTML attributes.

```tsx
import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { ButtonProps, buttonVariants } from './types';

export const useButton = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props  // ← captures ALL remaining native props
}: VariantProps<typeof buttonVariants> & ButtonProps & ComponentProps<'button'>) => {
  return {
    variant,
    size,
    disabled,
    ...props  // ← spread onto the native element
  };
};
```

The `...props` spread is critical — it must flow from hook input → hook return → native element.

---

## Choosing the right element

| Component | ComponentProps arg |
|-----------|-------------------|
| Button | `ComponentProps<'button'>` |
| Input | `ComponentProps<'input'>` |
| Select | `ComponentProps<'select'>` |
| Textarea | `ComponentProps<'textarea'>` |
| Anchor | `ComponentProps<'a'>` |
| Div wrapper | `ComponentProps<'div'>` |

---

## Omit conflicts when necessary

Sometimes your custom props shadow a native HTML prop with an incompatible type.
Use `Omit` to remove the native version before intersecting.

```tsx
// Input.tsx — 'size' and 'id' have different types in ComponentProps<'input'>
type InputComponentProps =
  Omit<VariantProps<typeof inputVariants>, 'state' | 'focused'> &
  InputProps &
  Omit<ComponentProps<'input'>, 'size' | 'id'> & {
    ariaDescribedBy?: string | string[];
  };
```

When to Omit:
- Your `size` prop is `'sm' | 'md' | 'lg'` but HTML `size` is `number`
- Your `id` is typed differently
- Any prop where the types are genuinely incompatible

Do NOT Omit props just because you want to override behavior — let the native prop flow through and handle it inside the hook.

---

## forwardRef — when to use it

Use `forwardRef` when:
- The component wraps an interactive element that parent code needs to focus (`input`, `textarea`, `select`)
- The component is used inside a form library (react-hook-form, Formik)
- The component manages its own internal ref AND must expose a ref to consumers

```tsx
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

const Input = forwardRef<HTMLInputElement, InputComponentProps>(
  ({ ...props }, ref) => {
    const { value, onChange, disabled, ...rest } = useInput({ ...props, ref });

    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
```

**When NOT to use forwardRef**: buttons (the hook manages its own ref internally via `useRef`), purely presentational wrappers, components that never need external ref access.

---

## Spreading props onto the native element

The hook returns `...props` — always spread them on the outermost interactive element:

```tsx
// ✅ CORRECT
const Button: FC<ButtonComponentProps> = ({ ...props }) => {
  const { variant, size, disabled, onClick, type, ...rest } = useButton(props);
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...rest}  // ← data-*, aria-*, form, name, and every other native attr
    >
      {/* content */}
    </button>
  );
};

// ❌ WRONG — rest is not spread; native props are silently dropped
const Button: FC<ButtonComponentProps> = ({ variant, size, disabled, onClick }) => {
  return <button disabled={disabled} onClick={onClick}>{/* ... */}</button>;
};
```

---

## Quick checklist

- [ ] Hook input type intersects `ComponentProps<'element'>`
- [ ] Custom props that conflict with native props use `Omit<ComponentProps<'element'>, 'conflicting-prop'>`
- [ ] `...props` / `...rest` is spread at the end of the return object in the hook
- [ ] Native element receives `{...rest}` spread
- [ ] Components needing external ref use `forwardRef` with correct generic types
- [ ] `displayName` set on forwardRef components

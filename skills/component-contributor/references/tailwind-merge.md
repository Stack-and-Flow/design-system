# Reference: tailwind-merge + clsx (cn utility)

> Canonical source: `src/lib/utils.ts`, `src/components/atoms/input/Input.tsx`, `src/components/atoms/dropdown/Dropdown.tsx`

---

## The problem tailwind-merge solves

Tailwind CSS uses a utility-first approach where class conflicts are silently ignored — the last class in the stylesheet wins, NOT the last class in the string.

```tsx
// ❌ PROBLEM — which padding wins? Not the one you think.
<div className={`p-4 ${userClassName}`} />
// If userClassName = 'p-8', the result depends on stylesheet order, not string order.
// Both classes are applied; browser uses specificity/source order — unpredictable.
```

`tailwind-merge` resolves conflicts by keeping only the LAST conflicting utility in the logical class order:

```tsx
import { twMerge } from 'tailwind-merge';          // → 'p-8'
twMerge('p-4', 'p-8')        // → 'p-8'
twMerge('text-sm', 'text-lg') // → 'text-lg'
```

---

## The cn() utility

This project provides a `cn()` helper that combines `clsx` (for conditional class logic) with `twMerge` (for conflict resolution):

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

**Import from `@/lib/utils`** — never import `clsx` or `twMerge` directly in component files.

```tsx
import { cn } from '@/lib/utils';
```

---

## When to use cn()

Use `cn()` whenever you combine:

1. **CVA variants + conditional classes**
```tsx
className={cn(
  inputVariants({ size, variant, state }),
  isFullWidth ? 'w-full' : 'w-auto'
)}
```

2. **CVA variants + external className prop**
```tsx
className={cn(
  buttonVariants({ variant, size }),
  className  // ← consumer override
)}
```

3. **Base classes + conditional modifier classes**
```tsx
className={cn(
  'flex items-center gap-2 rounded-md px-3 py-2',
  disabled && 'pointer-events-none opacity-40',
  error && 'border-error-light',
  className
)}
```

4. **Multiple conditional classes**
```tsx
className={cn(
  'base-class',
  isActive && 'bg-brand-dark',
  isDisabled && 'opacity-40',
  isLoading && 'cursor-wait'
)}
```

---

## When NOT to use cn()

- Single static class string with no conditions — just use a plain string
- Inside `types.ts` CVA definition — CVA handles its own class composition

```tsx
// ✅ No cn() needed — static, no conflicts
<span className='sr-only'>Loading</span>

// ✅ No cn() needed inside CVA
export const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      primary: 'bg-brand-light dark:bg-brand-dark'
    }
  }
});
```

---

## Common patterns from the codebase

### Input.tsx — CVA + conditionals + external className

```tsx
<div
  className={cn(
    inputVariants({ size, rounded, variant, state, focused: isFocused }),
    isFullWidth ? 'w-full' : 'w-auto',
    label ? 'items-end' : 'items-center',
    hint?.type === 'error' && 'border-error-light! shadow-[0_0_0_3px_rgba(219,20,60,0.12)]',
    hint?.type === 'warning' && 'border-warning-light!',
    hint?.type === 'success' && 'border-success-light!',
    disabled && 'pointer-events-none opacity-40',
    className  // ← always last, so consumer can override
  )}
>
```

### Dropdown.tsx — base classes + state variants + consumer override

```tsx
<DropdownMenuPrimitive.Content
  className={cn(
    'min-w-32 rounded-md border p-1',
    'bg-surface-light dark:bg-surface-dark',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    marginClasses[position],
    className  // ← consumer override always last
  )}
>
```

---

## Rules

- Import `cn` from `@/lib/utils` — NEVER import `clsx` or `twMerge` directly in component files
- Consumer `className` prop goes LAST in the `cn()` call — always allows override
- Use `cn()` whenever combining CVA output + anything else
- Use `cn()` whenever you have conditional class logic
- Do NOT use template literals for class composition (`\`class1 ${condition ? 'a' : 'b'}\``) — use `cn()` instead

---

## Checklist

- [ ] `cn` imported from `@/lib/utils`
- [ ] CVA variant output always combined with `cn()`
- [ ] Consumer `className` prop is last argument in `cn()` call
- [ ] No template literal class composition in component files
- [ ] No direct `clsx` or `twMerge` imports in component or hook files

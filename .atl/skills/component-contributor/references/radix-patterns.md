# Reference: Radix UI Integration Patterns

> Canonical source: `src/components/atoms/dropdown/Dropdown.tsx`
> Radix packages used in this project: `@radix-ui/react-dropdown-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-avatar`

---

## Why Radix

Radix provides unstyled, accessible primitives that handle:
- Keyboard navigation (arrow keys, Escape, Tab trapping)
- ARIA roles, states and properties
- Focus management
- Portal rendering (avoids z-index stacking issues)

You style them — Radix handles the behavior. Never reimplement what Radix already does.

---

## Import pattern

Always import Radix as a namespace alias. Never use named imports.

```tsx
// ✅ CORRECT
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as SelectPrimitive from '@radix-ui/react-select';

// ❌ WRONG — makes it hard to trace which component belongs to which primitive
import { Root, Trigger, Content } from '@radix-ui/react-dropdown-menu';
```

The namespace alias (`DropdownMenuPrimitive`, `DialogPrimitive`, etc.) makes it immediately clear which primitive library each element comes from when reading the JSX.

---

## Dropdown Menu — canonical pattern

```tsx
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import type { FC } from 'react';
import type { DropdownProps } from './types';
import { useDropdown } from './useDropdown';

const Dropdown: FC<DropdownProps> = ({ ...props }) => {
  const { items, align, position, offset, className } = useDropdown(props);

  return (
    <DropdownMenuPrimitive.Root>
      {/* Trigger wraps whatever the consumer passes as children */}
      <DropdownMenuPrimitive.Trigger asChild={true}>
        <div>{props.children}</div>
      </DropdownMenuPrimitive.Trigger>

      {/* Portal renders outside the DOM tree — avoids z-index issues */}
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          role='menu'
          aria-labelledby={accessibleLabelId}
          className={cn(
            'min-w-[8rem] rounded-md border p-1',
            'bg-surface-light dark:bg-surface-dark',
            // Radix animation data attributes — use these, not custom state
            'data-[state=closed]:animate-out data-[state=open]:animate-in',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className
          )}
          side={position}
          align={align}
          sideOffset={offset}
          avoidCollisions={true}
        >
          {items.map(renderDropdownElement)}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
```

Key decisions:
- `asChild={true}` on Trigger — lets any element act as trigger without adding an extra DOM node
- `Portal` — always use it for floating content (menus, dialogs, popovers) to avoid clipping
- `avoidCollisions={true}` — Radix repositions the menu if it would overflow the viewport
- Animation via `data-[state=open/closed]` — Radix manages open/closed state; you attach CSS animations to these attributes

---

## Items pattern

```tsx
<DropdownMenuPrimitive.Item
  disabled={element.disabled}
  aria-disabled={element.disabled || undefined}
  className={cn(
    'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
    'transition-[background,color] duration-150 ease-[ease]',
    'hover:bg-white-tint-mid',
    'focus-visible:outline-none focus-visible:shadow-[var(--glow-focus-dark)]'
  )}
  onClick={element.onClick}
>
  {element.label}
</DropdownMenuPrimitive.Item>
```

- Never use `outline` for focus — always `box-shadow` with the `--glow-focus-dark` token
- `aria-disabled` mirrors `disabled` — required for screen readers
- `cursor-default` not `cursor-pointer` — menu items behave like native menu, not links

---

## Submenu pattern

```tsx
<DropdownMenuPrimitive.Sub>
  <DropdownMenuPrimitive.SubTrigger
    aria-haspopup='menu'
    aria-controls={submenuId}
    aria-expanded={false}
    className={cn(/* same classes as item */)}
  >
    {element.label}
    <ChevronRightIcon className='ml-auto size-4' />
  </DropdownMenuPrimitive.SubTrigger>

  <DropdownMenuPrimitive.SubContent id={submenuId} className={cn(/* container styles */)}>
    {element.items.map(renderDropdownElement)}
  </DropdownMenuPrimitive.SubContent>
</DropdownMenuPrimitive.Sub>
```

---

## Dialog pattern

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog';

const Dialog: FC<DialogProps> = ({ ...props }) => {
  const { open, onOpenChange, title, description, children } = useDialog(props);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild={true}>
        {props.trigger}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'rounded-lg bg-surface-light dark:bg-surface-dark',
            'p-6 shadow-lg'
          )}
        >
          <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
          {children}
          <DialogPrimitive.Close asChild={true}>
            <button aria-label='Close dialog'>×</button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
```

---

## Select pattern

```tsx
import * as SelectPrimitive from '@radix-ui/react-select';

// Structure: Root → Trigger → [Portal → Content → [Viewport → Items]]
<SelectPrimitive.Root value={value} onValueChange={onChange}>
  <SelectPrimitive.Trigger className={cn(/* trigger styles */)}>
    <SelectPrimitive.Value placeholder='Select...' />
    <SelectPrimitive.Icon>
      <ChevronDownIcon />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>

  <SelectPrimitive.Portal>
    <SelectPrimitive.Content className={cn(/* content styles */)}>
      <SelectPrimitive.Viewport>
        {options.map((option) => (
          <SelectPrimitive.Item key={option.value} value={option.value}>
            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        ))}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
</SelectPrimitive.Root>
```

---

## Rules

- ALWAYS use `Portal` for floating content — menus, dialogs, tooltips, popovers
- ALWAYS use `asChild={true}` on `Trigger` to avoid extra DOM nodes
- NEVER re-implement keyboard navigation — Radix handles it
- NEVER use `outline` for focus — use `box-shadow` with `--glow-focus-dark`
- ALWAYS apply Radix `data-[state]` attributes for animations — never manage open/close state in CSS manually
- Logic (open state, filtering, computed values) goes in the hook — NOT in the component file

---

## Checklist

- [ ] Radix imported as namespace alias (`* as XxxPrimitive`)
- [ ] Floating content wrapped in `Portal`
- [ ] Trigger uses `asChild={true}`
- [ ] Focus ring uses `focus-visible:shadow-[var(--glow-focus-dark)]` — no outline
- [ ] Animations use `data-[state=open/closed]` attributes
- [ ] All open/close logic lives in the hook

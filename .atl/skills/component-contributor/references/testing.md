# Reference: Testing

> Canonical source: `src/components/atoms/button/Button.test.tsx`
> Testing stack: **Vitest** + **@testing-library/react** + **@testing-library/user-event**

---

## Two-layer strategy

Every component has TWO test layers. Both are mandatory.

| Layer | Tool | What it tests | File |
|-------|------|---------------|------|
| **Hook** | `renderHook` | Pure logic — no DOM | `useComponent.ts` |
| **Component** | `render` + `screen` + `userEvent` | Observable DOM behavior | `Component.tsx` |

### What to test
- State values returned by the hook (disabled, isLoading, variant, etc.)
- Computed functions returned by the hook (e.g. `iconSize()`)
- DOM rendering — correct element, text, attributes
- ARIA attributes — aria-label, aria-pressed, aria-disabled
- Interaction — click, keyboard, focus triggers expected result
- Disabled/loading states block interaction

### What NOT to test
- Specific CSS class strings
- Internal refs
- Animation implementation (ripple, spinner internals)
- Tailwind utility names

---

## Required mocks

Declare ALL mocks BEFORE importing the component. Order matters in Vitest.

```tsx
// ─── MOCKS (before component import) ───

vi.mock('lucide-react/dynamic', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => null
}));

// CSS import — prevent parse errors in jsdom
vi.mock('@/components/utils/styles/index.css', () => ({}));

// ─── IMPORTS (after mocks) ───
import { MyComponent } from './MyComponent';
import { useMyComponent } from './useMyComponent';
```

**Why**: jsdom cannot handle dynamic imports (lucide-react/dynamic), CSS animations (spinners-react), or raw CSS files. Mocking them prevents test crashes that are unrelated to component logic.

**Rule**: If your component imports any of these — mock them. If it imports a new third-party package with animations or dynamic loading, add a mock for it too.

---

## Hook tests — renderHook pattern

```tsx
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMyComponent } from './useMyComponent';

describe('useMyComponent — logic', () => {
  it('returns the default value for myProp', () => {
    const { result } = renderHook(() => useMyComponent({}));
    expect(result.current.myProp).toBe('default');
  });

  it('reflects the passed prop correctly', () => {
    const { result } = renderHook(() => useMyComponent({ variant: 'ghost' }));
    expect(result.current.variant).toBe('ghost');
  });

  it('computed function returns correct value for input', () => {
    const { result } = renderHook(() => useMyComponent({ size: 'sm' }));
    expect(result.current.computedSize()).toBe('expected-class');
  });
});
```

---

## Component tests — render/screen/userEvent pattern

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent — component behavior', () => {
  it('renders the expected element in the DOM', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays the text prop as content', () => {
    render(<MyComponent text='Hello' />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(<MyComponent text='Submit' disabled={true} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<MyComponent text='Click' onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<MyComponent text='Click' disabled={true} onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

## ARIA testing patterns

```tsx
// aria-label
render(<MyComponent ariaLabel='Submit form' />);
expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument();

// aria-pressed + role="switch"
render(<MyComponent text='Toggle' aria-pressed={true} />);
expect(screen.getByRole('switch', { name: 'Toggle' })).toBeInTheDocument();

// aria-disabled
render(<MyComponent text='Blocked' disabled={true} />);
expect(screen.getByRole('button', { name: 'Blocked' })).toHaveAttribute('aria-disabled', 'true');
```

---

## Storybook play functions (visual interaction tests)

For interactive components, ALSO add a `play` function in the `.stories.tsx` file.
These run in a real browser via Playwright, unlike Vitest which runs in jsdom.

```tsx
import { expect, userEvent, within } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

export const Interactive: StoryObj<typeof MyComponent> = {
  args: { text: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /click me/i });

    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // assert result
  }
};
```

Run Storybook tests: `pnpm test-storybook`

---

## Running tests

```bash
# Vitest (unit + hook tests)
pnpm test

# Storybook interaction tests (requires Storybook running)
pnpm test-storybook
```

---

## Checklist before opening a PR

- [ ] Hook tested with `renderHook` — all returned values and computed functions covered
- [ ] Component tested with `render/screen/userEvent` — rendering, ARIA, interaction, disabled states
- [ ] All required mocks declared BEFORE component imports
- [ ] Interactive component has a `play` function in its story
- [ ] `pnpm test` passes with no failures

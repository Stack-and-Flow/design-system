# Reference: Testing

> Canonical source: `src/components/atoms/button/Button.test.tsx`
> Testing stack: **Vitest** + **@testing-library/react** + **@testing-library/user-event**
> Test file: `ComponentName.test.tsx` (complete test suite in one file)

---

## Single-file strategy

Every component has ONE test file: `ComponentName.test.tsx`

This file contains TWO test suites:

| Suite | Tool | What it tests |
|-------|------|---------------|
| **Hook** | `renderHook` | Pure logic — no DOM |
| **Component** | `render` + `screen` + `userEvent` | Observable DOM behavior |

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

## Storybook stories

Stories are for visual documentation and design exploration — NOT for testing.

- NO `play` functions in stories
- NO interaction testing in Storybook
- ALL tests go in `ComponentName.test.tsx`

---

## Running tests

```bash
# Vitest (unit + hook tests)
pnpm test
```

---

## Checklist before opening a PR

- [ ] Hook tested with `renderHook` — all returned values and computed functions covered
- [ ] Component tested with `render/screen/userEvent` — rendering, ARIA, interaction, disabled states
- [ ] All required mocks declared BEFORE component imports
- [ ] All tests in `ComponentName.test.tsx`
- [ ] `pnpm test` passes with no failures

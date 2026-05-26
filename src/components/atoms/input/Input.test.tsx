import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// --- Mocks (declared before component import) ---

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

// --- Imports after mocks ---

import { Input } from './Input';
import { useInput } from './useInput';

// ─────────────────────────────────────────────
// HOOK TESTS — useInput
// ─────────────────────────────────────────────

describe('useInput — logic', () => {
  it('uses text type by default', () => {
    const { result } = renderHook(() => useInput({ id: 'input', label: 'Name' }));
    expect(result.current.inputProps.type).toBe('text');
  });

  it('does not convert non-password inputs to password', () => {
    const { result } = renderHook(() => useInput({ id: 'input', label: 'Name', type: 'email' }));
    expect(result.current.inputProps.type).toBe('email');
  });

  it('derives aria-labelledby from the visible label', () => {
    const { result } = renderHook(() => useInput({ id: 'email', label: 'Email' }));
    expect(result.current.inputProps['aria-labelledby']).toBe('email-label');
  });

  it('derives aria-describedby from hint content', () => {
    const { result } = renderHook(() =>
      useInput({ id: 'email', label: 'Email', hint: { type: 'error', message: 'Required' } })
    );
    expect(result.current.inputProps['aria-describedby']).toBe('email-hint');
  });

  it('uses placeholder as an accessible name when no label or aria name is provided', () => {
    const { result } = renderHook(() => useInput({ id: 'search', placeholder: 'Search products' }));
    expect(result.current.inputProps['aria-label']).toBe('Search products');
  });

  it('updates floating-label state when controlled value changes after mount', () => {
    const { result, rerender } = renderHook(({ value }) => useInput({ id: 'name', label: 'Name', value }), {
      initialProps: { value: '' }
    });

    expect(result.current.labelProps.className).toContain('top-1/2');

    rerender({ value: 'Alice' });

    expect(result.current.labelProps.className).not.toContain('top-1/2');
  });

  it('floats visible labels and adds vertical content spacing when start adornments are present', () => {
    const { result } = renderHook(() =>
      useInput({ id: 'email', label: 'Email', startContent: 'https://', endContent: '.com' })
    );

    expect(result.current.labelProps.className).not.toContain('top-1/2');
    expect(result.current.labelProps.className).toContain('left-4');
    expect(result.current.labelProps.className).not.toContain('left-12');
    expect(result.current.contentClassName).toContain('translate-y-2');
    expect(result.current.contentClassName).not.toContain('pl-1');
  });

  it('uses a smaller floating label for the compact size', () => {
    const { result } = renderHook(() => useInput({ id: 'email', label: 'Email', size: 'sm', placeholder: 'Email' }));

    expect(result.current.labelProps.className).toContain('top-0.5');
    expect(result.current.labelProps.className).toContain('fs-xs');
  });

  it('applies full width to the outer wrapper', () => {
    const { result } = renderHook(() => useInput({ id: 'email', label: 'Email', isFullWidth: true }));

    expect(result.current.wrapperClassName).toContain('w-full');
  });

  it('uses compact content spacing for the small size', () => {
    const { result } = renderHook(() => useInput({ id: 'email', label: 'Email', size: 'sm', startContent: '$' }));

    expect(result.current.containerProps.className).toContain('h-12');
    expect(result.current.containerProps.className).toContain('px-3');
    expect(result.current.contentClassName).toContain('gap-2');
    expect(result.current.adornmentClassName).toContain('fs-small');
  });

  it('keeps dark hover styling for the underlined variant', () => {
    const { result } = renderHook(() => useInput({ id: 'email', label: 'Email', variant: 'underlined' }));

    expect(result.current.containerProps.className).toContain('dark:hover:border-border-strong-dark');
  });

  it('reserves inline-action space when end content is present', () => {
    const { result } = renderHook(() =>
      useInput({ id: 'password', label: 'Password', type: 'password', endContent: '.com' })
    );

    expect(result.current.contentClassName).toContain('pr-8');
  });
});

// ─────────────────────────────────────────────
// COMPONENT TESTS — Input
// ─────────────────────────────────────────────

describe('Input — component behavior', () => {
  it('renders an input with a visible label', () => {
    render(<Input id='email' label='Email' />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('calls onChange with the event and next value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input id='name' label='Name' onChange={handleChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ana');

    expect(handleChange.mock.lastCall?.[1]).toBe('Ana');
  });

  it('sets required and aria-required when isRequired is true', () => {
    render(<Input id='email' label='Email' isRequired={true} />);
    const input = screen.getByRole('textbox', { name: /Email/i });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('honors the native required prop', () => {
    render(<Input id='email' label='Email' required={true} />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
  });

  it('sets invalid and describedby when an error hint is provided', () => {
    render(<Input id='email' label='Email' hint={{ type: 'error', message: 'Invalid email' }} />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Invalid email');
  });

  it('preserves native aria-invalid values when no error hint is provided', () => {
    render(<Input id='email' label='Email' aria-invalid='grammar' />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'grammar');
  });

  it('merges custom aria-describedby with the rendered hint', () => {
    render(
      <div>
        <span id='external-description'>External description</span>
        <Input
          id='email'
          label='Email'
          aria-describedby='external-description'
          hint={{ type: 'error', message: 'Invalid email' }}
        />
      </div>
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'External description Invalid email'
    );
  });

  it('is disabled when disabled is true', () => {
    render(<Input id='email' label='Email' disabled={true} />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });

  it('toggles password visibility with an accessible button', async () => {
    const user = userEvent.setup();
    render(<Input id='password' label='Password' type='password' />);
    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: 'Show password' });

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggle);

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders number step buttons as non-submit controls', async () => {
    const user = userEvent.setup();
    render(<Input id='quantity' label='Quantity' type='number' defaultValue={1} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    const increase = screen.getByRole('button', { name: 'Increase value' });
    const decrease = screen.getByRole('button', { name: 'Decrease value' });

    expect(increase).toHaveAttribute('type', 'button');
    expect(decrease).toHaveAttribute('type', 'button');

    await user.click(increase);
    expect(input).toHaveValue(2);

    await user.click(decrease);
    expect(input).toHaveValue(1);
  });

  it('honors native step, min, and max with number controls', async () => {
    const user = userEvent.setup();
    render(<Input id='quantity' label='Quantity' type='number' defaultValue={0.5} min={0} max={1} step={0.5} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    const increase = screen.getByRole('button', { name: 'Increase value' });
    const decrease = screen.getByRole('button', { name: 'Decrease value' });

    await user.click(increase);
    expect(input).toHaveValue(1);

    await user.click(increase);
    expect(input).toHaveValue(1);

    await user.click(decrease);
    expect(input).toHaveValue(0.5);

    await user.click(decrease);
    expect(input).toHaveValue(0);

    await user.click(decrease);
    expect(input).toHaveValue(0);
  });

  it('does not cancel number key input so the browser controls number editing', () => {
    render(<Input id='temperature' label='Temperature' type='number' min={-10} defaultValue={12} />);
    const input = screen.getByRole('spinbutton', { name: 'Temperature' });

    expect(fireEvent.keyDown(input, { key: '-' })).toBe(true);
    expect(fireEvent.keyDown(input, { key: 'a' })).toBe(true);
  });

  it('allows leading plus signs for tel inputs while blocking invalid tel letters', () => {
    render(<Input id='phone' label='Phone' type='tel' />);
    const input = screen.getByRole('textbox', { name: 'Phone' });

    expect(fireEvent.keyDown(input, { key: '+' })).toBe(true);
    expect(fireEvent.keyDown(input, { key: 'a' })).toBe(false);
  });

  it('preserves native clipboard shortcuts for tel inputs', () => {
    render(<Input id='phone' label='Phone' type='tel' />);
    const input = screen.getByRole('textbox', { name: 'Phone' });

    expect(fireEvent.keyDown(input, { key: 'v', ctrlKey: true })).toBe(true);
    expect(fireEvent.keyDown(input, { key: 'a', metaKey: true })).toBe(true);
  });

  it('falls back to manual number controls when step is any', async () => {
    const user = userEvent.setup();
    render(<Input id='quantity' label='Quantity' type='number' defaultValue={1} min={0} max={2} step='any' />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    const increase = screen.getByRole('button', { name: 'Increase value' });
    const decrease = screen.getByRole('button', { name: 'Decrease value' });

    await user.click(increase);
    expect(input).toHaveValue(2);

    await user.click(increase);
    expect(input).toHaveValue(2);

    await user.click(decrease);
    expect(input).toHaveValue(1);
  });

  it('keeps status border precedence while focused', async () => {
    const user = userEvent.setup();
    render(<Input id='email' label='Email' hint={{ type: 'error', message: 'Invalid email' }} />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    await user.click(input);

    const containerClassName = input.closest('div.relative')?.className ?? '';
    expect(containerClassName).toContain('!border-error-light');
    expect(containerClassName.lastIndexOf('!border-error-light')).toBeGreaterThan(
      containerClassName.lastIndexOf('!border-brand-light/50')
    );
  });

  it('supports native aria-labelledby overrides', () => {
    render(
      <div>
        <span id='external-label'>External label</span>
        <Input id='custom' aria-labelledby='external-label' />
      </div>
    );

    expect(screen.getByRole('textbox', { name: 'External label' })).toBeInTheDocument();
  });
});

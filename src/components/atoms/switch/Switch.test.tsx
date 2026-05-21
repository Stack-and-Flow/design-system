import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ChangeEvent, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';
import { useSwitch } from './useSwitch';

const createChangeEvent = (checked: boolean): ChangeEvent<HTMLInputElement> =>
  ({ target: { checked } }) as ChangeEvent<HTMLInputElement>;

describe('useSwitch — logic', () => {
  it('returns unchecked state by default', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications' }));
    expect(result.current.checked).toBe(false);
    expect(result.current.ariaChecked).toBe(false);
  });

  it('returns the defaultChecked state for uncontrolled switches', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications', defaultChecked: true }));
    expect(result.current.checked).toBe(true);
    expect(result.current.ariaChecked).toBe(true);
  });

  it('keeps checked controlled by the checked prop', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications', checked: true, defaultChecked: false }));
    expect(result.current.checked).toBe(true);
  });

  it('derives the accessible name from ariaLabel, native aria-label, or label', () => {
    expect(renderHook(() => useSwitch({ ariaLabel: 'Custom label' })).result.current.ariaLabel).toBe('Custom label');
    expect(renderHook(() => useSwitch({ 'aria-label': 'Native label' })).result.current.ariaLabel).toBe('Native label');
    expect(renderHook(() => useSwitch({ label: 'Visible label' })).result.current.ariaLabel).toBe('Visible label');
  });

  it('throws when no accessible name is available at runtime', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useSwitch({} as never))).toThrow(
      'Switch requires an accessible name. Provide label, ariaLabel, or aria-label.'
    );

    consoleError.mockRestore();
  });

  it('returns computed class names without exposing CVA logic to the component', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications' }));
    expect(result.current.rootClassName).toEqual(expect.any(String));
    expect(result.current.switchTrack).toEqual(expect.any(String));
    expect(result.current.switchThumb).toEqual(expect.any(String));
  });

  it('applies decorative switch glow when emphasis uses the default contract', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications' }));

    expect(result.current.switchTrack).toContain('shadow-glow-btn-secondary');
    expect(result.current.switchTrack).toContain('shadow-glow-btn-primary');
  });

  it('suppresses decorative switch glow when emphasis is flat', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications', emphasis: 'flat' }));

    expect(result.current.switchTrack).not.toContain('shadow-glow-btn-secondary');
    expect(result.current.switchTrack).not.toContain('shadow-glow-btn-primary');
    expect(result.current.switchTrack).toContain('peer-focus-visible:shadow-glow-focus-light');
  });

  it('treats the legacy disabled color as disabled semantics', () => {
    const { result } = renderHook(() => useSwitch({ label: 'Notifications', color: 'disabled' }));
    expect(result.current.disabled).toBe(true);
  });

  it('updates uncontrolled state and notifies onChange from the hook handler', () => {
    const handleChange = vi.fn();
    const { result } = renderHook(() => useSwitch({ label: 'Notifications', onChange: handleChange }));

    act(() => {
      result.current.handleInputChange(createChangeEvent(true));
    });

    expect(result.current.checked).toBe(true);
    expect(result.current.ariaChecked).toBe(true);
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

describe('Switch — component behavior', () => {
  it('renders a switch with an accessible name from the visible label', () => {
    render(<Switch label='Notifications' />);
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('uses ariaLabel when no visible label is provided', () => {
    render(<Switch ariaLabel='Enable notifications' />);
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
  });

  it('keeps aria-checked synchronized with checked state', async () => {
    const user = userEvent.setup();
    render(<Switch label='Notifications' />);

    const switchInput = screen.getByRole('switch', { name: 'Notifications' });
    expect(switchInput).toHaveAttribute('aria-checked', 'false');

    await user.click(switchInput);

    expect(switchInput).toBeChecked();
    expect(switchInput).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles when the visible label is clicked', async () => {
    const user = userEvent.setup();
    render(<Switch label='Email alerts' />);

    const switchInput = screen.getByRole('switch', { name: 'Email alerts' });
    await user.click(screen.getByText('Email alerts'));

    expect(switchInput).toBeChecked();
  });

  it('toggles with Space when focused', async () => {
    const user = userEvent.setup();
    render(<Switch label='Keyboard switch' />);

    const switchInput = screen.getByRole('switch', { name: 'Keyboard switch' });
    switchInput.focus();
    await user.keyboard('[Space]');

    expect(switchInput).toBeChecked();
  });

  it('calls onChange with the next checked value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch label='Notifications' onChange={handleChange} />);

    await user.click(screen.getByRole('switch', { name: 'Notifications' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle or call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch label='Disabled switch' disabled={true} onChange={handleChange} />);

    const switchInput = screen.getByRole('switch', { name: 'Disabled switch' });
    await user.click(switchInput);

    expect(switchInput).toBeDisabled();
    expect(switchInput).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('treats color="disabled" as disabled and does not call onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch label='Legacy disabled color' color='disabled' defaultChecked={true} onChange={handleChange} />);

    const switchInput = screen.getByRole('switch', { name: 'Legacy disabled color' });
    await user.click(switchInput);

    expect(switchInput).toBeDisabled();
    expect(switchInput).toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('forwards native input props to the switch input', () => {
    render(<Switch label='Terms' name='terms' required={true} value='accepted' form='settings-form' />);

    const switchInput = screen.getByRole('switch', { name: 'Terms' });
    expect(switchInput).toHaveAttribute('name', 'terms');
    expect(switchInput).toBeRequired();
    expect(switchInput).toHaveAttribute('value', 'accepted');
    expect(switchInput).toHaveAttribute('form', 'settings-form');
  });

  it('respects controlled state from the parent', async () => {
    const user = userEvent.setup();

    const ControlledSwitch = () => {
      const [checked, setChecked] = useState(false);
      return <Switch label={checked ? 'On' : 'Off'} checked={checked} onChange={setChecked} />;
    };

    render(<ControlledSwitch />);

    await user.click(screen.getByRole('switch', { name: 'Off' }));

    expect(screen.getByRole('switch', { name: 'On' })).toBeChecked();
  });

  it('renders thumb, start, and end icons without changing switch semantics', () => {
    render(
      <Switch
        label='Theme'
        thumbIcon={<span data-testid='thumb-icon'>moon</span>}
        startContent={<span data-testid='start-icon'>off</span>}
        endContent={<span data-testid='end-icon'>on</span>}
      />
    );

    expect(screen.getByRole('switch', { name: 'Theme' })).toBeInTheDocument();
    expect(screen.getByTestId('thumb-icon')).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('does not leak emphasis to the input DOM', () => {
    render(<Switch label='Theme' emphasis='flat' />);

    expect(screen.getByRole('switch', { name: 'Theme' })).not.toHaveAttribute('emphasis');
  });
});

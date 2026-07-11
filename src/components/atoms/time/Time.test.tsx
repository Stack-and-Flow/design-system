/**
 * Time.test.tsx — Tests for Stack-and-Flow Design System Time component
 *
 * STRATEGY:
 * - Hook (useTime): tested with renderHook → pure logic, no DOM rendering
 * - Component (Time): tested with render + screen + userEvent → observable behavior
 *
 * WHAT we test: segment state, navigation, ARIA attrs, disabled states, keyboard behavior, hint system
 * WHAT we do NOT test: specific CSS class strings, internal refs
 */

import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// --- Mocks (declared before component import) ---

vi.mock('lucide-react/dynamic', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => null
}));

// --- Imports after mocks ---

import Time from './Time';
import { useTime } from './useTime';

// ─────────────────────────────────────────────
// HOOK TESTS — useTime
// ─────────────────────────────────────────────

describe('useTime — logic', () => {
  it('returns disabled: false by default', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time' }));
    expect(result.current.disabled).toBe(false);
  });

  it('returns isInvalid: false by default', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time' }));
    expect(result.current.isInvalid).toBe(false);
  });

  it('returns isInvalid: true when hint type is error', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time', hint: { type: 'error', message: 'Error' } }));
    expect(result.current.isInvalid).toBe(true);
  });

  it('returns disabled: true when disabled prop is true', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time', disabled: true }));
    expect(result.current.disabled).toBe(true);
  });

  it('returns default granularity as minute', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time' }));
    expect(result.current.granularity).toBe('minute');
  });

  it('returns default hourCycle as 24', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time' }));
    expect(result.current.hourCycle).toBe(24);
  });

  it('passes id correctly to return value', () => {
    const { result } = renderHook(() => useTime({ id: 'appointment-time' }));
    expect(result.current.id).toBe('appointment-time');
  });

  it('returns segments with empty values by default', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time' }));
    expect(result.current.segments.hour).toBe('');
    expect(result.current.segments.minute).toBe('');
  });

  it('returns hasHint: false when no hint is provided', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time' }));
    expect(result.current.hasHint).toBe(false);
  });

  it('returns hasHint: true when hint is provided', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time', hint: { type: 'info', message: 'Enter time' } }));
    expect(result.current.hasHint).toBe(true);
  });

  it('defaults dayPeriod to AM in 12h mode', () => {
    const { result } = renderHook(() => useTime({ id: 'test-time', hourCycle: 12 }));
    expect(result.current.segments.dayPeriod).toBe('AM');
  });
});

// ─────────────────────────────────────────────
// COMPONENT TESTS — Time
// ─────────────────────────────────────────────

describe('Time — component behavior', () => {
  it('renders a time input group in the DOM', () => {
    render(<Time id='test-time' />);
    expect(screen.getByRole('group', { name: 'Time' })).toBeInTheDocument();
  });

  it('renders hour and minute segments', () => {
    render(<Time id='test-time' />);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('does NOT render second segment by default', () => {
    render(<Time id='test-time' />);
    expect(screen.queryByRole('spinbutton', { name: 'Seconds' })).not.toBeInTheDocument();
  });

  it('renders second segment when granularity is second', () => {
    render(<Time id='test-time' granularity='second' />);
    expect(screen.getByRole('spinbutton', { name: 'Seconds' })).toBeInTheDocument();
  });

  it('displays the label when provided', () => {
    render(<Time id='test-time' label='Appointment Time' />);
    expect(screen.getByText('Appointment Time')).toBeInTheDocument();
  });

  it('renders required indicator when isRequired is true', () => {
    render(<Time id='test-time' label='Meeting Time' isRequired={true} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Time id='test-time' label='Disabled Time' disabled={true} />);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toBeDisabled();
  });

  it('applies aria-invalid when hint type is error', () => {
    render(<Time id='test-time' label='Invalid Time' hint={{ type: 'error', message: 'Error' }} />);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies aria-required when isRequired is true', () => {
    render(<Time id='test-time' label='Required Time' isRequired={true} />);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveAttribute('aria-required', 'true');
  });

  it('displays error hint message when hint type is error', () => {
    render(<Time id='test-time' hint={{ type: 'error', message: 'Please enter a valid time' }} />);
    expect(screen.getByText('Please enter a valid time')).toBeInTheDocument();
  });

  it('displays info hint message when hint type is info', () => {
    render(<Time id='test-time' hint={{ type: 'info', message: 'Enter the meeting start time' }} />);
    expect(screen.getByText('Enter the meeting start time')).toBeInTheDocument();
  });

  it('accepts numeric input in hour segment', async () => {
    const user = userEvent.setup();
    render(<Time id='test-time' />);
    const hourInput = screen.getByRole('spinbutton', { name: 'Hours' });

    await user.click(hourInput);
    await user.type(hourInput, '14');

    expect(hourInput).toHaveValue('14');
  });

  it('calls onChange when segment value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Time id='test-time' onChange={handleChange} />);
    const hourInput = screen.getByRole('spinbutton', { name: 'Hours' });

    await user.click(hourInput);
    await user.type(hourInput, '10');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders dayPeriod segment when hourCycle is 12', () => {
    render(<Time id='test-time' hourCycle={12} />);
    expect(screen.getByRole('spinbutton', { name: 'AM or PM' })).toBeInTheDocument();
  });

  it('does NOT render dayPeriod segment when hourCycle is 24', () => {
    render(<Time id='test-time' hourCycle={24} />);
    expect(screen.queryByRole('spinbutton', { name: 'AM or PM' })).not.toBeInTheDocument();
  });

  it('renders with full width when isFullWidth is true', () => {
    const { container } = render(<Time id='test-time' label='Full Width' isFullWidth={true} />);
    expect(container.querySelector('[data-time-wrapper]')).toHaveClass('w-full');
  });

  it('renders label inside the container when label is provided', () => {
    const { container } = render(<Time id='test-time' label='Start Time' />);
    const wrapper = container.querySelector('[data-time-wrapper]');
    expect(wrapper).toContainElement(screen.getByText('Start Time'));
  });

  it('does NOT render stepper buttons by default', () => {
    render(<Time id='test-time' />);
    expect(screen.queryByRole('button', { name: 'Increase value' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Decrease value' })).not.toBeInTheDocument();
  });

  it('renders increment and decrement stepper buttons when showSteppers is true', () => {
    render(<Time id='test-time' showSteppers={true} />);
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeInTheDocument();
  });

  it('stepper buttons are disabled when the component is disabled', () => {
    render(<Time id='test-time' showSteppers={true} disabled={true} />);
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeDisabled();
  });

  it('preserves focus on the clicked segment instead of always focusing hour', async () => {
    const user = userEvent.setup();
    render(<Time id='test-time' hourCycle={12} />);

    const minuteInput = screen.getByRole('spinbutton', { name: 'Minutes' });
    const dayPeriodInput = screen.getByRole('spinbutton', { name: 'AM or PM' });

    await user.click(minuteInput);
    expect(minuteInput).toHaveFocus();

    await user.click(dayPeriodInput);
    expect(dayPeriodInput).toHaveFocus();
  });

  it('ignores invalid AM/PM values like "1" or "2" instead of applying them', () => {
    const handleChange = vi.fn();
    render(<Time id='test-time' hourCycle={12} onChange={handleChange} />);

    const dayPeriodInput = screen.getByRole('spinbutton', { name: 'AM or PM' });

    fireEvent.change(dayPeriodInput, { target: { value: '1' } });

    expect(dayPeriodInput).toHaveValue('AM');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('toggles AM/PM with arrow keys and with direct A/P key presses', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Time id='test-time' hourCycle={12} onChange={handleChange} />);

    const dayPeriodInput = screen.getByRole('spinbutton', { name: 'AM or PM' });
    await user.click(dayPeriodInput);

    await user.keyboard('{ArrowUp}');
    expect(dayPeriodInput).toHaveValue('PM');

    await user.keyboard('{ArrowDown}');
    expect(dayPeriodInput).toHaveValue('AM');

    await user.keyboard('p');
    expect(dayPeriodInput).toHaveValue('PM');

    await user.keyboard('a');
    expect(dayPeriodInput).toHaveValue('AM');

    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ dayPeriod: 'PM' }));
  });

  it('clamps out-of-range hour input and emits the clamped value via onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Time id='test-time' onChange={handleChange} />);

    const hourInput = screen.getByRole('spinbutton', { name: 'Hours' });
    await user.click(hourInput);
    await user.type(hourInput, '99');

    expect(hourInput).toHaveValue('23');
    expect(handleChange).toHaveBeenLastCalledWith(expect.objectContaining({ hour: '23' }));
  });
});

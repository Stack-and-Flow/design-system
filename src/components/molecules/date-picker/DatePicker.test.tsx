/** @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest';
import { act, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

type MockCalendarSelection = Date | null | [Date | null, Date | null];

type MockCalendarProps = {
  autoFocusOnMount?: boolean;
  disabled?: boolean;
  disabledDates?: Date[];
  firstDayOfWeek?: number;
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  onDateChange?: (selection: MockCalendarSelection) => void;
  readOnly?: boolean;
  selectedDate?: MockCalendarSelection;
  visibleMonths?: number;
};

const calendarMockState = vi.hoisted(() => ({
  props: [] as MockCalendarProps[]
}));

vi.mock('../../atoms/calendar', () => ({
  // biome-ignore lint/style/useNamingConvention: must match component export name
  Calendar: (props: MockCalendarProps) => {
    calendarMockState.props.push(props);

    return (
      <div aria-label='Mock calendar' data-autofocus={String(props.autoFocusOnMount)} role='application'>
        <button type='button' onClick={() => props.onDateChange?.(new Date(2024, 4, 15))}>
          Select May 15, 2024
        </button>
        <button type='button' onClick={() => props.onDateChange?.([new Date(2024, 4, 1), new Date(2024, 4, 15)])}>
          Select range
        </button>
      </div>
    );
  }
}));

import { DatePicker as RootDatePicker } from '../../../index';
import { DatePicker } from './DatePicker';
import { DatePicker as BarrelDatePicker } from './index';
import { useDatePicker } from './useDatePicker';

const getLastCalendarProps = () => {
  const props = calendarMockState.props.at(-1);

  if (!props) {
    throw new Error('Expected DatePicker to render Calendar.');
  }

  return props;
};

const getHiddenInput = (container: HTMLElement, name: string) => {
  const input = container.querySelector(`input[name="${name}"]`);

  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Expected hidden input named ${name}.`);
  }

  return input;
};

beforeAll(() => {
  if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
      observe() {
        // no-op for jsdom positioning tests
      }

      unobserve() {
        // no-op for jsdom positioning tests
      }

      disconnect() {
        // no-op for jsdom positioning tests
      }
    }

    window.ResizeObserver = ResizeObserver;
  }
});

afterEach(() => {
  calendarMockState.props = [];
  vi.restoreAllMocks();
});

describe('useDatePicker — logic', () => {
  it('returns the default empty state and hidden value for named fields', () => {
    const { result } = renderHook(() => useDatePicker({ id: 'birthday', name: 'birthday' }));

    expect(result.current.selectedDate).toBeNull();
    expect(result.current.displayValue).toBe('Select date');
    expect(result.current.effectiveOpen).toBe(false);
    expect(result.current.firstDayOfWeek).toBe(1);
    expect(result.current.visibleMonths).toBe(1);
    expect(result.current.hiddenInputProps).toMatchObject({
      type: 'hidden',
      name: 'birthday',
      value: '',
      disabled: false
    });
  });

  it('serializes hidden input dates with local date getters instead of ISO UTC slicing', () => {
    const boundaryDate = new Date('2024-01-01T00:00:00.000Z');
    vi.spyOn(boundaryDate, 'getFullYear').mockReturnValue(2023);
    vi.spyOn(boundaryDate, 'getMonth').mockReturnValue(11);
    vi.spyOn(boundaryDate, 'getDate').mockReturnValue(31);

    const { result } = renderHook(() =>
      useDatePicker({ id: 'boundary', name: 'boundary', defaultValue: boundaryDate })
    );

    expect(result.current.hiddenInputProps?.value).toBe('2023-12-31');
    expect(result.current.hiddenInputProps?.value).not.toBe(boundaryDate.toISOString().slice(0, 10));
  });

  it('sanitizes date-only format options and lets dateStyle win over granular fields', () => {
    const { result } = renderHook(() =>
      useDatePicker({
        id: 'formatted',
        defaultValue: new Date(2024, 0, 15),
        locale: 'en-US',
        formatOptions: {
          calendar: 'islamic',
          dateStyle: 'medium',
          day: '2-digit',
          hour: '2-digit',
          month: '2-digit',
          timeStyle: 'short',
          timeZone: 'UTC',
          year: 'numeric'
        }
      })
    );

    expect(result.current.sanitizedFormatOptions).toEqual({ dateStyle: 'medium' });
    expect(result.current.displayValue.length).toBeGreaterThan(0);
  });

  it('resolves invalid and non-Gregorian locale candidates to one Gregorian locale for display and Calendar', () => {
    const invalidLocale = renderHook(() => useDatePicker({ id: 'invalid-locale', locale: 'not-a-locale' }));
    const nonGregorianLocale = renderHook(() =>
      useDatePicker({ id: 'non-gregorian-locale', locale: 'ar-SA-u-ca-islamic' })
    );

    for (const hook of [invalidLocale, nonGregorianLocale]) {
      expect(hook.result.current.calendarProps.locale).toBe(hook.result.current.effectiveLocale);
      expect(new Intl.DateTimeFormat(hook.result.current.effectiveLocale).resolvedOptions().calendar).toBe('gregory');
    }
  });

  it('falls back gracefully for invalid display dates and runtime-invalid format options', () => {
    const invalidDate = renderHook(() =>
      useDatePicker({ id: 'invalid-date', name: 'invalid-date', value: new Date(Number.NaN) })
    );
    const invalidOptions = renderHook(() =>
      useDatePicker({
        id: 'invalid-options',
        defaultValue: new Date(2024, 0, 15),
        locale: 'en-US',
        formatOptions: { dateStyle: 'not-a-date-style' } as unknown as Intl.DateTimeFormatOptions
      })
    );

    expect(invalidDate.result.current.displayValue).toBe('Select date');
    expect(invalidDate.result.current.hiddenInputProps?.value).toBe('');
    expect(invalidDate.result.current.calendarProps.selectedDate).toBeNull();
    expect(invalidOptions.result.current.displayValue).toBe('Jan 15, 2024');
  });

  it('lets controlled value win over defaultValue while emitting selected dates and clear events', () => {
    const controlledDate = new Date(2024, 3, 10);
    const defaultDate = new Date(2024, 4, 11);
    const nextDate = new Date(2024, 5, 12);
    const handleDateChange = vi.fn();

    const controlled = renderHook(() =>
      useDatePicker({
        id: 'controlled',
        value: controlledDate,
        defaultValue: defaultDate,
        onDateChange: handleDateChange
      })
    );

    expect(controlled.result.current.selectedDate).toBe(controlledDate);

    act(() => {
      controlled.result.current.selectDate(nextDate);
    });

    expect(controlled.result.current.selectedDate).toBe(controlledDate);
    expect(handleDateChange).toHaveBeenLastCalledWith(nextDate);

    const uncontrolled = renderHook(() =>
      useDatePicker({ id: 'uncontrolled', defaultValue: defaultDate, onDateChange: handleDateChange })
    );

    act(() => {
      uncontrolled.result.current.selectDate(nextDate);
    });
    act(() => {
      uncontrolled.result.current.clearDate();
    });

    expect(uncontrolled.result.current.selectedDate).toBeNull();
    expect(handleDateChange).toHaveBeenCalledWith(nextDate);
    expect(handleDateChange).toHaveBeenCalledWith(null);
    expect(uncontrolled.result.current.shouldRestoreFocusAfterClear).toBe(true);
  });

  it('does not close the popover when direct hook selection rejects an unavailable date', () => {
    const handleDateChange = vi.fn();
    const handleOpenChange = vi.fn();
    const unavailableDate = new Date(2024, 0, 1);
    const { result } = renderHook(() =>
      useDatePicker({
        id: 'unavailable-direct-selection',
        defaultOpen: true,
        disabledDates: [unavailableDate],
        onDateChange: handleDateChange,
        onOpenChange: handleOpenChange
      })
    );

    act(() => {
      result.current.selectDate(unavailableDate);
    });

    expect(result.current.effectiveOpen).toBe(true);
    expect(handleDateChange).not.toHaveBeenCalled();
    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('supports uncontrolled and controlled open state precedence', () => {
    const uncontrolledOpenChange = vi.fn();
    const controlledOpenChange = vi.fn();

    const uncontrolled = renderHook(() =>
      useDatePicker({ id: 'uncontrolled-open', defaultOpen: true, onOpenChange: uncontrolledOpenChange })
    );
    const controlled = renderHook(() =>
      useDatePicker({ id: 'controlled-open', open: false, defaultOpen: true, onOpenChange: controlledOpenChange })
    );

    expect(uncontrolled.result.current.effectiveOpen).toBe(true);
    expect(controlled.result.current.effectiveOpen).toBe(false);

    act(() => {
      uncontrolled.result.current.requestOpenChange(false);
      controlled.result.current.requestOpenChange(true);
    });

    expect(uncontrolled.result.current.effectiveOpen).toBe(false);
    expect(uncontrolledOpenChange).toHaveBeenLastCalledWith(false);
    expect(controlled.result.current.effectiveOpen).toBe(false);
    expect(controlledOpenChange).toHaveBeenLastCalledWith(true);
  });

  it('forces controlled open state closed for disabled and read-only fields without emitting user open changes', () => {
    const disabledOpenChange = vi.fn();
    const readOnlyOpenChange = vi.fn();

    const disabled = renderHook(() =>
      useDatePicker({ id: 'disabled', open: true, disabled: true, onOpenChange: disabledOpenChange })
    );
    const readOnly = renderHook(() =>
      useDatePicker({ id: 'readonly', open: true, readOnly: true, onOpenChange: readOnlyOpenChange })
    );

    expect(disabled.result.current.effectiveOpen).toBe(false);
    expect(readOnly.result.current.effectiveOpen).toBe(false);

    act(() => {
      disabled.result.current.requestOpenChange(true);
      readOnly.result.current.requestOpenChange(true);
    });

    expect(disabledOpenChange).not.toHaveBeenCalled();
    expect(readOnlyOpenChange).not.toHaveBeenCalled();
  });

  it('returns hidden input props only when named and not disabled, while read-only stays enabled', () => {
    const enabled = renderHook(() => useDatePicker({ id: 'enabled', name: 'enabled' }));
    const disabled = renderHook(() => useDatePicker({ id: 'disabled', name: 'disabled', disabled: true }));
    const readOnly = renderHook(() => useDatePicker({ id: 'readonly', name: 'readonly', readOnly: true }));

    expect(enabled.result.current.hiddenInputProps?.disabled).toBe(false);
    expect(disabled.result.current.hiddenInputProps).toBeUndefined();
    expect(readOnly.result.current.hiddenInputProps).toMatchObject({
      name: 'readonly',
      disabled: false
    });
  });

  it('sanitizes firstDayOfWeek and visibleMonths into Calendar-safe values', () => {
    const defaults = renderHook(() => useDatePicker({ id: 'defaults', firstDayOfWeek: Number.NaN, visibleMonths: 0 }));
    const floored = renderHook(() => useDatePicker({ id: 'floored', firstDayOfWeek: 6.9, visibleMonths: 2.8 }));
    const outOfRange = renderHook(() =>
      useDatePicker({ id: 'out-of-range', firstDayOfWeek: 9, visibleMonths: Number.POSITIVE_INFINITY })
    );
    const capped = renderHook(() => useDatePicker({ id: 'capped', visibleMonths: 10_000 }));

    expect(defaults.result.current.firstDayOfWeek).toBe(1);
    expect(defaults.result.current.visibleMonths).toBe(1);
    expect(floored.result.current.firstDayOfWeek).toBe(6);
    expect(floored.result.current.visibleMonths).toBe(2);
    expect(outOfRange.result.current.firstDayOfWeek).toBe(1);
    expect(outOfRange.result.current.visibleMonths).toBe(1);
    expect(capped.result.current.visibleMonths).toBe(12);
  });

  it('keeps clear behavior inert while disabled or read-only', () => {
    const disabledChange = vi.fn();
    const readOnlyChange = vi.fn();
    const disabled = renderHook(() =>
      useDatePicker({
        id: 'disabled-clear',
        defaultValue: new Date(2024, 0, 1),
        disabled: true,
        onDateChange: disabledChange
      })
    );
    const readOnly = renderHook(() =>
      useDatePicker({
        id: 'readonly-clear',
        defaultValue: new Date(2024, 0, 1),
        readOnly: true,
        onDateChange: readOnlyChange
      })
    );

    act(() => {
      disabled.result.current.clearDate();
      readOnly.result.current.clearDate();
    });

    expect(disabled.result.current.selectedDate).toEqual(new Date(2024, 0, 1));
    expect(readOnly.result.current.selectedDate).toEqual(new Date(2024, 0, 1));
    expect(disabled.result.current.shouldRestoreFocusAfterClear).toBe(false);
    expect(readOnly.result.current.shouldRestoreFocusAfterClear).toBe(false);
    expect(disabledChange).not.toHaveBeenCalled();
    expect(readOnlyChange).not.toHaveBeenCalled();
  });
});

describe('DatePicker — component behavior', () => {
  it('is exported from the molecule barrel and package root', () => {
    expect(BarrelDatePicker).toBe(DatePicker);
    expect(RootDatePicker).toBe(DatePicker);
  });

  it('renders accessible triggers from a visible label or ariaLabel fallback', () => {
    const { rerender } = render(<DatePicker id='start-date' label='Start date' />);

    expect(screen.getByRole('button', { name: 'Start date Select date' })).toHaveTextContent('Select date');

    rerender(<DatePicker id='deadline' ariaLabel='Choose deadline' />);

    expect(screen.getByRole('button', { name: 'Choose deadline Select date' })).toHaveTextContent('Select date');
  });

  it('includes the selected display value in trigger accessible names', () => {
    const selectedDate = new Date(2024, 4, 15);
    const { rerender } = render(<DatePicker id='start-date' label='Start date' value={selectedDate} locale='en-US' />);

    expect(screen.getByRole('button', { name: 'Start date May 15, 2024' })).toHaveTextContent('May 15, 2024');

    rerender(<DatePicker id='deadline' ariaLabel='Choose deadline' value={selectedDate} locale='en-US' />);

    expect(screen.getByRole('button', { name: 'Choose deadline May 15, 2024' })).toHaveTextContent('May 15, 2024');
  });

  it('renders and wires descriptions, validation, required, and read-only copy without aria-required', () => {
    render(
      <DatePicker
        id='readonly-date'
        label='Review date'
        description='Pick the date that reviewers should see.'
        isRequired={true}
        readOnly={true}
        validationState='error'
        validationMessage='Choose an available date.'
      />
    );

    const trigger = screen.getByRole('button', { name: 'Review date Select date' });
    const describedBy = trigger.getAttribute('aria-describedby') ?? '';

    expect(screen.getByText('Pick the date that reviewers should see.')).toHaveAttribute(
      'id',
      'readonly-date-description'
    );
    expect(screen.getByText('Required field.')).toHaveAttribute('id', 'readonly-date-required');
    expect(screen.getByText('Read-only field.')).toHaveAttribute('id', 'readonly-date-readonly');
    expect(screen.getByText('Choose an available date.')).toHaveAttribute('id', 'readonly-date-validation');
    expect(describedBy.split(' ')).toEqual(
      expect.arrayContaining([
        'readonly-date-description',
        'readonly-date-required',
        'readonly-date-readonly',
        'readonly-date-validation'
      ])
    );
    expect(trigger).not.toHaveAttribute('aria-required');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('opens an accessible Popover and passes sanitized Calendar props only while open', async () => {
    const user = userEvent.setup();
    const selectedDate = new Date(2024, 4, 10);
    const minDate = new Date(2024, 4, 1);
    const maxDate = new Date(2024, 4, 31);
    const disabledDates = [new Date(2024, 4, 12)];

    render(
      <DatePicker
        id='booking-date'
        label='Booking date'
        defaultValue={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        firstDayOfWeek={6.9}
        visibleMonths={2.8}
        locale='ar-SA-u-ca-islamic'
        popoverClassName='custom-popover-class'
      />
    );

    expect(screen.queryByRole('application', { name: 'Mock calendar' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Booking date/ }));

    expect(await screen.findByRole('dialog', { name: 'Booking date calendar' })).toHaveClass('custom-popover-class');
    expect(screen.getByRole('application', { name: 'Mock calendar' })).toHaveAttribute('data-autofocus', 'true');

    const calendarProps = getLastCalendarProps();
    expect(calendarProps.selectedDate).toBe(selectedDate);
    expect(calendarProps.minDate).toBe(minDate);
    expect(calendarProps.maxDate).toBe(maxDate);
    expect(calendarProps.disabledDates).toBe(disabledDates);
    expect(calendarProps.firstDayOfWeek).toBe(6);
    expect(calendarProps.visibleMonths).toBe(2);
    expect(calendarProps.autoFocusOnMount).toBe(true);
    expect(calendarProps.locale).toBeDefined();
    expect(new Intl.DateTimeFormat(calendarProps.locale).resolvedOptions().calendar).toBe('gregory');
  });

  it('selects a single Calendar date, updates display and hidden input, emits once, and closes', async () => {
    const user = userEvent.setup();
    const handleDateChange = vi.fn();
    const { container } = render(
      <DatePicker
        id='appointment-date'
        name='appointment'
        label='Appointment date'
        locale='en-US'
        onDateChange={handleDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Appointment date Select date' }));
    await user.click(await screen.findByRole('button', { name: 'Select May 15, 2024' }));

    expect(handleDateChange).toHaveBeenCalledTimes(1);
    expect(handleDateChange).toHaveBeenCalledWith(new Date(2024, 4, 15));
    expect(getHiddenInput(container, 'appointment')).toHaveValue('2024-05-15');
    expect(screen.getByRole('button', { name: 'Appointment date May 15, 2024' })).toHaveTextContent('May 15, 2024');
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Appointment date calendar' })).not.toBeInTheDocument()
    );
  });

  it('ignores Calendar range selections in single-date mode', async () => {
    const user = userEvent.setup();
    const handleDateChange = vi.fn();

    render(<DatePicker id='single-date' label='Single date' onDateChange={handleDateChange} />);

    await user.click(screen.getByRole('button', { name: 'Single date Select date' }));
    await user.click(await screen.findByRole('button', { name: 'Select range' }));

    expect(handleDateChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Single date calendar' })).toBeInTheDocument();
  });

  it('keeps disabled and read-only fields closed while preserving read-only hidden values', async () => {
    const user = userEvent.setup();
    const handleReadOnlyChange = vi.fn();
    const readOnlyDate = new Date(2024, 6, 4);
    const { container, rerender } = render(
      <DatePicker id='blocked-date' name='blocked' label='Blocked date' disabled={true} />
    );

    const disabledTrigger = screen.getByRole('button', { name: 'Blocked date Select date' });
    expect(disabledTrigger).toBeDisabled();
    expect(container.querySelector('input[name="blocked"]')).toBeNull();

    await user.click(disabledTrigger);
    expect(screen.queryByRole('dialog', { name: 'Blocked date calendar' })).not.toBeInTheDocument();

    rerender(
      <DatePicker
        id='blocked-date'
        name='blocked'
        label='Blocked date'
        value={readOnlyDate}
        readOnly={true}
        isClearable={true}
        locale='en-US'
        onDateChange={handleReadOnlyChange}
      />
    );

    const readOnlyTrigger = screen.getByRole('button', { name: 'Blocked date Jul 4, 2024' });
    expect(readOnlyTrigger).not.toBeDisabled();
    expect(readOnlyTrigger).toHaveAttribute('aria-disabled', 'true');
    expect(getHiddenInput(container, 'blocked')).toHaveValue('2024-07-04');
    expect(screen.queryByRole('button', { name: 'Clear selected date' })).not.toBeInTheDocument();

    await user.click(readOnlyTrigger);
    expect(screen.queryByRole('dialog', { name: 'Blocked date calendar' })).not.toBeInTheDocument();
    expect(handleReadOnlyChange).not.toHaveBeenCalled();
  });

  it('renders clear as a sibling button, clears the value, and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    const handleDateChange = vi.fn();
    const { container } = render(
      <DatePicker
        id='clearable-date'
        name='clearable'
        label='Clearable date'
        defaultValue={new Date(2024, 4, 15)}
        isClearable={true}
        locale='en-US'
        onDateChange={handleDateChange}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Clearable date May 15, 2024' });
    const clearButton = screen.getByRole('button', { name: 'Clear selected date' });

    expect(clearButton).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).not.toContainElement(clearButton);
    expect(trigger.parentElement?.parentElement).toBe(clearButton.parentElement);

    await user.click(clearButton);

    expect(handleDateChange).toHaveBeenCalledWith(null);
    expect(getHiddenInput(container, 'clearable')).toHaveValue('');
    expect(trigger).toHaveTextContent('Select date');
    expect(screen.queryByRole('button', { name: 'Clear selected date' })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('keeps the calendar indicator decorative and all DatePicker buttons non-submitting', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    const { container } = render(
      <form onSubmit={handleSubmit}>
        <DatePicker
          id='form-date'
          label='Form date'
          defaultValue={new Date(2024, 4, 15)}
          isClearable={true}
          locale='en-US'
        />
      </form>
    );

    const indicator = container.querySelector('[data-slot="date-picker-indicator"]');

    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(indicator).toHaveAttribute('focusable', 'false');

    await user.click(screen.getByRole('button', { name: 'Form date May 15, 2024' }));

    const dialog = await screen.findByRole('dialog', { name: 'Form date calendar' });
    const calendarButton = within(dialog).getByRole('button', { name: 'Select May 15, 2024' });
    expect(calendarButton).toHaveAttribute('type', 'button');

    await user.click(screen.getByRole('button', { name: 'Clear selected date' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});

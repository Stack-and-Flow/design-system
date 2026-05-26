import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';
import { useCalendar } from './useCalendar';

const baseDate = new Date(2025, 7, 14);
const rangeStart = new Date(2025, 7, 11);
const rangeStartOnly: [Date | null, Date | null] = [rangeStart, null];
const rangeEnd = new Date(2025, 7, 18);

const getDateMatcher = (date: Date): RegExp => new RegExp(buildFullDateLabel(date), 'i');

const buildFullDateLabel = (date: Date): string =>
  new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

const findCurrentMonthDay = (months: ReturnType<typeof useCalendar>['months'], dayNumber: number) =>
  months[0].weeks.flat().find((day) => day.dayNumber === dayNumber && day.isCurrentMonth);

describe('useCalendar — logic', () => {
  it('returns one visible month by default and seven weekday headers', () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: baseDate }));

    expect(result.current.months).toHaveLength(1);
    expect(result.current.weekdayHeaders).toHaveLength(7);
  });

  it('rotates weekday headers from the configured first day of the week', () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: baseDate, firstDayOfWeek: 0, locale: 'en' }));

    expect(result.current.weekdayHeaders[0]).toMatch(/sun/i);
  });

  it('calls onDateChange with a single date when a day is selected', () => {
    const onDateChange = vi.fn();
    const { result } = renderHook(() => useCalendar({ selectedDate: baseDate, onDateChange }));
    const nextDay = findCurrentMonthDay(result.current.months, 15);

    expect(nextDay).toBeDefined();

    act(() => {
      nextDay?.buttonProps.onClick();
    });

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith(expect.any(Date));
    expect(onDateChange.mock.calls[0]?.[0]).toEqual(new Date(2025, 7, 15));
  });

  it('completes a range selection when a start date already exists', () => {
    const onDateChange = vi.fn();
    const { result } = renderHook(() => useCalendar({ selectedDate: rangeStartOnly, onDateChange }));
    const endDay = findCurrentMonthDay(result.current.months, 16);

    expect(endDay).toBeDefined();

    act(() => {
      endDay?.buttonProps.onClick();
    });

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange.mock.calls[0]?.[0]).toEqual([rangeStart, new Date(2025, 7, 16)]);
  });
});

describe('Calendar — component behavior', () => {
  it('renders a labeled calendar grid and month heading', () => {
    render(<Calendar selectedDate={baseDate} />);

    expect(screen.getByRole('grid', { name: /august 2025/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose month and year/i })).toBeInTheDocument();
  });

  it('selects a single date when an enabled day button is clicked', async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(<Calendar selectedDate={baseDate} onDateChange={onDateChange} />);

    await user.click(screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 15)) }));

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith(new Date(2025, 7, 15));
  });

  it('does not call onDateChange or open the picker when the calendar is read-only', async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(<Calendar selectedDate={baseDate} onDateChange={onDateChange} readOnly={true} />);

    const dayButton = screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 15)) });
    const pickerButton = screen.getByRole('button', { name: /choose month and year/i });

    expect(dayButton).toBeDisabled();
    expect(pickerButton).toBeDisabled();

    await user.click(dayButton);
    await user.click(pickerButton);

    expect(onDateChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: /choose month and year/i })).not.toBeInTheDocument();
  });

  it('does not call onDateChange when the calendar is disabled', async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(<Calendar selectedDate={baseDate} onDateChange={onDateChange} disabled={true} />);

    const nextMonthButton = screen.getByRole('button', { name: /next month/i });
    expect(nextMonthButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 15)) }));

    expect(onDateChange).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation and selection within the grid', async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(<Calendar selectedDate={baseDate} onDateChange={onDateChange} />);

    const selectedButton = screen.getByRole('button', { name: getDateMatcher(baseDate) });

    await user.click(selectedButton);
    await user.keyboard('{ArrowRight}{Enter}');

    const nextDayButton = screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 15)) });

    expect(nextDayButton).toHaveFocus();
    expect(onDateChange).toHaveBeenCalledWith(new Date(2025, 7, 15));
  });

  it('supports completing a visible range selection', async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    render(<Calendar selectedDate={rangeStartOnly} onDateChange={onDateChange} />);

    await user.click(screen.getByRole('button', { name: getDateMatcher(rangeEnd) }));

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith([rangeStart, rangeEnd]);
  });

  it('opens the month and year picker, moves focus, closes with Escape, and updates the month selection', async () => {
    const user = userEvent.setup();

    render(<Calendar selectedDate={baseDate} />);

    const pickerTrigger = screen.getByRole('button', { name: /choose month and year/i });
    await user.click(pickerTrigger);

    let picker = screen.getByRole('dialog', { name: /choose month and year/i });
    expect(screen.getByRole('button', { name: /back to calendar/i })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /choose month and year/i })).not.toBeInTheDocument();
    expect(pickerTrigger).toHaveFocus();

    await user.click(pickerTrigger);
    picker = screen.getByRole('dialog', { name: /choose month and year/i });
    const monthButtons = within(picker).getAllByRole('button');
    const octoberButton = monthButtons.find((button) => button.textContent?.toLowerCase() === 'october');

    expect(octoberButton).toBeDefined();

    await user.click(octoberButton as HTMLButtonElement);

    expect(screen.getByRole('grid', { name: /october 2025/i })).toBeInTheDocument();
  });

  it('marks configured disabled dates as unavailable', () => {
    render(<Calendar selectedDate={baseDate} disabledDates={[new Date(2025, 7, 19)]} />);

    const disabledButton = screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 19)) });

    expect(disabledButton).toBeDisabled();
    expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('initializes focus to the first enabled in-range date when the selected month is unavailable', () => {
    const minDate = new Date(2025, 8, 10);
    const firstEnabledDate = new Date(2025, 8, 11);

    render(
      <Calendar selectedDate={baseDate} minDate={minDate} maxDate={new Date(2025, 8, 20)} disabledDates={[minDate]} />
    );

    expect(screen.getByRole('grid', { name: /september 2025/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: getDateMatcher(minDate) })).toBeDisabled();
    expect(screen.getByRole('button', { name: getDateMatcher(firstEnabledDate) })).toHaveAttribute('tabindex', '0');
  });

  it('skips disabled dates during keyboard navigation', async () => {
    const user = userEvent.setup();

    render(<Calendar selectedDate={new Date(2025, 7, 18)} disabledDates={[new Date(2025, 7, 19)]} />);

    await user.click(screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 18)) }));
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 20)) })).toHaveFocus();
  });

  it('keeps navigation focus on an enabled date when the target date is disabled', async () => {
    const user = userEvent.setup();
    const disabledTargetDate = new Date(2025, 8, 14);
    const fallbackDate = new Date(2025, 8, 15);

    render(<Calendar selectedDate={baseDate} disabledDates={[disabledTargetDate]} />);

    await user.click(screen.getByRole('button', { name: /next month/i }));

    expect(screen.getByRole('grid', { name: /september 2025/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: getDateMatcher(disabledTargetDate) })).toBeDisabled();
    expect(screen.getByRole('button', { name: getDateMatcher(fallbackDate) })).toHaveFocus();
  });

  it('keeps exactly one roving tab stop in three-month mode', () => {
    render(<Calendar selectedDate={new Date(2025, 8, 1)} visibleMonths={3} />);

    const septemberFirstButtons = screen.getAllByRole('button', { name: getDateMatcher(new Date(2025, 8, 1)) });
    const tabbableButtons = septemberFirstButtons.filter((button) => button.tabIndex === 0);

    expect(septemberFirstButtons.length).toBeGreaterThan(1);
    expect(tabbableButtons).toHaveLength(1);
  });

  it('supports hidden rendering, locale labels, visible months, and min/max bounds', () => {
    const { rerender } = render(<Calendar selectedDate={baseDate} show={false} />);

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();

    rerender(<Calendar selectedDate={baseDate} visibleMonths={2} minDate={baseDate} maxDate={rangeEnd} />);

    expect(screen.getAllByRole('grid')).toHaveLength(2);
    expect(screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 13)) })).toBeDisabled();
    expect(screen.getByRole('button', { name: getDateMatcher(new Date(2025, 7, 19)) })).toBeDisabled();

    rerender(<Calendar selectedDate={baseDate} locale='es' />);

    expect(screen.getByRole('button', { name: /elegir mes y año/i })).toBeInTheDocument();
  });
});

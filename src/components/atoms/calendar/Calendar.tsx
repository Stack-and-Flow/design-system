import React from 'react';
import { calendarCva } from './calendarCva';
import { dayCva } from './dayCva';
import { MonthYearPickerDropdown } from './MonthYearPickerDropdown';
import type { CalendarProps } from './types';
import { calendarColorPalette, lightenColor, useCalendar } from './useCalendar';

// Functional calendar component for date visualization and selection
export const Calendar: React.FC<CalendarProps> = ({
  firstDayOfWeek = 1, // Monday as default
  variant = 'filled',
  size = 'md',
  radius = 'md',
  show = true,
  theme = 'light',
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  onDateChange,
  selectedDate,
  disabledDates,
  highlightedDates,
  locale,
  visibleMonths = 1,
  color = 'default'
}) => {
  const {
    monthDatas,
    weekdayNames,
    monthNames,
    currentDate,
    setCurrentDate,
    handleDayClick,
    goToPrevMonth,
    goToNextMonth,
    isSameDay
  } = useCalendar({
    selectedDate,
    onDateChange,
    minDate,
    maxDate,
    disabled,
    readOnly,
    firstDayOfWeek,
    disabledDates,
    highlightedDates,
    locale,
    visibleMonths,
    theme
  });

  // Drag state for range selection
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<Date | null>(null);
  const [dragEnd, setDragEnd] = React.useState<Date | null>(null);

  // Effect to handle global mouseup for drag & drop range selection
  React.useEffect(() => {
    if (!isDragging) {
      return;
    }
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      if (dragStart && dragEnd && !isSameDay(dragStart, dragEnd)) {
        handleDayClick(dragEnd, false);
      }
      setDragStart(null);
      setDragEnd(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, dragEnd, handleDayClick, isSameDay]);

  // State for picker mode (months/years)
  const [pickerMode, setPickerMode] = React.useState<'calendar' | 'month' | 'year'>('calendar');

  // Header: month and year selector (combined)
  const years = Array.from({ length: 21 }, (_, i) => 2015 + i); // 2015-2035 for a wide range

  // Determine radius for CVA and style
  const radiusCva = radius;

  if (!show) {
    return null;
  }

  // Compute header label for single or multi-month
  let headerLabel = '';
  if (monthDatas.length === 1) {
    headerLabel = monthDatas[0].label;
  } else {
    const first = monthDatas[0];
    const last = monthDatas[monthDatas.length - 1];
    const firstMonth = monthNames[first.monthDate.getMonth()];
    const lastMonth = monthNames[last.monthDate.getMonth()];
    const firstYear = first.monthDate.getFullYear();
    const lastYear = last.monthDate.getFullYear();
    headerLabel =
      firstYear === lastYear
        ? `${firstMonth} - ${lastMonth} ${firstYear}`
        : `${firstMonth} ${firstYear} - ${lastMonth} ${lastYear}`;
  }

  // Generate dynamic hover class
  const bgColor = calendarColorPalette[color] || calendarColorPalette['default'];
  const hoverColor = lightenColor(bgColor, 20); // Lighten by 20% for hover
  const dynamicHoverClass = `custom-hover-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  const dynamicStyles = `
    .${dynamicHoverClass}:hover {
      background-color: ${hoverColor} !important;
      color: var(--color-text-dark) !important;
    }
  `;
  return (
    <div>
      <style>{dynamicStyles}</style>
      <div
        className={`${calendarCva({ variant, size, radius: radiusCva, theme, show, disabled, readOnly })} ${visibleMonths > 1 ? 'w-auto' : ''}`}
        role='application'
        style={{
          animation: 'var(--animate-fadeIn)',
          ...(readOnly ? { pointerEvents: 'none' } : {}),
          ...(disabled ? { pointerEvents: 'none' } : {})
        }}
      >
        {/* Header: month and year, click to open picker */}
        <div className='flex justify-between items-center mb-4 gap-2'>
          <button
            onClick={disabled || readOnly ? undefined : goToPrevMonth}
            className={`p-2 rounded-full hover:bg-surface-raised-light dark:hover:bg-white-tint-faint focus:outline-none focus:ring-2 transition-colors duration-200 ${variant === 'outlined' ? 'text-text-light dark:text-text-dark' : ''}`}
            aria-label='Previous month'
            disabled={disabled || readOnly}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M15 19l-7-7 7-7'></path>
            </svg>
          </button>
          <button
            type='button'
            className='bg-transparent outline-none font-semibold text-text-light dark:text-text-dark px-2 py-1 rounded hover:bg-surface-raised-light dark:hover:bg-white-tint-faint transition-colors duration-150'
            aria-label='Choose month and year'
            onClick={disabled || readOnly ? undefined : () => setPickerMode('month')}
            disabled={disabled || readOnly}
          >
            {headerLabel}
          </button>
          <button
            onClick={disabled || readOnly ? undefined : goToNextMonth}
            className={`p-2 rounded-full hover:bg-surface-raised-light dark:hover:bg-white-tint-faint focus:outline-none focus:ring-2 transition-colors duration-200 ${variant === 'outlined' ? 'text-text-light dark:text-text-dark' : ''}`}
            aria-label='Next month'
            disabled={disabled || readOnly}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M9 5l7 7-7 7'></path>
            </svg>
          </button>
        </div>

        {/* Fullscreen month/year picker view */}
        {pickerMode === 'month' && (
          <MonthYearPickerDropdown
            currentYear={currentDate.getFullYear()}
            currentMonth={currentDate.getMonth()}
            minDate={minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : undefined}
            maxDate={maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()) : undefined}
            onChange={(year, month) => {
              const newDate = new Date(year, month, 1);
              setCurrentDate(newDate);
              setPickerMode('calendar');
            }}
            onCancel={() => setPickerMode('calendar')}
            monthNames={monthNames}
            years={years}
            locale={locale}
          />
        )}

        {/* Calendar grid */}
        {pickerMode === 'calendar' && (
          <div className='flex gap-4'>
            {monthDatas.map((monthData, index) => (
              <div key={index} className='flex-1' role='grid'>
                {/* Weekday headers */}
                <div
                  className='grid grid-cols-7 gap-1 mb-2 text-center text-sm font-semibold text-text-tertiary-light dark:text-text-secondary-dark'
                  role='row'
                >
                  <div className='contents'>
                    {weekdayNames.map((day) => (
                      <div key={day} className='py-1' role='columnheader'>
                        <span>{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Grid of days */}
                <div className='grid grid-cols-7 gap-1' role='rowgroup'>
                  {monthData.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} role='row' className='contents'>
                      {week.map((day, dayIndex) => {
                        // Determine if day is in drag range
                        let isDragInRange = false;
                        let isDragRangeStart = false;
                        let isDragRangeEnd = false;
                        if (dragStart && dragEnd) {
                          const start = dragStart < dragEnd ? dragStart : dragEnd;
                          const end = dragStart > dragEnd ? dragStart : dragEnd;
                          isDragInRange = day.date >= start && day.date <= end;
                          isDragRangeStart = isSameDay(day.date, start);
                          isDragRangeEnd = isSameDay(day.date, end);
                        }
                        // Only apply highlight if not selected
                        const isSelectedDay = day.isSelected;
                        let highlightClass;
                        let highlightStyle;
                        if (day.isHighlighted) {
                          if (isSelectedDay) {
                            // Only apply border from highlightStyle if present
                            if (day.highlightStyle?.border) {
                              highlightStyle = { border: day.highlightStyle.border };
                            }
                            // Optionally merge border class if present
                            if (day.highlightClassName?.includes('border')) {
                              highlightClass = day.highlightClassName
                                .split(' ')
                                .filter((c: string) => c.includes('border'))
                                .join(' ');
                            }
                          } else {
                            highlightClass = day.highlightClassName;
                            highlightStyle = day.highlightStyle;
                          }
                        }
                        // Determine color for selected/range days
                        let dayStyle = { userSelect: 'none', ...highlightStyle };
                        if ((day.isSelected || day.isInRange || isDragInRange) && !day.isDisabled) {
                          if (variant === 'outlined') {
                            dayStyle = {
                              ...dayStyle,
                              border: `2px solid ${bgColor}`,
                              background: 'transparent'
                            };
                          } else if (variant === 'soft') {
                            dayStyle = {
                              ...dayStyle,
                              background: bgColor + '22', // 13% opacity
                              color: bgColor
                            };
                          } else if (variant === 'ghost') {
                            dayStyle = {
                              ...dayStyle,
                              background: 'transparent',
                              color: bgColor,
                              textDecoration: 'underline'
                            };
                          } else {
                            // filled
                            dayStyle = {
                              ...dayStyle
                            };
                          }
                        }
                        // Apply dynamic hover class for selected/range days
                        const hoverClass =
                          (day.isSelected || day.isInRange || isDragInRange) && !day.isDisabled
                            ? dynamicHoverClass
                            : '';
                        return (
                          <div
                            key={dayIndex}
                            className={[
                              dayCva({
                                size,
                                isCurrentMonth: day.isCurrentMonth,
                                isSelected: day.isSelected,
                                variant,
                                isToday: day.isToday,
                                isDisabled: day.isDisabled,
                                isInRange: day.isInRange || isDragInRange,
                                isRangeStart: day.isRangeStart || isDragRangeStart,
                                isRangeEnd: day.isRangeEnd || isDragRangeEnd,
                                theme
                              }),
                              highlightClass,
                              readOnly ? 'pointer-events-none select-none' : '',
                              hoverClass
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onMouseDown={
                              day.isDisabled || readOnly
                                ? undefined
                                : () => {
                                    setIsDragging(true);
                                    setDragStart(day.date);
                                    setDragEnd(day.date);
                                  }
                            }
                            onMouseEnter={
                              isDragging && !(day.isDisabled || readOnly) ? () => setDragEnd(day.date) : undefined
                            }
                            onMouseUp={
                              isDragging && !(day.isDisabled || readOnly)
                                ? () => {
                                    setIsDragging(false);
                                    if (dragStart && dragEnd && !isSameDay(dragStart, dragEnd)) {
                                      handleDayClick(dragEnd, false);
                                    }
                                    setDragStart(null);
                                    setDragEnd(null);
                                  }
                                : undefined
                            }
                            onClick={
                              day.isDisabled || readOnly
                                ? undefined
                                : () => {
                                    if (!isDragging) {
                                      handleDayClick(day.date, day.isDisabled);
                                    }
                                  }
                            }
                            role='gridcell'
                            aria-selected={day.isSelected ? 'true' : 'false'}
                            aria-disabled={day.isDisabled || readOnly ? 'true' : 'false'}
                            tabIndex={day.isDisabled || readOnly ? -1 : 0}
                            style={dayStyle}
                          >
                            {day.date.getDate()}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

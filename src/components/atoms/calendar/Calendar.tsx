import React from 'react';
import { MonthYearPickerDropdown } from './MonthYearPickerDropdown';
import { calendarCva } from './calendarCva';
import { dayCva } from './dayCva';
import type { CalendarProps } from './types';
import { useCalendar } from './useCalendar';

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
  id,
  minDate,
  maxDate,
  onDateChange,
  selectedDate,
  ...props
}) => {
  const { weeks, weekdayNames, monthNames, currentDate, handleDayClick, goToPrevMonth, goToNextMonth, isSameDay } =
    useCalendar({
      selectedDate,
      onDateChange,
      minDate,
      maxDate,
      disabled,
      readOnly,
      firstDayOfWeek,
      ...props
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

  // Accessible label for the grid
  const monthYearLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Header: month and year selector (combined)
  const years = Array.from({ length: 21 }, (_, i) => 2015 + i); // 2015-2035 for a wide range

  // Determine radius for CVA and style
  const radiusCva = radius;

  if (!show) {
    return null;
  }

  return (
    <div
      className={calendarCva({ variant, size, radius: radiusCva, theme, show, disabled, readOnly })}
      role='application'
      style={{
        animation: 'fadeIn 0.3s',
        ...(readOnly ? { pointerEvents: 'none', opacity: 0.8 } : {})
      }}
    >
      {/* Header: month and year, click to open picker */}
      <div className='flex justify-between items-center mb-4 gap-2'>
        <button
          onClick={readOnly ? undefined : goToPrevMonth}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 transition-colors duration-200 ${variant === 'outlined' ? 'text-gray-900 dark:text-white' : ''}`}
          aria-label='Previous month'
          disabled={readOnly}
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
          className='bg-transparent outline-none font-semibold text-gray-900 dark:text-gray-100 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150'
          aria-label='Choose month and year'
          onClick={readOnly ? undefined : () => setPickerMode('month')}
          disabled={readOnly}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </button>
        <button
          onClick={readOnly ? undefined : goToNextMonth}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 transition-colors duration-200 ${variant === 'outlined' ? 'text-gray-900 dark:text-white' : ''}`}
          aria-label='Next month'
          disabled={readOnly}
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
            const newDate = new Date(currentDate);
            newDate.setFullYear(year);
            newDate.setMonth(month);
            onDateChange?.(newDate);
            setPickerMode('calendar');
          }}
          onCancel={() => setPickerMode('calendar')}
          years={years}
          monthNames={monthNames}
        />
      )}

      {/* Regular calendar view */}
      {pickerMode === 'calendar' && (
        <>
          <h2 id={`month-year-label-${id ?? 'default'}`} className='sr-only'>
            {monthYearLabel}
          </h2>
          <div role='grid' aria-labelledby={`month-year-label-${id ?? 'default'}`}>
            {/* Weekday names */}
            <div
              className='grid grid-cols-7 text-center text-xs font-medium uppercase mb-2 text-gray-500 dark:text-gray-400'
              role='rowgroup'
            >
              <div role='row' className='contents'>
                {weekdayNames.map((day) => (
                  <div key={day} className='py-1' role='columnheader'>
                    <span>{day}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Grid of days */}
            <div className='grid grid-cols-7 gap-1' role='rowgroup'>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} role='row' className='contents'>
                  {week.map((day, dayIndex) => {
                    // Determine if day is in drag range
                    let isDragInRange = false;
                    if (dragStart && dragEnd) {
                      const start = dragStart < dragEnd ? dragStart : dragEnd;
                      const end = dragStart > dragEnd ? dragStart : dragEnd;
                      isDragInRange = day.date >= start && day.date <= end;
                    }
                    return (
                      <div
                        key={dayIndex}
                        className={dayCva({
                          size,
                          isCurrentMonth: day.isCurrentMonth,
                          isSelected: day.isSelected && !day.isRangeStart,
                          variant,
                          isToday: day.isToday,
                          isDisabled: day.isDisabled || readOnly,
                          isInRange: day.isInRange || day.isRangeStart || isDragInRange,
                          isRangeStart:
                            day.isRangeStart || (isDragInRange && dragStart && isSameDay(day.date, dragStart)),
                          isRangeEnd: day.isRangeEnd || (isDragInRange && dragEnd && isSameDay(day.date, dragEnd))
                        })}
                        onMouseDown={
                          readOnly || day.isDisabled
                            ? undefined
                            : () => {
                                setIsDragging(true);
                                setDragStart(day.date);
                                setDragEnd(day.date);
                              }
                        }
                        onMouseEnter={
                          isDragging && !readOnly && !day.isDisabled ? () => setDragEnd(day.date) : undefined
                        }
                        onMouseUp={
                          isDragging && !readOnly && !day.isDisabled
                            ? () => {
                                setIsDragging(false);
                                if (dragStart && dragEnd && !isSameDay(dragStart, dragEnd)) {
                                  // Call handleDayClick for range selection
                                  handleDayClick(dragEnd, false);
                                }
                                setDragStart(null);
                                setDragEnd(null);
                              }
                            : undefined
                        }
                        onClick={
                          readOnly || day.isDisabled
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
                        style={{ userSelect: 'none' }}
                      >
                        {day.date.getDate()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

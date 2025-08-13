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
  ...props
}) => {
  const { weeks, weekdayNames, monthNames, currentDate, handleDayClick, goToPrevMonth, goToNextMonth } = useCalendar({
    ...props,
    firstDayOfWeek
  });

  // State for picker mode (months/years)
  const [pickerMode, setPickerMode] = React.useState<'calendar' | 'month' | 'year'>('calendar');

  // Accessible label for the grid
  const monthYearLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Header: month and year selector (combined)
  const years = Array.from({ length: 21 }, (_, i) => 2015 + i); // 2015-2035 for a wide range

  // Determine radius for CVA and style
  const radiusCva = typeof radius === 'number' ? undefined : radius;
  const radiusStyle = typeof radius === 'number' ? { borderRadius: radius } : undefined;

  if (!show) {
    return null;
  }

  return (
    <div
      className={calendarCva({ variant, size, radius: radiusCva, theme, show, disabled, readOnly })}
      role='application'
      style={{ animation: 'fadeIn 0.3s', ...radiusStyle }}
    >
      {/* Header: month and year, click to open picker */}
      <div className='flex justify-between items-center mb-4 gap-2'>
        <button
          onClick={goToPrevMonth}
          className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200'
          aria-label='Previous month'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'></path>
          </svg>
        </button>
        <button
          type='button'
          className='bg-transparent outline-none font-semibold text-gray-900 dark:text-gray-100 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150'
          aria-label='Choose month and year'
          onClick={() => setPickerMode('month')}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </button>
        <button
          onClick={goToNextMonth}
          className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200'
          aria-label='Next month'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'></path>
          </svg>
        </button>
      </div>

      {/* Fullscreen month/year picker view */}
      {pickerMode === 'month' && (
        <MonthYearPickerDropdown
          currentYear={currentDate.getFullYear()}
          currentMonth={currentDate.getMonth()}
          minDate={
            props.minDate
              ? new Date(props.minDate.getFullYear(), props.minDate.getMonth(), props.minDate.getDate())
              : undefined
          }
          maxDate={
            props.maxDate
              ? new Date(props.maxDate.getFullYear(), props.maxDate.getMonth(), props.maxDate.getDate())
              : undefined
          }
          onChange={(year, month) => {
            const newDate = new Date(currentDate);
            newDate.setFullYear(year);
            newDate.setMonth(month);
            props.onDateChange?.(newDate);
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
          <h2 id='month-year-label' className='sr-only'>
            {monthYearLabel}
          </h2>
          <div role='grid' aria-labelledby='month-year-label'>
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
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={dayCva({
                        size,
                        isCurrentMonth: day.isCurrentMonth,
                        isSelected: day.isSelected,
                        variant,
                        isToday: day.isToday,
                        isDisabled: day.isDisabled
                      })}
                      style={{ borderRadius: typeof radius === 'number' ? radius : undefined }}
                      onClick={() => handleDayClick(day.date, day.isDisabled)}
                      role='gridcell'
                      aria-selected={day.isSelected ? 'true' : 'false'}
                      aria-disabled={day.isDisabled ? 'true' : 'false'}
                      tabIndex={day.isDisabled ? -1 : 0}
                    >
                      {day.date.getDate()}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

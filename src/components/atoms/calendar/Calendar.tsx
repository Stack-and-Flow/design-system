import type React from 'react';
import type { CalendarProps } from './types';
import { useCalendar } from './useCalendar';

// Functional calendar component for date visualization and selection
export const Calendar: React.FC<CalendarProps> = ({
  theme = 'light',
  variant = 'filled',
  size = 'md',
  radius = 'md',
  ...props
}) => {
  const { weeks, weekdayNames, monthNames, currentDate, handleDayClick, goToPrevMonth, goToNextMonth } =
    useCalendar(props);

  // Accessible label for the grid
  const monthYearLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Classes for dark mode and variants
  const themeClasses = theme === 'dark' ? 'bg-gray-900 text-gray-100 shadow-black' : 'bg-white text-gray-900 shadow-lg';
  const variantClasses = variant === 'outlined' ? 'border border-gray-300' : '';
  const sizeMap = {
    sm: 'p-2 w-64',
    md: 'p-4 w-80',
    lg: 'p-6 w-96'
  };
  const sizeClasses = sizeMap[size] || sizeMap.md;
  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl'
  };
  const radiusClasses = typeof radius === 'number' ? `rounded-[${radius}px]` : radiusMap[radius] || radiusMap.md;

  // Header: month and year selector
  const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    const newDate = new Date(currentDate);
    newDate.setMonth(newMonth);
    props.onDateChange?.(newDate);
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    const newDate = new Date(currentDate);
    newDate.setFullYear(newYear);
    props.onDateChange?.(newDate);
  };

  return (
    <div className={`font-inter ${themeClasses} ${variantClasses} ${sizeClasses} ${radiusClasses}`} role='application'>
      {/* Calendar header with month and year selector */}
      <div className='flex justify-between items-center mb-4 gap-2'>
        <button
          onClick={goToPrevMonth}
          className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200`}
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
        <div className='flex items-center gap-2'>
          <select
            className={`bg-transparent outline-none font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
            value={currentDate.getMonth()}
            onChange={handleMonthChange}
            aria-label='Select month'
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>
          <select
            className={`bg-transparent outline-none font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
            value={currentDate.getFullYear()}
            onChange={handleYearChange}
            aria-label='Select year'
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={goToNextMonth}
          className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200`}
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

      {/* Calendar grid with accessible label */}
      <h2 id='month-year-label' className='sr-only'>
        {monthYearLabel}
      </h2>
      <div role='grid' aria-labelledby='month-year-label'>
        {/* Weekday names */}
        <div
          className={`grid grid-cols-7 text-center text-xs font-medium uppercase mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          role='rowgroup'
        >
          <div role='row' className='contents'>
            {weekdayNames.map((day) => (
              <div key={day} className='py-1' role='columnheader' aria-label={day}>
                {day}
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
                  className={`
                    flex items-center justify-center font-medium select-none
                    ${size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm'}
                    ${
                      day.isCurrentMonth
                        ? theme === 'dark'
                          ? 'text-gray-100 hover:bg-gray-800'
                          : 'text-gray-900 hover:bg-gray-100'
                        : theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }
                    ${
                      day.isSelected
                        ? variant === 'outlined'
                          ? 'border-2 border-red-700 text-red-700 bg-transparent rounded-full'
                          : 'bg-red-700 text-white rounded-full'
                        : ''
                    }
                    ${day.isToday && !day.isSelected ? 'border-2 border-red-600' : ''}
                    ${
                      day.isDisabled
                        ? theme === 'dark'
                          ? 'cursor-not-allowed bg-gray-800 text-gray-700'
                          : 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : 'cursor-pointer'
                    }
                    transition-all duration-150 ease-in-out
                  `}
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
    </div>
  );
};

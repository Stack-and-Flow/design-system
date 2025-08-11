import type React from 'react';
import type { CalendarProps } from './types';
import { useCalendar } from './useCalendar';

// Componente de calendario funcional para visualización y selección de fechas
export const Calendar: React.FC<CalendarProps> = (props) => {
  const { weeks, weekdayNames, monthYearLabel, handleDayClick, goToPrevMonth, goToNextMonth } = useCalendar(props);

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg w-96 font-inter' role='application'>
      {/* Encabezado del calendario */}
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={goToPrevMonth}
          className='p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200'
          aria-label='Previous month'
        >
          <svg
            className='w-5 h-5 text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'></path>
          </svg>
        </button>
        <h2 className='text-lg font-semibold text-gray-900' id='month-year-label'>
          {monthYearLabel}
        </h2>
        <button
          onClick={goToNextMonth}
          className='p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200'
          aria-label='Next month'
        >
          <svg
            className='w-5 h-5 text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'></path>
          </svg>
        </button>
      </div>

      {/* Cuadrícula del calendario */}
      <div role='grid' aria-labelledby='month-year-label'>
        {/* Nombres de los días de la semana */}
        <div className='grid grid-cols-7 text-center text-xs font-medium text-gray-500 uppercase mb-2' role='rowgroup'>
          <div role='row' className='contents'>
            {weekdayNames.map((day) => (
              <div key={day} className='py-1' role='columnheader' aria-label={day}>
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Cuadrícula de días */}
        <div className='grid grid-cols-7 gap-1' role='rowgroup'>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} role='row' className='contents'>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium
                    ${day.isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-500'}
                    ${day.isSelected ? 'bg-red-700 text-white' : ''}
                    ${day.isToday && !day.isSelected ? 'border-2 border-red-600' : ''}
                    ${day.isDisabled ? 'cursor-not-allowed bg-gray-50 text-gray-300' : 'cursor-pointer'}
                    transition-all duration-150 ease-in-out
                  `}
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

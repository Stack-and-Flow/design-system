import type React from 'react';
import { useEffect, useRef, useState } from 'react';
// Inject custom scrollbar-hiding CSS once
const injectCustomScrollbarStyle = () => {
  if (document.getElementById('custom-scrollbar-style')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'custom-scrollbar-style';
  style.innerHTML = `.custom-scrollbar::-webkit-scrollbar { width: 0 !important; height: 0 !important; } .custom-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }`;
  document.head.appendChild(style);
};

export interface MonthYearPickerDropdownProps {
  currentYear: number;
  currentMonth: number;
  years: number[];
  monthNames: string[];
  minDate?: Date;
  maxDate?: Date;
  onChange: (year: number, month: number) => void;
  onCancel: () => void;
}

export const MonthYearPickerDropdown: React.FC<MonthYearPickerDropdownProps> = ({
  currentYear,
  currentMonth,
  years,
  monthNames,
  minDate,
  maxDate,
  onChange,
  onCancel
}) => {
  useEffect(() => {
    injectCustomScrollbarStyle();
  }, []);

  // Refs for scroll containers and selected items
  const monthsContainerRef = useRef<HTMLDivElement>(null);
  const yearsContainerRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLButtonElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  // Scroll selected month/year into center view on mount or when selection changes
  useEffect(() => {
    if (selectedMonthRef.current && monthsContainerRef.current) {
      selectedMonthRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
    if (selectedYearRef.current && yearsContainerRef.current) {
      selectedYearRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [selectedMonth, selectedYear]);

  // Disable months/years outside min/max
  const isMonthDisabled = (year: number, month: number) => {
    if (minDate && (year < minDate.getFullYear() || (year === minDate.getFullYear() && month < minDate.getMonth()))) {
      return true;
    }
    if (maxDate && (year > maxDate.getFullYear() || (year === maxDate.getFullYear() && month > maxDate.getMonth()))) {
      return true;
    }
    return false;
  };

  return (
    <div className='absolute inset-0 z-10 flex flex-col bg-white dark:bg-gray-900 rounded-lg animate-fadeIn w-full h-full'>
      <div className='flex-1 flex flex-col justify-center items-center w-full h-full p-0'>
        <div className='flex w-full h-full gap-2 px-4 py-6 overflow-x-auto overflow-y-visible min-h-[200px]'>
          {/* Months */}
          <div
            className='flex-1 flex flex-col gap-1 overflow-y-auto max-h-full pr-1 custom-scrollbar'
            tabIndex={0}
            role='listbox'
            aria-label='Months'
            ref={monthsContainerRef}
          >
            {monthNames.map((month, idx) => (
              <button
                key={month}
                ref={idx === selectedMonth ? selectedMonthRef : undefined}
                className={`w-full py-1.5 px-3 rounded-md font-semibold text-base text-left transition-colors duration-150 ${idx === selectedMonth ? 'bg-red-600 text-white dark:bg-red-400 dark:text-gray-900' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'} ${isMonthDisabled(selectedYear, idx) ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ letterSpacing: '0.01em', fontSize: '0.95rem' }}
                onClick={() => {
                  if (isMonthDisabled(selectedYear, idx)) {
                    return;
                  }
                  setSelectedMonth(idx);
                  onChange(selectedYear, idx);
                }}
                aria-current={idx === selectedMonth ? 'true' : undefined}
                disabled={isMonthDisabled(selectedYear, idx)}
                role='option'
              >
                {month}
              </button>
            ))}
          </div>
          {/* Years */}
          <div
            className='flex-1 flex flex-col gap-1 overflow-y-auto max-h-full pl-1 custom-scrollbar'
            tabIndex={0}
            role='listbox'
            aria-label='Years'
            ref={yearsContainerRef}
          >
            {years.map((year) => (
              <button
                key={year}
                ref={year === selectedYear ? selectedYearRef : undefined}
                className={`w-full py-1.5 px-3 rounded-md font-semibold text-base text-left transition-colors duration-150 ${year === selectedYear ? 'bg-red-600 text-white dark:bg-red-400 dark:text-gray-900' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'}`}
                style={{ letterSpacing: '0.01em', fontSize: '0.95rem' }}
                onClick={() => setSelectedYear(year)}
                aria-current={year === selectedYear ? 'true' : undefined}
                role='option'
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <button
          className='self-end m-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs text-blue-500 dark:text-blue-400'
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

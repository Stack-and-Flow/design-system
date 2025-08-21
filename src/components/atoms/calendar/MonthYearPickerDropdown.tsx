import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface MonthYearPickerDropdownProps {
  currentYear: number;
  currentMonth: number;
  years: number[];
  monthNames: string[];
  minDate?: Date;
  maxDate?: Date;
  onChange: (year: number, month: number) => void;
  onCancel: () => void;
  locale?: string;
}

export const MonthYearPickerDropdown: React.FC<MonthYearPickerDropdownProps> = ({
  currentYear,
  currentMonth,
  years,
  monthNames,
  minDate,
  maxDate,
  onChange,
  onCancel,
  locale = 'en'
}) => {
  // Inline scrollbar hide styles
  const scrollbarHideStyle: React.CSSProperties = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none' // IE 10+
  };

  const monthsContainerRef = useRef<HTMLDivElement>(null);
  const yearsContainerRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLButtonElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    if (selectedMonthRef.current && monthsContainerRef.current) {
      selectedMonthRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    if (selectedYearRef.current && yearsContainerRef.current) {
      selectedYearRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
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

  const handleSelect = () => {
    onChange(selectedYear, selectedMonth);
  };

  // Buttons translate
  const buttonLabels: Record<string, { cancel: string; select: string }> = {
    en: { cancel: 'Cancel', select: 'Select' },
    es: { cancel: 'Cancelar', select: 'Seleccionar' }
  };
  const labels = buttonLabels[locale as keyof typeof buttonLabels] || buttonLabels['en'];

  return (
    <div className='absolute inset-0 z-10 flex flex-col bg-white dark:bg-gray-900 rounded-lg animate-fadeIn w-full h-full'>
      <div className='flex-1 flex flex-col justify-center items-center w-full h-full p-0'>
        <div className='flex w-full h-[200px] gap-2 px-4 py-6 overflow-x-auto overflow-y-auto'>
          {/* Months */}
          <div
            className='flex-1 flex flex-col gap-1 overflow-y-auto max-h-full pr-1'
            tabIndex={0}
            role='listbox'
            aria-label='Months'
            ref={monthsContainerRef}
            style={scrollbarHideStyle}
          >
            {monthNames.map((month, idx) => (
              <button
                key={month}
                ref={idx === selectedMonth ? selectedMonthRef : undefined}
                className={`w-full py-1.5 px-3 rounded-md font-semibold text-base text-left transition-colors duration-150 ${idx === selectedMonth ? 'bg-red-600 text-white dark:bg-red-600 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'} ${isMonthDisabled(selectedYear, idx) ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ letterSpacing: '0.01em', fontSize: '0.95rem' }}
                onClick={() => {
                  if (isMonthDisabled(selectedYear, idx)) {
                    return;
                  }
                  setSelectedMonth(idx);
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
            className='flex-1 flex flex-col gap-1 overflow-y-auto max-h-full pl-1'
            tabIndex={0}
            role='listbox'
            aria-label='Years'
            ref={yearsContainerRef}
            style={scrollbarHideStyle}
          >
            {years.map((year) => (
              <button
                key={year}
                ref={year === selectedYear ? selectedYearRef : undefined}
                className={`w-full py-1.5 px-3 rounded-md font-semibold text-base text-left transition-colors duration-150 ${year === selectedYear ? 'bg-red-600 text-white dark:bg-red-600 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'}`}
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
        <div className='flex justify-end p-2 gap-2'>
          <button
            className='px-2 py-1 rounded bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 text-sm transition-colors duration-150'
            onClick={onCancel}
          >
            {labels.cancel}
          </button>
          <button
            className='px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 text-sm transition-colors duration-150'
            onClick={handleSelect}
          >
            {labels.select}
          </button>
        </div>
      </div>
    </div>
  );
};

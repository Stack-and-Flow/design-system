import type { FC } from 'react';
import type { CalendarProps } from './types';
import { useCalendar } from './useCalendar';

export const Calendar: FC<CalendarProps> = (props) => {
  const {
    calendarClassName,
    calendarGridClassName,
    calendarLabel,
    headerClassName,
    headerLabel,
    isPickerOpen,
    isVisible,
    liveRegionLabel,
    monthHeadingClassName,
    monthPickerLabel,
    monthSectionClassName,
    months,
    monthsLayoutClassName,
    navigationIconClassName,
    nextButtonProps,
    pickerCloseButtonProps,
    pickerDialogProps,
    pickerHeaderClassName,
    pickerHeaderContentClassName,
    pickerHeadingClassName,
    pickerMetaClassName,
    pickerMonthOptions,
    pickerOptionsGridClassName,
    pickerPanelsClassName,
    pickerSectionClassName,
    pickerYearOptions,
    previousButtonProps,
    themeClassName,
    togglePickerButtonProps,
    weekRowClassName,
    weekdayClassName,
    weekdayHeaders,
    yearsLabel
  } = useCalendar(props);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={themeClassName}>
      <section className={calendarClassName} aria-label={calendarLabel}>
        <p className='sr-only' aria-live='polite'>
          {liveRegionLabel}
        </p>

        <header className={headerClassName}>
          <button {...previousButtonProps}>
            <svg
              className={navigationIconClassName}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M15 19l-7-7 7-7' />
            </svg>
          </button>

          <button {...togglePickerButtonProps}>{headerLabel}</button>

          <button {...nextButtonProps}>
            <svg
              className={navigationIconClassName}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </header>

        {isPickerOpen ? (
          <div {...pickerDialogProps}>
            <div className={pickerHeaderClassName}>
              <div className={pickerHeaderContentClassName}>
                <h3 className={pickerHeadingClassName}>{monthPickerLabel}</h3>
                <p className={pickerMetaClassName}>{headerLabel}</p>
              </div>
              <button {...pickerCloseButtonProps}>{pickerCloseButtonProps['aria-label']}</button>
            </div>

            <div className={pickerPanelsClassName}>
              <section aria-label={monthPickerLabel} className={pickerSectionClassName}>
                <div className={pickerOptionsGridClassName}>
                  {pickerMonthOptions.map((option) => (
                    <button key={option.key} className={option.className} {...option.props}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              <section aria-label={yearsLabel} className={pickerSectionClassName}>
                <div className={pickerOptionsGridClassName}>
                  {pickerYearOptions.map((option) => (
                    <button key={option.key} className={option.className} {...option.props}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className={`${monthsLayoutClassName} ${months.length > 1 ? 'md:grid-flow-col' : ''}`}>
            {months.map((month) => (
              <section key={month.key} className={monthSectionClassName}>
                <h3 id={month.labelId} className={monthHeadingClassName}>
                  {month.label}
                </h3>

                <div role='grid' id={month.gridId} aria-labelledby={month.labelId} className={calendarGridClassName}>
                  <div role='row' className={weekRowClassName}>
                    {weekdayHeaders.map((weekday) => (
                      <div key={`${month.key}-${weekday}`} role='columnheader' className={weekdayClassName}>
                        {weekday}
                      </div>
                    ))}
                  </div>

                  {month.weeks.map((week, weekIndex) => (
                    <div key={`${month.key}-week-${weekIndex}`} role='row' className={weekRowClassName}>
                      {week.map((day) => (
                        <div key={day.key} {...day.cellProps}>
                          <button className={day.buttonClassName} style={day.style} {...day.buttonProps}>
                            {day.dayNumber}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

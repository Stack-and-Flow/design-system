import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, RefObject } from 'react';
import type { CalendarProps, CalendarSelection } from '../../atoms/calendar';

export const datePickerVariants = cva(
  [
    'relative flex max-w-full justify-between overflow-hidden border py-2',
    'cursor-pointer transition-[background,border-color,box-shadow] duration-200 ease-[ease]',
    '[&:has(:focus-visible)]:focus-ring'
  ],
  {
    variants: {
      variant: {
        regular: [
          'bg-surface-light border-border-light hover:bg-surface-raised-light hover:border-border-strong-light',
          'dark:bg-surface-dark dark:border-border-dark dark:hover:bg-surface-raised-dark dark:hover:border-border-strong-dark'
        ],
        underlined: [
          'bg-transparent border-border-light hover:border-border-strong-light',
          'dark:border-border-dark dark:hover:border-border-strong-dark'
        ],
        line: [
          'bg-transparent border-t-transparent border-l-transparent border-r-transparent rounded-none!',
          'border-b-border-light hover:border-b-border-strong-light',
          'dark:border-b-border-dark dark:hover:border-b-border-strong-dark'
        ],
        bordered: [
          'bg-surface-light border-border-strong-light hover:bg-surface-raised-light',
          'dark:bg-surface-dark dark:border-border-strong-dark dark:hover:bg-surface-raised-dark'
        ]
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md'
      },
      size: {
        sm: 'h-form-field-sm px-3 fs-small',
        md: 'h-form-field-md px-4 fs-base',
        lg: 'h-form-field-lg px-4 fs-h6'
      },
      status: {
        default: '',
        error:
          'border-error-light shadow-glow-input-error-light hover:!border-error-light dark:border-error dark:shadow-glow-input-error dark:hover:!border-error',
        warning:
          'border-warning-light shadow-glow-input-warning-light hover:!border-warning-light dark:border-warning dark:shadow-glow-input-warning dark:hover:!border-warning',
        success:
          'border-success-light shadow-glow-input-success-light hover:!border-success-light dark:border-success dark:shadow-glow-input-success dark:hover:!border-success',
        info: 'border-info-light shadow-glow-input-info-light hover:!border-info-light dark:border-info dark:shadow-glow-input-info dark:hover:!border-info'
      },
      focused: {
        true: '!border-brand-light/50 dark:!border-brand-dark/50',
        false: ''
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    compoundVariants: [
      {
        focused: true,
        status: 'error',
        class: '!border-error-light dark:!border-error'
      },
      {
        focused: true,
        status: 'warning',
        class: '!border-warning-light dark:!border-warning'
      },
      {
        focused: true,
        status: 'success',
        class: '!border-success-light dark:!border-success'
      },
      {
        focused: true,
        status: 'info',
        class: '!border-info-light dark:!border-info'
      }
    ],
    defaultVariants: {
      variant: 'regular',
      rounded: false,
      size: 'md',
      status: 'default',
      focused: false,
      fullWidth: false
    }
  }
);

export const datePickerValueVariants = cva(
  'flex-1 truncate border-none bg-transparent text-left font-medium outline-none',
  {
    variants: {
      hasValue: {
        true: 'text-text-light dark:text-text-dark',
        false: 'text-text-muted-light dark:text-text-muted-dark'
      }
    },
    defaultVariants: {
      hasValue: false
    }
  }
);

export const datePickerInlineButtonVariants = cva(
  [
    'cursor-pointer rounded-full bg-surface-light p-0.5 text-text-light hover:bg-surface-raised-light',
    'dark:bg-surface-dark dark:text-text-dark dark:hover:bg-surface-raised-dark',
    'focus-visible:focus-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
  ],
  {
    variants: {
      visibility: {
        visible: '',
        hidden: 'hidden'
      }
    },
    defaultVariants: {
      visibility: 'visible'
    }
  }
);

export const datePickerMessageVariants = cva('fs-small', {
  variants: {
    tone: {
      info: 'text-info-light dark:text-info',
      warning: 'text-warning-text-light dark:text-warning',
      error: 'text-error-light dark:text-error',
      success: 'text-success-text-light dark:text-success'
    }
  },
  defaultVariants: {
    tone: 'info'
  }
});

type DatePickerVariantProps = VariantProps<typeof datePickerVariants>;

type DatePickerCalendarProps = Pick<
  CalendarProps,
  | 'autoFocusOnMount'
  | 'disabled'
  | 'disabledDates'
  | 'firstDayOfWeek'
  | 'locale'
  | 'maxDate'
  | 'minDate'
  | 'onDateChange'
  | 'readOnly'
  | 'selectedDate'
  | 'visibleMonths'
>;

export type DatePickerValidationState = 'default' | 'error' | 'warning' | 'success' | 'info';
export type DatePickerVariant = NonNullable<DatePickerVariantProps['variant']>;
export type DatePickerSize = NonNullable<DatePickerVariantProps['size']>;
export type DatePickerFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DatePickerFormatOptions = Intl.DateTimeFormatOptions;
export type DatePickerOpenChangeSource = 'trigger' | 'calendar' | 'clear' | 'programmatic';

export type DatePickerProps = {
  /** @control text */
  id: string;
  /** @control text */
  name?: string;
  /** @control text */
  label?: string;
  /** @control text */
  ariaLabel?: string;
  /**
   * @control text
   * @default Select date
   */
  placeholder?: string;
  /** @control date */
  value?: Date | null;
  /**
   * @control date
   * @default null
   */
  defaultValue?: Date | null;
  onDateChange?: (date: Date | null) => void;
  /** @control boolean */
  open?: boolean;
  /**
   * @control boolean
   * @default false
   */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @control date */
  minDate?: Date;
  /** @control date */
  maxDate?: Date;
  /**
   * @control object
   * @default []
   */
  disabledDates?: Date[];
  /**
   * @control text
   * @default browser Gregorian locale
   */
  locale?: string;
  /**
   * @control object
   * @default { dateStyle: 'medium' }
   */
  formatOptions?: DatePickerFormatOptions;
  /** @control text */
  description?: string;
  /**
   * @control number
   * @default 1
   */
  firstDayOfWeek?: number;
  /**
   * @control number
   * @default 1
   */
  visibleMonths?: number;
  /**
   * @control select
   * @default regular
   */
  variant?: DatePickerVariant;
  /**
   * @control select
   * @default md
   */
  size?: DatePickerSize;
  /**
   * @control boolean
   * @default false
   */
  rounded?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isRequired?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control boolean
   * @default false
   */
  readOnly?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isClearable?: boolean;
  /**
   * @control select
   * @default default
   */
  validationState?: DatePickerValidationState;
  /** @control text */
  validationMessage?: string;
  /** @control text */
  className?: string;
  /** @control text */
  fieldClassName?: string;
  /** @control text */
  popoverClassName?: string;
  /** @control text */
  ariaDescribedBy?: string | string[];
  /** @control text */
  ariaLabelledBy?: string | string[];
};

export type UseDatePickerReturn = {
  calendarProps: DatePickerCalendarProps;
  clearButtonProps: ComponentProps<'button'>;
  clearDate: () => void;
  description?: string;
  descriptionId?: string;
  displayValue: string;
  effectiveLocale: string;
  effectiveOpen: boolean;
  fieldClassName: string;
  firstDayOfWeek: DatePickerFirstDayOfWeek;
  focusTrigger: () => void;
  hiddenInputProps?: ComponentProps<'input'>;
  indicatorClassName: string;
  isRequired: boolean;
  label?: string;
  labelId?: string;
  messageClassName: string;
  popoverAriaLabel: string;
  popoverClassName?: string;
  readOnlyDescriptionId?: string;
  requestOpenChange: (open: boolean, source?: DatePickerOpenChangeSource) => void;
  requiredDescriptionId?: string;
  sanitizedFormatOptions: Intl.DateTimeFormatOptions;
  selectDate: (date: Date | null) => void;
  selectedDate: Date | null;
  shouldRenderClearButton: boolean;
  shouldRestoreFocusAfterClear: boolean;
  triggerButtonProps: ComponentProps<'button'>;
  triggerClassName: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  triggerValueId: string;
  validationMessage?: string;
  validationMessageId?: string;
  valueClassName: string;
  visibleMonths: number;
  wrapperClassName: string;
};

export type DatePickerCalendarSelectionHandler = (selection: CalendarSelection) => void;

import { cva, type VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';

export const calendarVariants = cva(
  [
    'grid w-fit border',
    'transition-[background,border-color,box-shadow,color,opacity] duration-200 ease-out',
    'text-text-light dark:text-text-dark'
  ],
  {
    variants: {
      variant: {
        filled: [
          'bg-surface-light border-border-light shadow-shadow-dropdown-light',
          'dark:bg-surface-dark dark:border-border-dark dark:shadow-shadow-dropdown'
        ],
        outlined: ['bg-transparent border-border-strong-light', 'dark:border-border-strong-dark'],
        soft: ['bg-red-tint-subtle border-red-tint-border', 'dark:bg-red-tint-low dark:border-red-tint-border'],
        ghost: ['bg-transparent border-transparent shadow-none']
      },
      size: {
        sm: 'gap-1 p-1',
        md: 'gap-1.5 p-1.5',
        lg: 'gap-4 p-4'
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg'
      },
      disabled: {
        true: 'opacity-40',
        false: ''
      },
      readOnly: {
        true: '',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      radius: 'md',
      disabled: false,
      readOnly: false
    }
  }
);

export const calendarHeaderVariants = cva('flex items-center justify-between', {
  variants: {
    size: {
      sm: 'mb-1.5 gap-1',
      md: 'mb-2 gap-1.5',
      lg: 'mb-4 gap-3'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarIconButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-full',
    'transition-[background,border-color,box-shadow,color,opacity] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-[26px] w-[26px]',
        lg: 'h-[46px] w-[46px]'
      },
      disabled: {
        true: 'cursor-not-allowed opacity-40',
        false: [
          'cursor-pointer text-text-light dark:text-text-dark',
          'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark'
        ]
      }
    },
    defaultVariants: {
      size: 'md',
      disabled: false
    }
  }
);

export const calendarNavigationIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-2.5',
      md: 'size-3.5',
      lg: 'size-5'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarTriggerButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md font-semibold',
    'transition-[background,border-color,box-shadow,color,opacity] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      size: {
        sm: 'min-h-4 px-1 py-0.5 text-[0.625rem]',
        md: 'min-h-[26px] px-2 py-1 text-[0.6875rem]',
        lg: 'min-h-[46px] px-4 py-2.5 text-base'
      },
      disabled: {
        true: 'cursor-not-allowed opacity-40',
        false: [
          'cursor-pointer text-text-light dark:text-text-dark',
          'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark'
        ]
      }
    },
    defaultVariants: {
      size: 'md',
      disabled: false
    }
  }
);

export const calendarMonthsLayoutVariants = cva('grid', {
  variants: {
    size: {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarMonthSectionVariants = cva('grid', {
  variants: {
    size: {
      sm: 'gap-0.5',
      md: 'gap-0.75',
      lg: 'gap-2'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarMonthHeadingVariants = cva('text-center font-semibold text-text-light dark:text-text-dark', {
  variants: {
    size: {
      sm: 'text-[0.625rem]',
      md: 'text-[0.6875rem]',
      lg: 'text-base'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarGridVariants = cva('grid', {
  variants: {
    size: {
      sm: 'gap-0',
      md: 'gap-0.5',
      lg: 'gap-2'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarWeekRowVariants = cva('grid grid-cols-7', {
  variants: {
    size: {
      sm: 'gap-0',
      md: 'gap-0.5',
      lg: 'gap-2'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarWeekdayVariants = cva(
  'flex items-center justify-center text-center font-semibold uppercase text-text-tertiary-light dark:text-text-secondary-dark',
  {
    variants: {
      size: {
        sm: 'min-h-4 text-[0.5rem] tracking-[0.04em]',
        md: 'min-h-6 text-[0.625rem] tracking-[0.08em]',
        lg: 'min-h-10 text-xs tracking-[0.12em]'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export const calendarDayButtonVariants = cva(
  [
    'inline-flex items-center justify-center font-medium select-none',
    'transition-[background,border-color,box-shadow,color,opacity] duration-150 ease-out',
    'focus-visible:outline-none'
  ],
  {
    variants: {
      variant: {
        filled: 'border border-transparent',
        outlined: 'border border-transparent',
        soft: 'border border-transparent',
        ghost: 'border border-transparent bg-transparent'
      },
      size: {
        sm: 'h-6 w-6 text-[0.625rem]',
        md: 'h-[34px] w-[34px] text-xs',
        lg: 'h-[54px] w-[54px] text-lg'
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg'
      },
      currentMonth: {
        true: 'text-text-light dark:text-text-dark',
        false: 'text-text-tertiary-light dark:text-text-tertiary-dark'
      },
      interactive: {
        true: ['cursor-pointer', 'focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'],
        false: 'cursor-default'
      },
      disabled: {
        true: 'pointer-events-none cursor-not-allowed opacity-40',
        false: ''
      },
      today: {
        true: 'ring-1 ring-border-strong-light dark:ring-border-strong-dark',
        false: ''
      },
      selectionShape: {
        none: '',
        single: 'rounded-full',
        rangeStart: 'rounded-l-full rounded-r-md',
        rangeMiddle: 'rounded-none',
        rangeEnd: 'rounded-r-full rounded-l-md'
      }
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      radius: 'md',
      currentMonth: true,
      interactive: true,
      disabled: false,
      today: false,
      selectionShape: 'none'
    },
    compoundVariants: [
      {
        variant: 'filled',
        interactive: true,
        disabled: false,
        class: 'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark'
      },
      {
        variant: 'outlined',
        interactive: true,
        disabled: false,
        class: 'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark'
      },
      {
        variant: 'soft',
        interactive: true,
        disabled: false,
        class: 'hover:bg-red-tint-subtle dark:hover:bg-red-tint-low'
      },
      {
        variant: 'ghost',
        interactive: true,
        disabled: false,
        class: 'hover:bg-black-tint-low dark:hover:bg-white-tint-faint'
      }
    ]
  }
);

// Calendar picker widths intentionally use approved dense-scale rem values instead of spacing tokens.
// The compact date grid needs precise, non-touch-first sizing while preserving native button a11y.
export const calendarPickerVariants = cva(
  [
    'grid rounded-md border border-border-light bg-surface-light text-text-light shadow-shadow-dropdown-light',
    'dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:shadow-shadow-dropdown'
  ],
  {
    variants: {
      size: {
        sm: 'w-[14.75rem] gap-1.5 p-1.5',
        md: 'w-[15.375rem] gap-2 p-2',
        lg: 'w-[16.625rem] gap-3 p-3'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export const calendarPickerHeaderVariants = cva('flex items-center justify-between', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-3'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerHeaderContentVariants = cva('grid', {
  variants: {
    size: {
      sm: 'gap-0.5',
      md: 'gap-1',
      lg: 'gap-3'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerHeadingVariants = cva('font-semibold text-text-light dark:text-text-dark', {
  variants: {
    size: {
      sm: 'text-[0.625rem]',
      md: 'text-[0.6875rem]',
      lg: 'text-base'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerMetaVariants = cva('text-text-tertiary-light dark:text-text-tertiary-dark', {
  variants: {
    size: {
      sm: 'text-[0.625rem]',
      md: 'text-[0.6875rem]',
      lg: 'text-sm'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerPanelsVariants = cva('grid md:grid-cols-2', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-3'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerSectionVariants = cva('grid', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerOptionsGridVariants = cva('grid grid-cols-2', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const calendarPickerOptionVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md font-medium',
    'transition-[background,border-color,box-shadow,color,opacity] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark'
  ],
  {
    variants: {
      size: {
        sm: 'min-h-4 px-1 py-0.5 text-[0.625rem]',
        md: 'min-h-[26px] px-2 py-1 text-[0.6875rem]',
        lg: 'min-h-[46px] px-3 py-2.5 text-base'
      },
      selected: {
        true: '',
        false: 'text-text-light dark:text-text-dark'
      },
      disabled: {
        true: 'cursor-not-allowed opacity-40',
        false: 'cursor-pointer hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark'
      }
    },
    defaultVariants: {
      size: 'md',
      selected: false,
      disabled: false
    }
  }
);

type CalendarColorTone = {
  emphasisText: string;
  filledRange: string;
  filledSelected: string;
  ghostRange: string;
  ghostSelected: string;
  outlinedRange: string;
  outlinedSelected: string;
  pickerHover: string;
  pickerSelected: string;
  softRange: string;
  softSelected: string;
};

const defaultColorTone: CalendarColorTone = {
  filledSelected: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
  filledRange: 'bg-primary/12 text-brand-light dark:text-brand-dark-light',
  softSelected: 'bg-primary/12 text-brand-light dark:text-brand-dark-light',
  softRange: 'bg-primary/8 text-brand-light dark:text-brand-dark-light',
  outlinedSelected: 'border-primary bg-primary/10 text-brand-light dark:text-brand-dark-light',
  outlinedRange: 'border-primary/35 bg-primary/8 text-brand-light dark:text-brand-dark-light',
  ghostSelected: 'text-brand-light underline decoration-current underline-offset-4 dark:text-brand-dark-light',
  ghostRange: 'bg-primary/8 text-brand-light dark:text-brand-dark-light',
  pickerSelected: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
  pickerHover: 'hover:bg-primary/10 hover:text-brand-light dark:hover:text-brand-dark-light',
  emphasisText: 'text-brand-light dark:text-brand-dark-light'
};

const orangeColorTone: CalendarColorTone = {
  filledSelected: 'bg-orange text-text-light hover:bg-orange-dark active:bg-orange-dark',
  filledRange: 'bg-orange/15 text-text-light dark:text-orange-light',
  softSelected: 'bg-orange/15 text-orange-dark dark:text-orange-light',
  softRange: 'bg-orange/10 text-orange-dark dark:text-orange-light',
  outlinedSelected: 'border-orange bg-orange/10 text-orange-dark dark:text-orange-light',
  outlinedRange: 'border-orange/35 bg-orange/8 text-orange-dark dark:text-orange-light',
  ghostSelected: 'text-orange-dark underline decoration-current underline-offset-4 dark:text-orange-light',
  ghostRange: 'bg-orange/8 text-orange-dark dark:text-orange-light',
  pickerSelected: 'bg-orange text-text-light hover:bg-orange-dark active:bg-orange-dark',
  pickerHover: 'hover:bg-orange/10 hover:text-orange-dark dark:hover:text-orange-light',
  emphasisText: 'text-orange-dark dark:text-orange-light'
};

const orangeLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-orange-light text-text-light hover:bg-orange active:bg-orange-dark',
  filledRange: 'bg-orange-light/18 text-orange-dark dark:text-orange-light',
  softSelected: 'bg-orange-light/18 text-orange-dark dark:text-orange-light',
  softRange: 'bg-orange-light/12 text-orange-dark dark:text-orange-light',
  outlinedSelected: 'border-orange-light bg-orange-light/10 text-orange-dark dark:text-orange-light',
  outlinedRange: 'border-orange-light/35 bg-orange-light/8 text-orange-dark dark:text-orange-light',
  ghostSelected: 'text-orange-light underline decoration-current underline-offset-4',
  ghostRange: 'bg-orange-light/10 text-orange-dark dark:text-orange-light',
  pickerSelected: 'bg-orange-light text-text-light hover:bg-orange active:bg-orange-dark',
  pickerHover: 'hover:bg-orange-light/10 hover:text-orange-dark dark:hover:text-orange-light',
  emphasisText: 'text-orange-dark dark:text-orange-light'
};

const orangeDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-orange-dark text-white hover:bg-orange active:bg-orange',
  filledRange: 'bg-orange-dark/15 text-orange-dark dark:text-orange-light',
  softSelected: 'bg-orange-dark/15 text-orange-dark dark:text-orange-light',
  softRange: 'bg-orange-dark/10 text-orange-dark dark:text-orange-light',
  outlinedSelected: 'border-orange-dark bg-orange-dark/10 text-orange-dark dark:text-orange-light',
  outlinedRange: 'border-orange-dark/35 bg-orange-dark/8 text-orange-dark dark:text-orange-light',
  ghostSelected: 'text-orange-dark underline decoration-current underline-offset-4 dark:text-orange-light',
  ghostRange: 'bg-orange-dark/8 text-orange-dark dark:text-orange-light',
  pickerSelected: 'bg-orange-dark text-white hover:bg-orange active:bg-orange',
  pickerHover: 'hover:bg-orange-dark/10 hover:text-orange-dark dark:hover:text-orange-light',
  emphasisText: 'text-orange-dark dark:text-orange-light'
};

const yellowColorTone: CalendarColorTone = {
  filledSelected: 'bg-yellow text-text-light hover:bg-yellow-dark active:bg-yellow-dark',
  filledRange: 'bg-yellow/18 text-yellow-dark dark:text-yellow-light',
  softSelected: 'bg-yellow/18 text-yellow-dark dark:text-yellow-light',
  softRange: 'bg-yellow/12 text-yellow-dark dark:text-yellow-light',
  outlinedSelected: 'border-yellow bg-yellow/10 text-yellow-dark dark:text-yellow-light',
  outlinedRange: 'border-yellow/35 bg-yellow/8 text-yellow-dark dark:text-yellow-light',
  ghostSelected: 'text-yellow-dark underline decoration-current underline-offset-4 dark:text-yellow-light',
  ghostRange: 'bg-yellow/8 text-yellow-dark dark:text-yellow-light',
  pickerSelected: 'bg-yellow text-text-light hover:bg-yellow-dark active:bg-yellow-dark',
  pickerHover: 'hover:bg-yellow/10 hover:text-yellow-dark dark:hover:text-yellow-light',
  emphasisText: 'text-yellow-dark dark:text-yellow-light'
};

const yellowLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-yellow-light text-text-light hover:bg-yellow active:bg-yellow-dark',
  filledRange: 'bg-yellow-light/18 text-yellow-dark dark:text-yellow-light',
  softSelected: 'bg-yellow-light/18 text-yellow-dark dark:text-yellow-light',
  softRange: 'bg-yellow-light/12 text-yellow-dark dark:text-yellow-light',
  outlinedSelected: 'border-yellow-light bg-yellow-light/10 text-yellow-dark dark:text-yellow-light',
  outlinedRange: 'border-yellow-light/35 bg-yellow-light/8 text-yellow-dark dark:text-yellow-light',
  ghostSelected: 'text-yellow-dark underline decoration-current underline-offset-4 dark:text-yellow-light',
  ghostRange: 'bg-yellow-light/8 text-yellow-dark dark:text-yellow-light',
  pickerSelected: 'bg-yellow-light text-text-light hover:bg-yellow active:bg-yellow-dark',
  pickerHover: 'hover:bg-yellow-light/10 hover:text-yellow-dark dark:hover:text-yellow-light',
  emphasisText: 'text-yellow-dark dark:text-yellow-light'
};

const yellowDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-yellow-dark text-white hover:bg-yellow active:bg-yellow',
  filledRange: 'bg-yellow-dark/15 text-yellow-dark dark:text-yellow-light',
  softSelected: 'bg-yellow-dark/15 text-yellow-dark dark:text-yellow-light',
  softRange: 'bg-yellow-dark/10 text-yellow-dark dark:text-yellow-light',
  outlinedSelected: 'border-yellow-dark bg-yellow-dark/10 text-yellow-dark dark:text-yellow-light',
  outlinedRange: 'border-yellow-dark/35 bg-yellow-dark/8 text-yellow-dark dark:text-yellow-light',
  ghostSelected: 'text-yellow-dark underline decoration-current underline-offset-4 dark:text-yellow-light',
  ghostRange: 'bg-yellow-dark/8 text-yellow-dark dark:text-yellow-light',
  pickerSelected: 'bg-yellow-dark text-white hover:bg-yellow active:bg-yellow',
  pickerHover: 'hover:bg-yellow-dark/10 hover:text-yellow-dark dark:hover:text-yellow-light',
  emphasisText: 'text-yellow-dark dark:text-yellow-light'
};

const greenColorTone: CalendarColorTone = {
  filledSelected: 'bg-green text-text-light hover:bg-green-dark active:bg-green-dark',
  filledRange: 'bg-green/15 text-green-dark dark:text-green-light',
  softSelected: 'bg-green/15 text-green-dark dark:text-green-light',
  softRange: 'bg-green/10 text-green-dark dark:text-green-light',
  outlinedSelected: 'border-green bg-green/10 text-green-dark dark:text-green-light',
  outlinedRange: 'border-green/35 bg-green/8 text-green-dark dark:text-green-light',
  ghostSelected: 'text-green-dark underline decoration-current underline-offset-4 dark:text-green-light',
  ghostRange: 'bg-green/8 text-green-dark dark:text-green-light',
  pickerSelected: 'bg-green text-text-light hover:bg-green-dark active:bg-green-dark',
  pickerHover: 'hover:bg-green/10 hover:text-green-dark dark:hover:text-green-light',
  emphasisText: 'text-green-dark dark:text-green-light'
};

const greenLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-green-light text-text-light hover:bg-green active:bg-green-dark',
  filledRange: 'bg-green-light/18 text-green-dark dark:text-green-light',
  softSelected: 'bg-green-light/18 text-green-dark dark:text-green-light',
  softRange: 'bg-green-light/12 text-green-dark dark:text-green-light',
  outlinedSelected: 'border-green-light bg-green-light/10 text-green-dark dark:text-green-light',
  outlinedRange: 'border-green-light/35 bg-green-light/8 text-green-dark dark:text-green-light',
  ghostSelected: 'text-green-dark underline decoration-current underline-offset-4 dark:text-green-light',
  ghostRange: 'bg-green-light/8 text-green-dark dark:text-green-light',
  pickerSelected: 'bg-green-light text-text-light hover:bg-green active:bg-green-dark',
  pickerHover: 'hover:bg-green-light/10 hover:text-green-dark dark:hover:text-green-light',
  emphasisText: 'text-green-dark dark:text-green-light'
};

const greenDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-green-dark text-white hover:bg-green active:bg-green',
  filledRange: 'bg-green-dark/15 text-green-dark dark:text-green-light',
  softSelected: 'bg-green-dark/15 text-green-dark dark:text-green-light',
  softRange: 'bg-green-dark/10 text-green-dark dark:text-green-light',
  outlinedSelected: 'border-green-dark bg-green-dark/10 text-green-dark dark:text-green-light',
  outlinedRange: 'border-green-dark/35 bg-green-dark/8 text-green-dark dark:text-green-light',
  ghostSelected: 'text-green-dark underline decoration-current underline-offset-4 dark:text-green-light',
  ghostRange: 'bg-green-dark/8 text-green-dark dark:text-green-light',
  pickerSelected: 'bg-green-dark text-white hover:bg-green active:bg-green',
  pickerHover: 'hover:bg-green-dark/10 hover:text-green-dark dark:hover:text-green-light',
  emphasisText: 'text-green-dark dark:text-green-light'
};

const tealColorTone: CalendarColorTone = {
  filledSelected: 'bg-teal text-text-light hover:bg-teal-dark active:bg-teal-dark',
  filledRange: 'bg-teal/15 text-teal-dark dark:text-teal-light',
  softSelected: 'bg-teal/15 text-teal-dark dark:text-teal-light',
  softRange: 'bg-teal/10 text-teal-dark dark:text-teal-light',
  outlinedSelected: 'border-teal bg-teal/10 text-teal-dark dark:text-teal-light',
  outlinedRange: 'border-teal/35 bg-teal/8 text-teal-dark dark:text-teal-light',
  ghostSelected: 'text-teal-dark underline decoration-current underline-offset-4 dark:text-teal-light',
  ghostRange: 'bg-teal/8 text-teal-dark dark:text-teal-light',
  pickerSelected: 'bg-teal text-text-light hover:bg-teal-dark active:bg-teal-dark',
  pickerHover: 'hover:bg-teal/10 hover:text-teal-dark dark:hover:text-teal-light',
  emphasisText: 'text-teal-dark dark:text-teal-light'
};

const tealLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-teal-light text-text-light hover:bg-teal active:bg-teal-dark',
  filledRange: 'bg-teal-light/18 text-teal-dark dark:text-teal-light',
  softSelected: 'bg-teal-light/18 text-teal-dark dark:text-teal-light',
  softRange: 'bg-teal-light/12 text-teal-dark dark:text-teal-light',
  outlinedSelected: 'border-teal-light bg-teal-light/10 text-teal-dark dark:text-teal-light',
  outlinedRange: 'border-teal-light/35 bg-teal-light/8 text-teal-dark dark:text-teal-light',
  ghostSelected: 'text-teal-dark underline decoration-current underline-offset-4 dark:text-teal-light',
  ghostRange: 'bg-teal-light/8 text-teal-dark dark:text-teal-light',
  pickerSelected: 'bg-teal-light text-text-light hover:bg-teal active:bg-teal-dark',
  pickerHover: 'hover:bg-teal-light/10 hover:text-teal-dark dark:hover:text-teal-light',
  emphasisText: 'text-teal-dark dark:text-teal-light'
};

const tealDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-teal-dark text-white hover:bg-teal active:bg-teal',
  filledRange: 'bg-teal-dark/15 text-teal-dark dark:text-teal-light',
  softSelected: 'bg-teal-dark/15 text-teal-dark dark:text-teal-light',
  softRange: 'bg-teal-dark/10 text-teal-dark dark:text-teal-light',
  outlinedSelected: 'border-teal-dark bg-teal-dark/10 text-teal-dark dark:text-teal-light',
  outlinedRange: 'border-teal-dark/35 bg-teal-dark/8 text-teal-dark dark:text-teal-light',
  ghostSelected: 'text-teal-dark underline decoration-current underline-offset-4 dark:text-teal-light',
  ghostRange: 'bg-teal-dark/8 text-teal-dark dark:text-teal-light',
  pickerSelected: 'bg-teal-dark text-white hover:bg-teal active:bg-teal',
  pickerHover: 'hover:bg-teal-dark/10 hover:text-teal-dark dark:hover:text-teal-light',
  emphasisText: 'text-teal-dark dark:text-teal-light'
};

const blueColorTone: CalendarColorTone = {
  filledSelected: 'bg-blue text-white hover:bg-blue-dark active:bg-blue-dark',
  filledRange: 'bg-blue/15 text-blue-dark dark:text-blue-light',
  softSelected: 'bg-blue/15 text-blue-dark dark:text-blue-light',
  softRange: 'bg-blue/10 text-blue-dark dark:text-blue-light',
  outlinedSelected: 'border-blue bg-blue/10 text-blue-dark dark:text-blue-light',
  outlinedRange: 'border-blue/35 bg-blue/8 text-blue-dark dark:text-blue-light',
  ghostSelected: 'text-blue-dark underline decoration-current underline-offset-4 dark:text-blue-light',
  ghostRange: 'bg-blue/8 text-blue-dark dark:text-blue-light',
  pickerSelected: 'bg-blue text-white hover:bg-blue-dark active:bg-blue-dark',
  pickerHover: 'hover:bg-blue/10 hover:text-blue-dark dark:hover:text-blue-light',
  emphasisText: 'text-blue-dark dark:text-blue-light'
};

const blueLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-blue-light text-text-light hover:bg-blue active:bg-blue-dark',
  filledRange: 'bg-blue-light/18 text-blue-dark dark:text-blue-light',
  softSelected: 'bg-blue-light/18 text-blue-dark dark:text-blue-light',
  softRange: 'bg-blue-light/12 text-blue-dark dark:text-blue-light',
  outlinedSelected: 'border-blue-light bg-blue-light/10 text-blue-dark dark:text-blue-light',
  outlinedRange: 'border-blue-light/35 bg-blue-light/8 text-blue-dark dark:text-blue-light',
  ghostSelected: 'text-blue-dark underline decoration-current underline-offset-4 dark:text-blue-light',
  ghostRange: 'bg-blue-light/8 text-blue-dark dark:text-blue-light',
  pickerSelected: 'bg-blue-light text-text-light hover:bg-blue active:bg-blue-dark',
  pickerHover: 'hover:bg-blue-light/10 hover:text-blue-dark dark:hover:text-blue-light',
  emphasisText: 'text-blue-dark dark:text-blue-light'
};

const blueDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-blue-dark text-white hover:bg-blue active:bg-blue',
  filledRange: 'bg-blue-dark/15 text-blue-dark dark:text-blue-light',
  softSelected: 'bg-blue-dark/15 text-blue-dark dark:text-blue-light',
  softRange: 'bg-blue-dark/10 text-blue-dark dark:text-blue-light',
  outlinedSelected: 'border-blue-dark bg-blue-dark/10 text-blue-dark dark:text-blue-light',
  outlinedRange: 'border-blue-dark/35 bg-blue-dark/8 text-blue-dark dark:text-blue-light',
  ghostSelected: 'text-blue-dark underline decoration-current underline-offset-4 dark:text-blue-light',
  ghostRange: 'bg-blue-dark/8 text-blue-dark dark:text-blue-light',
  pickerSelected: 'bg-blue-dark text-white hover:bg-blue active:bg-blue',
  pickerHover: 'hover:bg-blue-dark/10 hover:text-blue-dark dark:hover:text-blue-light',
  emphasisText: 'text-blue-dark dark:text-blue-light'
};

const indigoColorTone: CalendarColorTone = {
  filledSelected: 'bg-indigo-dark text-white hover:bg-indigo active:bg-indigo-dark',
  filledRange: 'bg-indigo/15 text-indigo-dark dark:text-indigo-light',
  softSelected: 'bg-indigo/15 text-indigo-dark dark:text-indigo-light',
  softRange: 'bg-indigo/10 text-indigo-dark dark:text-indigo-light',
  outlinedSelected: 'border-indigo bg-indigo/10 text-indigo-dark dark:text-indigo-light',
  outlinedRange: 'border-indigo/35 bg-indigo/8 text-indigo-dark dark:text-indigo-light',
  ghostSelected: 'text-indigo-dark underline decoration-current underline-offset-4 dark:text-indigo-light',
  ghostRange: 'bg-indigo/8 text-indigo-dark dark:text-indigo-light',
  pickerSelected: 'bg-indigo text-white hover:bg-indigo-dark active:bg-indigo-dark',
  pickerHover: 'hover:bg-indigo/10 hover:text-indigo-dark dark:hover:text-indigo-light',
  emphasisText: 'text-indigo-dark dark:text-indigo-light'
};

const indigoLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-indigo-light text-text-light hover:bg-indigo active:bg-indigo-dark',
  filledRange: 'bg-indigo-light/18 text-indigo-dark dark:text-indigo-light',
  softSelected: 'bg-indigo-light/18 text-indigo-dark dark:text-indigo-light',
  softRange: 'bg-indigo-light/12 text-indigo-dark dark:text-indigo-light',
  outlinedSelected: 'border-indigo-light bg-indigo-light/10 text-indigo-dark dark:text-indigo-light',
  outlinedRange: 'border-indigo-light/35 bg-indigo-light/8 text-indigo-dark dark:text-indigo-light',
  ghostSelected: 'text-indigo-dark underline decoration-current underline-offset-4 dark:text-indigo-light',
  ghostRange: 'bg-indigo-light/8 text-indigo-dark dark:text-indigo-light',
  pickerSelected: 'bg-indigo-light text-text-light hover:bg-indigo active:bg-indigo-dark',
  pickerHover: 'hover:bg-indigo-light/10 hover:text-indigo-dark dark:hover:text-indigo-light',
  emphasisText: 'text-indigo-dark dark:text-indigo-light'
};

const indigoDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-indigo-dark text-white hover:bg-indigo active:bg-indigo',
  filledRange: 'bg-indigo-dark/15 text-indigo-dark dark:text-indigo-light',
  softSelected: 'bg-indigo-dark/15 text-indigo-dark dark:text-indigo-light',
  softRange: 'bg-indigo-dark/10 text-indigo-dark dark:text-indigo-light',
  outlinedSelected: 'border-indigo-dark bg-indigo-dark/10 text-indigo-dark dark:text-indigo-light',
  outlinedRange: 'border-indigo-dark/35 bg-indigo-dark/8 text-indigo-dark dark:text-indigo-light',
  ghostSelected: 'text-indigo-dark underline decoration-current underline-offset-4 dark:text-indigo-light',
  ghostRange: 'bg-indigo-dark/8 text-indigo-dark dark:text-indigo-light',
  pickerSelected: 'bg-indigo-dark text-white hover:bg-indigo active:bg-indigo',
  pickerHover: 'hover:bg-indigo-dark/10 hover:text-indigo-dark dark:hover:text-indigo-light',
  emphasisText: 'text-indigo-dark dark:text-indigo-light'
};

const purpleColorTone: CalendarColorTone = {
  filledSelected: 'bg-purple text-white hover:bg-purple-dark active:bg-purple-dark',
  filledRange: 'bg-purple/15 text-purple-dark dark:text-purple-light',
  softSelected: 'bg-purple/15 text-purple-dark dark:text-purple-light',
  softRange: 'bg-purple/10 text-purple-dark dark:text-purple-light',
  outlinedSelected: 'border-purple bg-purple/10 text-purple-dark dark:text-purple-light',
  outlinedRange: 'border-purple/35 bg-purple/8 text-purple-dark dark:text-purple-light',
  ghostSelected: 'text-purple-dark underline decoration-current underline-offset-4 dark:text-purple-light',
  ghostRange: 'bg-purple/8 text-purple-dark dark:text-purple-light',
  pickerSelected: 'bg-purple text-white hover:bg-purple-dark active:bg-purple-dark',
  pickerHover: 'hover:bg-purple/10 hover:text-purple-dark dark:hover:text-purple-light',
  emphasisText: 'text-purple-dark dark:text-purple-light'
};

const purpleLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-purple-light text-text-light hover:bg-purple active:bg-purple-dark',
  filledRange: 'bg-purple-light/18 text-purple-dark dark:text-purple-light',
  softSelected: 'bg-purple-light/18 text-purple-dark dark:text-purple-light',
  softRange: 'bg-purple-light/12 text-purple-dark dark:text-purple-light',
  outlinedSelected: 'border-purple-light bg-purple-light/10 text-purple-dark dark:text-purple-light',
  outlinedRange: 'border-purple-light/35 bg-purple-light/8 text-purple-dark dark:text-purple-light',
  ghostSelected: 'text-purple-dark underline decoration-current underline-offset-4 dark:text-purple-light',
  ghostRange: 'bg-purple-light/8 text-purple-dark dark:text-purple-light',
  pickerSelected: 'bg-purple-light text-text-light hover:bg-purple active:bg-purple-dark',
  pickerHover: 'hover:bg-purple-light/10 hover:text-purple-dark dark:hover:text-purple-light',
  emphasisText: 'text-purple-dark dark:text-purple-light'
};

const purpleDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-purple-dark text-white hover:bg-purple active:bg-purple',
  filledRange: 'bg-purple-dark/15 text-purple-dark dark:text-purple-light',
  softSelected: 'bg-purple-dark/15 text-purple-dark dark:text-purple-light',
  softRange: 'bg-purple-dark/10 text-purple-dark dark:text-purple-light',
  outlinedSelected: 'border-purple-dark bg-purple-dark/10 text-purple-dark dark:text-purple-light',
  outlinedRange: 'border-purple-dark/35 bg-purple-dark/8 text-purple-dark dark:text-purple-light',
  ghostSelected: 'text-purple-dark underline decoration-current underline-offset-4 dark:text-purple-light',
  ghostRange: 'bg-purple-dark/8 text-purple-dark dark:text-purple-light',
  pickerSelected: 'bg-purple-dark text-white hover:bg-purple active:bg-purple',
  pickerHover: 'hover:bg-purple-dark/10 hover:text-purple-dark dark:hover:text-purple-light',
  emphasisText: 'text-purple-dark dark:text-purple-light'
};

const pinkColorTone: CalendarColorTone = {
  filledSelected: 'bg-pink text-white hover:bg-pink-dark active:bg-pink-dark',
  filledRange: 'bg-pink/15 text-pink-dark dark:text-pink-light',
  softSelected: 'bg-pink/15 text-pink-dark dark:text-pink-light',
  softRange: 'bg-pink/10 text-pink-dark dark:text-pink-light',
  outlinedSelected: 'border-pink bg-pink/10 text-pink-dark dark:text-pink-light',
  outlinedRange: 'border-pink/35 bg-pink/8 text-pink-dark dark:text-pink-light',
  ghostSelected: 'text-pink-dark underline decoration-current underline-offset-4 dark:text-pink-light',
  ghostRange: 'bg-pink/8 text-pink-dark dark:text-pink-light',
  pickerSelected: 'bg-pink text-white hover:bg-pink-dark active:bg-pink-dark',
  pickerHover: 'hover:bg-pink/10 hover:text-pink-dark dark:hover:text-pink-light',
  emphasisText: 'text-pink-dark dark:text-pink-light'
};

const pinkLightColorTone: CalendarColorTone = {
  filledSelected: 'bg-pink-light text-text-light hover:bg-pink active:bg-pink-dark',
  filledRange: 'bg-pink-light/18 text-pink-dark dark:text-pink-light',
  softSelected: 'bg-pink-light/18 text-pink-dark dark:text-pink-light',
  softRange: 'bg-pink-light/12 text-pink-dark dark:text-pink-light',
  outlinedSelected: 'border-pink-light bg-pink-light/10 text-pink-dark dark:text-pink-light',
  outlinedRange: 'border-pink-light/35 bg-pink-light/8 text-pink-dark dark:text-pink-light',
  ghostSelected: 'text-pink-dark underline decoration-current underline-offset-4 dark:text-pink-light',
  ghostRange: 'bg-pink-light/8 text-pink-dark dark:text-pink-light',
  pickerSelected: 'bg-pink-light text-text-light hover:bg-pink active:bg-pink-dark',
  pickerHover: 'hover:bg-pink-light/10 hover:text-pink-dark dark:hover:text-pink-light',
  emphasisText: 'text-pink-dark dark:text-pink-light'
};

const pinkDarkColorTone: CalendarColorTone = {
  filledSelected: 'bg-pink-dark text-white hover:bg-pink active:bg-pink',
  filledRange: 'bg-pink-dark/15 text-pink-dark dark:text-pink-light',
  softSelected: 'bg-pink-dark/15 text-pink-dark dark:text-pink-light',
  softRange: 'bg-pink-dark/10 text-pink-dark dark:text-pink-light',
  outlinedSelected: 'border-pink-dark bg-pink-dark/10 text-pink-dark dark:text-pink-light',
  outlinedRange: 'border-pink-dark/35 bg-pink-dark/8 text-pink-dark dark:text-pink-light',
  ghostSelected: 'text-pink-dark underline decoration-current underline-offset-4 dark:text-pink-light',
  ghostRange: 'bg-pink-dark/8 text-pink-dark dark:text-pink-light',
  pickerSelected: 'bg-pink-dark text-white hover:bg-pink active:bg-pink',
  pickerHover: 'hover:bg-pink-dark/10 hover:text-pink-dark dark:hover:text-pink-light',
  emphasisText: 'text-pink-dark dark:text-pink-light'
};

export const calendarColorTones = {
  default: defaultColorTone,
  orange: orangeColorTone,
  'orange-light': orangeLightColorTone,
  'orange-dark': orangeDarkColorTone,
  yellow: yellowColorTone,
  'yellow-light': yellowLightColorTone,
  'yellow-dark': yellowDarkColorTone,
  green: greenColorTone,
  'green-light': greenLightColorTone,
  'green-dark': greenDarkColorTone,
  teal: tealColorTone,
  'teal-light': tealLightColorTone,
  'teal-dark': tealDarkColorTone,
  blue: blueColorTone,
  'blue-light': blueLightColorTone,
  'blue-dark': blueDarkColorTone,
  indigo: indigoColorTone,
  'indigo-light': indigoLightColorTone,
  'indigo-dark': indigoDarkColorTone,
  purple: purpleColorTone,
  'purple-light': purpleLightColorTone,
  'purple-dark': purpleDarkColorTone,
  pink: pinkColorTone,
  'pink-light': pinkLightColorTone,
  'pink-dark': pinkDarkColorTone
} as const;

export type CalendarVariant = NonNullable<VariantProps<typeof calendarVariants>['variant']>;
export type CalendarSize = NonNullable<VariantProps<typeof calendarVariants>['size']>;
export type CalendarRadius = NonNullable<VariantProps<typeof calendarVariants>['radius']>;
export type CalendarColor = keyof typeof calendarColorTones;

export type CalendarHighlightedDate = {
  date: Date;
  className?: string;
  style?: CSSProperties;
};

export type CalendarSelection = Date | null | [Date | null, Date | null];

export type CalendarProps = {
  /**
   * @control select
   * @default default
   */
  color?: CalendarColor;
  /** @control object */
  selectedDate?: CalendarSelection;
  onDateChange?: (date: CalendarSelection) => void;
  /** @control object */
  disabledDates?: Date[];
  /**
   * @control select
   * @default filled
   */
  variant?: CalendarVariant;
  /**
   * @control select
   * @default md
   * @dense Approved compact Calendar scale; use only where dense date selection is desired.
   */
  size?: CalendarSize;
  /**
   * @control select
   * @default md
   */
  radius?: CalendarRadius;
  /**
   * @control boolean
   * @default true
   */
  show?: boolean;
  /** @control date */
  maxDate?: Date;
  /** @control date */
  minDate?: Date;
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
   * @control number
   * @default 1
   */
  firstDayOfWeek?: number;
  /**
   * @control select
   * @default light
   */
  theme?: 'light' | 'dark';
  /** @control object */
  highlightedDates?: CalendarHighlightedDate[];
  /**
   * @control text
   * @default en
   */
  locale?: string;
  /**
   * @control number
   * @default 1
   */
  visibleMonths?: number;
};

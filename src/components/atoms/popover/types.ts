import { cva, type VariantProps } from 'class-variance-authority';
import type { FC, ReactNode } from 'react';

export const popoverContentVariants = cva(
  [
    'z-50 flex w-max max-w-[calc(100vw-1rem)] flex-col overflow-hidden border text-left outline-none',
    'data-[state=closed]:animate-out data-[state=open]:animate-in',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1',
    'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
    'transition-[opacity,transform] duration-150 ease-out motion-reduce:!animate-none motion-reduce:!transition-none'
  ],
  {
    variants: {
      size: {
        sm: 'w-[16rem] text-sm',
        md: 'w-[20rem] text-sm',
        lg: 'w-[24rem] text-base'
      },
      variant: {
        default: 'bg-background-light dark:bg-surface-dark',
        frosted: [
          'bg-navbar-light dark:bg-navbar-dark',
          'backdrop-blur-[16px] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)]'
        ]
      },
      color: {
        neutral: 'border-border-light dark:border-border-dark',
        primary: 'border-brand-light/20 dark:border-brand-dark/30',
        secondary: 'border-indigo/20 dark:border-indigo-light/30',
        success: 'border-success-light/30 dark:border-success/30',
        warning: 'border-warning-light/30 dark:border-warning/30',
        danger: 'border-error-light/30 dark:border-error/30'
      },
      radius: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl'
      },
      shadow: {
        sm: 'shadow-sm',
        md: 'shadow-dropdown-light dark:shadow-dropdown',
        lg: 'shadow-lg dark:shadow-dropdown'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      color: 'neutral',
      radius: 'lg',
      shadow: 'md'
    }
  }
);

export const popoverTriggerVariants = cva([
  'outline-none focus-visible:outline-none',
  'focus-visible:shadow-glow-focus-light dark:focus-visible:shadow-glow-focus-dark',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
]);

export const popoverHeaderVariants = cva('border-b px-4 font-semibold tracking-normal', {
  variants: {
    size: {
      sm: 'py-2.5 text-sm',
      md: 'py-3 text-base',
      lg: 'py-3.5 text-lg'
    },
    color: {
      neutral: 'border-border-light text-text-light dark:border-border-dark dark:text-text-dark',
      primary: 'border-border-light text-brand-light dark:border-border-dark dark:text-brand-dark',
      secondary: 'border-border-light text-indigo-dark dark:border-border-dark dark:text-indigo-light',
      success: 'border-border-light text-success-light dark:border-border-dark dark:text-success',
      warning: 'border-border-light text-warning-light dark:border-border-dark dark:text-warning',
      danger: 'border-border-light text-error-light dark:border-border-dark dark:text-error'
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
});

export const popoverBodyVariants = cva('px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const popoverFooterVariants = cva('flex items-center justify-end gap-2 border-t px-4 py-3', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base'
    }
  },
  defaultVariants: {
    size: 'md'
  },
  compoundVariants: [
    {
      size: ['sm', 'md', 'lg'],
      class: 'border-border-light dark:border-border-dark'
    }
  ]
});

export const popoverArrowVariants = cva('drop-shadow-sm', {
  variants: {
    variant: {
      default: '',
      frosted: ''
    },
    color: {
      neutral: 'fill-background-light dark:fill-surface-dark',
      primary: 'fill-brand-light/15 dark:fill-brand-dark/20',
      secondary: 'fill-indigo/15 dark:fill-indigo-light/20',
      success: 'fill-success-light/15 dark:fill-success/20',
      warning: 'fill-warning-light/15 dark:fill-warning/20',
      danger: 'fill-error-light/15 dark:fill-error/20'
    }
  },
  compoundVariants: [
    {
      variant: 'frosted',
      color: 'neutral',
      class: 'fill-navbar-light dark:fill-navbar-dark'
    },
    {
      variant: 'frosted',
      color: 'primary',
      class: 'fill-navbar-light dark:fill-navbar-dark'
    },
    {
      variant: 'frosted',
      color: 'secondary',
      class: 'fill-navbar-light dark:fill-navbar-dark'
    },
    {
      variant: 'frosted',
      color: 'success',
      class: 'fill-navbar-light dark:fill-navbar-dark'
    },
    {
      variant: 'frosted',
      color: 'warning',
      class: 'fill-navbar-light dark:fill-navbar-dark'
    },
    {
      variant: 'frosted',
      color: 'danger',
      class: 'fill-navbar-light dark:fill-navbar-dark'
    }
  ],
  defaultVariants: {
    variant: 'default',
    color: 'neutral'
  }
});

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type PopoverSize = NonNullable<VariantProps<typeof popoverContentVariants>['size']>;
export type PopoverVariant = NonNullable<VariantProps<typeof popoverContentVariants>['variant']>;
export type PopoverColor = NonNullable<VariantProps<typeof popoverContentVariants>['color']>;
export type PopoverRadius = NonNullable<VariantProps<typeof popoverContentVariants>['radius']>;
export type PopoverShadow = NonNullable<VariantProps<typeof popoverContentVariants>['shadow']>;

type PopoverSlotProps = {
  children: ReactNode;
  /** @control text */
  className?: string;
};

export type PopoverProps = {
  /** @control object */
  children: ReactNode;
  /** @control boolean */
  open?: boolean;
  /**
   * @control boolean
   * @default false
   */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type PopoverTriggerProps = {
  /** @control object */
  children: ReactNode;
  /**
   * @control boolean
   * @default true
   */
  asChild?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /** @control text */
  className?: string;
};

export type PopoverContentProps = PopoverSlotProps & {
  /**
   * @control select
   * @default bottom
   */
  placement?: PopoverPlacement;
  /**
   * @control number
   * @default 8
   */
  offset?: number;
  /**
   * @control select
   * @default md
   */
  size?: PopoverSize;
  /**
   * @control select
   * @default default
   */
  variant?: PopoverVariant;
  /**
   * @control select
   * @default neutral
   */
  color?: PopoverColor;
  /**
   * @control select
   * @default lg
   */
  radius?: PopoverRadius;
  /**
   * @control select
   * @default md
   */
  shadow?: PopoverShadow;
  /** @control text */
  ariaLabel?: string;
  /** @control text */
  ariaLabelledBy?: string;
  /** @control text */
  ariaDescribedBy?: string;
};

export type PopoverHeaderProps = PopoverSlotProps;
export type PopoverBodyProps = PopoverSlotProps;
export type PopoverFooterProps = PopoverSlotProps;
export type PopoverArrowProps = {
  /** @control text */
  className?: string;
};

export type PopoverCompoundComponent = FC<PopoverProps> & {
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Trigger: FC<PopoverTriggerProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Content: FC<PopoverContentProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Header: FC<PopoverHeaderProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Body: FC<PopoverBodyProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Footer: FC<PopoverFooterProps>;
  // biome-ignore lint/style/useNamingConvention: compound API requires PascalCase slot names
  Arrow: FC<PopoverArrowProps>;
};

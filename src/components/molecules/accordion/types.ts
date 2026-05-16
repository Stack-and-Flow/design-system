import type { HeaderVariant } from '@atoms/header';
import type { TextVariant } from '@atoms/text';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const accordionVariants = cva('w-full text-text-light dark:text-text-dark', {
  variants: {
    variant: {
      default: 'rounded-none',
      surface:
        'rounded-xl overflow-hidden border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark',
      bordered:
        'rounded-xl border overflow-hidden border-border-strong-light bg-background-light dark:border-border-strong-dark dark:bg-background-dark',
      ghost: 'rounded-none bg-transparent'
    },
    size: {
      sm: 'fs-small',
      md: 'fs-base',
      lg: 'fs-h6'
    },
    disabled: {
      true: 'cursor-not-allowed pointer-events-none opacity-40',
      false: ''
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    disabled: false
  }
});

export const accordionItemVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      default: 'border-border-light dark:border-border-dark',
      surface: 'border-border-light dark:border-border-dark',
      bordered: 'border-border-strong-light dark:border-border-strong-dark',
      ghost: 'border-border-light dark:border-border-dark'
    },
    hideSeparator: {
      true: 'border-b-0',
      false: 'border-b last:border-b-0'
    }
  },
  defaultVariants: {
    variant: 'default',
    hideSeparator: false
  }
});

export const accordionTriggerVariants = cva(
  [
    'flex min-h-11 w-full items-center justify-between gap-3 text-left font-semibold tracking-ui',
    'text-text-light dark:text-text-dark',
    'transition-[background-color,border-color,box-shadow,transform,color] duration-200 ease-out',
    'focus-visible:outline-none focus-visible:bg-red-tint-subtle focus-visible:shadow-(--glow-focus-light) dark:focus-visible:bg-red-tint-low dark:focus-visible:shadow-(--glow-focus-dark)',
    'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40'
  ],
  {
    variants: {
      variant: {
        default: 'hover:bg-red-tint-subtle dark:hover:bg-white-tint-faint',
        surface: 'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark',
        bordered: 'hover:bg-red-tint-subtle dark:hover:bg-red-tint-low',
        ghost: 'hover:bg-white-tint-faint dark:hover:bg-white-tint-faint'
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export const accordionPanelVariants = cva('overflow-hidden text-text-secondary-light dark:text-text-secondary-dark', {
  variants: {
    size: {
      sm: 'px-3 pt-1 pb-3 text-sm leading-6',
      md: 'px-4 pt-2 pb-4 text-base leading-7',
      lg: 'px-5 pt-2 pb-5 text-lg leading-8'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const accordionContentTextVariants = cva('text-text-secondary-light dark:text-text-secondary-dark', {
  variants: {
    size: {
      sm: 'text-sm leading-6',
      md: 'text-base leading-7',
      lg: 'text-lg leading-8'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const accordionTitleTextVariants = cva('font-semibold text-text-light dark:text-text-dark', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const accordionIndicatorVariants = cva(
  'grid size-5 shrink-0 place-items-center text-brand-light dark:text-brand-dark'
);

export const accordionDefaultIconVariants = cva(
  'origin-center leading-none transition-transform duration-300 ease-out',
  {
    variants: {
      expanded: {
        true: 'rotate-90',
        false: 'rotate-0'
      }
    },
    defaultVariants: {
      expanded: false
    }
  }
);

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  indicator?: ReactNode;
};

export type AccordionProps = VariantProps<typeof accordionVariants> &
  Omit<ComponentProps<'div'>, 'children'> & {
    /**
     * @control object
     */
    items: AccordionItem[];
    /**
     * @control object
     * @default []
     */
    defaultExpandedKeys?: string[];
    /**
     * @control object
     */
    expandedKeys?: string[];
    /**
     * @control object
     */
    onExpandedChange?: (keys: string[]) => void;
    /**
     * @control boolean
     * @default false
     */
    allowsMultipleExpanded?: boolean;
    /**
     * @control boolean
     * @default true
     */
    allowsToggle?: boolean;
    /**
     * @control boolean
     * @default false
     */
    disabled?: boolean;
    /**
     * @control boolean
     * @default false
     */
    hideSeparator?: boolean;
    /**
     * @control select
     * @default h3
     */
    headingLevel?: HeaderVariant;
    /**
     * @control select
     * @default p
     */
    contentTextTag?: TextVariant;
    /**
     * @control text
     */
    idPrefix?: string;
  };

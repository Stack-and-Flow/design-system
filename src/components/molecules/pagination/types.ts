import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, HTMLAttributeAnchorTarget, MouseEvent, ReactNode } from 'react';

export const paginationRootVariants = cva('flex flex-col gap-3 bg-transparent font-sans', {
  variants: {
    size: {
      sm: 'fs-small',
      md: 'fs-base',
      lg: 'fs-h6'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const paginationContentVariants = cva('flex list-none flex-row flex-wrap items-center gap-1 p-0 m-0', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const paginationItemVariants = cva('flex items-center');

export const paginationSummaryVariants = cva('m-0 text-text-secondary-light dark:text-text-secondary-dark', {
  variants: {
    size: {
      sm: 'fs-small',
      md: 'fs-base',
      lg: 'fs-h6'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const paginationControlVariants = cva(
  [
    'inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border font-semibold no-underline',
    'border-border-light bg-background-light text-text-light dark:border-border-dark dark:bg-surface-dark dark:text-text-dark',
    'transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out',
    'hover:border-brand-light-darkest hover:bg-red-tint-subtle hover:text-brand-light-darkest hover:no-underline',
    'dark:hover:border-brand-dark-light dark:hover:bg-red-tint-subtle dark:hover:text-brand-dark-light',
    'active:scale-[0.98]',
    'focus-visible:focus-ring'
  ],
  {
    variants: {
      size: {
        sm: 'px-2 fs-small',
        md: 'px-3 fs-base',
        lg: 'px-4 fs-h6'
      },
      isCurrent: {
        true: [
          'border-brand-light-darkest bg-brand-light-darkest text-white',
          'hover:border-brand-light-darkest hover:bg-brand-light-darkest hover:text-white',
          'dark:border-brand-light-darkest dark:bg-brand-light-darkest dark:text-white',
          'dark:hover:border-brand-light-darkest dark:hover:bg-brand-light-darkest dark:hover:text-white'
        ],
        false: ''
      },
      isDisabled: {
        true: 'pointer-events-none cursor-not-allowed opacity-40',
        false: 'cursor-pointer'
      }
    },
    defaultVariants: {
      size: 'md',
      isCurrent: false,
      isDisabled: false
    }
  }
);

export const paginationEllipsisVariants = cva(
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary-light dark:text-text-secondary-dark',
  {
    variants: {
      size: {
        sm: 'px-2 fs-small',
        md: 'px-3 fs-base',
        lg: 'px-4 fs-h6'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export type PaginationVariants = VariantProps<typeof paginationRootVariants>;
export type PaginationSize = NonNullable<PaginationVariants['size']>;
export type PaginationControlClickHandler = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;

export type PaginationProps = Omit<ComponentProps<'nav'>, 'children'> & {
  /** @control object */
  children: ReactNode;
  /**
   * @control select
   * @default md
   */
  size?: PaginationSize;
  /**
   * @control text
   * @default Pagination
   */
  'aria-label'?: string;
  /** @control text */
  className?: string;
};

export type PaginationSummaryProps = ComponentProps<'p'>;
export type PaginationContentProps = ComponentProps<'ul'>;
export type PaginationItemProps = ComponentProps<'li'>;

export type PaginationControlOwnProps = {
  /**
   * @control boolean
   * @default false
   */
  isCurrent?: boolean;
  /**
   * @control boolean
   * @default false
   */
  isDisabled?: boolean;
  /** @control text */
  className?: string;
};

export type PaginationAnchorControlProps = Omit<
  ComponentProps<'a'>,
  'aria-current' | 'children' | 'className' | 'href' | 'onClick' | 'ref'
> &
  PaginationControlOwnProps & {
    /** @control object */
    children: ReactNode;
    /** @control text */
    href: string;
    /** @control text */
    target?: HTMLAttributeAnchorTarget;
    /** @control text */
    rel?: string;
    onClick?: PaginationControlClickHandler;
  };

export type PaginationButtonControlProps = Omit<
  ComponentProps<'button'>,
  'aria-current' | 'children' | 'className' | 'disabled' | 'href' | 'onClick' | 'ref' | 'type'
> &
  PaginationControlOwnProps & {
    /** @control object */
    children: ReactNode;
    href?: undefined;
    onClick?: PaginationControlClickHandler;
  };

export type PaginationLinkProps = PaginationAnchorControlProps | PaginationButtonControlProps;

type PaginationDirectionalAnchorProps = Omit<PaginationAnchorControlProps, 'aria-label' | 'children' | 'isCurrent'>;

type PaginationDirectionalButtonProps = Omit<PaginationButtonControlProps, 'aria-label' | 'children' | 'isCurrent'>;

export type PaginationPreviousProps = (PaginationDirectionalAnchorProps | PaginationDirectionalButtonProps) & {
  /**
   * @control object
   * @default Previous
   */
  children?: ReactNode;
  /**
   * @control text
   * @default Go to previous page
   */
  'aria-label'?: string;
};

export type PaginationNextProps = (PaginationDirectionalAnchorProps | PaginationDirectionalButtonProps) & {
  /**
   * @control object
   * @default Next
   */
  children?: ReactNode;
  /**
   * @control text
   * @default Go to next page
   */
  'aria-label'?: string;
};

export type PaginationEllipsisProps = Omit<ComponentProps<'span'>, 'children'> & {
  /**
   * @control text
   * @default More pages
   */
  'aria-label'?: string;
  /** @control text */
  className?: string;
};

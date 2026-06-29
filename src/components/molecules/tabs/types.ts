import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const tabsRootVariants = cva('flex min-w-0 w-full text-text-light dark:text-text-dark', {
  variants: {
    placement: {
      top: 'flex-col gap-4',
      bottom: 'flex-col-reverse gap-4',
      left: 'flex-row gap-4',
      right: 'flex-row-reverse gap-4'
    },
    fullWidth: {
      true: '',
      false: ''
    }
  },
  defaultVariants: {
    placement: 'top',
    fullWidth: false
  }
});

export const tabsListVariants = cva(
  [
    'relative isolate min-w-0 max-w-full self-start items-stretch',
    'transition-[background-color,border-color,box-shadow] duration-200 ease-out'
  ],
  {
    variants: {
      variant: {
        solid:
          'rounded-xl border border-border-light bg-surface-light p-1 dark:border-border-dark dark:bg-surface-dark',
        bordered:
          'rounded-xl border border-border-strong-light bg-background-light p-1 dark:border-border-strong-dark dark:bg-background-dark',
        light: 'rounded-xl bg-transparent p-1',
        underlined: 'rounded-none border-b border-border-light bg-transparent p-0 dark:border-border-dark'
      },
      placement: {
        top: 'grid grid-flow-col auto-cols-fr gap-1',
        bottom: 'grid grid-flow-col auto-cols-fr gap-1',
        left: 'grid grid-cols-1 gap-1',
        right: 'grid grid-cols-1 gap-1'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit'
      }
    },
    defaultVariants: {
      variant: 'solid',
      placement: 'top',
      fullWidth: false
    }
  }
);

export const tabsTabWrapperVariants = cva('relative z-[1] min-w-0', {
  variants: {
    placement: {
      top: 'min-w-28',
      bottom: 'min-w-28',
      left: 'w-full min-w-36',
      right: 'w-full min-w-36'
    },
    fullWidth: {
      true: 'w-full',
      false: ''
    }
  },
  defaultVariants: {
    placement: 'top',
    fullWidth: false
  }
});

export const tabsTabVariants = cva(
  [
    'relative inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-ui',
    'text-text-secondary-light dark:text-text-secondary-dark',
    'focus-visible:focus-ring',
    'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
  ],
  {
    variants: {
      variant: {
        solid: 'border border-transparent bg-transparent',
        bordered: 'border border-transparent bg-transparent',
        light: 'border border-transparent bg-transparent',
        underlined: 'rounded-none border-b-2 border-transparent bg-transparent px-1'
      },
      placement: {
        top: 'w-full',
        bottom: 'w-full',
        left: 'w-full justify-start',
        right: 'w-full justify-start'
      },
      size: {
        sm: 'h-control-sm px-3 fs-small',
        md: 'h-control-md px-4 fs-base',
        lg: 'h-control-lg px-5 fs-h6'
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-pill'
      },
      selected: {
        true: '',
        false: ''
      },
      disabled: {
        true: 'pointer-events-none cursor-not-allowed opacity-40',
        false: ''
      },
      withIcon: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        variant: 'solid',
        selected: false,
        class: 'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark'
      },
      {
        variant: 'underlined',
        selected: false,
        class: 'hover:border-border-strong-light dark:hover:border-border-strong-dark'
      },
      {
        placement: ['left', 'right'],
        withIcon: true,
        class: 'justify-start'
      }
    ],
    defaultVariants: {
      variant: 'solid',
      placement: 'top',
      size: 'md',
      radius: 'md',
      selected: false,
      disabled: false,
      withIcon: false
    }
  }
);

export const tabsTabContentVariants = cva('inline-flex min-w-0 items-center gap-2 truncate');

export const tabsCursorVariants = cva('absolute pointer-events-none z-0', {
  variants: {
    variant: {
      solid: 'border',
      bordered: 'border',
      light: '',
      underlined: 'rounded-full'
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-pill'
    },
    animated: {
      true: 'motion-safe:transition-[transform,opacity,background-color,border-color,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
      false: 'transition-none'
    }
  },
  defaultVariants: {
    variant: 'solid',
    radius: 'md',
    animated: true
  }
});

export const tabsPanelVariants = cva(
  'min-w-0 text-text-secondary-light outline-none focus-visible:focus-ring dark:text-text-secondary-dark',
  {
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
  }
);

export type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>['variant']>;
export type TabsColor = 'primary' | 'success' | 'warning' | 'info' | 'error';
export type TabsSize = NonNullable<VariantProps<typeof tabsTabVariants>['size']>;
export type TabsRadius = NonNullable<VariantProps<typeof tabsTabVariants>['radius']>;
export type TabsPlacement = NonNullable<VariantProps<typeof tabsRootVariants>['placement']>;
export type TabsActivationMode = 'automatic' | 'manual';

export type TabsItem = {
  key: string;
  title: ReactNode;
  content: ReactNode;
  titleValue?: string;
  icon?: ReactNode;
  disabled?: boolean;
  href?: string;
  target?: ComponentProps<'a'>['target'];
  rel?: ComponentProps<'a'>['rel'];
  download?: ComponentProps<'a'>['download'];
  ping?: ComponentProps<'a'>['ping'];
  referrerPolicy?: ComponentProps<'a'>['referrerPolicy'];
};

export type TabsClassNames = Partial<{
  base: string;
  tabList: string;
  tab: string;
  tabContent: string;
  cursor: string;
  panel: string;
  tabWrapper: string;
}>;

type NativeTabsProps = Omit<ComponentProps<'div'>, 'children' | 'className'>;

export type TabsProps = NativeTabsProps & {
  /** @control object */
  items: TabsItem[];
  /** @control text */
  value?: string;
  /**
   * @control text
   */
  defaultValue?: string;
  /** @control object */
  onValueChange?: (value: string) => void;
  /**
   * @control select
   * @default solid
   */
  variant?: TabsVariant;
  /**
   * @control select
   * @default primary
   */
  color?: TabsColor;
  /**
   * @control select
   * @default md
   */
  size?: TabsSize;
  /**
   * @control select
   * @default md
   */
  radius?: TabsRadius;
  /**
   * @control select
   * @default top
   */
  placement?: TabsPlacement;
  /**
   * @control boolean
   * @default false
   */
  fullWidth?: boolean;
  /**
   * @control object
   * @default []
   */
  disabledKeys?: Iterable<string>;
  /**
   * @control boolean
   * @default false
   */
  isDisabled?: boolean;
  /**
   * @control select
   * @default automatic
   */
  activationMode?: TabsActivationMode;
  /**
   * @control boolean
   * @default true
   */
  shouldSelectOnPressUp?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disableAnimation?: boolean;
  /**
   * @control boolean
   * @default false
   */
  disableCursorAnimation?: boolean;
  /**
   * @control boolean
   * @default false
   */
  destroyInactiveTabPanel?: boolean;
  /**
   * @control object
   * @default {}
   */
  classNames?: TabsClassNames;
  /** @control text */
  className?: string;
  /** @control text */
  'aria-label'?: string;
  /** @control text */
  'aria-labelledby'?: string;
};

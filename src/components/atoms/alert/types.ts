import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import type { DynamicIconName } from '@/types';

export const alertVariants = cva(
  [
    'relative grid w-full overflow-hidden border',
    'text-left transition-[grid-template-rows,opacity,background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none'
  ],
  {
    variants: {
      variant: {
        solid: 'shadow-none',
        bordered: 'bg-transparent',
        flat: 'border-transparent'
      },
      color: {
        primary: '',
        success: '',
        warning: '',
        danger: ''
      },
      rounded: {
        true: 'rounded-lg',
        false: 'rounded-none'
      }
    },
    compoundVariants: [
      {
        color: 'primary',
        variant: 'solid',
        class:
          'border-border-strong-light bg-surface-raised-light text-text-light dark:border-border-strong-dark dark:bg-surface-raised-dark dark:text-text-dark'
      },
      {
        color: 'primary',
        variant: 'flat',
        class: 'bg-surface-light text-text-light dark:bg-surface-dark dark:text-text-dark'
      },
      {
        color: 'primary',
        variant: 'bordered',
        class: 'border-border-strong-light text-text-light dark:border-border-strong-dark dark:text-text-dark'
      },
      {
        color: 'success',
        variant: 'solid',
        class: 'border-success-light bg-success-tint text-text-light dark:border-success dark:text-text-dark'
      },
      {
        color: 'success',
        variant: 'flat',
        class: 'bg-success-tint text-text-light dark:text-text-dark'
      },
      {
        color: 'success',
        variant: 'bordered',
        class: 'border-success-light text-text-light dark:border-success dark:text-text-dark'
      },
      {
        color: 'warning',
        variant: 'solid',
        class: 'border-warning-light bg-warning-tint text-text-light dark:border-warning dark:text-text-dark'
      },
      {
        color: 'warning',
        variant: 'flat',
        class: 'bg-warning-tint text-text-light dark:text-text-dark'
      },
      {
        color: 'warning',
        variant: 'bordered',
        class: 'border-warning-light text-text-light dark:border-warning dark:text-text-dark'
      },
      {
        color: 'danger',
        variant: 'solid',
        class: 'border-error-light bg-error-tint text-text-light dark:border-error dark:text-text-dark'
      },
      {
        color: 'danger',
        variant: 'flat',
        class: 'bg-error-tint text-text-light dark:text-text-dark'
      },
      {
        color: 'danger',
        variant: 'bordered',
        class: 'border-error-light text-text-light dark:border-error dark:text-text-dark'
      }
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      rounded: true
    }
  }
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
export type AlertColor = NonNullable<VariantProps<typeof alertVariants>['color']>;

type NativeAlertProps = Omit<
  ComponentProps<'div'>,
  'aria-describedby' | 'aria-labelledby' | 'children' | 'className' | 'role' | 'title'
>;

export const defaultAlertIcons: Record<AlertColor, DynamicIconName> = {
  primary: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x'
};

export type AlertProps = NativeAlertProps & {
  /** @control object */
  title?: ReactNode;
  /** @control object */
  subtitle?: ReactNode;
  /** @control object */
  children?: ReactNode;
  /**
   * @control select
   * @default solid
   */
  variant?: AlertVariant;
  /**
   * @control select
   * @default primary
   */
  color?: AlertColor;
  /**
   * @control boolean
   * @default true
   */
  rounded?: boolean;
  /**
   * @control boolean
   * @default false
   */
  dismissible?: boolean;
  /**
   * @control boolean
   * @default true
   */
  defaultOpen?: boolean;
  /** @control boolean */
  open?: boolean;
  /** @control object */
  onOpenChange?: (open: boolean) => void;
  /**
   * @control text
   * @default Dismiss alert
   */
  closeButtonAriaLabel?: string;
  /**
   * @control select
   * @default derived from color
   */
  iconName?: DynamicIconName;
  /** @control object */
  startContent?: ReactNode;
  /** @control object */
  endContent?: ReactNode;
  /** @control text */
  className?: string;
};

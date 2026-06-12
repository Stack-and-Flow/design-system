import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import type { IconButtonSize } from '@/components/atoms/icon-button';
import type { DynamicIconName } from '@/types';

export const snippetBase = cva(
  [
    'box-border flex w-full max-w-full items-start overflow-hidden border',
    'font-mono text-left text-text-light dark:text-text-dark',
    'transition-[background-color,border-color,box-shadow] duration-200 ease-out'
  ],
  {
    variants: {
      size: {
        sm: 'gap-1 py-1 pr-1 pl-3 text-xs',
        md: 'gap-2 py-1 pr-1 pl-3 text-sm',
        lg: 'gap-2 py-1.5 pr-1.5 pl-4 text-base'
      },
      rounded: {
        none: 'rounded-none',
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      },
      variant: {
        solid: '',
        outline: 'bg-transparent',
        shadow: 'shadow-glow-chip-secondary-light dark:shadow-glow-chip-secondary'
      },
      color: {
        default: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        info: ''
      }
    },
    compoundVariants: [
      {
        variant: ['solid', 'shadow'],
        color: 'default',
        class: 'bg-surface-light border-border-light dark:bg-surface-dark dark:border-border-dark'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'primary',
        class: 'bg-red-surface-light border-brand-light/20 dark:bg-red-surface-dark dark:border-brand-dark/30'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'secondary',
        class:
          'bg-surface-raised-light border-border-strong-light dark:bg-surface-raised-dark dark:border-border-strong-dark'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'success',
        class: 'bg-success-surface-light border-success-light/30 dark:bg-success-surface-dark dark:border-success/30'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'warning',
        class: 'bg-warning-surface-light border-warning-light/30 dark:bg-warning-surface-dark dark:border-warning/30'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'danger',
        class: 'bg-error-surface-light border-error-light/30 dark:bg-error-surface-dark dark:border-error/30'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'info',
        class: 'bg-info-surface-light border-info-light/30 dark:bg-info-surface-dark dark:border-info/30'
      },
      {
        variant: 'outline',
        color: 'default',
        class: 'border-border-light dark:border-border-dark'
      },
      {
        variant: 'outline',
        color: 'primary',
        class: 'border-brand-light dark:border-brand-dark'
      },
      {
        variant: 'outline',
        color: 'secondary',
        class: 'border-border-strong-light dark:border-border-strong-dark'
      },
      {
        variant: 'outline',
        color: 'success',
        class: 'border-success-light dark:border-success'
      },
      {
        variant: 'outline',
        color: 'warning',
        class: 'border-warning-light dark:border-warning'
      },
      {
        variant: 'outline',
        color: 'danger',
        class: 'border-error-light dark:border-error'
      },
      {
        variant: 'outline',
        color: 'info',
        class: 'border-info-light dark:border-info'
      },
      {
        variant: 'shadow',
        class: 'border-border-strong-light dark:border-border-strong-dark'
      }
    ],
    defaultVariants: {
      size: 'md',
      rounded: 'md',
      variant: 'solid',
      color: 'default'
    }
  }
);

export const snippetPreClassName =
  'm-0 min-h-9 min-w-0 flex-1 overflow-x-auto whitespace-pre break-words bg-transparent py-2 text-inherit scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent';

export const snippetCopyButtonWrapperClassName = 'shrink-0 self-start';

export const snippetCopyButtonClassName =
  'opacity-100 transition-[opacity,box-shadow,background-color,color] duration-200 ease-out';

export const snippetStatusClassName = 'sr-only';

export const snippetCopyButtonIcons = {
  idle: 'copy',
  success: 'check'
} as const satisfies Record<'idle' | 'success', DynamicIconName>;

export type SnippetSize = NonNullable<VariantProps<typeof snippetBase>['size']>;

export const snippetCopyButtonSizes = {
  sm: 'xs',
  md: 'xs',
  lg: 'sm'
} as const satisfies Record<SnippetSize, IconButtonSize>;

export type SnippetVariantProps = VariantProps<typeof snippetBase>;

type NativeSnippetProps = Omit<
  ComponentProps<'div'>,
  'aria-controls' | 'aria-label' | 'children' | 'className' | 'color' | 'onCopy'
>;

export type SnippetProps = NativeSnippetProps & {
  /** @control text */
  children: ReactNode;
  /** @control select
   * @default md
   */
  size?: NonNullable<SnippetVariantProps['size']>;
  /** @control select
   * @default md
   */
  rounded?: NonNullable<SnippetVariantProps['rounded']>;
  /** @control select
   * @default solid
   */
  variant?: NonNullable<SnippetVariantProps['variant']>;
  /** @control select
   * @default default
   */
  color?: NonNullable<SnippetVariantProps['color']>;
  /** @control text */
  className?: string;
  /** @control boolean
   * @default false
   */
  disableCopy?: boolean;
  /** @control action */
  onCopy?: () => void;
  /** @control text */
  'aria-controls'?: string;
  /** @control text */
  'aria-label'?: string;
};

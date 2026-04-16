import type { IconSizes } from '@/components/atoms/icon-button';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

/**
 * CVA configuration for the Snippet component.
 * Controls base styles, variants, and compound variants.
 */
export const snippetBase = cva(
  'w-full max-w-full box-border overflow-hidden flex flex-row justify-start items-center gap-2 p-2 font-mono whitespace-pre-wrap text-text-light dark:text-text-dark text-justify',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
      },
      rounded: {
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
        none: 'rounded-none'
      },
      variant: {
        solid: '',
        outline: 'border-2 bg-transparent',
        shadow: 'shadow-lg'
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
        class: 'bg-color-surface-light dark:bg-color-surface-dark'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'primary',
        class: 'bg-color-surface-raised-light dark:bg-color-brand-dark'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'secondary',
        class: 'bg-color-surface-raised-dark dark:bg-color-surface-raised-dark'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'success',
        class: 'bg-green-400 dark:bg-green-700'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'warning',
        class: 'bg-yellow-400 dark:bg-yellow-700'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'danger',
        class: 'bg-red-400 dark:bg-red-700'
      },
      {
        variant: ['solid', 'shadow'],
        color: 'info',
        class: 'bg-blue-400 dark:bg-blue-700'
      },

      {
        variant: 'outline',
        color: 'default',
        class: 'border-color-border-light dark:border-color-border-dark'
      },
      {
        variant: 'outline',
        color: 'primary',
        class: 'border-color-brand-light dark:border-color-brand-dark'
      },
      {
        variant: 'outline',
        color: 'secondary',
        class: 'border-color-surface-raised-dark dark:border-color-surface-raised-dark'
      },
      {
        variant: 'outline',
        color: 'success',
        class: 'border-green-400 dark:border-green-700'
      },
      {
        variant: 'outline',
        color: 'warning',
        class: 'border-yellow-400 dark:border-yellow-700'
      },
      {
        variant: 'outline',
        color: 'danger',
        class: 'border-red-400 dark:border-red-700'
      },
      {
        variant: 'outline',
        color: 'info',
        class: 'border-blue-400 dark:border-blue-700'
      },

      { variant: 'shadow', color: 'default', class: 'shadow-color-text-muted-light/50' },
      { variant: 'shadow', color: 'primary', class: 'shadow-red-600/50' },
      {
        variant: 'shadow',
        color: 'secondary',
        class: 'shadow-color-text-muted-light/50'
      },
      { variant: 'shadow', color: 'success', class: 'shadow-green-600/50' },
      { variant: 'shadow', color: 'warning', class: 'shadow-yellow-600/50' },
      { variant: 'shadow', color: 'danger', class: 'shadow-red-600/50' },
      { variant: 'shadow', color: 'info', class: 'shadow-blue-600/50' }
    ],
    defaultVariants: {
      size: 'md',
      rounded: 'md',
      variant: 'solid',
      color: 'default'
    }
  }
);

/**
 * Snippet component variants generated from CVA.
 */
export type SnippetVariants = VariantProps<typeof snippetBase>;

type Size = 'sm' | 'md' | 'lg';

/**
 * Icon button sizes for each snippet size.
 */
export type SizeButton = Record<Size, IconSizes>;

/**
 * Props for the Snippet component.
 * @property {ReactNode} children - Content to display inside the snippet.
 * @property {'sm'|'md'|'lg'} [size] - Size of the snippet.
 * @property {'xs'|'sm'|'md'|'lg'|'xl'|'full'|'none'} [rounded] - Border radius.
 * @property {string} [className] - Additional class names.
 * @property {'default'|'primary'|'secondary'|'success'|'warning'|'danger'|'info'} [color] - Color variant.
 * @property {'solid'|'outline'|'shadow'} [variant] - Visual style variant.
 * @property {boolean} [disableCopy] - Disables the copy button.
 * @property {() => void} [onCopy] - Callback after copying.
 * @property {string} ['aria-controls'] - ARIA controls attribute.
 * @property {string} ['aria-label'] - ARIA label attribute.
 */
export interface SnippetProps extends SnippetVariants {
  children: ReactNode;
  size?: Size;
  rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  className?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  variant?: 'solid' | 'outline' | 'shadow';
  disableCopy?: boolean;
  onCopy?: () => void;
  'aria-controls'?: string;
  'aria-label'?: string;
}

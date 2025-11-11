import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
export const tooltipVariants = cva(
  [' absolute ', ' py-1.5 px-2.5 ', ' bg-gray-600 text-[.8rem] text-white text-center ', ' animate-fadeIn'],
  {
    variants: {
      color: {
        default: 'dark:bg-gray-300 dark:text-gray-800 bg-gray-600',
        primary: 'dark:bg-red-300 dark:text-gray-800 bg-red-600',
        success: 'dark:bg-green-light dark:text-gray-800 bg-green-dark',
        warning: 'dark:bg-yellow-light dark:text-gray-800 bg-yellow-dark',
        transparent: ' dark:text-gray-300 bg-tranparent dark:bg-tranparent text-gray-800'
      },
      complement: {
        default: ' ',
        'arrow-bottom':
          'after:absolute after:bottom-[-5px] after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:w-[10px] after:h-[10px] dark:after:bg-inherit after:bg-inherit ',
        'arrow-left':
          'after:absolute after:bottom-[-5px] after:left-0 after:-translate-x-1/2 after:-translate-y-1/2   after:top-1/2 after:rotate-45 after:w-[10px] after:h-[10px] dark:after:bg-inherit after:bg-inherit ',
        'arrow-right':
          'after:absolute after:bottom-[-5px] after:right-0 after:translate-x-1/2 after:-translate-y-1/2  after:top-1/2 after:rotate-45 after:w-[10px] after:h-[10px] dark:after:bg-inherit after:bg-inherit ',
        'arrow-top':
          'after:absolute after:top-[-5px] after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:w-[10px] after:h-[10px] dark:after:bg-inherit after:bg-inherit  '
      },
      width: {
        default: 'w-max',
        md: 'w-[200px]',
        xl: 'w-[500px]'
      }
    },
    defaultVariants: {}
  }
);
type TooltipColor = 'default' | 'primary' | 'success' | 'warning' | 'transparent';

type TooltipComplement = 'default' | 'arrow-bottom' | 'arrow-left' | 'arrow-right' | 'arrow-top';

type TooltipWidth = 'default' | 'md' | 'xl';

export type TooltipProps = {
  /** @control text */
  content?: string;

  children?: ReactNode;

  /**
   * @control select
   * @default primary
   */
  color?: TooltipColor;

  /** @control select */
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

  /** @control text */
  delayShow?: number;

  /** @control text */
  delayHide?: number;

  /** @control select */
  complement?: TooltipComplement;

  /**
   * @control select
   * @default default
   */
  width?: TooltipWidth;

  /**
   * @control boolean
   * @default true
   */
  disabled?: boolean;

  /**
   * @control boolean
   * @default false
   */
  onFocus?: boolean;
  /**
   * @control boolean
   * @default true
   */
  onClick?: boolean;
};

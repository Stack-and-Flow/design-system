import { cva } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const tooltipVariants = cva(
  [
    'fixed z-50 rounded-md border px-2.5 py-1.5',
    'fs-small text-center opacity-0 shadow-md',
    'transition-opacity duration-150 ease-out will-change-[opacity] motion-reduce:transition-none'
  ],
  {
    variants: {
      color: {
        default:
          'border-border-light bg-surface-raised-light text-text-light dark:border-border-dark dark:bg-surface-raised-dark dark:text-text-dark',
        primary: 'border-transparent bg-btn-primary text-white',
        success: 'border-transparent bg-success-light text-text-light dark:bg-success dark:text-text-light',
        warning: 'border-transparent bg-warning-light text-text-light dark:bg-warning dark:text-text-light',
        transparent:
          'border-border-light bg-transparent text-text-light dark:border-border-dark dark:bg-transparent dark:text-text-dark'
      },
      complement: {
        default: '',
        'arrow-bottom':
          "after:absolute after:-bottom-1 after:left-1/2 after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:content-[''] after:bg-inherit",
        'arrow-left':
          "after:absolute after:top-1/2 after:-left-1 after:size-2.5 after:-translate-y-1/2 after:rotate-45 after:content-[''] after:bg-inherit",
        'arrow-right':
          "after:absolute after:top-1/2 after:-right-1 after:size-2.5 after:-translate-y-1/2 after:rotate-45 after:content-[''] after:bg-inherit",
        'arrow-top':
          "after:absolute after:-top-1 after:left-1/2 after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:content-[''] after:bg-inherit"
      },
      width: {
        default: 'w-max max-w-64',
        md: 'w-48',
        xl: 'w-96'
      }
    },
    defaultVariants: {
      color: 'default',
      complement: 'default',
      width: 'default'
    }
  }
);

export type TooltipColor = 'default' | 'primary' | 'success' | 'warning' | 'transparent';
export type TooltipComplement = 'default' | 'arrow-bottom' | 'arrow-left' | 'arrow-right' | 'arrow-top';
export type TooltipWidth = 'default' | 'md' | 'xl';
export type TooltipPosition =
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
export type TooltipTriggerInteraction = 'hover' | 'focus' | 'click';

export type TooltipProps = Omit<ComponentProps<'span'>, 'children' | 'color' | 'content'> & {
  /** @control text */
  content?: ReactNode;
  /** @control text */
  children?: ReactNode;
  /**
   * @control select
   * @default default
   */
  color?: TooltipColor;
  /**
   * @control select
   * @default top
   */
  position?: TooltipPosition;
  /**
   * Legacy alias for `position`.
   * @control select
   * @default top
   */
  placement?: TooltipPosition;
  /**
   * @control number
   * @default 0
   */
  delayMs?: number;
  /**
   * Legacy alias for `delayMs`.
   * @control number
   * @default 0
   */
  delayShow?: number;
  /**
   * @control number
   * @default 50
   */
  delayHide?: number;
  /**
   * @control select
   * @default default
   */
  complement?: TooltipComplement;
  /**
   * @control select
   * @default default
   */
  width?: TooltipWidth;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control select
   */
  triggerInteraction?: TooltipTriggerInteraction;
  /**
   * Convenience flag that maps to `triggerInteraction="focus"`.
   * Prefer `triggerInteraction` for new code.
   * @control boolean
   * @default false
   */
  openOnFocus?: boolean;
  /**
   * Convenience flag that maps to `triggerInteraction="click"`.
   * Prefer `triggerInteraction` for new code.
   * @control boolean
   * @default false
   */
  openOnClick?: boolean;
  /**
   * @control boolean
   */
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

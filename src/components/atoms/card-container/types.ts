import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const cardContainerVariants = cva(
  [
    'block overflow-hidden border',
    'text-text-light dark:text-text-dark',
    'transition-[background-color,border-color,box-shadow,translate,transform,color] duration-300 ease-out motion-reduce:transition-none'
  ],
  {
    variants: {
      variant: {
        surface: 'bg-surface-light border-border-light dark:bg-surface-dark dark:border-border-dark',
        raised:
          'bg-surface-raised-light border-border-strong-light dark:bg-surface-raised-dark dark:border-border-strong-dark',
        outlined: 'bg-transparent border-border-strong-light dark:border-border-strong-dark',
        tinted: 'bg-red-tint-subtle border-red-tint-border'
      },
      backdropBlur: {
        none: '',
        sm: [
          '!bg-card-backdrop-light !border-red-tint-border dark:!bg-card-backdrop-dark dark:!border-red-tint-border',
          '[backdrop-filter:var(--blur-card-sm)] [-webkit-backdrop-filter:var(--blur-card-sm)]',
          'dark:[backdrop-filter:var(--blur-card-sm)] dark:[-webkit-backdrop-filter:var(--blur-card-sm)]'
        ],
        md: [
          '!bg-card-backdrop-light !border-red-tint-border dark:!bg-card-backdrop-dark dark:!border-red-tint-border',
          '[backdrop-filter:var(--blur-card-md)] [-webkit-backdrop-filter:var(--blur-card-md)]',
          'dark:[backdrop-filter:var(--blur-card-md)] dark:[-webkit-backdrop-filter:var(--blur-card-md)]'
        ],
        lg: [
          '!bg-card-backdrop-light !border-red-tint-border dark:!bg-card-backdrop-dark dark:!border-red-tint-border',
          '[backdrop-filter:var(--blur-card-lg)] [-webkit-backdrop-filter:var(--blur-card-lg)]',
          'dark:[backdrop-filter:var(--blur-card-lg)] dark:[-webkit-backdrop-filter:var(--blur-card-lg)]'
        ]
      },
      padding: {
        none: 'p-0',
        sm: 'p-sm',
        md: 'p-md',
        lg: 'p-lg'
      },
      radius: {
        none: 'rounded-none',
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg'
      },
      hoverEffect: {
        none: '',
        lift: [
          'motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
          'hover:border-brand-light dark:hover:border-brand-dark-light',
          'hover:shadow-glow-card-hover-light dark:hover:shadow-glow-card-hover'
        ]
      }
    },
    defaultVariants: {
      variant: 'surface',
      backdropBlur: 'none',
      padding: 'md',
      radius: 'md',
      hoverEffect: 'none'
    }
  }
);

type CardContainerVariantProps = VariantProps<typeof cardContainerVariants>;
export type CardContainerVariant = NonNullable<CardContainerVariantProps['variant']>;
export type CardContainerBackdropBlur = NonNullable<CardContainerVariantProps['backdropBlur']>;
export type CardContainerPadding = NonNullable<CardContainerVariantProps['padding']>;
export type CardContainerRadius = NonNullable<CardContainerVariantProps['radius']>;
export type CardContainerHoverEffect = NonNullable<CardContainerVariantProps['hoverEffect']>;
type NativeCardContainerProps = Omit<ComponentProps<'div'>, 'children' | 'className'>;

export type CardContainerProps = NativeCardContainerProps & {
  children?: ReactNode;
  /**
   * @control select
   * @default surface
   */
  variant?: CardContainerVariant;
  /**
   * Optional background blur treatment for cards that intentionally act as floating glass surfaces.
   * Keep `none` for normal document-flow content cards.
   *
   * @control select
   * @default none
   */
  backdropBlur?: CardContainerBackdropBlur;
  /**
   * @control select
   * @default md
   */
  padding?: CardContainerPadding;
  /**
   * @control select
   * @default md
   */
  radius?: CardContainerRadius;
  /**
   * @control select
   * @default none
   */
  hoverEffect?: CardContainerHoverEffect;
  /** @control text */
  className?: string;
};

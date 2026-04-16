import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const textVariants = cva(['font-[var(--font-weight-regular)] text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]'], {
  variants: {
    font: {
      // Sistema de una sola fuente — todas las variantes usan Space Grotesk Variable
      primary: 'font-[var(--font-primary)]',
      secondary: 'font-[var(--font-primary)]',
      secondaryBold: 'font-[var(--font-primary)] font-[var(--font-weight-bold)]'
    },
    tag: {
      p: 'fs-base',
      span: 'fs-base',
      small: 'fs-small'
    },
    prominent: {
      true: 'font-bold',
      false: ''
    },
    srOnly: {
      true: 'sr-only',
      false: ''
    }
  },
  defaultVariants: {
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false
  }
});

export type TextVariant = 'p' | 'small' | 'span';
export type TextFont = 'primary' | 'secondary' | 'secondaryBold';

type BaseTextProps = {
  /**
   * @control select
   * @default secondary
   * */
  font?: TextFont;
  /**
   * @control select
   * @default p
   */
  tag: TextVariant;
  /**
   * @control boolean
   * @default false
   */
  prominent?: boolean;
  /**
   * @control boolean
   * @default false
   * */
  srOnly?: boolean;
  /** @control text */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** @control text */
  className?: string;
  /** @control select */
  role?: 'status' | 'alert' | 'log' | 'marquee' | 'none';
  /** @control text */
  id?: string;
} & VariantProps<typeof textVariants>;

type TextWithHtml = BaseTextProps & {
  /** @control boolean */
  isHtml: true;
  children: string;
};

type TextStandard = BaseTextProps & {
  /** @control boolean */
  isHtml?: false;
  children: ReactNode;
};

export type TextProps = TextStandard | TextWithHtml;

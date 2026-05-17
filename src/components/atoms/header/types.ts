import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

export const headerVariants = cva('font-primary text-text-light dark:text-text-dark', {
  variants: {
    font: {
      primary: 'font-primary',
      secondary: 'font-primary',
      secondaryBold: 'font-primary font-weight-bold'
    },
    size: {
      h1: 'fs-h1',
      h2: 'fs-h2',
      h3: 'fs-h3',
      h4: 'fs-h4',
      h5: 'fs-h5',
      h6: 'fs-h6'
    },
    prominent: {
      true: 'font-weight-bold',
      false: ''
    },
    srOnly: {
      true: 'sr-only',
      false: ''
    }
  },
  defaultVariants: {
    font: 'primary',
    size: 'h1',
    prominent: false,
    srOnly: false
  }
});

export type HeaderVariantProps = VariantProps<typeof headerVariants>;
export type HeaderVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeaderFont = NonNullable<HeaderVariantProps['font']>;
export type HeaderSize = NonNullable<HeaderVariantProps['size']>;

type NativeHeaderProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children' | 'className'>;

export type HeaderProps = Omit<HeaderVariantProps, 'font' | 'size'> &
  NativeHeaderProps & {
    /** @control text */
    children: ReactNode;
    /**
     * @control select
     * @default primary
     */
    font?: HeaderFont;
    /**
     * @control select
     * @default h1
     */
    tag?: HeaderVariant;
    /**
     * @control select
     * @default h1
     */
    size?: HeaderSize;
    /**
     * @control select
     * @default undefined
     */
    fontSize?: HeaderSize;
    /**
     * @control boolean
     * @default false
     */
    prominent?: boolean;
    /** @control text */
    className?: string;
    /**
     * @control boolean
     * @default false
     */
    srOnly?: boolean;
    /** @control text */
    id?: string;
  };

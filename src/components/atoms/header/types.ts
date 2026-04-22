import { type VariantProps, cva } from 'class-variance-authority';

export const headerVariants = cva(['font-normal leading-[1.2] text-text-light dark:text-text-dark'], {
  variants: {
    font: {
      // Sistema de una sola fuente — todas las variantes usan Space Grotesk Variable
      primary: 'font-primary',
      secondary: 'font-primary',
      secondaryBold: 'font-primary font-weight-bold'
    },
    tag: {
      h1: 'fs-h1 tablet:fs-tablet-h1',
      h2: 'fs-h2 tablet:fs-tablet-h2',
      h3: 'fs-h3 tablet:fs-tablet-h3',
      h4: 'fs-h4 tablet:fs-tablet-h4',
      h5: 'fs-h5 tablet:fs-tablet-h5',
      h6: 'fs-h6 tablet:fs-tablet-h6'
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
    font: 'primary',
    tag: 'h1',
    prominent: false,
    srOnly: false
  }
});

export type HeaderVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeaderFont = 'primary' | 'secondary' | 'secondaryBold';

export type HeaderProps = {
  /** @control text */
  children?: string;
  /** @control select */
  font?: HeaderFont;
  /** @control select */
  tag: HeaderVariant;
  /** @control select */
  fontSize?: HeaderVariant;
  /** @control boolean */
  prominent?: boolean;
  /** @control text */
  className?: string;
  /** @control boolean */
  srOnly?: boolean;
  /** @control text */
  id?: string; // Nuevo prop opcional para accesibilidad
} & VariantProps<typeof headerVariants>;

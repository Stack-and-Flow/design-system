import { cn } from '@/lib/utils';
import { type DividerProps, dividerVariants } from './types';

type DividerOrientation = NonNullable<DividerProps['orientation']>;

type DividerElementProps = Omit<
  DividerProps,
  'className' | 'color' | 'corner' | 'decorative' | 'orientation' | 'size' | 'thickness'
> & {
  role?: 'separator';
  'aria-hidden'?: true;
  'aria-orientation'?: DividerOrientation;
};

export type UseDividerReturn = {
  className: string;
  dividerProps: DividerElementProps;
};

export const useDivider = ({
  orientation = 'horizontal',
  color = 'bg-primary',
  size = 'full',
  corner = 'none',
  thickness = 'xs',
  className,
  decorative = false,
  ...props
}: DividerProps): UseDividerReturn => {
  const dividerClassName = cn(dividerVariants({ orientation, size, corner, thickness }), color, className);

  return {
    className: dividerClassName,
    dividerProps: {
      ...props,
      role: decorative ? undefined : 'separator',
      'aria-hidden': decorative ? true : undefined,
      'aria-orientation': decorative ? undefined : orientation
    }
  };
};

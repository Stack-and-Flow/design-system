import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type CardContainerProps, cardContainerVariants } from './types';

type CardContainerElementProps = Omit<
  CardContainerProps,
  'backdropBlur' | 'children' | 'className' | 'hoverEffect' | 'padding' | 'radius' | 'variant'
>;

export type UseCardContainerReturn = {
  cardContainerProps: CardContainerElementProps;
  children?: ReactNode;
  className: string;
};

export const useCardContainer = ({
  children,
  className,
  variant = 'surface',
  backdropBlur = 'none',
  padding = 'md',
  radius = 'md',
  hoverEffect = 'none',
  ...props
}: CardContainerProps): UseCardContainerReturn => ({
  children,
  className: cn(cardContainerVariants({ variant, backdropBlur, padding, radius, hoverEffect }), className),
  cardContainerProps: {
    ...props
  }
});

import { cn } from '@/lib/utils';
import { type SpacerProps, spacerScaleClasses, spacerVariants } from './types';

type UseSpacerReturn = {
  className: string;
  ariaHidden: boolean;
};

export const useSpacer = ({
  axis = 'vertical',
  size = 4,
  spaceX,
  spaceY,
  className,
  ariaHidden = true
}: SpacerProps): UseSpacerReturn => {
  const resolvedSpaceX = spaceX ?? (axis === 'horizontal' || axis === 'both' ? size : 0);
  const resolvedSpaceY = spaceY ?? (axis === 'vertical' || axis === 'both' ? size : 0);

  return {
    className: cn(
      spacerVariants({ axis }),
      spacerScaleClasses[resolvedSpaceX].width,
      spacerScaleClasses[resolvedSpaceY].height,
      className
    ),
    ariaHidden
  };
};

import type { FC } from 'react';
import type { CardContainerProps } from './types';
import { useCardContainer } from './useCardContainer';

export const CardContainer: FC<CardContainerProps> = (props) => {
  const { children, className, cardContainerProps } = useCardContainer(props);

  return (
    <div {...cardContainerProps} className={className}>
      {children}
    </div>
  );
};

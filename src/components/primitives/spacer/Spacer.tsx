import type { FC } from 'react';
import type { SpacerProps } from './types';
import { useSpacer } from './useSpacer';

export const Spacer: FC<SpacerProps> = (props) => {
  const { className, ariaHidden } = useSpacer(props);

  return <div className={className} aria-hidden={ariaHidden} />;
};

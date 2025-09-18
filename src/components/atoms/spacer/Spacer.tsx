import type { FC } from 'react';

import type { SpacerProps } from './types';
import { useSpacer } from './useSpacer';

const Spacer: FC<SpacerProps> = ({ spaceX, spaceY }) => {
  const { width, height } = useSpacer({ spaceX, spaceY });
  return (
    <>
      <div style={{ width: width, height: height }}></div>
    </>
  );
};

export default Spacer;

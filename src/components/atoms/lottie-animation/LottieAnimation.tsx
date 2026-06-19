import type { LottieAnimationProps } from './types';
import { useLottieAnimation } from './useLottieAnimation';

export const LottieAnimation = (props: LottieAnimationProps) => {
  const { containerProps, isInteractive, rootProps } = useLottieAnimation(props);

  if (isInteractive) {
    return (
      <button {...rootProps}>
        <div {...containerProps} />
      </button>
    );
  }

  return (
    <div {...rootProps}>
      <div {...containerProps} />
    </div>
  );
};

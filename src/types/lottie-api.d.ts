declare module 'lottie-api' {
  import type { AnimationItem } from 'lottie-web';

  export type LottieKeyPath = unknown;

  export type LottieApiAdapter = {
    getKeyPath: (path: string) => LottieKeyPath;
    addValueCallback: (path: LottieKeyPath, callback: () => [number, number]) => void;
  };

  export type LottieApiModule = {
    createAnimationApi: (animation: AnimationItem) => LottieApiAdapter;
  };

  export const createAnimationApi: LottieApiModule['createAnimationApi'];

  const lottieApi: LottieApiModule;

  export default lottieApi;
}

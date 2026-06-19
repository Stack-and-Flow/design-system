import type { LottieApiModule } from 'lottie-api';
import type { LottiePlayer } from 'lottie-web';

export const getLottieModules = async () => {
  const [{ default: lottie }, { default: lottieApi }] = await Promise.all([
    import('lottie-web') as Promise<{ default: LottiePlayer }>,
    import('lottie-api') as Promise<{ default: LottieApiModule }>
  ]);

  return { lottie, lottieApi };
};

import type { LottieApiModule } from 'lottie-api';
import type { LottiePlayer } from 'lottie-web';

export const getLottiePlayer = async () => {
  const { default: lottie } = (await import('lottie-web')) as { default: LottiePlayer };

  return lottie;
};

export const getLottieApi = async () => {
  const { default: lottieApi } = (await import('lottie-api')) as { default: LottieApiModule };

  return lottieApi;
};

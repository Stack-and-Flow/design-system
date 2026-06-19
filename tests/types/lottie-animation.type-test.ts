import type { AnimationConfigWithData, RendererType } from 'lottie-web';
import type { LottieAnimationProps } from '../../src/components/atoms/lottie-animation/types';

const animationData = {
  assets: [],
  ddd: 0,
  fr: 60,
  h: 96,
  ip: 0,
  layers: [],
  nm: 'type-contract-sample',
  op: 60,
  v: '5.7.0',
  w: 96
} as unknown as NonNullable<AnimationConfigWithData<RendererType>['animationData']>;

const meaningfulProps = {
  animationData,
  ariaLabel: 'Meaningful animation'
} satisfies LottieAnimationProps;

const interactiveProps = {
  animationData,
  ariaLabel: 'Interactive animation',
  interactive: true
} satisfies LottieAnimationProps;

const decorativeProps = {
  animationData,
  decorative: true
} satisfies LottieAnimationProps;

// @ts-expect-error interactive mode requires ariaLabel
const interactiveWithoutLabel = { animationData, interactive: true } satisfies LottieAnimationProps;

// @ts-expect-error meaningful non-interactive mode requires ariaLabel
const meaningfulWithoutLabel = { animationData } satisfies LottieAnimationProps;

// @ts-expect-error decorative mode forbids ariaLabel
const decorativeWithLabel = { animationData, ariaLabel: 'Decorative', decorative: true } satisfies LottieAnimationProps;

// @ts-expect-error decorative mode must not be focusable
const focusableDecorative = { animationData, decorative: true, tabIndex: 0 } satisfies LottieAnimationProps;

void meaningfulProps;
void interactiveProps;
void decorativeProps;
void interactiveWithoutLabel;
void meaningfulWithoutLabel;
void decorativeWithLabel;
void focusableDecorative;

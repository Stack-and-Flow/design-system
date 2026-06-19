import { cva, type VariantProps } from 'class-variance-authority';
import type { AnimationConfigWithData, AnimationDirection, AnimationItem, RendererType } from 'lottie-web';
import type { AriaRole, ComponentProps, CSSProperties } from 'react';

export const lottieAnimationVariants = cva(
  [
    'relative inline-flex h-full w-full shrink-0 items-center justify-center overflow-hidden align-middle',
    'rounded-md border border-transparent bg-transparent text-text-light dark:text-text-dark',
    'transition-[background-color,border-color,box-shadow,transform,opacity] duration-200 ease-out motion-reduce:transition-none'
  ],
  {
    variants: {
      fit: {
        contain: '',
        cover: ''
      }
    },
    defaultVariants: {
      fit: 'contain'
    }
  }
);

export type LottieAnimationFit = NonNullable<VariantProps<typeof lottieAnimationVariants>['fit']>;
export type LottieEventListener = {
  eventName: Parameters<AnimationItem['addEventListener']>[0];
  callback: Parameters<AnimationItem['addEventListener']>[1];
};
export type LottieAnimationControl = Record<string, [number, number]>;

type NativeButtonProps = Omit<
  ComponentProps<'button'>,
  'aria-label' | 'children' | 'className' | 'disabled' | 'role' | 'style' | 'title'
>;
type NativeDivProps = Omit<
  ComponentProps<'div'>,
  'aria-label' | 'children' | 'className' | 'onClick' | 'role' | 'style' | 'title'
>;

type LottieAnimationBaseProps = {
  /** @control object */
  animationData: AnimationConfigWithData<RendererType>['animationData'];
  /**
   * @control boolean
   * @default false
   */
  interactive?: boolean;
  /**
   * @control boolean
   * @default false
   */
  decorative?: boolean;
  /** @control text */
  ariaLabel?: string;
  /** @control text */
  title?: string;
  /**
   * @control boolean
   * @default true
   */
  loop?: boolean;
  /**
   * @control boolean
   * @default true
   */
  autoplay?: boolean;
  /**
   * @control boolean
   * @default false
   */
  paused?: boolean;
  /**
   * @control boolean
   * @default false
   */
  stopped?: boolean;
  /**
   * @control number
   * @default 1
   */
  speed?: number;
  /**
   * @control radio
   * @default 1
   */
  direction?: AnimationDirection;
  /**
   * @control radio
   * @default svg
   */
  renderer?: RendererType;
  /** @control text */
  assetsPath?: string;
  /** @control object */
  rendererSettings?: AnimationConfigWithData<RendererType>['rendererSettings'];
  /** @control object */
  animationControl?: LottieAnimationControl;
  /** @control object */
  eventListeners?: LottieEventListener[];
  /**
   * Called when dynamic imports, Lottie initialization, or optional keypath control setup fail.
   * @control false
   */
  onError?: (error: unknown) => void;
  /**
   * @control text
   * @default 100%
   */
  width?: string | number;
  /**
   * @control text
   * @default 100%
   */
  height?: string | number;
  /**
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * @control number
   * @default native button default or not focusable in non-interactive mode
   */
  tabIndex?: number;
  /**
   * @control boolean
   * @default true
   */
  respectReducedMotion?: boolean;
  /**
   * @control select
   * @default contain
   */
  fit?: LottieAnimationFit;
  /** @control text */
  className?: string;
  /** @control object */
  style?: CSSProperties;
};

type LottieAnimationInteractiveProps = NativeButtonProps &
  LottieAnimationBaseProps & {
    interactive: true;
    ariaLabel: string;
    decorative?: never;
    role?: never;
  };

type LottieAnimationMeaningfulProps = NativeDivProps &
  LottieAnimationBaseProps & {
    interactive?: false;
    decorative?: false;
    ariaLabel: string;
    /**
     * @control text
     * @default img
     */
    role?: AriaRole;
  };

type LottieAnimationDecorativeProps = NativeDivProps &
  LottieAnimationBaseProps & {
    interactive?: false;
    decorative: true;
    ariaLabel?: never;
    role?: never;
    tabIndex?: never;
    title?: never;
  };

export type LottieAnimationProps =
  | LottieAnimationInteractiveProps
  | LottieAnimationMeaningfulProps
  | LottieAnimationDecorativeProps;

export type LottieAnimationVariantProps = VariantProps<typeof lottieAnimationVariants>;

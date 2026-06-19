import type { LottieApiAdapter } from 'lottie-api';
import type {
  AnimationConfigWithData,
  AnimationItem,
  CanvasRendererConfig,
  HTMLRendererConfig,
  RendererType,
  SVGRendererConfig
} from 'lottie-web';
import type { AriaRole, ComponentProps, CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getLottieModules } from '@/lib/lottie';
import { cn } from '@/lib/utils';
import { type LottieAnimationControl, type LottieAnimationProps, lottieAnimationVariants } from './types';

type SanitizedDivRest = ComponentProps<'div'> & {
  'aria-label'?: string;
  onClick?: ComponentProps<'div'>['onClick'];
  role?: AriaRole;
  title?: string;
};

type UseLottieAnimationReturn =
  | {
      containerProps: ComponentProps<'div'>;
      isInteractive: true;
      rootProps: ComponentProps<'button'>;
    }
  | {
      containerProps: ComponentProps<'div'>;
      isInteractive: false;
      rootProps: ComponentProps<'div'>;
    };

const useReducedMotionPreference = () => {
  const [state, setState] = useState({
    hasResolved: false,
    prefersReducedMotion: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setState({ hasResolved: true, prefersReducedMotion: false });
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setState({ hasResolved: true, prefersReducedMotion: mediaQuery.matches });
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);

      return () => {
        mediaQuery.removeEventListener('change', updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  return state;
};

const toCssSize = (value: string | number | undefined) => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value ?? '100%';
};

const getPreserveAspectRatio = (fit: NonNullable<LottieAnimationProps['fit']>) => {
  if (fit === 'cover') {
    return 'xMidYMid slice';
  }

  return 'xMidYMid meet';
};

const resolveRendererSettings = (
  renderer: RendererType,
  fit: NonNullable<LottieAnimationProps['fit']>,
  rendererSettings: LottieAnimationProps['rendererSettings']
): LottieAnimationProps['rendererSettings'] => {
  const preserveAspectRatio = getPreserveAspectRatio(fit);

  switch (renderer) {
    case 'canvas': {
      const canvasSettings = (rendererSettings ?? {}) as CanvasRendererConfig;

      return {
        ...canvasSettings,
        preserveAspectRatio: canvasSettings.preserveAspectRatio ?? preserveAspectRatio
      };
    }
    case 'html': {
      return (rendererSettings ?? {}) as HTMLRendererConfig;
    }
    default: {
      const svgSettings = (rendererSettings ?? {}) as SVGRendererConfig;

      return {
        ...svgSettings,
        preserveAspectRatio: svgSettings.preserveAspectRatio ?? preserveAspectRatio
      };
    }
  }
};

const applyAnimationControl = (
  animationApi: LottieApiAdapter,
  animationControl: LottieAnimationControl | undefined
) => {
  if (!animationControl) {
    return;
  }

  for (const [propertyPath, value] of Object.entries(animationControl)) {
    const keyPath = animationApi.getKeyPath(propertyPath);
    animationApi.addValueCallback(keyPath, () => value);
  }
};

const stripDecorativeProps = (restProps: SanitizedDivRest) => {
  const sanitizedRest = { ...restProps };

  delete sanitizedRest['aria-label'];
  delete sanitizedRest.onClick;
  delete sanitizedRest.role;
  delete sanitizedRest.tabIndex;
  delete sanitizedRest.title;

  return sanitizedRest;
};

const getRootClassName = ({
  className,
  disabled,
  fit,
  focusable,
  interactive
}: {
  className: LottieAnimationProps['className'];
  disabled: boolean;
  fit: NonNullable<LottieAnimationProps['fit']>;
  focusable: boolean;
  interactive: boolean;
}) => {
  return cn(
    lottieAnimationVariants({ fit }),
    focusable && 'focus-visible:focus-ring',
    interactive && [
      'cursor-pointer active:scale-[0.98] hover:bg-black-tint-low dark:hover:bg-white-tint-faint',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
    ],
    !interactive && disabled && 'pointer-events-none cursor-not-allowed opacity-40',
    className
  );
};

const getAnimationContainerClassName = () => {
  return cn('h-full w-full', '[&>*]:h-full [&>*]:w-full', '[&>svg]:block [&>canvas]:block');
};

const getRootStyle = ({
  height,
  style,
  width
}: {
  height: string | number | undefined;
  style: CSSProperties | undefined;
  width: string | number | undefined;
}) => {
  const resolvedStyle = {
    ...style
  } satisfies CSSProperties;

  if (height !== undefined) {
    resolvedStyle.height = toCssSize(height);
  }

  if (width !== undefined) {
    resolvedStyle.width = toCssSize(width);
  }

  if (Object.keys(resolvedStyle).length === 0) {
    return undefined;
  }

  return resolvedStyle;
};

const getContainerStyle = ({
  height,
  width
}: {
  height: string | number | undefined;
  width: string | number | undefined;
}) => {
  return {
    height: toCssSize(height),
    width: toCssSize(width)
  } satisfies CSSProperties;
};

export const useLottieAnimation = (props: LottieAnimationProps): UseLottieAnimationReturn => {
  const {
    animationData,
    interactive = false,
    decorative = false,
    ariaLabel,
    title,
    loop = true,
    autoplay = true,
    paused = false,
    stopped = false,
    speed = 1,
    direction = 1,
    renderer = 'svg',
    assetsPath,
    rendererSettings,
    animationControl,
    eventListeners,
    width,
    height,
    disabled = false,
    respectReducedMotion = true,
    fit = 'contain',
    className,
    style,
    role,
    ...restProps
  } = props as LottieAnimationProps & { role?: AriaRole };
  const containerRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<AnimationItem | null>(null);
  const { hasResolved: hasResolvedReducedMotion, prefersReducedMotion } = useReducedMotionPreference();
  const shouldAutoplay = autoplay && !(respectReducedMotion && prefersReducedMotion);

  const resolvedRendererSettings = useMemo(() => {
    return resolveRendererSettings(renderer, fit, rendererSettings);
  }, [fit, renderer, rendererSettings]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (respectReducedMotion && !hasResolvedReducedMotion) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let animationInstance: AnimationItem | null = null;

    const initializeAnimation = async () => {
      const { lottie, lottieApi } = await getLottieModules();
      if (disposed || !containerRef.current) {
        return;
      }

      const loadOptions: AnimationConfigWithData<RendererType> = {
        animationData,
        assetsPath,
        autoplay: shouldAutoplay,
        container,
        loop,
        renderer,
        rendererSettings: resolvedRendererSettings
      };

      animationInstance = lottie.loadAnimation(loadOptions);
      animationInstance.setDirection(direction);
      animationInstance.setSpeed(speed);
      animationInstance.loop = loop;

      const animationApi = lottieApi.createAnimationApi(animationInstance);
      applyAnimationControl(animationApi, animationControl);

      if (stopped) {
        animationInstance.stop();
      } else if (paused || !shouldAutoplay) {
        animationInstance.pause();
      } else {
        animationInstance.play();
      }

      if (!disposed) {
        setAnimation(animationInstance);
      }
    };

    void initializeAnimation();

    return () => {
      disposed = true;
      setAnimation((currentAnimation) => {
        if (currentAnimation === animationInstance) {
          return null;
        }

        return currentAnimation;
      });
      animationInstance?.destroy();
    };
  }, [
    animationControl,
    animationData,
    assetsPath,
    renderer,
    resolvedRendererSettings,
    respectReducedMotion,
    hasResolvedReducedMotion
  ]);

  useEffect(() => {
    if (!animation) {
      return;
    }

    if (!eventListeners?.length) {
      return;
    }

    for (const eventListener of eventListeners) {
      animation.addEventListener(eventListener.eventName, eventListener.callback);
    }

    return () => {
      for (const eventListener of eventListeners) {
        animation.removeEventListener(eventListener.eventName, eventListener.callback);
      }
    };
  }, [animation, eventListeners]);

  useEffect(() => {
    if (!animation) {
      return;
    }

    animation.loop = loop;
  }, [animation, loop]);

  useEffect(() => {
    if (!animation) {
      return;
    }

    animation.setDirection(direction);
  }, [animation, direction]);

  useEffect(() => {
    if (!animation) {
      return;
    }

    animation.setSpeed(speed);
  }, [animation, speed]);

  useEffect(() => {
    if (!animation) {
      return;
    }

    if (stopped) {
      animation.stop();
      return;
    }

    if (paused || !shouldAutoplay) {
      animation.pause();
      return;
    }

    animation.play();
  }, [animation, paused, shouldAutoplay, stopped]);

  const divRest = restProps as SanitizedDivRest;
  const focusable = interactive || (!decorative && divRest.tabIndex !== undefined);
  const rootClassName = getRootClassName({ className, disabled, fit, focusable, interactive });
  const rootStyle = getRootStyle({ height, style, width });
  const containerProps = {
    'aria-hidden': true,
    className: getAnimationContainerClassName(),
    ref: containerRef,
    style: getContainerStyle({ height, width })
  } satisfies ComponentProps<'div'>;

  if (interactive) {
    const buttonRest = restProps as ComponentProps<'button'>;

    return {
      isInteractive: true,
      rootProps: {
        ...buttonRest,
        'aria-label': ariaLabel,
        className: rootClassName,
        disabled,
        style: rootStyle,
        title,
        type: buttonRest.type ?? 'button'
      },
      containerProps
    };
  }

  if (decorative) {
    return {
      isInteractive: false,
      rootProps: {
        ...stripDecorativeProps(divRest),
        'aria-hidden': true,
        className: rootClassName,
        style: rootStyle
      },
      containerProps
    };
  }

  return {
    isInteractive: false,
    rootProps: {
      ...divRest,
      'aria-label': ariaLabel,
      className: rootClassName,
      role: role ?? 'img',
      style: rootStyle,
      title
    },
    containerProps
  };
};

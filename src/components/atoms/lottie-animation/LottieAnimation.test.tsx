import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnimationConfigWithData, AnimationItem, RendererType } from 'lottie-web';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let prefersReducedMotion = false;

const createMockAnimation = () => {
  return {
    addEventListener: vi.fn(() => () => undefined),
    assetsPath: '',
    autoplay: false,
    currentFrame: 0,
    currentRawFrame: 0,
    destroy: vi.fn(),
    firstFrame: 0,
    frameMult: 1,
    frameRate: 60,
    goToAndPlay: vi.fn(),
    goToAndStop: vi.fn(),
    hide: vi.fn(),
    includeLayers: vi.fn(),
    isLoaded: true,
    isPaused: false,
    isSubframeEnabled: true,
    loadSegments: vi.fn,
    loop: true,
    name: 'mock-animation',
    pause: vi.fn(),
    play: vi.fn(),
    playCount: 0,
    playDirection: 1,
    playSegments: vi.fn(),
    playSpeed: 1,
    registerAnimation: vi.fn,
    removeEventListener: vi.fn(),
    renderer: {},
    resetSegments: vi.fn(),
    resize: vi.fn(),
    segmentPos: 0,
    segments: [0, 60] as [number, number],
    setDirection: vi.fn(),
    setLoop: vi.fn(),
    setSegment: vi.fn(),
    setSpeed: vi.fn(),
    setSubframe: vi.fn(),
    show: vi.fn(),
    stop: vi.fn(),
    timeCompleted: 60,
    togglePause: vi.fn(),
    totalFrames: 60,
    triggerEvent: vi.fn()
  };
};

const createMockAnimationApi = () => {
  return {
    addValueCallback: vi.fn(),
    getKeyPath: vi.fn((path: string) => path)
  };
};

const mockAnimations: ReturnType<typeof createMockAnimation>[] = [];
const mockAnimationApis: ReturnType<typeof createMockAnimationApi>[] = [];
const loadAnimationMock = vi.fn((_config: AnimationConfigWithData<RendererType>) => {
  const animation = createMockAnimation();
  mockAnimations.push(animation);
  return animation as unknown as AnimationItem;
});
const createAnimationApiMock = vi.fn((_animation: AnimationItem) => {
  const animationApi = createMockAnimationApi();
  mockAnimationApis.push(animationApi);
  return animationApi;
});

vi.mock('@/lib/lottie', () => ({
  getLottieModules: vi.fn(async () => ({
    lottie: {
      loadAnimation: loadAnimationMock
    },
    lottieApi: {
      createAnimationApi: createAnimationApiMock
    }
  }))
}));

import { LottieAnimation } from './LottieAnimation';
import type { LottieAnimationProps } from './types';
import { useLottieAnimation } from './useLottieAnimation';

const sampleAnimationData = {
  assets: [],
  ddd: 0,
  fr: 60,
  h: 96,
  ip: 0,
  layers: [],
  nm: 'sample',
  op: 60,
  v: '5.7.0',
  w: 96
} as unknown as NonNullable<AnimationConfigWithData<RendererType>['animationData']>;

const setReducedMotion = (matches: boolean) => {
  prefersReducedMotion = matches;
};

beforeEach(() => {
  prefersReducedMotion = false;
  mockAnimations.length = 0;
  mockAnimationApis.length = 0;
  loadAnimationMock.mockClear();
  createAnimationApiMock.mockClear();

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: prefersReducedMotion,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn()
    }))
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useLottieAnimation — logic', () => {
  it('returns button root props with native button defaults in interactive mode', () => {
    const { result } = renderHook(() =>
      useLottieAnimation({ animationData: sampleAnimationData, ariaLabel: 'Play animation', interactive: true })
    );

    expect(result.current.isInteractive).toBe(true);
    if (result.current.isInteractive) {
      expect(result.current.rootProps.type).toBe('button');
      expect(result.current.rootProps['aria-label']).toBe('Play animation');
      expect(result.current.containerProps.style).toMatchObject({ height: '100%', width: '100%' });
    }
  });

  it('returns meaningful non-interactive image semantics by default', () => {
    const { result } = renderHook(() =>
      useLottieAnimation({ animationData: sampleAnimationData, ariaLabel: 'Success animation' })
    );

    expect(result.current.isInteractive).toBe(false);
    if (!result.current.isInteractive) {
      expect(result.current.rootProps.role).toBe('img');
      expect(result.current.rootProps['aria-label']).toBe('Success animation');
    }
  });

  it('adds the shared focus ring when meaningful non-interactive mode is made focusable', () => {
    const { result } = renderHook(() =>
      useLottieAnimation({ animationData: sampleAnimationData, ariaLabel: 'Focusable animation', tabIndex: 0 })
    );

    expect(result.current.isInteractive).toBe(false);
    if (!result.current.isInteractive) {
      expect(result.current.rootProps.className).toContain('focus-visible:focus-ring');
      expect(result.current.rootProps.tabIndex).toBe(0);
    }
  });

  it('converts numeric width and height props to px values', () => {
    const { result } = renderHook(() =>
      useLottieAnimation({ animationData: sampleAnimationData, ariaLabel: 'Sized animation', height: 48, width: 64 })
    );

    if (!result.current.isInteractive) {
      expect(result.current.rootProps.style).toMatchObject({ height: '48px', width: '64px' });
    }
  });

  it('keeps decorative mode hidden when accidental accessibility props are forced through runtime casts', () => {
    const { result } = renderHook(() =>
      useLottieAnimation({
        animationData: sampleAnimationData,
        decorative: true,
        role: 'img',
        title: 'Should be ignored',
        'aria-label': 'Should be ignored'
      } as unknown as LottieAnimationProps)
    );

    expect(result.current.isInteractive).toBe(false);
    if (!result.current.isInteractive) {
      expect(result.current.rootProps['aria-hidden']).toBe(true);
      expect(result.current.rootProps.role).toBeUndefined();
      expect(result.current.rootProps.tabIndex).toBeUndefined();
      expect(result.current.rootProps.title).toBeUndefined();
    }
  });
});

describe('LottieAnimation — component behavior', () => {
  it('renders a named native button when interactive', async () => {
    const handleClick = vi.fn();
    render(
      <LottieAnimation
        animationData={sampleAnimationData}
        ariaLabel='Play animation'
        interactive={true}
        onClick={handleClick}
      />
    );

    const button = await screen.findByRole('button', { name: 'Play animation' });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders meaningful non-interactive mode with image semantics', () => {
    render(<LottieAnimation animationData={sampleAnimationData} ariaLabel='Processing animation' />);

    expect(screen.getByRole('img', { name: 'Processing animation' })).toBeInTheDocument();
  });

  it('renders decorative mode hidden from assistive technology', () => {
    const { container } = render(<LottieAnimation animationData={sampleAnimationData} decorative={true} />);
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('keeps decorative semantics when accidental labels, roles, and titles are forced through casts', () => {
    const { container } = render(
      <LottieAnimation
        {...({
          animationData: sampleAnimationData,
          ariaLabel: 'Should be ignored',
          decorative: true,
          role: 'img',
          tabIndex: 0,
          title: 'Should be ignored'
        } as unknown as LottieAnimationProps)}
      />
    );

    const root = container.firstElementChild;

    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('aria-label');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('title');
  });

  it('ignores role overrides in interactive mode', async () => {
    render(
      <LottieAnimation
        {...({
          animationData: sampleAnimationData,
          ariaLabel: 'Download animation',
          interactive: true,
          role: 'switch'
        } as unknown as LottieAnimationProps)}
      />
    );

    const button = await screen.findByRole('button', { name: 'Download animation' });

    expect(button).not.toHaveAttribute('role', 'switch');
  });

  it('disables the native button and blocks activation when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <LottieAnimation
        animationData={sampleAnimationData}
        ariaLabel='Disabled animation'
        disabled={true}
        interactive={true}
        onClick={handleClick}
      />
    );

    const button = await screen.findByRole('button', { name: 'Disabled animation' });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('loads the animation with the validated renderer settings and size defaults', async () => {
    render(
      <LottieAnimation
        animationData={sampleAnimationData}
        ariaLabel='Configured animation'
        assetsPath='/assets'
        fit='cover'
        loop={false}
        renderer='svg'
        rendererSettings={{ className: 'player' }}
      />
    );

    await waitFor(() => {
      expect(loadAnimationMock).toHaveBeenCalledTimes(1);
    });

    expect(loadAnimationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        animationData: sampleAnimationData,
        assetsPath: '/assets',
        autoplay: true,
        loop: false,
        renderer: 'svg',
        rendererSettings: expect.objectContaining({
          className: 'player',
          preserveAspectRatio: 'xMidYMid slice'
        })
      })
    );
  });

  it('destroys the animation on unmount', async () => {
    const { unmount } = render(<LottieAnimation animationData={sampleAnimationData} ariaLabel='Lifecycle animation' />);

    await waitFor(() => {
      expect(mockAnimations).toHaveLength(1);
    });

    unmount();

    expect(mockAnimations[0]?.destroy).toHaveBeenCalledTimes(1);
  });

  it('attaches and removes event listeners with the animation instance', async () => {
    const completeListener = vi.fn();
    const listeners = [{ callback: completeListener, eventName: 'complete' as const }];
    const { unmount } = render(
      <LottieAnimation animationData={sampleAnimationData} ariaLabel='Events animation' eventListeners={listeners} />
    );

    await waitFor(() => {
      expect(mockAnimations[0]?.addEventListener).toHaveBeenCalledWith('complete', completeListener);
    });

    unmount();

    expect(mockAnimations[0]?.removeEventListener).toHaveBeenCalledWith('complete', completeListener);
  });

  it('updates speed, direction, loop, paused, and stopped playback props', async () => {
    const { rerender } = render(
      <LottieAnimation animationData={sampleAnimationData} ariaLabel='Playback animation' direction={1} speed={1} />
    );

    await waitFor(() => {
      expect(mockAnimations).toHaveLength(1);
    });

    rerender(
      <LottieAnimation
        animationData={sampleAnimationData}
        ariaLabel='Playback animation'
        direction={-1}
        loop={false}
        paused={true}
        speed={2}
      />
    );

    await waitFor(() => {
      expect(mockAnimations[0]?.setDirection).toHaveBeenCalledWith(-1);
      expect(mockAnimations[0]?.setSpeed).toHaveBeenCalledWith(2);
      expect(mockAnimations[0]?.pause).toHaveBeenCalled();
      expect(mockAnimations[0]?.loop).toBe(false);
    });

    rerender(<LottieAnimation animationData={sampleAnimationData} ariaLabel='Playback animation' stopped={true} />);

    await waitFor(() => {
      expect(mockAnimations[0]?.stop).toHaveBeenCalled();
    });
  });

  it('applies animationControl through lottie-api and recreates the animation when it changes', async () => {
    const { rerender } = render(
      <LottieAnimation
        animationControl={{ spinner: [0.5, 0.5] }}
        animationData={sampleAnimationData}
        ariaLabel='Controlled animation'
      />
    );

    await waitFor(() => {
      expect(createAnimationApiMock).toHaveBeenCalledTimes(1);
      expect(mockAnimationApis[0]?.getKeyPath).toHaveBeenCalledWith('spinner');
      expect(mockAnimationApis[0]?.addValueCallback).toHaveBeenCalledTimes(1);
    });

    rerender(
      <LottieAnimation
        animationControl={{ spinner: [1, 1] }}
        animationData={sampleAnimationData}
        ariaLabel='Controlled animation'
      />
    );

    await waitFor(() => {
      expect(loadAnimationMock).toHaveBeenCalledTimes(2);
      expect(mockAnimations[0]?.destroy).toHaveBeenCalledTimes(1);
      expect(mockAnimationApis[1]?.addValueCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('disables autoplay when reduced motion is enabled and respectReducedMotion is true', async () => {
    setReducedMotion(true);
    render(<LottieAnimation animationData={sampleAnimationData} ariaLabel='Reduced motion animation' />);

    await waitFor(() => {
      expect(loadAnimationMock).toHaveBeenCalledWith(expect.objectContaining({ autoplay: false }));
    });

    expect(mockAnimations[0]?.pause).toHaveBeenCalled();
  });

  it('allows autoplay when reduced motion is enabled but respectReducedMotion is false', async () => {
    setReducedMotion(true);
    render(
      <LottieAnimation
        animationData={sampleAnimationData}
        ariaLabel='Reduced motion override animation'
        respectReducedMotion={false}
      />
    );

    await waitFor(() => {
      expect(loadAnimationMock).toHaveBeenCalledWith(expect.objectContaining({ autoplay: true }));
    });
  });

  it('renders safely during SSR without calling browser-only Lottie APIs', () => {
    const markup = renderToString(
      <LottieAnimation animationData={sampleAnimationData} ariaLabel='Server animation' interactive={true} />
    );

    expect(markup).toContain('aria-label="Server animation"');
    expect(loadAnimationMock).not.toHaveBeenCalled();
    expect(createAnimationApiMock).not.toHaveBeenCalled();
  });

  it('does not require matchMedia during server rendering', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');

    renderToString(<LottieAnimation animationData={sampleAnimationData} ariaLabel='Render safety animation' />);

    expect(matchMediaSpy).not.toHaveBeenCalled();
  });
});

describe('LottieAnimation — type contract', () => {
  it('requires ariaLabel in interactive and meaningful non-interactive modes and forbids it for decorative mode', () => {
    ({
      animationData: sampleAnimationData,
      ariaLabel: 'Meaningful animation'
    }) satisfies LottieAnimationProps;

    ({
      animationData: sampleAnimationData,
      ariaLabel: 'Interactive animation',
      interactive: true
    }) satisfies LottieAnimationProps;

    // @ts-expect-error interactive mode requires ariaLabel
    ({ animationData: sampleAnimationData, interactive: true }) satisfies LottieAnimationProps;

    // @ts-expect-error meaningful non-interactive mode requires ariaLabel
    ({ animationData: sampleAnimationData }) satisfies LottieAnimationProps;

    // @ts-expect-error decorative mode forbids ariaLabel
    ({ animationData: sampleAnimationData, ariaLabel: 'Decorative', decorative: true }) satisfies LottieAnimationProps;

    // @ts-expect-error decorative mode must not be focusable
    ({ animationData: sampleAnimationData, decorative: true, tabIndex: 0 }) satisfies LottieAnimationProps;

    expect(true).toBe(true);
  });
});

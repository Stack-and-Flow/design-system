import lottieAnimationDemo from '@assets/lottie/lottie-animation-demo.json';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useMemo, useState } from 'react';
import { LottieAnimation } from './LottieAnimation';
import type { LottieAnimationProps } from './types';

const demoAnimationData = lottieAnimationDemo as LottieAnimationProps['animationData'];

const defaultFrameClassName = 'h-32 w-32';

const StoryFrame = ({ children, label }: { children: ReactNode; label: string }) => (
  <div className='flex flex-col items-center gap-sm rounded-md border border-border-light bg-surface-light p-md dark:border-border-dark dark:bg-surface-dark'>
    <div className={defaultFrameClassName}>{children}</div>
    <span className='text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark'>{label}</span>
  </div>
);

const StoryGrid = ({ children }: { children: ReactNode }) => (
  <div className='flex flex-wrap items-start justify-center gap-lg'>{children}</div>
);

const ControlButton = ({
  active = false,
  children,
  onClick
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    className={`shrink-0 whitespace-nowrap rounded-pill border px-md py-xs text-sm font-semibold transition-[background-color,border-color,color] duration-200 ease-out focus-visible:focus-ring ${
      active
        ? 'border-brand-light bg-red-tint-subtle-light text-brand-light dark:border-brand-dark dark:bg-red-tint-subtle-dark dark:text-brand-dark'
        : 'border-border-light bg-surface-light text-text-light hover:border-border-strong-light hover:bg-surface-raised-light dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:hover:border-border-strong-dark dark:hover:bg-surface-raised-dark'
    }`}
    onClick={onClick}
    type='button'
  >
    {children}
  </button>
);

const InteractiveDemo = () => {
  const [paused, setPaused] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    setClickCount((currentClickCount) => currentClickCount + 1);
    action('interactive-click')({ paused: nextPaused });
  };

  return (
    <div className='flex w-full max-w-full flex-col items-center gap-md'>
      <div className={defaultFrameClassName}>
        <LottieAnimation
          animationData={demoAnimationData}
          ariaLabel={paused ? 'Resume animation' : 'Pause animation'}
          interactive={true}
          onClick={handleClick}
          paused={paused}
        />
      </div>
      <span className='rounded-pill border border-border-light bg-surface-light px-md py-xs text-sm font-semibold text-text-light dark:border-border-dark dark:bg-surface-dark dark:text-text-dark'>
        {paused ? 'Paused' : 'Running'} · clicks: {clickCount}
      </span>
    </div>
  );
};

const PlaybackControlsDemo = () => {
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const play = () => {
    setStopped(false);
    setPaused(false);
  };

  const pause = () => {
    setStopped(false);
    setPaused(true);
  };

  const stop = () => {
    setPaused(false);
    setStopped(true);
  };

  return (
    <div className='flex w-full max-w-full flex-col items-center gap-md'>
      <div className={defaultFrameClassName}>
        <LottieAnimation
          animationData={demoAnimationData}
          ariaLabel='Playback controlled animation'
          direction={direction}
          paused={paused}
          speed={speed}
          stopped={stopped}
        />
      </div>
      <div className='flex w-full max-w-full flex-row flex-wrap justify-center gap-xs'>
        <ControlButton active={!paused && !stopped} onClick={play}>
          Play
        </ControlButton>
        <ControlButton active={paused} onClick={pause}>
          Pause
        </ControlButton>
        <ControlButton active={stopped} onClick={stop}>
          Stop
        </ControlButton>
        <ControlButton active={speed === 0.5} onClick={() => setSpeed(0.5)}>
          0.5x
        </ControlButton>
        <ControlButton active={speed === 2} onClick={() => setSpeed(2)}>
          2x
        </ControlButton>
        <ControlButton active={direction === -1} onClick={() => setDirection((current) => (current === 1 ? -1 : 1))}>
          Reverse
        </ControlButton>
      </div>
      <span className='text-center text-sm font-semibold text-text-light dark:text-text-dark'>
        speed {speed}x · direction {direction === 1 ? 'forward' : 'reverse'} ·{' '}
        {stopped ? 'stopped' : paused ? 'paused' : 'playing'}
      </span>
    </div>
  );
};

const EventListenersDemo = () => {
  const [loopCount, setLoopCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const eventListeners = useMemo<LottieAnimationProps['eventListeners']>(
    () => [
      {
        callback: () => {
          action('loop-complete')();
          setLoopCount((currentLoopCount) => currentLoopCount + 1);
        },
        eventName: 'loopComplete'
      }
    ],
    []
  );

  return (
    <div className='flex w-full max-w-full flex-col items-center gap-md'>
      <div className={defaultFrameClassName}>
        <LottieAnimation
          animationData={demoAnimationData}
          ariaLabel='Events animation'
          eventListeners={eventListeners}
          paused={paused}
          speed={2}
        />
      </div>
      <span className='rounded-pill border border-border-light bg-surface-light px-md py-xs text-sm font-semibold text-text-light dark:border-border-dark dark:bg-surface-dark dark:text-text-dark'>
        loopComplete events: {loopCount}
      </span>
      <div className='flex w-full max-w-full flex-row flex-wrap justify-center gap-xs'>
        <ControlButton active={!paused} onClick={() => setPaused(false)}>
          Resume
        </ControlButton>
        <ControlButton active={paused} onClick={() => setPaused(true)}>
          Pause
        </ControlButton>
        <ControlButton onClick={() => setLoopCount(0)}>Reset count</ControlButton>
      </div>
    </div>
  );
};

const AnimationControlDemo = () => {
  const [controlled, setControlled] = useState(false);

  return (
    <div className='flex w-full max-w-full flex-col items-center gap-md'>
      <StoryGrid>
        <StoryFrame label='Normal motion'>
          <LottieAnimation animationData={demoAnimationData} ariaLabel='Uncontrolled animation' />
        </StoryFrame>
        <StoryFrame label={controlled ? 'Blue dot pinned' : 'Control off'}>
          <LottieAnimation
            animationControl={controlled ? { 'Control Dot,Transform,Position': [94, 40] } : undefined}
            animationData={demoAnimationData}
            ariaLabel='Controlled animation'
          />
        </StoryFrame>
      </StoryGrid>
      <ControlButton active={controlled} onClick={() => setControlled((current) => !current)}>
        {controlled ? 'Release control' : 'Pin blue dot'}
      </ControlButton>
    </div>
  );
};

const ResponsiveContainerDemo = () => {
  const [width, setWidth] = useState(288);

  return (
    <div className='flex w-full max-w-full flex-col items-center gap-md'>
      <div className='flex w-full max-w-full flex-row flex-wrap justify-center gap-xs'>
        <ControlButton active={width === 160} onClick={() => setWidth(160)}>
          Narrow
        </ControlButton>
        <ControlButton active={width === 288} onClick={() => setWidth(288)}>
          Medium
        </ControlButton>
        <ControlButton active={width === 448} onClick={() => setWidth(448)}>
          Wide
        </ControlButton>
      </div>
      <div
        className='h-48 overflow-hidden rounded-md border border-border-light bg-surface-light p-md transition-[width] duration-300 ease-out dark:border-border-dark dark:bg-surface-dark'
        style={{ width }}
      >
        <LottieAnimation animationData={demoAnimationData} ariaLabel='Responsive animation' />
      </div>
      <span className='text-sm font-semibold text-text-light dark:text-text-dark'>Container width: {width}px</span>
    </div>
  );
};

/**
 * ## Description
 * LottieAnimation renders local Lottie JSON data with full first-slice parity for playback, accessibility, sizing, and reduced-motion behavior.
 *
 * ## Dependencies
 * Uses `lottie-web` for animation playback and `lottie-api` for keypath value callbacks.
 *
 * ## Usage Guide
 * Use `interactive={true}` only when the animation itself acts as a button. The interactive story toggles playback on click so the relationship between user action and controlled props is visible. Use the default meaningful non-interactive mode for informative motion and `decorative={true}` when the animation is purely ornamental. Use parent layout, `width`, `height`, `className`, or the narrow `style` layout escape hatch for sizing.
 *
 * ## Demo asset
 * The stories use a repository-owned Lottie JSON fixture with multiple animated layers: a pulsing ring, orbiting dot, moving control dot, progress beam, and core pulse. This makes playback, speed, direction, sizing, event listeners, and `animationControl` differences visible without relying on external assets.
 */
const meta: Meta<typeof LottieAnimation> = {
  title: 'Atoms/LottieAnimation',
  component: LottieAnimation,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof LottieAnimation>;

/**
 * Shows the default meaningful non-interactive mode with a visible repository-owned Lottie fixture.
 */
export const Default: Story = {
  args: {
    animationData: demoAnimationData,
    ariaLabel: 'Celebration animation'
  },
  decorators: [
    (StoryComponent) => (
      <div className={defaultFrameClassName}>
        <StoryComponent />
      </div>
    )
  ]
};

/**
 * Shows the decorative mode that stays hidden from assistive technology while still rendering the animation visually.
 */
export const Decorative: Story = {
  args: {
    animationData: demoAnimationData,
    decorative: true
  },
  decorators: Default.decorators
};

/**
 * Shows the runtime safety behavior where decorative semantics still win if an accidental accessible name is forced through JavaScript or a cast.
 */
export const DecorativeIgnoresAccidentalLabel: Story = {
  render: () => (
    <div className={defaultFrameClassName}>
      <LottieAnimation
        {...({
          animationData: demoAnimationData,
          ariaLabel: 'Should be ignored',
          decorative: true,
          title: 'Should be ignored'
        } as unknown as LottieAnimationProps)}
      />
    </div>
  )
};

/**
 * Shows native button semantics with visible feedback. The animation itself is the button; clicking it toggles the controlled `paused` prop and updates the status chip.
 */
export const Interactive: Story = {
  render: () => <InteractiveDemo />
};

/**
 * Shows consumer-controlled playback props with explicit buttons so each action changes the rendered animation immediately.
 */
export const PlaybackControls: Story = {
  render: () => <PlaybackControlsDemo />
};

/**
 * Shows the disabled interactive state while keeping the animation visible.
 */
export const DisabledInteractive: Story = {
  args: {
    animationData: demoAnimationData,
    ariaLabel: 'Disabled animation',
    disabled: true,
    interactive: true,
    onClick: action('disabled-interactive-click')
  },
  decorators: Default.decorators
};

/**
 * Shows playback speed overrides by comparing slow, default, and fast playback side by side.
 */
export const Speed: Story = {
  render: () => (
    <StoryGrid>
      <StoryFrame label='0.5x speed'>
        <LottieAnimation animationData={demoAnimationData} ariaLabel='Slow animation' speed={0.5} />
      </StoryFrame>
      <StoryFrame label='1x speed'>
        <LottieAnimation animationData={demoAnimationData} ariaLabel='Default speed animation' />
      </StoryFrame>
      <StoryFrame label='2x speed'>
        <LottieAnimation animationData={demoAnimationData} ariaLabel='Fast animation' speed={2} />
      </StoryFrame>
    </StoryGrid>
  )
};

/**
 * Shows event listener registration with an explicit `loopComplete` counter. The counter increments after each completed loop; pausing the animation stops new loop events and reset clears the count.
 */
export const EventListeners: Story = {
  render: () => <EventListenersDemo />
};

/**
 * Shows keypath control wiring through `lottie-api`. The toggle pins the animated blue control dot to a fixed top-right coordinate and releases it back to normal motion.
 */
export const AnimationControl: Story = {
  render: () => <AnimationControlDemo />
};

/**
 * Shows renderer-specific settings passed through to `lottie-web` by comparing contain and cover fitting in wide frames.
 */
export const RendererSettings: Story = {
  render: () => (
    <StoryGrid>
      <StoryFrame label='xMidYMid meet'>
        <LottieAnimation
          animationData={demoAnimationData}
          ariaLabel='Contain renderer animation'
          height={96}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          width={160}
        />
      </StoryFrame>
      <StoryFrame label='xMidYMid slice'>
        <LottieAnimation
          animationData={demoAnimationData}
          ariaLabel='Cover renderer animation'
          fit='cover'
          height={96}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          width={160}
        />
      </StoryFrame>
    </StoryGrid>
  )
};

/**
 * Shows explicit width and height props for reference-parity sizing.
 */
export const ExplicitWidthAndHeight: Story = {
  args: {
    animationData: demoAnimationData,
    ariaLabel: 'Sized animation',
    height: 72,
    width: 120
  }
};

/**
 * Shows the component filling a parent container whose width changes from story controls.
 */
export const ResponsiveContainer: Story = {
  render: () => <ResponsiveContainerDemo />
};

/**
 * Shows the configuration used when reduced motion should prevent autoplay for users who opt out of motion in the operating system.
 */
export const ReducedMotionPreference: Story = {
  args: {
    animationData: demoAnimationData,
    ariaLabel: 'Reduced motion animation',
    respectReducedMotion: true
  },
  decorators: Default.decorators
};

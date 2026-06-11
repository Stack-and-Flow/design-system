import { Button } from '@atoms/button';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, useEffect, useState } from 'react';
import { ToastProvider, toast } from '@/index';
import type { ToastQueueStrategy, ToastSize, ToastStatus, ToastVariant } from './types';

const createDeferredPromise = () => {
  return new Promise<{ filename: string }>((resolve) => {
    window.setTimeout(() => {
      resolve({ filename: 'release-notes.pdf' });
    }, 1200);
  });
};

const ToastStoryShell = ({ children, ...props }: ComponentProps<typeof ToastProvider>) => {
  useEffect(() => {
    toast.clear();

    return () => {
      toast.clear();
    };
  }, []);

  return <ToastProvider {...props}>{children}</ToastProvider>;
};

const TriggerButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button onClick={onClick} text={label} variant='secondary' />
);

type ToastPlacement = NonNullable<ComponentProps<typeof ToastProvider>['placement']>;

const queueDemoToasts = (strategy: ToastQueueStrategy) => {
  toast.clear();

  for (let index = 1; index <= 4; index += 1) {
    toast({
      id: `queue-${strategy}-demo-${index}`,
      title: `${strategy.toUpperCase()} notification ${index}`,
      description:
        index <= 2
          ? strategy === 'fifo'
            ? 'Queued after notification 4 arrives. FIFO promotes notification 1 before notification 2.'
            : 'Queued after notification 4 arrives. LIFO promotes notification 2 before notification 1.'
          : 'Visible after the four-toast batch because the stack keeps the latest items on screen.'
    });
  }
};

/**
 * ## Description
 * ToastProvider renders the notifications landmark region and wires the imperative `toast(...)` API to token-based, non-modal toast notifications.
 *
 * ## Dependencies
 * Uses the design-system `Button`, `IconButton`, and `Icon` patterns to render toast actions and dismiss controls consistently with the rest of the system.
 *
 * ## Usage Guide
 * Mount a single provider near the application root, then call `toast(...)` from event handlers, async flows, or promise helpers. Provider props configure system-level behavior such as placement, queueing, motion, safe areas, and pause defaults. Toast options such as `title`, `description`, `status`, `variant`, `size`, `duration`, `dismissible`, and `progress` are passed to the imperative `toast(...)` call, not to `ToastProvider`; use the `Playground` story to inspect those call-time options through Storybook Controls. Toasts stack with a compact HeroUI-like overlap by default and automatically respect the user's `prefers-reduced-motion` setting. This Milestone 2 story set covers the full issue matrix for statuses, variants, sizes, placements, queue strategies, swipe dismissal, long content, and keyboard landmark navigation.
 */
const meta: Meta<typeof ToastProvider> = {
  title: 'Organisms/Toast',
  component: ToastProvider,
  parameters: {
    docs: {
      autodocs: true,
      story: {
        iframeHeight: 320,
        inline: false
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ToastProvider>;

type ToastControlsStoryArgs = ComponentProps<typeof ToastProvider> & {
  toastDescription: string;
  toastDismissible: boolean;
  toastDuration: number;
  toastProgress: boolean;
  toastSize: ToastSize;
  toastStatus: ToastStatus;
  toastTitle: string;
  toastVariant: ToastVariant;
};

type ToastControlsStory = StoryObj<ToastControlsStoryArgs>;

/**
 * Exposes the imperative toast options through Storybook Controls.
 */
export const Playground: ToastControlsStory = {
  args: {
    toastDescription: 'The latest settings are now available to your team.',
    toastDismissible: true,
    toastDuration: 5000,
    toastProgress: true,
    toastSize: 'md',
    toastStatus: 'neutral',
    toastTitle: 'Changes saved',
    toastVariant: 'soft'
  },
  argTypes: {
    toastDescription: { control: 'text', name: 'description' },
    toastDismissible: { control: 'boolean', name: 'dismissible' },
    toastDuration: { control: { min: 0, step: 500, type: 'number' }, name: 'duration' },
    toastProgress: { control: 'boolean', name: 'progress' },
    toastSize: { control: 'select', name: 'size', options: ['sm', 'md', 'lg'] },
    toastStatus: {
      control: 'select',
      name: 'status',
      options: ['neutral', 'info', 'success', 'warning', 'error', 'loading']
    },
    toastTitle: { control: 'text', name: 'title' },
    toastVariant: { control: 'select', name: 'variant', options: ['solid', 'soft', 'outline'] }
  },
  render: ({
    toastDescription,
    toastDismissible,
    toastDuration,
    toastProgress,
    toastSize,
    toastStatus,
    toastTitle,
    toastVariant,
    ...providerArgs
  }) => (
    <ToastStoryShell {...providerArgs}>
      <TriggerButton
        label='Show configured toast'
        onClick={() => {
          toast({
            id: 'playground-toast',
            title: toastTitle,
            description: toastDescription,
            dismissible: toastDismissible,
            duration: toastDuration,
            progress: toastProgress,
            size: toastSize,
            status: toastStatus,
            variant: toastVariant
          });
          action('toast-playground-trigger')();
        }}
      />
    </ToastStoryShell>
  )
};

/**
 * Demonstrates the baseline imperative trigger with the provider defaults and the named notifications region.
 */
export const Default: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <TriggerButton
        label='Show toast'
        onClick={() => {
          toast({
            id: 'default-toast',
            title: 'Changes saved',
            description: 'The latest settings are now available to your team.'
          });
          action('toast-trigger')();
        }}
      />
    </ToastStoryShell>
  )
};

/**
 * Demonstrates all approved status helpers, including the persistent loading state.
 */
export const Status: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <div className='flex flex-wrap gap-3'>
        <TriggerButton
          label='Neutral'
          onClick={() => toast('Background sync finished', { id: 'status-neutral-toast' })}
        />
        <TriggerButton
          label='Info'
          onClick={() => toast.info('A new update is ready to install', { id: 'status-info-toast' })}
        />
        <TriggerButton
          label='Success'
          onClick={() => toast.success('Deployment finished successfully', { id: 'status-success-toast' })}
        />
        <TriggerButton
          label='Warning'
          onClick={() => toast.warning('Check the staging credentials before retrying', { id: 'status-warning-toast' })}
        />
        <TriggerButton
          label='Error'
          onClick={() => toast.error('The upload could not be completed', { id: 'status-error-toast' })}
        />
        <TriggerButton
          label='Loading'
          onClick={() =>
            toast.loading({
              id: 'status-loading-toast',
              title: 'Uploading assets',
              description: 'This stays visible until another event updates it.'
            })
          }
        />
      </div>
    </ToastStoryShell>
  )
};

/**
 * Demonstrates the supported visual variant matrix without changing the semantic status contract.
 */
export const Variants: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <div className='flex flex-wrap gap-3'>
        <TriggerButton
          label='Solid'
          onClick={() =>
            toast({
              id: 'variant-solid-toast',
              title: 'Solid variant',
              description: 'Raised visual treatment.',
              variant: 'solid'
            })
          }
        />
        <TriggerButton
          label='Soft'
          onClick={() =>
            toast({
              id: 'variant-soft-toast',
              title: 'Soft variant',
              description: 'Default tinted surface.',
              variant: 'soft'
            })
          }
        />
        <TriggerButton
          label='Outline'
          onClick={() =>
            toast({
              id: 'variant-outline-toast',
              title: 'Outline variant',
              description: 'Border-led surface.',
              variant: 'outline'
            })
          }
        />
      </div>
    </ToastStoryShell>
  )
};

/**
 * Demonstrates the density scale so size changes affect spacing, width, icon scale, and text treatment.
 */
export const Sizes: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <div className='flex flex-wrap gap-3'>
        <TriggerButton
          label='Small'
          onClick={() =>
            toast({
              id: 'size-small-toast',
              title: 'Small toast',
              description: 'Compact density keeps the content readable without changing the public API.',
              size: 'sm'
            })
          }
        />
        <TriggerButton
          label='Medium'
          onClick={() =>
            toast({
              id: 'size-medium-toast',
              title: 'Medium toast',
              description: 'The medium size matches the default spacing and width.',
              size: 'md'
            })
          }
        />
        <TriggerButton
          label='Large'
          onClick={() =>
            toast({
              id: 'size-large-toast',
              title: 'Large toast',
              description: 'The large size opens the surface, text, and indicator density for heavier messages.',
              size: 'lg'
            })
          }
        />
      </div>
    </ToastStoryShell>
  )
};

/**
 * Demonstrates an action-oriented toast that keeps the close affordance after the content block.
 */
export const WithAction: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <TriggerButton
        label='Show actionable toast'
        onClick={() => {
          toast({
            id: 'action-toast',
            title: 'Review requested',
            description: 'A maintainer must approve this release before it can continue.',
            action: {
              label: 'Open review',
              onAction: () => action('toast-action')()
            }
          });
        }}
      />
    </ToastStoryShell>
  )
};

/**
 * Demonstrates the promise helper replacing the loading toast with success content once the async work resolves.
 */
export const PromiseLifecycle: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <TriggerButton
        label='Run promise toast'
        onClick={() => {
          void toast.promise(createDeferredPromise(), {
            loading: {
              id: 'promise-lifecycle-toast',
              title: 'Uploading file...',
              description: 'Please keep this tab open.'
            },
            success: (data) => ({
              id: 'promise-lifecycle-toast',
              title: 'Upload complete',
              description: data.filename
            }),
            error: {
              id: 'promise-lifecycle-toast',
              title: 'Upload failed',
              description: 'Please try again in a few seconds.'
            }
          });
        }}
      />
    </ToastStoryShell>
  )
};

const PlacementDemo = (args: ComponentProps<typeof ToastProvider>) => {
  const [placement, setPlacement] = useState<ToastPlacement>('bottom');

  const showPlacementToast = (nextPlacement: ToastPlacement, label: string) => {
    toast.clear();
    setPlacement(nextPlacement);

    window.setTimeout(() => {
      toast(`${label} placement`, { id: `placement-${nextPlacement}-toast` });
      action('placement-toast')({ placement: nextPlacement });
    }, 0);
  };

  return (
    <ToastStoryShell {...args} placement={placement}>
      <div className='flex flex-wrap gap-3'>
        <TriggerButton label='Top start' onClick={() => showPlacementToast('top-start', 'Top start')} />
        <TriggerButton label='Top' onClick={() => showPlacementToast('top', 'Top')} />
        <TriggerButton label='Top end' onClick={() => showPlacementToast('top-end', 'Top end')} />
        <TriggerButton label='Bottom start' onClick={() => showPlacementToast('bottom-start', 'Bottom start')} />
        <TriggerButton label='Bottom' onClick={() => showPlacementToast('bottom', 'Bottom')} />
        <TriggerButton label='Bottom end' onClick={() => showPlacementToast('bottom-end', 'Bottom end')} />
      </div>
    </ToastStoryShell>
  );
};

/**
 * Demonstrates every supported placement from a single grouped matrix story.
 */
export const Placement: Story = {
  render: (args) => <PlacementDemo {...args} />
};

const QueueStrategyDemo = (args: ComponentProps<typeof ToastProvider>) => {
  const [queueStrategy, setQueueStrategy] = useState<ToastQueueStrategy>('fifo');

  const showQueuedToasts = (nextStrategy: ToastQueueStrategy) => {
    toast.clear();
    setQueueStrategy(nextStrategy);

    window.setTimeout(() => {
      queueDemoToasts(nextStrategy);
      action('queue-strategy-toast')({ queueStrategy: nextStrategy });
    }, 0);
  };

  return (
    <ToastStoryShell {...args} maxVisible={2} queueStrategy={queueStrategy}>
      <div className='flex flex-wrap gap-3'>
        <TriggerButton label='Queue FIFO toasts' onClick={() => showQueuedToasts('fifo')} />
        <TriggerButton label='Queue LIFO toasts' onClick={() => showQueuedToasts('lifo')} />
      </div>
    </ToastStoryShell>
  );
};

/**
 * Demonstrates the queue promotion difference when the visible stack frees a slot.
 * Queue four toasts: the latest two stay visible, while notifications 1 and 2 move into the queue. Close one visible toast; FIFO promotes notification 1 first, while LIFO promotes notification 2 first.
 */
export const QueueStrategy: Story = {
  render: (args) => <QueueStrategyDemo {...args} />
};

/**
 * Demonstrates swipe dismissal with the default vertical mapping and an explicit horizontal override.
 */
export const SwipeDismissal: Story = {
  args: { placement: 'bottom-end', swipeThreshold: 40 },
  render: (args) => (
    <ToastStoryShell {...args}>
      <div className='flex flex-wrap gap-3'>
        <TriggerButton
          label='Default swipe'
          onClick={() => {
            toast({
              id: 'swipe-default-toast',
              title: 'Swipe down to dismiss',
              description:
                'Bottom placements default to a downward swipe. Drag the toast past the threshold to remove it.'
            });
          }}
        />
        <TriggerButton
          label='Right-swipe override'
          onClick={() => {
            toast({
              id: 'swipe-right-toast',
              title: 'Swipe right to dismiss',
              description: 'This toast overrides the provider default with a rightward swipe gesture.',
              swipeDirection: 'right'
            });
          }}
        />
      </div>
    </ToastStoryShell>
  )
};

/**
 * Demonstrates hover, focus-within, and window-blur pause hooks on a long-running timed toast.
 */
export const PauseBehaviors: Story = {
  args: { defaultDuration: 8000 },
  render: (args) => (
    <ToastStoryShell {...args}>
      <TriggerButton
        label='Show pausable toast'
        onClick={() => {
          toast({
            id: 'pause-behaviors-toast',
            title: 'Investigating logs',
            description: 'Hover, focus the action, or switch windows to pause the remaining timer.',
            action: {
              label: 'Inspect',
              onAction: () => action('inspect-click')()
            }
          });
        }}
      />
    </ToastStoryShell>
  )
};

/**
 * Demonstrates long content wrapping so the title, description, and actions remain readable at the viewport width limit.
 */
export const LongContent: Story = {
  args: { placement: 'bottom-end' },
  render: (args) => (
    <ToastStoryShell {...args}>
      <TriggerButton
        label='Show long-content toast'
        onClick={() => {
          toast({
            id: 'long-content-toast',
            title:
              'A long review summary still needs a stable accessible name even when the message wraps across multiple lines in the constrained viewport.',
            description:
              'This long supporting copy stresses wrapping, spacing, and overlap resilience without introducing horizontal overflow. It should stay readable in both light and dark themes, keep the dismiss control aligned after the message block, and preserve the action touch target.',
            action: {
              label: 'Review notes',
              onAction: () => action('review-notes')()
            },
            size: 'lg'
          });
        }}
      />
    </ToastStoryShell>
  )
};

/**
 * Demonstrates the named landmark region used by `F6` / `Shift+F6` keyboard navigation.
 */
export const KeyboardLandmarkNavigation: Story = {
  render: (args) => (
    <ToastStoryShell {...args}>
      <div className='flex flex-col items-start gap-3'>
        <Button text='Focusable control before the region' variant='secondary' />
        <TriggerButton
          label='Spawn keyboard toast'
          onClick={() => {
            toast({
              id: 'keyboard-landmark-toast',
              title: 'Keyboard landmark ready',
              description: 'Press F6 to move focus into the notifications region, then Shift+F6 to return.'
            });
          }}
        />
      </div>
    </ToastStoryShell>
  )
};

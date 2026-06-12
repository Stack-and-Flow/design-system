import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Alert } from './Alert';

/**
 * ## Description
 * Alert renders assertive inline feedback for important status, warning, success, or error messaging.
 *
 * ## Dependencies
 * Uses the design-system `Icon` component for the default leading indicator and close affordance.
 *
 * ## Usage Guide
 * Use Alert for inline messages that should be announced immediately with `role="alert"`. Provide at least one of `title`, `subtitle`, or `children`. Use `dismissible` only when the user should be able to remove the message, and prefer `endContent` for secondary actions or metadata.
 */
const meta: Meta<typeof Alert> = {
  title: 'Atoms/Alert',
  component: Alert,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Alert>;

/**
 * Shows the default informational alert using the approved default variants.
 */
export const Default: Story = {
  args: {
    title: 'Connection restored',
    subtitle: 'Everything is back online and syncing normally.'
  }
};

/**
 * Shows the uncontrolled dismissible behavior with the built-in close button.
 */
export const DismissibleUncontrolled: Story = {
  args: {
    title: 'Updates available',
    subtitle: 'Install the latest release to access new fixes and components.',
    dismissible: true,
    onOpenChange: action('open-change')
  }
};

/**
 * Shows a controlled dismissible alert that can be reopened by the parent.
 */
export const DismissibleControlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    return (
      <div className='flex w-[42rem] max-w-[calc(100vw-2rem)] flex-col gap-4'>
        <Button
          onClick={() => {
            setOpen(true);
            action('reopen-click')();
          }}
          text='Reopen alert'
          variant='secondary'
        />
        <Alert
          {...args}
          onOpenChange={(nextOpen) => {
            action('open-change')(nextOpen);
            setOpen(nextOpen);
          }}
          open={open}
        />
      </div>
    );
  },
  args: {
    title: 'Billing reminder',
    subtitle: 'Your subscription renews in three days.',
    dismissible: true
  }
};

/**
 * Shows the solid alert variant across semantic colors.
 */
export const VariantSolid: Story = {
  render: () => (
    <div className='grid w-[42rem] max-w-[calc(100vw-2rem)] gap-4'>
      <Alert color='primary' subtitle='Primary solid treatment.' title='Primary' variant='solid' />
      <Alert color='success' subtitle='Success solid treatment.' title='Success' variant='solid' />
      <Alert color='warning' subtitle='Warning solid treatment.' title='Warning' variant='solid' />
      <Alert color='danger' subtitle='Danger solid treatment.' title='Danger' variant='solid' />
    </div>
  )
};

/**
 * Shows the bordered alert variant across semantic colors.
 */
export const VariantBordered: Story = {
  render: () => (
    <div className='grid w-[42rem] max-w-[calc(100vw-2rem)] gap-4'>
      <Alert color='primary' subtitle='Primary bordered treatment.' title='Primary' variant='bordered' />
      <Alert color='success' subtitle='Success bordered treatment.' title='Success' variant='bordered' />
      <Alert color='warning' subtitle='Warning bordered treatment.' title='Warning' variant='bordered' />
      <Alert color='danger' subtitle='Danger bordered treatment.' title='Danger' variant='bordered' />
    </div>
  )
};

/**
 * Shows the flat alert variant across semantic colors.
 */
export const VariantFlat: Story = {
  render: () => (
    <div className='grid w-[42rem] max-w-[calc(100vw-2rem)] gap-4'>
      <Alert color='primary' subtitle='Primary flat treatment.' title='Primary' variant='flat' />
      <Alert color='success' subtitle='Success flat treatment.' title='Success' variant='flat' />
      <Alert color='warning' subtitle='Warning flat treatment.' title='Warning' variant='flat' />
      <Alert color='danger' subtitle='Danger flat treatment.' title='Danger' variant='flat' />
    </div>
  )
};

/**
 * Shows a custom token-backed status surface using the opaque semantic background tokens.
 */
export const CustomColor: Story = {
  args: {
    title: 'Informational note',
    subtitle: 'Use className and custom startContent when the alert needs a non-standard semantic color.',
    className: 'border-info-light bg-info-surface-light dark:border-info dark:bg-info-surface-dark',
    startContent: (
      <Icon color='text-info-light' colorDark='dark:text-info' decorative={true} name='badge-info' size={20} />
    )
  }
};

/**
 * Shows the title-only layout with the close button aligned to the title row.
 */
export const TitleOnlyDismissible: Story = {
  args: {
    title: 'Title-only alert',
    dismissible: true,
    onOpenChange: action('open-change')
  }
};

/**
 * Shows custom slot content overriding the default icon and adding a trailing action.
 */
export const CustomStartAndEndContent: Story = {
  args: {
    title: 'Deployment paused',
    subtitle: 'A reviewer must approve the release before it can continue.',
    startContent: <Icon color='text-current' decorative={true} name='shield-alert' size={20} />,
    endContent: <Button onClick={action('review-click')} size='xs' text='Review now' variant='primary' />
  }
};

/**
 * Shows a parent-controlled visibility toggle starting from a closed state.
 */
export const InitiallyClosedVisibilityToggle: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className='flex w-[42rem] max-w-[calc(100vw-2rem)] flex-col gap-4'>
        <Button
          onClick={() => {
            setOpen((currentOpen) => !currentOpen);
            action('toggle-click')();
          }}
          text={open ? 'Hide alert' : 'Show alert'}
          variant='secondary'
        />
        <Alert {...args} onOpenChange={action('open-change')} open={open} />
      </div>
    );
  },
  args: {
    title: 'Preview mode enabled',
    subtitle: 'Only invited reviewers can see the unpublished changes.'
  }
};

/**
 * Shows rich description content with inline HTML elements.
 */
export const RichDescriptionContent: Story = {
  args: {
    title: 'Review required',
    subtitle: (
      <span>
        The description accepts <strong>rich inline HTML</strong>, including{' '}
        <a
          className='font-semibold text-current underline underline-offset-2'
          href='https://github.com/Stack-and-Flow/design-system/issues/13'
        >
          contextual links
        </a>
        .
      </span>
    ),
    color: 'warning'
  }
};

/**
 * Shows multiline content wrapping without breaking the trailing controls.
 */
export const LongMultilineContent: Story = {
  args: {
    title: 'Migration scheduled for tonight',
    subtitle:
      'Some services may be briefly unavailable while the schema update runs. Watch the status page for progress and wait for the final confirmation before retrying pending jobs.',
    children:
      'If you are operating a long-running workflow, save your current state now so you can safely resume once maintenance has completed.',
    dismissible: true,
    endContent: <span className='text-xs font-semibold uppercase tracking-ui'>Maintenance</span>
  }
};

import { Button } from '@atoms/button';
import { buttonVariants } from '@atoms/button/types';
import { Icon } from '@atoms/icon';
import { Input } from '@atoms/input';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentPropsWithoutRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Popover } from './Popover';

type TriggerButtonProps = ComponentPropsWithoutRef<'button'>;

const TriggerButton = ({ children, className, type = 'button', ...props }: TriggerButtonProps) => (
  <button {...props} className={cn(buttonVariants({ variant: 'primary' }), className)} type={type}>
    {children}
  </button>
);

/**
 * ## Description
 * Popover displays rich non-modal dialog content in a floating layer anchored to a trigger while preserving Stack-and-Flow surface, focus, and accessibility rules.
 *
 * ## Dependencies
 * These stories use `Button`, `Input`, and `Icon` to demonstrate real interactive content and trigger composition.
 *
 * ## Usage Guide
 * Compose the component with the canonical compound API: `Popover`, `Popover.Trigger`, `Popover.Content`, `Popover.Arrow`, `Popover.Header`, `Popover.Body`, and `Popover.Footer`.
 * `Popover.Content` always exposes non-modal dialog semantics and must have an accessible name from `Popover.Header`, `ariaLabel`, or `ariaLabelledBy`.
 */
const meta: Meta<typeof Popover> = {
  title: 'Atoms/Popover',
  component: Popover,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Popover>;

/**
 * Shows the default opaque floating surface with a labelled header and body.
 */
export const Default: Story = {
  render: () => (
    <Popover onOpenChange={action('open-change')}>
      <Popover.Trigger>
        <TriggerButton>Open popover</TriggerButton>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>Profile details</Popover.Header>
        <Popover.Body>Use Popover for rich contextual content that remains connected to its trigger.</Popover.Body>
      </Popover.Content>
    </Popover>
  )
};

/**
 * Shows the optional arrow slot aligned with the content surface.
 */
export const WithArrow: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <TriggerButton>Open with arrow</TriggerButton>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Header>Arrow enabled</Popover.Header>
        <Popover.Body>The arrow is rendered by adding the dedicated slot.</Popover.Body>
      </Popover.Content>
    </Popover>
  )
};

/**
 * Shows all supported placements for the content panel.
 */
export const Placements: Story = {
  render: () => (
    <div className='flex min-h-80 flex-wrap items-center justify-center gap-4 p-8'>
      <Popover>
        <Popover.Trigger>
          <TriggerButton>top</TriggerButton>
        </Popover.Trigger>
        <Popover.Content placement='top'>
          <Popover.Header>top placement</Popover.Header>
          <Popover.Body>Collision handling stays enabled by default.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>right</TriggerButton>
        </Popover.Trigger>
        <Popover.Content placement='right'>
          <Popover.Header>right placement</Popover.Header>
          <Popover.Body>Collision handling stays enabled by default.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>bottom</TriggerButton>
        </Popover.Trigger>
        <Popover.Content placement='bottom'>
          <Popover.Header>bottom placement</Popover.Header>
          <Popover.Body>Collision handling stays enabled by default.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>left</TriggerButton>
        </Popover.Trigger>
        <Popover.Content placement='left'>
          <Popover.Header>left placement</Popover.Header>
          <Popover.Body>Collision handling stays enabled by default.</Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  )
};

/**
 * Shows controlled open state owned by the consumer.
 */
export const ControlledOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <Popover.Trigger>
          <TriggerButton>{open ? 'Close popover' : 'Open controlled popover'}</TriggerButton>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>Controlled state</Popover.Header>
          <Popover.Body>The consumer owns the visibility state and receives every state change.</Popover.Body>
        </Popover.Content>
      </Popover>
    );
  }
};

/**
 * Shows header, body, and footer slots with contextual actions.
 */
export const HeaderBodyFooter: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <TriggerButton>Open actions</TriggerButton>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>Unsaved changes</Popover.Header>
        <Popover.Body>Review your updates before leaving this section.</Popover.Body>
        <Popover.Footer>
          <Button emphasis='flat' onClick={action('cancel')} text='Cancel' variant='ghost' />
          <Button onClick={action('save')} text='Save changes' variant='primary' />
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  )
};

/**
 * Shows interactive form content inside the floating panel.
 */
export const InteractiveFormContent: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <TriggerButton>Quick edit</TriggerButton>
      </Popover.Trigger>
      <Popover.Content size='lg'>
        <Popover.Header>Rename project</Popover.Header>
        <Popover.Body className='grid gap-3'>
          <Input aria-label='Project name' id='popover-project-name' placeholder='Stack-and-Flow' />
          <Input aria-label='Project description' id='popover-project-description' placeholder='Optional description' />
        </Popover.Body>
        <Popover.Footer>
          <Button emphasis='flat' onClick={action('dismiss')} text='Dismiss' variant='ghost' />
          <Button onClick={action('submit')} text='Update' variant='primary' />
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  )
};

/**
 * Shows a custom icon trigger composed through the trigger slot.
 */
export const CustomTrigger: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <button className={buttonVariants({ variant: 'primary' })} type='button'>
          <span className='inline-flex items-center gap-2'>
            <Icon decorative={true} name='ellipsis' />
            More actions
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>Custom trigger</Popover.Header>
        <Popover.Body>The trigger slot supports custom button content and icon composition.</Popover.Body>
      </Popover.Content>
    </Popover>
  )
};

/**
 * Shows the supported content size variants.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex min-h-72 flex-wrap items-start gap-4 p-8'>
      <Popover>
        <Popover.Trigger>
          <TriggerButton>sm</TriggerButton>
        </Popover.Trigger>
        <Popover.Content size='sm'>
          <Popover.Header>SM size</Popover.Header>
          <Popover.Body>Panel spacing and width scale with the selected size variant.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>md</TriggerButton>
        </Popover.Trigger>
        <Popover.Content size='md'>
          <Popover.Header>MD size</Popover.Header>
          <Popover.Body>Panel spacing and width scale with the selected size variant.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>lg</TriggerButton>
        </Popover.Trigger>
        <Popover.Content size='lg'>
          <Popover.Header>LG size</Popover.Header>
          <Popover.Body>Panel spacing and width scale with the selected size variant.</Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  )
};

/**
 * Shows the available accent colors using the same content structure.
 */
export const ColorAccents: Story = {
  render: () => (
    <div className='flex min-h-80 flex-wrap items-start gap-4 p-8'>
      <Popover>
        <Popover.Trigger>
          <TriggerButton>neutral</TriggerButton>
        </Popover.Trigger>
        <Popover.Content color='neutral'>
          <Popover.Header>neutral accent</Popover.Header>
          <Popover.Body>Accent color applies to the header and related floating details.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>primary</TriggerButton>
        </Popover.Trigger>
        <Popover.Content color='primary'>
          <Popover.Header>primary accent</Popover.Header>
          <Popover.Body>Accent color applies to the header and related floating details.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>secondary</TriggerButton>
        </Popover.Trigger>
        <Popover.Content color='secondary'>
          <Popover.Header>secondary accent</Popover.Header>
          <Popover.Body>Accent color applies to the header and related floating details.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>success</TriggerButton>
        </Popover.Trigger>
        <Popover.Content color='success'>
          <Popover.Header>success accent</Popover.Header>
          <Popover.Body>Accent color applies to the header and related floating details.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>warning</TriggerButton>
        </Popover.Trigger>
        <Popover.Content color='warning'>
          <Popover.Header>warning accent</Popover.Header>
          <Popover.Body>Accent color applies to the header and related floating details.</Popover.Body>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger>
          <TriggerButton>danger</TriggerButton>
        </Popover.Trigger>
        <Popover.Content color='danger'>
          <Popover.Header>danger accent</Popover.Header>
          <Popover.Body>Accent color applies to the header and related floating details.</Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  )
};

/**
 * Shows the frosted non-default surface variant.
 */
export const FrostedVariant: Story = {
  render: () => (
    <div className='rounded-xl bg-page-dark p-10'>
      <Popover>
        <Popover.Trigger>
          <TriggerButton>Open frosted</TriggerButton>
        </Popover.Trigger>
        <Popover.Content variant='frosted'>
          <Popover.Arrow />
          <Popover.Header>Frosted surface</Popover.Header>
          <Popover.Body>
            This variant uses the approved floating blur treatment instead of the opaque default.
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  )
};

/**
 * Shows the non-interactive disabled trigger state.
 */
export const DisabledTrigger: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger disabled={true}>
        <TriggerButton>Disabled trigger</TriggerButton>
      </Popover.Trigger>
      <Popover.Content ariaLabel='Disabled trigger popover'>
        This content should not open while the trigger is disabled.
      </Popover.Content>
    </Popover>
  )
};

/**
 * Shows a scoped dark-mode portal without requiring full-page dark mode.
 */
export const DarkMode: Story = {
  render: () => (
    <div className='dark rounded-xl bg-background-dark p-10 text-text-dark'>
      <Popover>
        <Popover.Trigger>
          <TriggerButton>Open dark scope</TriggerButton>
        </Popover.Trigger>
        <Popover.Content variant='frosted'>
          <Popover.Arrow />
          <Popover.Header>Scoped dark portal</Popover.Header>
          <Popover.Body>
            The content portal keeps the local dark-mode scope when rendered outside the DOM tree.
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  )
};

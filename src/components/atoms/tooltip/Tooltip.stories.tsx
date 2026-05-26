import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { Tooltip } from './Tooltip';

/**
 * ## Description
 * Tooltip displays short contextual help for a trigger without taking permanent layout space.
 *
 * ## Dependencies
 * Uses `Button` and `IconButton` to demonstrate text and icon triggers.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

/**
 * Shows the default tooltip behavior with hover and focus support.
 */
export const Default: Story = {
  args: {
    content: 'Helpful tooltip text',
    children: <Button text='Hover me' />
  }
};

/**
 * Shows that disabled tooltips do not attach behavior to the trigger.
 */
export const Disabled: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip content='Enabled tooltip'>
        <Button text='Enabled tooltip' />
      </Tooltip>
      <Tooltip content='Disabled tooltip' disabled={true}>
        <Button text='Disabled tooltip' />
      </Tooltip>
    </section>
  )
};

/**
 * Shows the available color variants.
 */
export const Colors: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip content='Default tooltip'>
        <Button text='Default' />
      </Tooltip>
      <Tooltip content='Primary tooltip' color='primary'>
        <Button text='Primary' />
      </Tooltip>
      <Tooltip content='Success tooltip' color='success'>
        <Button text='Success' />
      </Tooltip>
      <Tooltip content='Warning tooltip' color='warning'>
        <Button text='Warning' />
      </Tooltip>
      <Tooltip content='Transparent tooltip' color='transparent'>
        <Button text='Transparent' />
      </Tooltip>
    </section>
  )
};

/**
 * Shows the supported tooltip positions.
 */
export const Positions: Story = {
  render: () => (
    <section className='flex flex-col items-center gap-2'>
      <section className='flex gap-4'>
        <Tooltip content='Top start' position='top-start'>
          <Button text='Top start' />
        </Tooltip>
        <Tooltip content='Top' position='top'>
          <Button text='Top' />
        </Tooltip>
        <Tooltip content='Top end' position='top-end'>
          <Button text='Top end' />
        </Tooltip>
      </section>
      <section className='flex gap-4'>
        <section className='flex flex-col items-start gap-2'>
          <Tooltip content='Left start' position='left-start'>
            <Button text='Left start' />
          </Tooltip>
          <Tooltip content='Left' position='left'>
            <Button text='Left' />
          </Tooltip>
          <Tooltip content='Left end' position='left-end'>
            <Button text='Left end' />
          </Tooltip>
        </section>
        <section className='flex flex-col items-end gap-2'>
          <Tooltip content='Right start' position='right-start'>
            <Button text='Right start' />
          </Tooltip>
          <Tooltip content='Right' position='right'>
            <Button text='Right' />
          </Tooltip>
          <Tooltip content='Right end' position='right-end'>
            <Button text='Right end' />
          </Tooltip>
        </section>
      </section>
      <section className='flex gap-4'>
        <Tooltip content='Bottom start' position='bottom-start'>
          <Button text='Bottom start' />
        </Tooltip>
        <Tooltip content='Bottom' position='bottom'>
          <Button text='Bottom' />
        </Tooltip>
        <Tooltip content='Bottom end' position='bottom-end'>
          <Button text='Bottom end' />
        </Tooltip>
      </section>
    </section>
  )
};

/**
 * Shows how the trigger interaction can switch between focus and click modes.
 */
export const TriggerInteraction: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip content='Focus trigger' triggerInteraction='focus'>
        <Button text='Focus trigger' />
      </Tooltip>
      <Tooltip content='Click trigger' triggerInteraction='click'>
        <Button text='Click trigger' />
      </Tooltip>
    </section>
  )
};

/**
 * Shows the display delay options.
 */
export const Delay: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip content='Default delay'>
        <Button text='Default delay' />
      </Tooltip>
      <Tooltip content='Delay 800ms' delayMs={800}>
        <Button text='Delay 800ms' />
      </Tooltip>
      <Tooltip content='Hide delay 800ms' delayHide={800}>
        <Button text='Hide delay 800ms' />
      </Tooltip>
    </section>
  )
};

/**
 * Shows the arrow complement for each supported direction.
 */
export const WithArrow: Story = {
  render: () => (
    <section className='flex flex-col gap-4'>
      <Tooltip content='Arrow bottom' complement='arrow-bottom'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Arrow right' position='left' complement='arrow-right'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Arrow left' position='right' complement='arrow-left'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Arrow top' position='bottom' complement='arrow-top'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
    </section>
  )
};

/**
 * Shows the available width variants.
 */
export const Widths: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
        width='default'
      >
        <Button text='Default width' />
      </Tooltip>
      <Tooltip
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
        width='md'
      >
        <Button text='Medium width' />
      </Tooltip>
      <Tooltip
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
        width='xl'
      >
        <Button text='Extra large width' />
      </Tooltip>
    </section>
  )
};

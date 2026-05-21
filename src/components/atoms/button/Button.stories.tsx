import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * ## Description
 * Button is the primary interactive element for triggering actions.
 *
 * ## Dependencies
 * Uses Lucide icons through the `icon` prop and `spinners-react` for loading feedback.
 *
 * ## Usage Guide
 * Use `primary` for the main action, `secondary` or `outlined` for supporting actions, and `ghost` or `light` for low-emphasis actions. Use `size='xs'` for dense controls with lower height and tighter padding. Use `emphasis='flat'` when a variant needs a quieter decorative treatment without removing accessible focus feedback. Use `isLoading` while async work is pending so repeated submissions are blocked.
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Button>;

/**
 * Shows the default button configuration using its default variants.
 */
export const Default: Story = {
  args: {
    text: 'Button',
    onClick: action('button-click')
  }
};

/**
 * Shows the visual hierarchy available through the variant prop.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' onClick={action('primary-click')} />
      <Button text='Secondary' variant='secondary' onClick={action('secondary-click')} />
      <Button text='Outlined' variant='outlined' onClick={action('outlined-click')} />
      <Button text='Ghost' variant='ghost' onClick={action('ghost-click')} />
      <Button text='Light' variant='light' onClick={action('light-click')} />
    </div>
  )
};

/**
 * Shows the semantic decorative emphasis toggle while preserving focus-visible behavior.
 */
export const Emphasis: Story = {
  render: () => (
    <div className='grid gap-4'>
      <div className='flex gap-4 items-center flex-wrap'>
        <Button text='Primary default' variant='primary' onClick={action('primary-default-click')} />
        <Button text='Primary flat' variant='primary' emphasis='flat' onClick={action('primary-flat-click')} />
      </div>
      <div className='flex gap-4 items-center flex-wrap'>
        <Button text='Secondary default' variant='secondary' onClick={action('secondary-default-click')} />
        <Button text='Secondary flat' variant='secondary' emphasis='flat' onClick={action('secondary-flat-click')} />
      </div>
    </div>
  )
};

/**
 * Shows the full `xs` to `lg` size scale with `xs` visibly shorter than `sm`.
 */
export const Size: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Extra small' size='xs' onClick={action('xs-click')} />
      <Button text='Small' size='sm' onClick={action('small-click')} />
      <Button text='Medium' size='md' onClick={action('medium-click')} />
      <Button text='Large' size='lg' onClick={action('large-click')} />
    </div>
  )
};

/**
 * Shows leading icon support across variants.
 */
export const WithIcon: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' icon='arrow-right' onClick={action('primary-icon-click')} />
      <Button text='Secondary' variant='secondary' icon='download' onClick={action('secondary-icon-click')} />
      <Button text='Outlined' variant='outlined' icon='pencil' onClick={action('outlined-icon-click')} />
      <Button text='Ghost' variant='ghost' icon='trash' onClick={action('ghost-icon-click')} />
      <Button text='Light' variant='light' icon='external-link' onClick={action('light-icon-click')} />
    </div>
  )
};

/**
 * Shows the loading state used while async work is pending.
 */
export const Loading: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' isLoading={true} onClick={action('loading-primary-click')} />
      <Button text='Secondary' variant='secondary' isLoading={true} onClick={action('loading-secondary-click')} />
      <Button text='Outlined' variant='outlined' isLoading={true} onClick={action('loading-outlined-click')} />
      <Button text='Ghost' variant='ghost' isLoading={true} onClick={action('loading-ghost-click')} />
      <Button text='Light' variant='light' isLoading={true} onClick={action('loading-light-click')} />
    </div>
  )
};

/**
 * Shows the non-interactive disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Primary' variant='primary' disabled={true} onClick={action('disabled-primary-click')} />
      <Button text='Secondary' variant='secondary' disabled={true} onClick={action('disabled-secondary-click')} />
      <Button text='Outlined' variant='outlined' disabled={true} onClick={action('disabled-outlined-click')} />
      <Button text='Ghost' variant='ghost' disabled={true} onClick={action('disabled-ghost-click')} />
      <Button text='Light' variant='light' disabled={true} onClick={action('disabled-light-click')} />
    </div>
  )
};

/**
 * Shows the rounded shape toggle.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Rounded' rounded={true} onClick={action('rounded-click')} />
      <Button text='Not rounded' rounded={false} onClick={action('not-rounded-click')} />
    </div>
  )
};

/**
 * Shows optional uppercase text styling.
 */
export const Uppercase: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Normal case' uppercase={false} onClick={action('normal-case-click')} />
      <Button text='Uppercase' uppercase={true} onClick={action('uppercase-click')} />
    </div>
  )
};

/**
 * Shows the full-width layout for constrained containers.
 */
export const FullWidth: Story = {
  render: () => (
    <div className='flex flex-col gap-4 w-80'>
      <Button text='Primary' variant='primary' isFullWidth={true} onClick={action('full-primary-click')} />
      <Button text='Secondary' variant='secondary' isFullWidth={true} onClick={action('full-secondary-click')} />
      <Button text='Outlined' variant='outlined' isFullWidth={true} onClick={action('full-outlined-click')} />
    </div>
  )
};

/**
 * Shows toggle-button semantics through aria-pressed.
 */
export const Pressed: Story = {
  render: () => (
    <div className='flex gap-4 items-center flex-wrap'>
      <Button text='Unpressed' variant='outlined' aria-pressed={false} onClick={action('unpressed-click')} />
      <Button text='Pressed' variant='primary' aria-pressed={true} onClick={action('pressed-click')} />
    </div>
  )
};

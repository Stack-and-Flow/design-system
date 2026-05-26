import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { Text } from '../text';
import { Input } from './Input';

/**
 * ## Description
 * Input lets users enter and edit short form values. It supports labels, placeholders, validation hints,
 * adornments, native input attributes, and token-backed visual variants for common form layouts.
 *
 * ## Dependencies
 * Uses `Icon` for inline adornment and validation status examples. Uses `Text` to show text adornments.
 *
 * ## Usage Guide
 * Provide a visible `label` when possible. When a visual label is not appropriate, pass `aria-label` or
 * `aria-labelledby` so the input still has an accessible name.
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * Shows the default input configuration using its default visual variants.
 */
export const Default: Story = {
  args: {
    id: 'input-default',
    label: 'Email',
    placeholder: 'name@example.com',
    onChange: action('change')
  }
};

/**
 * Shows the underlined visual variant.
 */
export const Underlined: Story = {
  args: {
    ...Default.args,
    id: 'input-underlined',
    variant: 'underlined'
  }
};

/**
 * Shows the single-line visual variant.
 */
export const Line: Story = {
  args: {
    ...Default.args,
    id: 'input-line',
    variant: 'line'
  }
};

/**
 * Shows the bordered visual variant.
 */
export const Bordered: Story = {
  args: {
    ...Default.args,
    id: 'input-bordered',
    variant: 'bordered'
  }
};

/**
 * Shows the available size axis without mixing other variants.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Input id='input-size-sm' label='Small' size='sm' defaultValue='Small value' onChange={action('small change')} />
      <Input
        id='input-size-md'
        label='Medium'
        size='md'
        defaultValue='Medium value'
        onChange={action('medium change')}
      />
      <Input id='input-size-lg' label='Large' size='lg' defaultValue='Large value' onChange={action('large change')} />
    </div>
  )
};

/**
 * Shows the rounded shape axis.
 */
export const Rounded: Story = {
  args: {
    ...Default.args,
    id: 'input-rounded',
    rounded: true
  }
};

/**
 * Shows required field affordance and native required semantics.
 */
export const Required: Story = {
  args: {
    ...Default.args,
    id: 'input-required',
    isRequired: true
  }
};

/**
 * Shows validation and helper hint tones.
 */
export const HintStates: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Input id='input-hint-error' label='Error' hint={{ type: 'error', message: 'This field is required.' }} />
      <Input id='input-hint-warning' label='Warning' hint={{ type: 'warning', message: 'Double-check this value.' }} />
      <Input id='input-hint-success' label='Success' hint={{ type: 'success', message: 'Looks good.' }} />
      <Input id='input-hint-info' label='Info' hint={{ type: 'info', message: 'Use your primary email.' }} />
    </div>
  )
};

/**
 * Shows the non-interactive disabled state.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'input-disabled',
    disabled: true
  }
};

/**
 * Shows the password input with an accessible visibility toggle.
 */
export const Password: Story = {
  args: {
    id: 'input-password',
    label: 'Password',
    type: 'password',
    onChange: action('password change')
  }
};

/**
 * Shows number input controls.
 */
export const NumberInput: Story = {
  args: {
    id: 'input-number',
    label: 'Quantity',
    type: 'number',
    defaultValue: 1,
    onChange: action('number change')
  }
};

/**
 * Shows common native input type variants.
 */
export const TypeVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Input id='input-type-text' label='Text' type='text' onChange={action('text change')} />
      <Input id='input-type-email' label='Email' type='email' onChange={action('email change')} />
      <Input id='input-type-tel' label='Phone' type='tel' onChange={action('phone change')} />
      <Input id='input-type-url' label='Website' type='url' onChange={action('url change')} />
      <Input id='input-type-search' label='Search' type='search' onChange={action('search change')} />
    </div>
  )
};

/**
 * Shows start and end content slots for prefixes, suffixes, and icons.
 */
export const StartAndEndContent: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Input
        id='input-start-end-text'
        label='Amount'
        placeholder='0.00'
        startContent={
          <Text tag='small' className='font-medium text-text-secondary-light dark:text-text-secondary-dark'>
            $
          </Text>
        }
        endContent={
          <Text tag='small' className='font-medium text-text-secondary-light dark:text-text-secondary-dark'>
            USD
          </Text>
        }
        onChange={action('amount change')}
      />
      <Input
        id='input-start-end-icon'
        type='email'
        label='Email'
        startContent={<Icon name='mail' tone='muted' decorative={true} />}
        endContent={
          <Text tag='small' className='font-medium text-text-secondary-light dark:text-text-secondary-dark'>
            @example.com
          </Text>
        }
        onChange={action('email change')}
      />
    </div>
  )
};

/**
 * Shows full-width layout behavior.
 */
export const FullWidth: Story = {
  args: {
    ...Default.args,
    id: 'input-full-width',
    isFullWidth: true
  },
  decorators: [
    (StoryComponent) => (
      <div className='w-full max-w-modal-md'>
        <StoryComponent />
      </div>
    )
  ]
};

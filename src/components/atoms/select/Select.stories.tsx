import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { Select } from './Select';

/**
 * ## Description
 * Select lets users choose a single option from a dropdown list. It supports labels, placeholders,
 * validation hints, keyboard navigation with type-ahead, clearable selection, and token-backed visual variants.
 *
 * ## Dependencies
 * Uses `Icon` for the chevron indicator and clear button. Uses `SpinnerCircular` from `spinners-react` for loading feedback.
 *
 * ## Usage Guide
 * Provide an `options` array with `{ key, label }` objects. Use `defaultValue` for uncontrolled usage
 * and `value` + `onChange` for controlled. Set `isClearable` to allow clearing the current selection.
 */
const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Select>;

const defaultOptions = [
  { key: 'ar', label: 'Argentina' },
  { key: 'br', label: 'Brazil' },
  { key: 'uy', label: 'Uruguay' },
  { key: 'cl', label: 'Chile' }
];

/**
 * Shows the default select configuration using its default variants.
 */
export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: defaultOptions,
    onChange: action('select-change')
  }
};

/**
 * Shows the available visual variants without mixing them with other prop axes.
 */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6'>
      <div className='w-48'>
        <Select
          label='Regular'
          variant='regular'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('regular-change')}
        />
      </div>
      <div className='w-48'>
        <Select
          label='Bordered'
          variant='bordered'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('bordered-change')}
        />
      </div>
      <div className='w-48'>
        <Select
          label='Faded'
          variant='faded'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('faded-change')}
        />
      </div>
      <div className='w-48'>
        <Select
          label='Underlined'
          variant='underlined'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('underlined-change')}
        />
      </div>
    </div>
  )
};

/**
 * Shows the supported size options side by side for visual comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-end gap-4'>
      <div className='w-48'>
        <Select
          label='Small'
          size='sm'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('sm-change')}
        />
      </div>
      <div className='w-48'>
        <Select
          label='Medium'
          size='md'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('md-change')}
        />
      </div>
      <div className='w-48'>
        <Select
          label='Large'
          size='lg'
          placeholder='Select...'
          options={defaultOptions}
          onChange={action('lg-change')}
        />
      </div>
    </div>
  )
};

/**
 * Shows the non-interactive disabled state.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true
  }
};

/**
 * Shows a select with a description helper text.
 */
export const WithDescription: Story = {
  args: {
    ...Default.args,
    description: 'This helps us localize content for you.'
  }
};

/**
 * Shows the invalid state with a highlighted border and error message.
 */
export const WithError: Story = {
  args: {
    ...Default.args,
    isInvalid: true,
    errorMessage: 'Country is required for shipping calculations.'
  }
};

/**
 * Shows the loading state with a spinner in the popover.
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true
  }
};

/**
 * Shows per-slot style overrides via the classNames API.
 */
export const WithClassNamesOverrides: Story = {
  render: () => (
    <Select
      label='Country'
      placeholder='Select a country'
      options={defaultOptions}
      classNames={{
        trigger: 'bg-brand-light/10 dark:bg-brand-dark/10',
        popover: 'bg-surface-raised-light dark:bg-surface-raised-dark',
        item: 'italic'
      }}
      onChange={action('class-names-overrides-change')}
    />
  )
};

/**
 * Shows scrolling behavior with a long list of options.
 */
export const LongList: Story = {
  render: () => (
    <Select
      label='Country'
      placeholder='Select a country'
      options={Array.from({ length: 50 }, (_, i) => ({
        key: String(i),
        label: `Option ${i + 1}`
      }))}
      onChange={action('long-list-change')}
    />
  )
};

/**
 * Shows options with icons via startContent across all variants.
 */
export const WithIcon: Story = {
  render: () => {
    const currencyOptions = [
      { key: 'usd', label: 'USD', startContent: <Icon name='dollar-sign' size={16} /> },
      { key: 'eur', label: 'EUR', startContent: <Icon name='euro' size={16} /> },
      { key: 'gbp', label: 'GBP', startContent: <Icon name='pound-sterling' size={16} /> }
    ];

    return (
      <div className='flex flex-wrap items-start gap-4'>
        <div className='w-48'>
          <Select
            label='Regular'
            variant='regular'
            placeholder='Currency'
            options={currencyOptions}
            onChange={action('icon-regular')}
          />
        </div>
        <div className='w-48'>
          <Select
            label='Bordered'
            variant='bordered'
            placeholder='Currency'
            options={currencyOptions}
            onChange={action('icon-bordered')}
          />
        </div>
        <div className='w-48'>
          <Select
            label='Faded'
            variant='faded'
            placeholder='Currency'
            options={currencyOptions}
            onChange={action('icon-faded')}
          />
        </div>
        <div className='w-48'>
          <Select
            label='Underlined'
            variant='underlined'
            placeholder='Currency'
            options={currencyOptions}
            onChange={action('icon-underlined')}
          />
        </div>
      </div>
    );
  }
};

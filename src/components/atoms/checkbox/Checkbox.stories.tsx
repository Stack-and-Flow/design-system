import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

/**
 * ## Description
 * Checkbox is a native checkbox-based atom for single binary choices. It supports controlled and uncontrolled state,
 * indeterminate selection, validation messaging, and strict accessible-name requirements without making label text clickable.
 *
 * ## Dependencies
 * Uses the `Text` atom internally to render visible label text, descriptions, and validation copy.
 *
 * ## Usage Guide
 * Use `label` for plain text labels and `labelHtml` only when sanitized inline formatting is required. The visual control is the only toggle hit area;
 * label, description, and error text are descriptive only. Pair `checked` with `onChange` for controlled usage, and use `indeterminate` for mixed-state presentation.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

/**
 * Shows the default checkbox configuration using the component defaults.
 */
export const Default: Story = {
  args: {
    label: 'Accept terms',
    onChange: action('checkbox-change')
  }
};

/**
 * Shows the checked visual state.
 */
export const Checked: Story = {
  args: {
    label: 'Receive updates',
    defaultChecked: true,
    onChange: action('checked-change')
  }
};

/**
 * Shows the non-interactive disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Checkbox label='Disabled unchecked' disabled={true} onChange={action('disabled-unchecked-change')} />
      <Checkbox
        label='Disabled checked'
        disabled={true}
        defaultChecked={true}
        onChange={action('disabled-checked-change')}
      />
    </div>
  )
};

/**
 * Shows the custom read-only behavior while preserving focusability.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Checkbox label='Read-only unchecked' readOnly={true} onChange={action('readonly-unchecked-change')} />
      <Checkbox
        label='Read-only checked'
        readOnly={true}
        defaultChecked={true}
        onChange={action('readonly-checked-change')}
      />
    </div>
  )
};

/**
 * Shows invalid semantics without additional helper copy.
 */
export const Invalid: Story = {
  args: {
    label: 'Required acknowledgement',
    invalid: true,
    onChange: action('invalid-change')
  }
};

/**
 * Shows validation messaging, which also implies invalid semantics.
 */
export const WithErrorMessage: Story = {
  args: {
    label: 'Terms acknowledgement',
    errorMessage: 'You must accept the terms before continuing.',
    onChange: action('error-message-change')
  }
};

/**
 * Shows helper description text associated through aria-describedby.
 */
export const WithDescription: Story = {
  args: {
    label: 'Email me product updates',
    description: 'We only send release notes and important service announcements.',
    onChange: action('description-change')
  }
};

/**
 * Shows the mixed-state indicator used for partial selection.
 */
export const Indeterminate: Story = {
  args: {
    label: 'Select all rows',
    checked: false,
    indeterminate: true,
    onChange: action('indeterminate-change')
  }
};

/**
 * Shows the size axis while preserving the control hit area.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Checkbox size='sm' label='Small checkbox' onChange={action('size-sm-change')} />
      <Checkbox size='md' label='Medium checkbox' onChange={action('size-md-change')} />
      <Checkbox size='lg' label='Large checkbox' onChange={action('size-lg-change')} />
    </div>
  )
};

/**
 * Shows the supported visual variants without mixing additional state axes.
 */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Checkbox
        variant='default'
        label='Default variant'
        defaultChecked={true}
        onChange={action('default-variant-change')}
      />
      <Checkbox
        variant='primary'
        label='Primary variant'
        defaultChecked={true}
        onChange={action('primary-variant-change')}
      />
      <Checkbox
        variant='secondary'
        label='Secondary variant'
        defaultChecked={true}
        onChange={action('secondary-variant-change')}
      />
      <Checkbox
        variant='danger'
        label='Danger variant'
        defaultChecked={true}
        onChange={action('danger-variant-change')}
      />
    </div>
  )
};

/**
 * Shows controlled state management through checked and onChange.
 */
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label={checked ? 'Enabled for this account' : 'Disabled for this account'}
        checked={checked}
        onChange={(nextChecked, event) => {
          action('controlled-change')(nextChecked, event);
          setChecked(nextChecked);
        }}
      />
    );
  }
};

/**
 * Shows a checkbox that relies on an aria-label instead of visible text.
 */
export const WithoutVisibleLabel: Story = {
  args: {
    ariaLabel: 'Select release candidate',
    onChange: action('aria-label-change')
  }
};

/**
 * Shows sanitized inline label HTML rendered through the Text atom.
 */
export const WithLabelHtml: Story = {
  args: {
    labelHtml: 'I agree to the <strong>privacy policy</strong>.',
    description: 'Inline formatting is allowed, but interactive HTML is removed.',
    onChange: action('label-html-change')
  }
};

/**
 * Shows the checkbox on a dark surface when the light and dark presentation differs.
 */
export const DarkSurface: Story = {
  render: () => (
    <div className='dark rounded-lg bg-background-dark p-6'>
      <Checkbox
        label='Enable deployment notifications'
        description='This preview renders the control against the dark theme surface.'
        defaultChecked={true}
        onChange={action('dark-surface-change')}
      />
    </div>
  )
};

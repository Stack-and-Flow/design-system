import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextArea } from './TextArea';

/**
 * ## Description
 * TextArea renders an accessible native multiline text field for longer form content.
 * It follows the local Input label, hint, status, variant, and sizing conventions while adding multiline rows, resize, and autosize behavior.
 *
 * ## Dependencies
 * Uses `Icon` indirectly for semantic hint icons so hints match other form controls in the design system.
 *
 * ## Usage Guide
 * Prefer a visible `label` whenever possible. Use `hint` for help, validation, and status messages; use `autosize` only when the field should grow with content.
 */
const meta: Meta<typeof TextArea> = {
  title: 'Atoms/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TextArea>;

/**
 * Demonstrates the default uncontrolled multiline field with a visible label and placeholder for baseline form usage.
 */
export const Default: Story = {
  args: {
    id: 'textarea-default',
    label: 'Message',
    placeholder: 'Write your message',
    onChange: action('textarea-change'),
    onValueChange: action('textarea-value-change')
  }
};

/**
 * Demonstrates controlled value ownership through `onValueChange`, matching common form-state integrations.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('Stack-and-Flow components are built with native semantics first.');

    return (
      <TextArea
        id='textarea-controlled'
        label='Controlled message'
        value={value}
        onValueChange={(nextValue) => {
          action('textarea-controlled-value-change')(nextValue);
          setValue(nextValue);
        }}
      />
    );
  }
};

/**
 * Compares the supported local visual variants so reviewers can verify parity with Input without HeroUI-only variants.
 */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6 rounded-xl bg-background-light p-4 dark:bg-background-dark'>
      <TextArea id='textarea-regular' label='Regular' variant='regular' placeholder='Regular surface' />
      <TextArea id='textarea-bordered' label='Bordered' variant='bordered' placeholder='Stronger border' />
      <TextArea id='textarea-underlined' label='Underlined' variant='underlined' placeholder='Underlined surface' />
      <TextArea id='textarea-line' label='Line' variant='line' placeholder='Bottom border only' />
    </div>
  )
};

/**
 * Compares small, medium, and large sizes with textarea-appropriate minimum heights and typography.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6'>
      <TextArea id='textarea-small' label='Small' size='sm' placeholder='Small textarea' />
      <TextArea id='textarea-medium' label='Medium' size='md' placeholder='Medium textarea' />
      <TextArea id='textarea-large' label='Large' size='lg' placeholder='Large textarea' />
    </div>
  )
};

/**
 * Shows disabled, read-only, and required states together because they have different native semantics and interaction behavior.
 */
export const States: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6'>
      <TextArea id='textarea-disabled' label='Disabled' disabled={true} defaultValue='Disabled content' />
      <TextArea id='textarea-readonly' label='Read only' readOnly={true} defaultValue='Read-only content' />
      <TextArea id='textarea-required' label='Required' isRequired={true} placeholder='Required message' />
    </div>
  )
};

/**
 * Provides deterministic visual fixtures for default, hover-like, and focus-like surfaces without requiring pointer or keyboard interaction.
 */
export const InteractionStates: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6 rounded-xl bg-background-light p-4 dark:bg-background-dark'>
      <TextArea id='textarea-static-default' label='Default' placeholder='Default surface' />
      <TextArea
        id='textarea-static-hover'
        label='Hover'
        placeholder='Hover-like surface'
        className='border-border-strong-light bg-surface-raised-light dark:border-border-strong-dark dark:bg-surface-raised-dark'
      />
      <TextArea
        id='textarea-static-focus'
        label='Focus'
        placeholder='Focus-like surface'
        className='!border-brand-light/50 shadow-glow-input-focus-light dark:!border-brand-dark/50 dark:shadow-glow-input-focus'
      />
    </div>
  )
};

/**
 * Demonstrates each semantic hint tone and how the hint message drives default visual status when `status` is not explicit.
 * TextArea reuses Input hint colors, so this story also guards shared hint contrast.
 */
export const ValidationStates: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6 rounded-xl bg-background-light p-4 dark:bg-background-dark'>
      <TextArea id='textarea-error' label='Error' hint={{ message: 'Message is required', type: 'error' }} />
      <TextArea id='textarea-warning' label='Warning' hint={{ message: 'Message is getting long', type: 'warning' }} />
      <TextArea id='textarea-success' label='Success' hint={{ message: 'Message looks good', type: 'success' }} />
      <TextArea
        id='textarea-info'
        label='Info'
        hint={{ message: 'You can include multiple paragraphs', type: 'info' }}
      />
    </div>
  )
};

/**
 * Shows local autosize behavior with minimum and maximum rows; manual resize is disabled by default in autosize mode.
 */
export const Autosize: Story = {
  args: {
    id: 'textarea-autosize',
    label: 'Autosize message',
    autosize: true,
    minRows: 2,
    maxRows: 5,
    defaultValue: 'Start typing to grow the textarea between the configured row limits.',
    onChange: action('textarea-autosize-change')
  }
};

/**
 * Compares native CSS resize modes, including explicit resize override when autosize would otherwise default to `none`.
 */
export const Resize: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6'>
      <TextArea id='textarea-resize-none' label='None' resize='none' defaultValue='No manual resize.' />
      <TextArea id='textarea-resize-vertical' label='Vertical' resize='vertical' defaultValue='Vertical resize.' />
      <TextArea
        id='textarea-resize-horizontal'
        label='Horizontal'
        resize='horizontal'
        defaultValue='Horizontal resize.'
      />
      <TextArea id='textarea-resize-both' label='Both' resize='both' defaultValue='Both directions.' />
    </div>
  )
};

/**
 * Demonstrates `isFullWidth` for layouts where the textarea should fill its parent container.
 */
export const FullWidth: Story = {
  args: {
    id: 'textarea-full-width',
    label: 'Full width',
    isFullWidth: true,
    placeholder: 'This textarea fills the wrapper.'
  },
  decorators: [
    (StoryComponent) => (
      <div className='w-full max-w-modal-md'>
        <StoryComponent />
      </div>
    )
  ]
};

/**
 * Demonstrates external accessible naming for layouts where a visible label is owned outside the component.
 */
export const ExternalLabel: Story = {
  render: () => (
    <div className='flex flex-col gap-2 rounded-xl bg-background-light p-4 dark:bg-background-dark'>
      <span id='textarea-external-label' className='fs-small font-semibold text-text-light dark:text-text-dark'>
        External project summary label
      </span>
      <TextArea
        id='textarea-external'
        ariaLabelledBy='textarea-external-label'
        placeholder='Externally labelled textarea'
      />
    </div>
  )
};

/**
 * Shows safe native textarea attributes passing through for form integration and browser-managed constraints.
 */
export const NativeProps: Story = {
  args: {
    id: 'textarea-native-props',
    label: 'Native props',
    name: 'message',
    maxLength: 140,
    rows: 5,
    autoComplete: 'off',
    placeholder: 'Native rows, name, and maxLength are passed through.'
  }
};

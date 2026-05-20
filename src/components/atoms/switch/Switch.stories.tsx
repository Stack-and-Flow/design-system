import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon } from '../icon';
import { Switch } from './Switch';

/**
 * ## Description
 * Switch is a binary form control for enabling or disabling a setting.
 * It renders an accessible checkbox-based switch with synchronized checked state, visible keyboard focus, and token-backed light/dark visuals.
 *
 * ## Dependencies
 * Uses `Icon` in icon examples to demonstrate thumb and track content composition.
 *
 * ## Usage Guide
 * Use `defaultChecked` for uncontrolled settings and `checked` with `onChange` for controlled state. Provide either a visible `label`, `ariaLabel`, or native `aria-label` so assistive technology can identify the switch.
 */
const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Switch>;

/**
 * Shows the default switch configuration using its default visual variants.
 */
export const Default: Story = {
  args: {
    label: 'Notifications',
    onChange: action('switch-change')
  }
};

/**
 * Shows the reference visual treatment for off, on, and checked hover states.
 */
export const VisualReference: Story = {
  render: () => (
    <div className='flex items-center gap-6 rounded-lg border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark'>
      <Switch ariaLabel='Reference off switch' onChange={action('reference-off-change')} />
      <Switch ariaLabel='Reference on switch' defaultChecked={true} onChange={action('reference-on-change')} />
      <Switch
        ariaLabel='Reference large on switch'
        size='lg'
        defaultChecked={true}
        onChange={action('reference-large-on-change')}
      />
    </div>
  )
};

/**
 * Shows the non-interactive disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <Switch label='Disabled off' disabled={true} onChange={action('disabled-off-change')} />
      <Switch label='Disabled on' disabled={true} defaultChecked={true} onChange={action('disabled-on-change')} />
    </div>
  )
};

/**
 * Shows the available size options while preserving the minimum touch target.
 */
export const Size: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      <Switch size='sm' label='Small' defaultChecked={true} onChange={action('small-change')} />
      <Switch size='md' label='Medium' defaultChecked={true} onChange={action('medium-change')} />
      <Switch size='lg' label='Large' defaultChecked={true} onChange={action('large-change')} />
    </div>
  )
};

/**
 * Shows the supported color treatments. The legacy disabled color is rendered with disabled semantics for compatibility.
 */
export const Color: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      <Switch color='default' label='Default color' defaultChecked={true} onChange={action('default-color-change')} />
      <Switch
        color='transparent'
        label='Transparent color'
        defaultChecked={true}
        onChange={action('transparent-color-change')}
      />
      <Switch color='disabled' label='Legacy disabled color' disabled={true} defaultChecked={true} />
    </div>
  )
};

/**
 * Shows the available visual variants without mixing them with other prop axes.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      <Switch variant='default' label='Default' defaultChecked={true} onChange={action('default-variant-change')} />
      <Switch variant='bordered' label='Bordered' defaultChecked={true} onChange={action('bordered-change')} />
      <Switch variant='glass' label='Glass' defaultChecked={true} onChange={action('glass-change')} />
      <Switch variant='shadow' label='Shadow' defaultChecked={true} onChange={action('shadow-change')} />
    </div>
  )
};

/**
 * Shows rounded and squared track shapes.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      <Switch label='Rounded' rounded={true} defaultChecked={true} onChange={action('rounded-change')} />
      <Switch label='Squared' rounded={false} defaultChecked={true} onChange={action('squared-change')} />
    </div>
  )
};

/**
 * Shows a thumb icon with light and dark token colors that keep WCAG 1.4.11 non-text contrast in dark mode.
 */
export const WithThumbIcon: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      <Switch
        label='Thumb icon off'
        size='lg'
        thumbIcon={<Icon name='moon' tone='muted' size={16} className='text-current!' decorative={true} />}
        onChange={action('thumb-icon-off-change')}
      />
      <Switch
        label='Thumb icon on'
        size='lg'
        thumbIcon={<Icon name='moon' tone='muted' size={16} className='text-current!' decorative={true} />}
        defaultChecked={true}
        onChange={action('thumb-icon-on-change')}
      />
    </div>
  )
};

/**
 * Shows start and end content without regressing the switch role or checked state.
 */
export const WithIcons: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      <Switch
        label='Icons off'
        size='lg'
        startContent={<Icon name='moon' tone='muted' size={16} className='text-current!' decorative={true} />}
        endContent={<Icon name='sun' tone='muted' size={16} className='text-current!' decorative={true} />}
        onChange={action('icons-off-change')}
      />
      <Switch
        label='Icons on'
        size='lg'
        startContent={<Icon name='moon' tone='muted' size={16} className='text-current!' decorative={true} />}
        endContent={<Icon name='sun' tone='muted' size={16} className='text-current!' decorative={true} />}
        defaultChecked={true}
        onChange={action('icons-on-change')}
      />
    </div>
  )
};

/**
 * Shows every supported label placement.
 */
export const LabelPlacement: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-8'>
      <Switch label='Left label' labelPlacement='left' defaultChecked={true} onChange={action('left-label-change')} />
      <Switch
        label='Right label'
        labelPlacement='right'
        defaultChecked={true}
        onChange={action('right-label-change')}
      />
      <Switch label='Top label' labelPlacement='top' defaultChecked={true} onChange={action('top-label-change')} />
      <Switch
        label='Bottom label'
        labelPlacement='bottom'
        defaultChecked={true}
        onChange={action('bottom-label-change')}
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
      <Switch
        label={checked ? 'Enabled' : 'Disabled'}
        checked={checked}
        onChange={(nextChecked) => {
          action('controlled-change')(nextChecked);
          setChecked(nextChecked);
        }}
      />
    );
  }
};

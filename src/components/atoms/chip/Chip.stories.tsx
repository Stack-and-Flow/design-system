import type { Meta, StoryObj } from '@storybook/react';
import { Check, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import Avatar from '../avatar/Avatar';
import IconButton from '../icon-button';
import Icon from '../icon/Icon';
import { Chip } from './Chip';

/**
 * ## DESCRIPTION
 * Chip component is a compact element used to display statuses, keywords, or quick actions.
 *
 * Common use cases include tags, filters, and state indicators in dense interfaces.
 *
 * - Customizable in color, size, variant, radius and animation.
 * - Supports `startContent` / `endContent` (icons or text), optional avatar, and `dot` indicator.
 * - Optional interactivity: clickable (`as="button"`), selectable (controlled or uncontrolled), and closable.
 * - Accessible via the `ariaLabel` prop when using `variant="dot"` without text.
 */

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: {
    docs: { autodocs: true }
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['solid', 'bordered', 'light', 'flat', 'faded', 'shadow', 'dot'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    animation: { control: 'select', options: ['default', 'pulse', 'bounce', 'ping'] },
    as: { control: 'select', options: ['div', 'button'] },
    selectable: { control: 'boolean' },
    selected: { control: 'boolean' },
    defaultSelected: { control: 'boolean' },
    closable: { control: 'boolean' },
    onClose: { action: 'onClose' },
    onSelectedChange: { action: 'onSelectedChange' }
  },
  args: {
    onClick: undefined
  }
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Chip',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    animation: 'default',
    as: 'div',
    selectable: false,
    closable: false,
    onClick: undefined
  },
  parameters: {
    actions: { disable: true }
  },
  argTypes: {
    onClick: { table: { disable: true }, control: false }
  }
};

/**
 * The `size` prop adjusts height, horizontal padding and font-size of the chip.
 *
 * Available options:
 * - `sm` → Small
 * - `md` → Medium (default)
 * - `lg` → Large
 */
export const Size: Story = {
  args: { variant: 'light' },
  render: () => (
    <div className='flex items-center gap-4'>
      <Chip size='sm'>Small</Chip>
      <Chip size='md'>Medium</Chip>
      <Chip size='lg'>Large</Chip>
    </div>
  )
};

/**
 * The `color` prop sets background and text color.
 */
export const Color: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Chip color='primary'>Primary</Chip>
      <Chip color='secondary'>Secondary</Chip>
      <Chip color='success'>Success</Chip>
      <Chip color='warning'>Warning</Chip>
      <Chip color='danger'>Danger</Chip>
    </div>
  )
};

/**
 * The `variant` prop defines visual style modifications for the chip.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Chip variant='solid'>Solid</Chip>
      <Chip variant='flat'>Flat</Chip>
      <Chip variant='shadow'>Shadow</Chip>
      <Chip variant='bordered'>Bordered</Chip>
      <Chip variant='light'>Light</Chip>
      <Chip variant='faded'>Faded</Chip>
      <Chip variant='dot' color='warning'>
        With dot
      </Chip>
    </div>
  )
};

/**
 * The `radius` prop controls the corner roundness.
 */
export const Radius: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Chip radius='none'>none</Chip>
      <Chip radius='sm'>sm</Chip>
      <Chip radius='md'>md</Chip>
      <Chip radius='lg'>lg</Chip>
      <Chip radius='full'>full</Chip>
    </div>
  )
};

/**
 * `startContent` and `endContent` allow placing icons or text before/after the chip label.
 */
export const StartEndContent: Story = {
  args: {
    children: 'Status',
    color: 'primary',
    startContent: <Trash2 />,
    endContent: (
      <IconButton aria-label='Close' className='p-0'>
        <Icon className='h-4 w-4' aria-hidden={true} name='bold' />
      </IconButton>
    )
  }
};

/**
 * Make chips clickable by setting `as="button"` and providing `onClick`.
 */
export const Clickable: Story = {
  args: {
    children: 'Clickable',
    as: 'button'
  },
  argTypes: {
    onClick: { action: 'onClick' }
  }
};

/**
 * Closable chips can be removed from a list.
 */
export const ClosableList = () => {
  const [items, setItems] = useState(['React', 'NextJS', 'Tailwind']);

  return (
    <div className='flex gap-2 flex-wrap'>
      {items.map((label, idx) => (
        <Chip key={label} size='md' closable={true} onClose={() => setItems(items.filter((_, i) => i !== idx))}>
          {label}
        </Chip>
      ))}
    </div>
  );
};

/**
 * Chips can be selectable. Use `defaultSelected` for uncontrolled usage,
 * or `selected` + `onSelectedChange` for controlled state.
 */
export const SelectableUncontrolled: Story = {
  args: {
    children: 'Toggle me',
    selectable: true,
    defaultSelected: false
  }
};

export const SelectableControlled: Story = {
  render: (args) => {
    const [sel, setSel] = React.useState(true);
    return (
      <Chip
        {...args}
        selectable={true}
        selected={sel}
        onSelectedChange={setSel}
        startContent={sel ? <Check size={16} /> : null}
      >
        {sel ? 'Selected' : 'Not selected'}
      </Chip>
    );
  }
};

/** Avatar al inicio (usa tu componente Avatar) */
export const WithAvatar: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Chip avatar={<Avatar src='/images/logo-dark-background.png' alt='EG' size='sm' />}>EGDEV</Chip>
      <Chip
        color='primary'
        avatar={<div className='h-6 w-6 rounded-full bg-accent text-white grid place-items-center text-[10px]'>AP</div>}
      >
        Andrés
      </Chip>
    </div>
  )
};

/** With text → shows a circular indicator before the label. */
export const DotWithText: Story = {
  args: { variant: 'dot', color: 'primary', children: 'Pending' }
};

/** Dot only → provide `ariaLabel` for accessibility. */
export const DotOnlyAccessible: Story = {
  args: { variant: 'dot', color: 'primary', ariaLabel: 'Online' }
};

/** You can override slot styles with `classNames`. */
export const WithClassNamesOverrides: Story = {
  args: {
    children: 'Custom Slots',
    classNames: {
      base: 'bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-800',
      content: 'tracking-wide',
      closeButton: 'bg-white/10 hover:bg-white/20'
    },
    closable: true,
    animation: 'bounce',
    as: 'div',
    onClick: undefined
  },
  parameters: {
    actions: { disable: true }
  },
  argTypes: {
    onClick: { table: { disable: true }, control: false }
  }
};

/** Stress test for long labels */
export const Stress: Story = {
  render: () => (
    <div className='max-w-[260px] space-x-2'>
      <Chip
        closable={true}
        startContent={<Icon aria-hidden={true} name='activity' />}
        endContent={<Icon aria-hidden={true} name='youtube' />}
      >
        Truncated: Very very very long label that should nicely
      </Chip>
    </div>
  )
};

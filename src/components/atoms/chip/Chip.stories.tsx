import type { Meta, StoryObj } from '@storybook/react';
import { Check, Trash2 } from 'lucide-react';
import React from 'react';
import { Avatar } from '../avatar';
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
 * - Optional interactivity: clickable (`onClick`/`selectable`), selectable (controlled or uncontrolled), and closable.
 * - `as` is a preference, not an absolute guarantee: when `closable` + interactive are combined, the chip uses a split-actions group with sibling buttons.
 * - Accessible via `ariaLabel` for chips without readable text; close action uses contextual label (`Remove <label>`).
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
    <div className='flex min-h-28 items-center gap-4 rounded-lg bg-background-light px-6 py-10 dark:bg-background-dark'>
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
    <div className='flex min-h-28 items-center gap-4 rounded-lg bg-background-light px-6 py-10 dark:bg-background-dark'>
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
    endContent: <Icon name='x' size={12} className='text-current dark:text-current' />
  }
};

/**
 * Chips become interactive when they receive `onClick` or `selectable`.
 * If `closable` is also enabled, the component switches to split-actions markup to keep a11y-valid controls.
 */
export const Clickable: Story = {
  args: {
    children: 'Clickable',
    as: 'button',
    onClick: () => undefined
  },
  argTypes: {
    onClick: { action: 'onClick' }
  }
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
      {/* Forzamos el slot avatar a 16px y recortamos */}
      <Chip avatar={<Avatar src='/images/logo-dark-background.png' alt='EG' size='sm' />}>EGDEV</Chip>

      <Chip
        classNames={{
          avatar: 'h-4 w-4 overflow-hidden rounded-full grid place-items-center'
        }}
        avatar={
          <Icon name='user' size={16} className='text-(--color-accent) dark:text-(--color-text-dark)' />
        }
      >
        User
      </Chip>

      <Chip
        color='primary'
        classNames={{ avatar: 'h-4 w-4 overflow-hidden rounded-full' }}
        avatar={<div className='h-4 w-4 rounded-full bg-accent text-white grid place-items-center text-[10px]'>A</div>}
      >
        Andrés
      </Chip>
    </div>
  )
};

/** With text → shows a circular indicator before the label. */
export const DotWithText: Story = {
  args: { variant: 'dot', color: 'primary', children: 'Pending' },
  render: (args) => (
    <div className='flex min-h-28 items-center rounded-lg bg-background-light px-6 py-10 dark:bg-background-dark'>
      <Chip {...args} />
    </div>
  )
};

/** Dot only → provide `ariaLabel` for accessibility. */
export const DotOnlyAccessible: Story = {
  args: { variant: 'dot', color: 'primary', ariaLabel: 'Online status' }
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
    <div className='max-w-65 space-x-2'>
      <Chip
        closable={true}
        startContent={
          <span aria-hidden={true}>
            <Icon name='activity' />
          </span>
        }
        endContent={
          <span aria-hidden={true}>
            <Icon name='x' />
          </span>
        }
      >
        Truncated: Very very very long label that should nicely
      </Chip>
    </div>
  )
};

export const ClosableAndClickable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `closable` and click behavior are combined, the chip uses a split-actions group (two sibling buttons). Primary action triggers `onClick`; close action triggers `onClose` only.'
      }
    }
  },
  args: {
    children: 'Closable + click',
    closable: true,
    onClose: () => undefined,
    onClick: () => undefined
  },
  argTypes: {
    onClick: { action: 'onClick' },
    onClose: { action: 'onClose' }
  }
};

export const DisabledAndClosable: Story = {
  args: {
    children: 'Disabled + closable',
    closable: true,
    disabled: true,
    onClose: () => undefined
  },
  argTypes: {
    onClose: { action: 'onClose' }
  }
};

export const ButtonAndClosable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`as="button"` is treated as a preference. In `closable` + interactive mode the chip renders split-actions markup to avoid nested interactive controls.'
      }
    }
  },
  args: {
    children: 'Button + closable',
    as: 'button',
    closable: true,
    onClose: () => undefined,
    onClick: () => undefined
  },
  argTypes: {
    onClick: { action: 'onClick' },
    onClose: { action: 'onClose' }
  }
};

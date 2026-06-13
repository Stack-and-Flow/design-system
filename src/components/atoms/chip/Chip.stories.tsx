import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Check, Trash2 } from 'lucide-react';
import React from 'react';
import { Avatar } from '../avatar';
import { Icon } from '../icon/Icon';
import { Chip } from './Chip';

/**
 * ## Description
 * Chip is a compact element used to display statuses, keywords, filters, or quick actions.
 *
 * ## Dependencies
 * Uses `Icon`, `Avatar`, and `lucide-react` icons in examples to document media, action, and composition slots.
 *
 * ## Usage Guide
 * Use `children` for the readable label, `ariaLabel` for dot-only or non-textual chips, and `closable` only when the chip can be removed.
 * When `closable` and click behavior are combined, the component renders split-actions markup with sibling buttons to avoid nested interactive controls.
 */
const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Chip'
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
      <Chip color='info'>Info</Chip>
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
 * Visual review matrix for all semantic colors and visual variants in light and dark surfaces.
 */
export const VisualReviewMatrix: Story = {
  render: () => (
    <div className='grid gap-6 rounded-xl bg-background-light p-6 dark:bg-background-dark'>
      <section className='grid gap-3'>
        <h3 className='fs-small font-secondary-bold capitalize text-text-secondary-light dark:text-text-secondary-dark'>
          Solid
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip variant='solid' color='primary'>
            primary
          </Chip>
          <Chip variant='solid' color='secondary'>
            secondary
          </Chip>
          <Chip variant='solid' color='success'>
            success
          </Chip>
          <Chip variant='solid' color='warning'>
            warning
          </Chip>
          <Chip variant='solid' color='danger'>
            danger
          </Chip>
          <Chip variant='solid' color='info'>
            info
          </Chip>
        </div>
      </section>
      <section className='grid gap-3'>
        <h3 className='fs-small font-secondary-bold capitalize text-text-secondary-light dark:text-text-secondary-dark'>
          Flat
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip variant='flat' color='primary'>
            primary
          </Chip>
          <Chip variant='flat' color='secondary'>
            secondary
          </Chip>
          <Chip variant='flat' color='success'>
            success
          </Chip>
          <Chip variant='flat' color='warning'>
            warning
          </Chip>
          <Chip variant='flat' color='danger'>
            danger
          </Chip>
          <Chip variant='flat' color='info'>
            info
          </Chip>
        </div>
      </section>
      <section className='grid gap-3'>
        <h3 className='fs-small font-secondary-bold capitalize text-text-secondary-light dark:text-text-secondary-dark'>
          Bordered
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip variant='bordered' color='primary'>
            primary
          </Chip>
          <Chip variant='bordered' color='secondary'>
            secondary
          </Chip>
          <Chip variant='bordered' color='success'>
            success
          </Chip>
          <Chip variant='bordered' color='warning'>
            warning
          </Chip>
          <Chip variant='bordered' color='danger'>
            danger
          </Chip>
          <Chip variant='bordered' color='info'>
            info
          </Chip>
        </div>
      </section>
      <section className='grid gap-3'>
        <h3 className='fs-small font-secondary-bold capitalize text-text-secondary-light dark:text-text-secondary-dark'>
          Light
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip variant='light' color='primary'>
            primary
          </Chip>
          <Chip variant='light' color='secondary'>
            secondary
          </Chip>
          <Chip variant='light' color='success'>
            success
          </Chip>
          <Chip variant='light' color='warning'>
            warning
          </Chip>
          <Chip variant='light' color='danger'>
            danger
          </Chip>
          <Chip variant='light' color='info'>
            info
          </Chip>
        </div>
      </section>
      <section className='grid gap-3'>
        <h3 className='fs-small font-secondary-bold capitalize text-text-secondary-light dark:text-text-secondary-dark'>
          Faded
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip variant='faded' color='primary'>
            primary
          </Chip>
          <Chip variant='faded' color='secondary'>
            secondary
          </Chip>
          <Chip variant='faded' color='success'>
            success
          </Chip>
          <Chip variant='faded' color='warning'>
            warning
          </Chip>
          <Chip variant='faded' color='danger'>
            danger
          </Chip>
          <Chip variant='faded' color='info'>
            info
          </Chip>
        </div>
      </section>
      <section className='grid gap-3'>
        <h3 className='fs-small font-secondary-bold capitalize text-text-secondary-light dark:text-text-secondary-dark'>
          Dot
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip variant='dot' color='primary'>
            primary
          </Chip>
          <Chip variant='dot' color='secondary'>
            secondary
          </Chip>
          <Chip variant='dot' color='success'>
            success
          </Chip>
          <Chip variant='dot' color='warning'>
            warning
          </Chip>
          <Chip variant='dot' color='danger'>
            danger
          </Chip>
          <Chip variant='dot' color='info'>
            info
          </Chip>
        </div>
      </section>
    </div>
  )
};

/**
 * Product-like examples used to judge whether Chip feels like a premium status/filter/control instead of a small Badge.
 */
export const UsageReview: Story = {
  render: () => (
    <div className='grid gap-6 rounded-xl bg-background-light p-6 dark:bg-background-dark'>
      <section className='grid gap-3 rounded-lg border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
        <h3 className='fs-base font-secondary-bold text-text-light dark:text-text-dark'>Status row</h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip color='success' variant='flat' startContent={<Check />}>
            Synced
          </Chip>
          <Chip color='warning' variant='dot'>
            Pending review
          </Chip>
          <Chip color='danger' variant='faded'>
            Failing checks
          </Chip>
          <Chip color='info' variant='light'>
            Needs context
          </Chip>
          <Chip color='secondary' variant='bordered'>
            Draft
          </Chip>
        </div>
      </section>

      <section className='grid gap-3 rounded-lg border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
        <h3 className='fs-base font-secondary-bold text-text-light dark:text-text-dark'>Filters and actions</h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip
            selectable={true}
            defaultSelected={true}
            color='primary'
            onSelectedChange={action('chip.filter-selected')}
          >
            React
          </Chip>
          <Chip closable={true} color='secondary' variant='faded' onClose={action('chip.close')}>
            Design System
          </Chip>
          <Chip as='button' color='primary' variant='solid' onClick={action('chip.apply')}>
            Apply filter
          </Chip>
        </div>
      </section>

      <section className='grid gap-3 rounded-lg border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
        <h3 className='fs-base font-secondary-bold text-text-light dark:text-text-dark'>Identity chip</h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip avatar={<Avatar src='/images/logo-only.svg' alt='EG' size='sm' />} color='secondary' variant='flat'>
            EGDEV
          </Chip>
          <Chip startContent={<Icon name='user' />} color='primary' variant='bordered'>
            Contributor
          </Chip>
        </div>
      </section>
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
    endContent: <Icon name='x' className='h-3 w-3 text-current dark:text-current' />
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
    onClick: action('chip.click')
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
    defaultSelected: false,
    onSelectedChange: action('chip.selected-change')
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
        startContent={sel ? <Check className='h-4 w-4' /> : null}
      >
        {sel ? 'Selected' : 'Not selected'}
      </Chip>
    );
  }
};

/** Avatar at the start using Avatar component. */
export const WithAvatar: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Chip avatar={<Avatar src='/images/logo-only.svg' alt='EG' size='sm' />}>EGDEV</Chip>

      <Chip
        classNames={{
          avatar: 'h-4 w-4 overflow-hidden rounded-full grid place-items-center'
        }}
        avatar={<Icon name='user' className='h-4 w-4 text-primary dark:text-text-dark' />}
      >
        User
      </Chip>

      <Chip
        color='primary'
        classNames={{ avatar: 'h-4 w-4 overflow-hidden rounded-full' }}
        avatar={<div className='grid h-4 w-4 place-items-center rounded-full bg-primary text-xs text-text-dark'>A</div>}
      >
        Andrew
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
      base: 'bg-primary text-text-dark hover:bg-primary-hover focus-visible:focus-ring',
      content: 'tracking-wide',
      closeButton: 'bg-white-tint-high hover:bg-white-tint-strong'
    },
    closable: true,
    animation: 'bounce',
    as: 'div'
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
    onClose: action('chip.close'),
    onClick: action('chip.click')
  }
};

export const DisabledAndClosable: Story = {
  args: {
    children: 'Disabled + closable',
    closable: true,
    disabled: true,
    onClose: action('chip.close')
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
    onClose: action('chip.close'),
    onClick: action('chip.click')
  }
};

import { buttonVariants } from '@atoms/button/types';
import { Icon } from '@atoms/icon';
import { iconButtonVariants } from '@atoms/icon-button/types';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import type { DropdownSchema } from './types';

const accountMenuItems: DropdownSchema = [
  { type: 'label', label: 'My Account' },
  { type: 'separator' },
  {
    type: 'item',
    label: 'Profile',
    onClick: action('profile-select'),
    startContent: <Icon name='user' />,
    endContent: <span>⇧⌘P</span>
  },
  {
    type: 'item',
    label: 'Billing',
    onClick: action('billing-select'),
    endContent: <span>⌘B</span>
  },
  { type: 'separator' },
  {
    type: 'submenu',
    label: 'Team',
    startContent: <Icon name='users' />,
    items: [
      { type: 'item', label: 'Invite users', onClick: action('invite-users-select') },
      { type: 'item', label: 'New team', onClick: action('new-team-select'), endContent: <span>⌘T</span> }
    ]
  }
];

const destructiveMenuItems: DropdownSchema = [
  { type: 'label', label: 'Danger zone' },
  { type: 'separator' },
  {
    type: 'item',
    label: 'Delete project',
    variant: 'destructive',
    onClick: action('delete-project-select'),
    endContent: <span>⌘⌫</span>
  }
];

const disabledMenuItems: DropdownSchema = [
  { type: 'label', label: 'Project actions' },
  { type: 'separator' },
  { type: 'item', label: 'Rename project', onClick: action('rename-project-select') },
  { type: 'item', label: 'Transfer ownership', disabled: true, onClick: action('transfer-ownership-select') }
];

const iconTrigger = (
  <span className={iconButtonVariants({ variant: 'primary' })}>
    <Icon color='text-white' colorDark='dark:text-white' decorative={true} name='ellipsis' size={20} />
  </span>
);

const Trigger = ({ label }: { label: string }) => (
  <span className={buttonVariants({ variant: 'primary' })}>{label}</span>
);

/**
 * ## Description
 * Dropdown displays a contextual action menu powered by Radix primitives while following the design-system token, accessibility, and Storybook conventions.
 *
 * ## Dependencies
 * Uses `@radix-ui/react-dropdown-menu` for menu semantics and the `Icon` atom to render optional visual affordances in examples.
 *
 * ## Usage Guide
 * Compose the menu with the `items` prop. Each entry must declare a `type`, and the supported shapes are:
 *
 * ```tsx
 * const items: DropdownSchema = [
 *   { type: 'label', label: 'My Account' },
 *   { type: 'separator' },
 *   {
 *     type: 'item',
 *     label: 'Profile',
 *     onClick: action('profile-select'),
 *     startContent: <Icon name='user' />,
 *     endContent: <span>⇧⌘P</span>
 *   },
 *   {
 *     type: 'submenu',
 *     label: 'Team',
 *     items: [
 *       { type: 'item', label: 'Invite users', onClick: action('invite-users-select') }
 *     ]
 *   },
 *   {
 *     type: 'item',
 *     label: 'Delete project',
 *     variant: 'destructive',
 *     onClick: action('delete-project-select')
 *   }
 * ];
 * ```
 *
 * Use `label` and `separator` entries to group related actions, `item` entries for selectable actions, and `submenu` entries for nested action groups. Use `disabled` on unavailable items, `variant='destructive'` only for irreversible actions, and `startContent` / `endContent` for icons or keyboard shortcuts. Provide `ariaLabel` when the trigger has no visible text.
 */
const meta: Meta<typeof Dropdown> = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

/**
 * Shows the default menu using the component defaults and a text trigger.
 */
export const Default: Story = {
  args: {
    items: accountMenuItems,
    children: <Trigger label='Open menu' />
  }
};

/**
 * Shows the non-interactive disabled-item state while keeping the menu accessible.
 */
export const Disabled: Story = {
  args: {
    items: disabledMenuItems,
    children: <Trigger label='Disabled item' />
  }
};

/**
 * Shows a destructive action item for irreversible operations.
 */
export const DestructiveItem: Story = {
  args: {
    items: destructiveMenuItems,
    children: <Trigger label='Danger zone' />
  }
};

/**
 * Shows the loading state used while menu items are being prepared.
 */
export const Loading: Story = {
  args: {
    items: accountMenuItems,
    loading: true,
    children: <Trigger label='Loading menu' />
  }
};

/**
 * Shows the width variants available for menu content.
 */
export const Width: Story = {
  render: () => (
    <div className='flex min-h-64 flex-wrap items-start gap-4'>
      <Dropdown items={accountMenuItems} width='auto'>
        <Trigger label='Auto width' />
      </Dropdown>
      <Dropdown items={accountMenuItems} width='sm'>
        <Trigger label='Small width' />
      </Dropdown>
      <Dropdown items={accountMenuItems} width='md'>
        <Trigger label='Medium width' />
      </Dropdown>
      <Dropdown items={accountMenuItems} width='lg'>
        <Trigger label='Large width' />
      </Dropdown>
    </div>
  )
};

/**
 * Shows menu placement on each supported side.
 */
export const Position: Story = {
  render: () => (
    <div className='flex min-h-80 flex-wrap items-center gap-4'>
      <Dropdown items={accountMenuItems} position='bottom'>
        <Trigger label='Bottom' />
      </Dropdown>
      <Dropdown items={accountMenuItems} position='top'>
        <Trigger label='Top' />
      </Dropdown>
      <Dropdown items={accountMenuItems} position='left'>
        <Trigger label='Left' />
      </Dropdown>
      <Dropdown items={accountMenuItems} position='right'>
        <Trigger label='Right' />
      </Dropdown>
    </div>
  )
};

/**
 * Shows start, center, and end alignment for the menu content.
 */
export const Alignment: Story = {
  render: () => (
    <div className='flex min-h-64 flex-wrap items-start gap-4'>
      <Dropdown items={accountMenuItems} align='start'>
        <Trigger label='Start' />
      </Dropdown>
      <Dropdown items={accountMenuItems} align='center'>
        <Trigger label='Center' />
      </Dropdown>
      <Dropdown items={accountMenuItems} align='end'>
        <Trigger label='End' />
      </Dropdown>
    </div>
  )
};

/**
 * Shows a nested submenu structure for grouped actions.
 */
export const Submenu: Story = {
  args: {
    items: accountMenuItems,
    children: <Trigger label='Team actions' />
  }
};

/**
 * Shows how to keep the menu open after an item is selected.
 */
export const CloseOnSelectFalse: Story = {
  args: {
    items: accountMenuItems,
    closeOnSelect: false,
    children: <Trigger label='Persistent menu' />
  }
};

/**
 * Shows an icon-only trigger with an explicit accessible label.
 */
export const CustomTrigger: Story = {
  args: {
    ariaLabel: 'Open account actions',
    items: accountMenuItems,
    children: iconTrigger
  }
};

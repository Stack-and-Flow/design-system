import { Icon } from '@atoms/icon';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Link } from '../link';
import { Dropdown } from './index';
import type { DropdownSchema } from './types';

/**
 * ## DESCRIPTION
 * The Dropdown component is a versatile menu element that allows users to select options or navigate through submenus.
 * It supports various configurations, including custom triggers, widths, offsets, alignments, and positions.
 * The component is designed to be accessible and customizable, making it suitable for a wide range of use cases.
 *
 * ## DEPENDENCIES
 * - [Radix UI Dropdown Menu](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
 * - [React Spinners](https://github.com/davidhu2000/react-spinners)
 * - Icon - from Lucide React for icons
 *
 * ## ITEMS STRUCTURE
 * The `items` prop defines the structure of the dropdown menu. It is an array of objects, where each object represents a menu element.
 * The following types of elements are supported:
 *
 * ## POSSIBILITIES
 * - **Customizable Content**: Add icons, shortcuts, or any React node to `startContent` and `endContent`.
 * - **Nested Menus**: Use `submenu` to create hierarchical menus.
 * - **Variants**: Style items as `default` or `destructive` for different use cases.
 * - **Disabled Items**: Disable specific items to indicate unavailable actions.
 * - **Dividers and Labels**: Use `separator` and `label` to organize and group items.
 *
 * ## USAGE
 *
 * ### 1. Label
 * A non-interactive label used to group or describe menu items.
 * ```json
 * {
 *   "type": "label",
 *   "label": "My Account"
 * }
 * ```
 *
 * ### 2. Separator
 * A visual divider used to separate groups of menu items.
 * ```json
 * {
 *   "type": "separator"
 * }
 * ```
 *
 * ### 3. Item
 * A clickable menu item that can trigger an action or navigate to a link.
 * ```json
 * {
 *   "type": "item",
 *   "label": "Profile",
 *   "disabled": false,
 *   "variant": "default",
 *   "onClick": () => alert('Profile clicked'),
 *   "startContent": <Icon name="user" />,
 *   "endContent": <span>⇧⌘P</span>
 * }
 * ```
 * - **Properties**:
 *   - `label`: The text displayed for the menu item.
 *   - `disabled`: Whether the item is disabled.
 *   - `variant`: The visual style of the item (`default` or `destructive`).
 *   - `onClick`: A callback function triggered when the item is clicked.
 *   - `startContent`: Optional content (e.g., an icon) displayed at the start of the item.
 *   - `endContent`: Optional content (e.g., a shortcut) displayed at the end of the item.
 *
 * ### 4. Submenu
 * A nested menu that contains additional items.
 * This allows for organizing related actions under a single menu trigger.
 * You can use `startContent` and `endContent` to customize the submenu trigger.
 * ChevronRight icon is rendered by default but you can be overridden with custom icons if needed.
 * ```json
 * {
 *   "type": "submenu",
 *   "label": "Team",
 *   "startContent": <Icon name="users" />,
 *   "endContent": <ChevronRightIcon className="ml-auto size-4" />,
 *   "items": [
 *     { "type": "item", "label": "Invite users" },
 *     { "type": "item", "label": "New Team", "endContent": <span>⌘+T</span> }
 *   ]
 * }
 * ```
 * - **Properties**:
 *   - `label`: The text displayed for the submenu trigger.
 *   - `items`: An array of `DropdownElement` objects defining the submenu's structure.
 *
 * ## EXAMPLE
 * Here is an example of a complete `items` array:
 * ```json
 * [
 *   { "type": "label", "label": "My Account" },
 *   { "type": "separator" },
 *   {
 *     "type": "item",
 *     "label": "Profile",
 *     "onClick": () => alert('Profile clicked'),
 *     "startContent": <Icon name="user" />,
 *     "endContent": <span>⇧⌘P</span>
 *   },
 *   { "type": "item", "label": "Billing", "endContent": <span>⌘B</span> },
 *   { "type": "separator" },
 *   {
 *     "type": "submenu",
 *     "label": "Team",
 *     "items": [
 *       { "type": "item", "label": "Invite users" },
 *       { "type": "item", "label": "New Team", "endContent": <span>⌘+T</span> }
 *     ]
 *   },
 *   { "type": "separator" },
 *   { "type": "item", "label": "Log out", "variant": "destructive", "endContent": <span>⇧⌘Q</span> }
 * ]
 * ```
 *
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

const schema: DropdownSchema = [
  { type: 'label', label: 'My Account' },
  { type: 'separator' },
  {
    type: 'item',
    label: 'Profile',
    endContent: <span>⇧⌘P</span>,
    onClick: () => alert('Profile clicked'),
    startContent: <Icon name='user' />
  },
  { type: 'item', label: 'Billing', endContent: <span>⌘B</span> },
  { type: 'separator' },
  {
    type: 'submenu',
    label: 'Team',
    items: [
      { type: 'item', label: 'Invite users' },
      { type: 'item', label: 'New Team', endContent: <span>⌘+T</span>, onClick: () => alert('Profile clicked') }
    ]
  },
  { type: 'separator' },
  { type: 'item', label: 'Log out', endContent: <span>⇧⌘Q</span>, variant: 'destructive' }
];

/**
 * - **Default Dropdown**: A basic dropdown with default settings.
 */
export const Default: Story = {
  args: {
    width: '250px',
    position: 'bottom',
    align: 'center',
    offset: 1,
    closeOnSelect: true,
    loading: false,
    className: '',
    items: schema,
    children: <Button text='Open Menu' />
  }
};
/**
 * - **Loading State**: A dropdown that simulates a loading state.
 *   This is useful for scenarios where the menu items are being fetched asynchronously.
 */

export const Loading: Story = {
  render: () => (
    <div className='flex gap-4 items-start min-h-[250px]'>
      <Dropdown items={schema} width='250px' loading={true}>
        <Button text='Loading Menu' />
      </Dropdown>
    </div>
  )
};

/**
 * - **Custom Trigger**: Demonstrates how to use custom elements as triggers for the dropdown.
 */
export const CustomTrigger: Story = {
  render: () => (
    <div className='flex gap-4 items-start min-h-[250px]'>
      <Dropdown items={schema} width='250px'>
        <Link size='md' variant='regular'>
          Lorem ipsum
        </Link>
      </Dropdown>
      <Dropdown items={schema} width='250px'>
        <Icon color='text-color-brand-light' colorDark='dark:text-color-brand-dark' name='image-plus' size={24} />
      </Dropdown>
    </div>
  )
};

/**
 * - **Custom Width**: A dropdown with a custom width of 500px.
 */
export const CustomWidth: Story = {
  render: () => (
    <div className='flex gap-4 items-start min-h-[250px]'>
      <Dropdown items={schema} width='500px'>
        <Button text='Custom Width' />
      </Dropdown>
    </div>
  )
};

/**
 * - **Custom Offset**: A dropdown with a custom offset of 20px.
 */
export const CustomOffset: Story = {
  render: () => (
    <div className='flex gap-4 items-start min-h-[250px]'>
      <Dropdown items={schema} offset={20} width='250px'>
        <Button text='Custom Offset' />
      </Dropdown>
    </div>
  )
};

/**
 * - **Position**: Demonstrates dropdowns positioned at different sides (top, bottom, left, right).
 */
export const Position: Story = {
  render: () => (
    <div className='flex gap-4 items-center min-h-[400px]'>
      <Dropdown items={schema} position='bottom' width='250px'>
        <Button text='Bottom' />
      </Dropdown>
      <Dropdown items={schema} position='top' width='250px'>
        <Button text='Top' />
      </Dropdown>
      <Dropdown items={schema} position='left' width='250px'>
        <Button text='Left' />
      </Dropdown>
      <Dropdown items={schema} position='right' width='250px'>
        <Button text='Right' />
      </Dropdown>
    </div>
  )
};

/**
 * - **Alignment**: Demonstrates dropdowns aligned to the start, center, and end.
 */
export const Alignment: Story = {
  render: () => (
    <div className='flex gap-4 items-start min-h-[250px]'>
      <Dropdown items={schema} align='start' position='bottom' width='250px'>
        <Button text='Start' />
      </Dropdown>
      <Dropdown items={schema} align='center' position='bottom' width='250px'>
        <Button text='Center' />
      </Dropdown>
      <Dropdown items={schema} align='end' position='bottom' width='250px'>
        <Button text='End' />
      </Dropdown>
    </div>
  )
};

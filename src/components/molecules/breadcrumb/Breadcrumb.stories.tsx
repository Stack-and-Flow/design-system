import Dropdown from '@/components/atoms/dropdown';
import Icon from '@/components/atoms/icon';
import type { Meta, StoryObj } from '@storybook/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbItem } from './types';
import { useBreadcrumb } from './useBreadcrumb';

/**
 * ## DESCRIPTION
 * Breadcrumbs display a hierarchy of links to the current page or resource in an application.
 *
 * ## SEARCH ICONS
 * You can search for icons in the [Lucide Icons] library (https://lucide.dev/icons). Use the icon name as the `icon` prop value to apply it as a separator for the elements. If not set, default separators will be applied.
 *
 * ## DEPENDENCIES
 * - Icon: Uses Icon component from `lucide-react` for icons.
 *
 */

const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    maxItem: {
      control: { type: 'number', min: 0 }
    },
    itemsBeforeCollapse: {
      control: { type: 'number', min: 1 }
    },
    itemsAfterCollapse: {
      control: { type: 'number', min: 1 }
    }
  },
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const items: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Library', href: '/library' },
  { title: 'Data', href: '#', target: '_blank' }
];

export const Default: Story = {
  args: {
    items,
    variant: 'bordered',
    bgColor: 'default',
    rounded: 'md',
    size: 'md',
    separator: '/',
    iconCollapse: 'accessibility',
    startContent: undefined,
    endContent: undefined,
    hideSeparator: false,
    maxItem: 0,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
    className: ''
  }
};

/**
 * - **Sizes**: Different size variants for the breadcrumb component (xs,sm, md, lg, xl).
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb items={items} size='sm' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
      <Breadcrumb items={items} size='md' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
      <Breadcrumb items={items} size='lg' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
    </div>
  )
};

/**
 *  - Text color variations using the textColor property.
  - The format for applying color to text is with tailwind.
  - The last element of the breadcrumb is a text-type atom component and will be disabled.
 */
export const Colors: Story = {
  render: () => (
    <div className='flex flex-col gap-2 p-4'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        textColor='red'
        aria-label='Red colored breadcrumb navigation'
      />

      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        textColor='blue'
        aria-label='Blue colored breadcrumb navigation'
      />

      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        textColor='indigo'
        aria-label='Indigo colored breadcrumb navigation'
      />
    </div>
  )
};
/**
 * Different visual styles including regular, underlined, bordered, line variants.
 * - ⚠️ Some variants use a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background using the bgColor property.
 *
 */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='regular'
      />

      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
      />

      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='bordered'
        bgColor='transparent'
      />
    </div>
  )
};

/**
 * - **Border Radius**: Allows you to apply different border radius to the container: md, xs, sm, lg, xl, full, none.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        rounded='none'
        variant='bordered'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        rounded={'xs'}
        variant='bordered'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        rounded='sm'
        variant='bordered'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        rounded='md'
        variant='bordered'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        rounded='full'
        variant='bordered'
      />
    </div>
  )
};

/**
 * - Allows you to apply a separator between elements. You can use any Lucide React icon or the characters /, |, >.
  - Simply enter the name of the Lucide React icon or the characters mentioned above in the “separator” property.
 */
export const Separators: Story = {
  render: () => (
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb items={items} size='md' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
      <Breadcrumb items={items} size='md' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='|' />
      <Breadcrumb items={items} size='md' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='>' />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='chevron-right'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='arrow-right'
      />
    </div>
  )
};

/**
 * - **Hidden Separators**: Toggle separator visibility with the hideSeparator prop.
 *   This is useful when you want to display breadcrumb items without visual separators between them.
 */
export const HiddenSeparators: Story = {
  render: () => (
    <Breadcrumb
      items={items}
      size='md'
      maxItem={0}
      itemsAfterCollapse={1}
      itemsBeforeCollapse={1}
      separator='/'
      hideSeparator={true}
    />
  )
};

/**
 * - **Start and End Content**: Add icons or content at the beginning and end of the breadcrumb.
 * - Use the startContent and endContent props.
 */
export const WithStartEndContent: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        startContent='home'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        endContent='external-link'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        startContent='home'
        variant='underlined'
        endContent='external-link'
      />
    </div>
  )
};

/**
 *- Controls the number of items visible with automatic collapse using icons. 
    - maxItem: A value of 0 shows all items, and a value less than the number of items (the minimum is 2) collapses the remaining items.
    - itemsAfterCollapse: These are the number of items you want to display before collapse (left side).
    - ItemsBeforeCollapse: These are the number of items you want to display after collapse (right side).
  - In this example, I have 3 items and I want 2 to be displayed, so the remaining item is 1 and will be hidden. the items are not displayed, only the chosen icon.
  - The icon can be applied with the 
 */
export const MaxItemsAndCollapse: Story = {
  render: () => (
    <Breadcrumb
      items={items}
      size='md'
      maxItem={2}
      itemsAfterCollapse={1}
      itemsBeforeCollapse={1}
      separator='/'
      variant='underlined'
      iconCollapse='ellipsis-vertical'
    />
  )
};

// mapper from breadcrumb items to dropdown items
const breadcrumbItemsToDropdownSchema = (breadcrumbItems: BreadcrumbItem[], title = 'Rutas ocultas') => {
  if (breadcrumbItems.length === 0) {
    return [];
  }

  return [
    { type: 'label' as const, label: title },
    { type: 'separator' as const },
    ...breadcrumbItems.map((item) => ({
      type: 'item' as const,
      label: item.title,
      onClick: () => {
        if (item.href) {
          window.location.href = item.href;
        }
      },
      startContent: <Icon name='chevron-right' size={14} />
    }))
  ];
};

function getDropdownForItems(items: BreadcrumbItem[], maxItem: number, before: number, after: number) {
  const { getHiddenItems } = useBreadcrumb({ items, maxItem, itemsBeforeCollapse: before, itemsAfterCollapse: after });
  return breadcrumbItemsToDropdownSchema(getHiddenItems());
}

const maxItem = 2;
const itemsBeforeCollapse = 1;
const itemsAfterCollapse = 1;

/**
 * - Use custom JSX elements instead of icons for collapsed breadcrumb sections.
 *   This provides complete control over the visual representation of collapsed items, allowing for interactive buttons or styled elements.
 *   In the current example, the dropdown defined in the atoms section has been used.
 */

export const WithJsxElmentCollapsed: Story = {
  render: () => {
    return (
      <Breadcrumb
        items={items}
        size='md'
        maxItem={maxItem}
        itemsAfterCollapse={itemsAfterCollapse}
        itemsBeforeCollapse={itemsBeforeCollapse}
        variant='underlined'
        collapsedElement={
          <Dropdown items={getDropdownForItems(items, 2, 1, 1)} width='200px'>
            <DynamicIcon name='ellipsis-vertical' className='cursor-pointer' />
          </Dropdown>
        }
      />
    );
  }
};

/**
 * - **Complete Examples**: Comprehensive demonstrations combining multiple props and features.
 *   These examples show real-world usage scenarios with various combinations of styling, icons, collapsing, and visual effects.
 */
export const CompleteExample: Story = {
  render: () => (
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={2}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='chevron-right'
        variant='underlined'
        rounded={'sm'}
        startContent='home'
        endContent='external-link'
        textColor='blue'
        iconCollapse='more-horizontal'
        collapsedElement={
          <Dropdown items={getDropdownForItems(items, 2, 1, 1)} width='200px'>
            <DynamicIcon name='ellipsis-vertical' />
          </Dropdown>
        }
      />
    </div>
  )
};

export const WithBadgeCollapse: Story = {
  render: () => {
    const longItems: BreadcrumbItem[] = [
      { title: 'Home', href: '/' },
      { title: 'Library', href: '/library' },
      { title: 'Documents', href: '/library/documents' },
      { title: 'Projects', href: '/library/documents/projects' },
      { title: 'Annual Report', href: '/library/documents/projects/annual' }
    ];

    return (
      <div className='flex flex-col gap-0.5'>
        <Breadcrumb
          items={longItems}
          size='md'
          maxItem={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
          separator='chevron-right'
          variant='underlined'
          rounded='sm'
          startContent='home'
          textColor='text-blue-600 dark:text-blue-400'
          collapsedElement={
            <Dropdown items={getDropdownForItems(longItems, 3, 1, 1)} width='200px'>
              <span className='inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer'>
                +{longItems.length - maxItem}
              </span>
            </Dropdown>
          }
        />
      </div>
    );
  }
};

export const ModernDropdown: Story = {
  render: () => {
    const longItems: BreadcrumbItem[] = [
      { title: 'Home', href: '/' },
      { title: 'Library', href: '/library' },
      { title: 'Documents', href: '/library/documents' },
      { title: 'Projects', href: '/library/documents/projects' },
      { title: 'Annual Report', href: '/library/documents/projects/annual' }
    ];

    return (
      <div className='flex flex-col gap-4'>
        <Breadcrumb
          items={longItems}
          size='md'
          maxItem={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
          separator='chevron-right'
          variant='underlined'
          textColor='text-slate-600 dark:text-slate-400'
          collapsedElement={
            <Dropdown items={getDropdownForItems(longItems, 3, 1, 1)} width='200px'>
              <span className='inline-flex items-center justify-center h-6 px-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'>
                {longItems.length - maxItem} more
              </span>
            </Dropdown>
          }
        />

        <Breadcrumb
          items={longItems}
          size='md'
          maxItem={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
          separator='chevron-right'
          variant='underlined'
          textColor='text-blue-600 dark:text-blue-400'
          collapsedElement={
            <Dropdown items={getDropdownForItems(longItems, 3, 1, 1)} width='200px'>
              <span className='inline-flex items-center justify-center h-7 min-w-[28px] px-2 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors'>
                +{longItems.length - maxItem}
              </span>
            </Dropdown>
          }
        />

        <Breadcrumb
          items={longItems}
          size='md'
          maxItem={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
          separator='/'
          variant='underlined'
          rounded='lg'
          textColor='text-gray-700 dark:text-gray-300'
          className='shadow-sm'
          collapsedElement={
            <Dropdown items={getDropdownForItems(longItems, 3, 1, 1)} width='200px'>
              <button className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <Icon name='more-horizontal' size={14} />
                <span>{longItems.length - maxItem} more</span>
              </button>
            </Dropdown>
          }
        />
      </div>
    );
  }
};

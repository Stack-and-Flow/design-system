import Badge from '@/components/atoms/badge';
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
    variant: 'regular',
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
    containerClassName: '',
    linkClassName: 'dark:text-white dark:hover:text-white'
  }
};

const textHoverStyleInDarkMode = 'dark:text-white dark:hover:text-white';
/**
 * - **Sizes**: Different size variants for the breadcrumb component (xs,sm, md, lg, xl).
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='sm'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        linkClassName={textHoverStyleInDarkMode}
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        linkClassName={textHoverStyleInDarkMode}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        linkClassName={textHoverStyleInDarkMode}
      />
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
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='sm'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        linkClassName={`text-blue-800 hover:text-blue-600 ${textHoverStyleInDarkMode}`}
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        linkClassName={`text-red-800 hover:text-red-600 dark:text-white ${textHoverStyleInDarkMode}`}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        linkClassName={`text-purple-800 hover:text-purple-600 ${textHoverStyleInDarkMode}`}
      />
    </div>
  )
};

/**
 * Different visual styles including regular, underlined, bordered, line variants.
 * - ⚠️ Some variants use a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background using the bgColor property.
 *
 */
const newStylesLinkClassName = `hover:text-gray-700 ${textHoverStyleInDarkMode}`;
export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='regular'
        linkClassName={newStylesLinkClassName}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        linkClassName={newStylesLinkClassName}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='bordered'
        linkClassName={newStylesLinkClassName}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='line'
        linkClassName={newStylesLinkClassName}
      />
    </div>
  )
};

/**
 * - **Border Radius**: Allows you to apply different border radius to the container: md, xs, sm, lg, xl, full, none.
 */

export const Rounded: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='regular'
        linkClassName={newStylesLinkClassName}
        rounded={'xs'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        linkClassName={newStylesLinkClassName}
        rounded={'lg'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='bordered'
        linkClassName={newStylesLinkClassName}
        rounded={'xl'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='underlined'
        linkClassName={newStylesLinkClassName}
        rounded={'full'}
      />
    </div>
  )
};

/**
 * - Allows you to apply a separator between elements. You can use any Lucide React icon or the characters /, |, >.
  - Simply enter the name of the Lucide React icon or the characters mentioned above in the “separator” property.
 */

export const Separatators: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='chevron-right'
        variant='regular'
        linkClassName={newStylesLinkClassName}
        rounded={'xs'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='|'
        variant='underlined'
        linkClassName={newStylesLinkClassName}
        rounded={'lg'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='home'
        variant='bordered'
        linkClassName={newStylesLinkClassName}
        rounded={'xl'}
      />
    </div>
  )
};

/**
 * - **Hidden Separators**: Toggle separator visibility with the hideSeparator prop.
 *   This is useful when you want to display breadcrumb items without visual separators between them.
 */

export const HiddenSeparator: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='chevron-right'
        hideSeparator={true}
        variant='regular'
        linkClassName={newStylesLinkClassName}
        rounded={'xs'}
      />
    </div>
  )
};

/**
 * - **Start and End Content**: Add icons or content at the beginning and end of the breadcrumb.
 * - Use the startContent and endContent props.
 */
export const BeforeAndAfterLinkIcon: Story = {
  render: () => (
    <div className='flex flex-col gap-2 w-fit'>
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='chevron-right'
        variant='regular'
        startContent='home'
        endContent='accessibility'
        linkClassName={newStylesLinkClassName}
        rounded={'xs'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='|'
        variant='underlined'
        startContent='home'
        linkClassName={newStylesLinkClassName}
        rounded={'lg'}
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='bordered'
        endContent='accessibility'
        linkClassName={newStylesLinkClassName}
        rounded={'xl'}
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
      linkClassName={newStylesLinkClassName}
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
      <div className='flex flex-col gap-2 w-fit'>
        <Breadcrumb
          items={items}
          size='md'
          maxItem={maxItem}
          itemsAfterCollapse={itemsAfterCollapse}
          itemsBeforeCollapse={itemsBeforeCollapse}
          linkClassName={newStylesLinkClassName}
          variant='underlined'
          collapsedElement={
            <Dropdown items={getDropdownForItems(items, 2, 1, 1)} width='200px'>
              <DynamicIcon name='ellipsis-vertical' className='cursor-pointer' />
            </Dropdown>
          }
        />

        <Breadcrumb
          items={items}
          size='md'
          maxItem={maxItem}
          itemsAfterCollapse={itemsAfterCollapse}
          itemsBeforeCollapse={itemsBeforeCollapse}
          linkClassName={newStylesLinkClassName}
          variant='underlined'
          collapsedElement={
            <Dropdown items={getDropdownForItems(items, 2, 1, 1)} width='200px'>
              <div className='relative inline-flex items-center justify-center w-6 h-6 hover:cursor-pointer'>
                <Badge content={items.length - maxItem} size='sm' className='absolute -top-1 -right-1' />
              </div>
            </Dropdown>
          }
        />
      </div>
    );
  }
};

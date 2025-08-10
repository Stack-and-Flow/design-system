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
      control: { type: 'number', min: 2 }
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
    variant: 'solid',
    bgColor: 'default',
    rounded: 'md',
    size: 'md',
    colorText: '',
    separator: '/',
    iconCollapse: 'accessibility',
    startContent: undefined,
    endContent: undefined,
    hideSeparator: false,
    maxItem: 0,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
    className: ''
    // shadow:
  }
};

/**
 * - **Sizes**: Different size variants for the breadcrumb component (sm, md, lg).
 *   This demonstrates how the breadcrumb scales across different size requirements for various UI contexts.
 */
export const Sizes: Story = {
  render: () => (
    <div>
      <Breadcrumb items={items} size='sm' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
      <Breadcrumb items={items} size='md' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
      <Breadcrumb items={items} size='lg' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
    </div>
  )
};

/**
 * - **Colors**: Text color variations using the colorText prop.
 *   This shows how to apply different color themes to breadcrumb text for better visual integration with your design system.
 */
export const Colors: Story = {
  render: () => (
    <div>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        colorText='red'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        colorText='blue'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        colorText='indigo'
      />
    </div>
  )
};

/**
 * - **Visual Variants**: Different visual styles including bordered, solid, and default variants.
 *   This demonstrates the various background and border styling options available for the breadcrumb component.
 */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='bordered'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        variant='outline'
        bgColor='primary'
        colorText='white'
      />
      <Breadcrumb items={items} size='md' maxItem={0} itemsAfterCollapse={1} itemsBeforeCollapse={1} separator='/' />
    </div>
  )
};

/**
 * - **Border Radius**: Toggle between rounded and square corners using the rounded prop.
 *   This shows how to control the corner styling of breadcrumb containers for different design aesthetics.
 *   Toggle true or false.
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
        rounded={'sm'}
        variant='bordered'
      />
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
    </div>
  )
};

/**
 * - **Separators**: Different types of separators including text characters (/, |, >) and dynamic icons.
 *   This demonstrates the flexibility of the separator prop to use both string characters and icon names.
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
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        hideSeparator={false}
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        hideSeparator={true}
      />
    </div>
  )
};

/**
 * - **Start and End Content**: Add icons or content at the beginning and end of the breadcrumb.
 *   This enhances the breadcrumb with contextual icons like home icons at the start or external link indicators at the end.
 */
export const WithStartEndContent: Story = {
  render: () => (
    <div>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        startContent='home'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
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
        endContent='external-link'
      />
    </div>
  )
};

/**
 * - **Maximum Items and Collapse**: Control the number of visible items with automatic collapsing using icons.
 *   This is essential for managing long breadcrumb trails by showing only key items and collapsing the middle ones.
 */
export const MaxItemsAndCollapse: Story = {
  render: () => (
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={2}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        iconCollapse='ellipsis-vertical'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={2}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        iconCollapse='ellipsis'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={2}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        iconCollapse='airplay'
      />
    </div>
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
 * - **Custom Collapse Elements**: Use custom JSX elements instead of icons for collapsed breadcrumb sections.
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
        collapsedElement={
          <Dropdown items={getDropdownForItems(items, 2, 1, 1)} width='200px'>
            <DynamicIcon name='ellipsis-vertical' />
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
        variant='bordered'
        rounded={'sm'}
        // shadow={true}
        startContent='home'
        endContent='external-link'
        colorText='blue'
        iconCollapse='more-horizontal'
        collapsedElement={
          <Dropdown items={getDropdownForItems(items, 2, 1, 1)} width='200px'>
            <DynamicIcon name='ellipsis-vertical' className='text-blue-500' />
          </Dropdown>
        }
      />
      <Breadcrumb
        items={items}
        size='lg'
        maxItem={2}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='|'
        variant='outline'
        // rounded={false}
        // shadow={false}
        iconCollapse='ellipsis'
      />
    </div>
  )
};

/**
 * - **Custom CSS Classes**: Apply custom styling through the className prop.
 *   This demonstrates how to extend the default breadcrumb appearance with custom borders, gradients, and other CSS effects.
 */
export const CustomClassName: Story = {
  render: () => (
    <div className='flex flex-col gap-0.5'>
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        className='border-2 border-dashed border-red-500'
      />
      <Breadcrumb
        items={items}
        size='md'
        maxItem={0}
        itemsAfterCollapse={1}
        itemsBeforeCollapse={1}
        separator='/'
        className='bg-gradient-to-r from-purple-400 to-pink-400 text-white p-2'
      />
    </div>
  )
};

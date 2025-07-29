import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbItem } from './types';

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
  title: 'Atoms/Breadcrumb',
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
    separator: '/',
    size: 'md',
    rounded: false,
    className: 'text-white',
    shadow: false,
    startContent: undefined,
    endContent: undefined,
    hideSeparator: false,
    maxItem: 2,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
    iconCollapse: 'ellipsis'
  }
};

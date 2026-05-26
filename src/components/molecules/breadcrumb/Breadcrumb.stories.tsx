import type { Meta, StoryObj } from '@storybook/react';
import { DynamicIcon } from 'lucide-react/dynamic.js';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbItem } from './types';

/**
 * ## Description
 * Breadcrumb displays the current navigation path and keeps the current page non-interactive.
 * Link hover stays on each item, while collapsed items use an accessible trigger.
 */
const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
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
  { title: 'Components', href: '/components' },
  { title: 'Breadcrumb', href: '/components/breadcrumb' }
];

const itemsWithContent: BreadcrumbItem[] = [
  { title: 'Home', href: '/', startContent: 'house' },
  { title: 'Library', href: '/library', endContent: 'chevron-right' },
  {
    title: 'Documentation',
    href: '/docs',
    startContent: <DynamicIcon name='folder-open' size={14} aria-hidden='true' />,
    endContent: <DynamicIcon name='external-link' size={14} aria-hidden='true' />
  },
  { title: 'Breadcrumb' }
];

const collapsedItems: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Library', href: '/library' },
  { title: 'Components', href: '/components' },
  { title: 'Navigation', href: '/components/navigation' },
  { title: 'Breadcrumb' }
];

/**
 * Default breadcrumb with the transparent, borderless container style.
 */
export const Default: Story = {
  args: {
    items
  }
};

/**
 * Size variants for the breadcrumb container and current item.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex w-fit flex-col gap-3'>
      <Breadcrumb items={items} size='sm' />
      <Breadcrumb items={items} size='md' />
      <Breadcrumb items={items} size='lg' />
    </div>
  )
};

/**
 * Available visual variants for the breadcrumb container.
 */
export const Variants: Story = {
  render: () => (
    <div className='flex w-fit flex-col gap-3'>
      <Breadcrumb items={items} variant='regular' />
      <Breadcrumb items={items} variant='bordered' />
      <Breadcrumb items={items} variant='underlined' />
      <Breadcrumb items={items} variant='line' />
    </div>
  )
};

/**
 * Start and end content stay inside the same clickable breadcrumb item.
 */
export const WithItemContent: Story = {
  render: () => (
    <Breadcrumb
      items={itemsWithContent}
      separator={<DynamicIcon name='chevron-right' size={14} aria-hidden='true' />}
    />
  )
};

/**
 * The last item stays non-interactive even when link styles are customized.
 */
export const CurrentItem: Story = {
  render: () => <Breadcrumb items={items} />
};

/**
 * Collapsed items use an accessible trigger with tooltip support.
 */
export const Collapsed: Story = {
  args: {
    items: collapsedItems,
    maxItems: 3,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
    separator: <DynamicIcon name='chevron-right' size={14} aria-hidden='true' />,
    showTooltip: true
  }
};

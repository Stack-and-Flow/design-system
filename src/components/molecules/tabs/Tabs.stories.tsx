import { Icon } from '@atoms/icon';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';
import type { TabsItem } from './types';

const baseItems: TabsItem[] = [
  {
    key: 'overview',
    title: 'Overview',
    content: 'Use Tabs to switch between related content sections without leaving the current context.'
  },
  {
    key: 'usage',
    title: 'Usage',
    content:
      'Prefer automatic activation for concise content and manual activation when panels are dense or expensive to render.'
  },
  {
    key: 'accessibility',
    title: 'Accessibility',
    content:
      'Arrow keys move between tabs, Home and End jump to the edges, and Enter or Space activates the focused tab in manual mode.'
  }
];

/**
 * ## Description
 * Tabs groups related views behind a shared tablist so people can move between sections with consistent keyboard support and semantic panel relationships.
 * It works well for settings, documentation sections, dashboard slices, and navigation where only one content panel should be active at a time.
 *
 * ## Usage Guide
 * Provide `aria-label` or `aria-labelledby` so the tablist has an accessible name.
 * Define each tab through `items`: `key` is the stable selection value, `title` renders the visible tab label, and `content` accepts any React node for the associated panel, not only strings.
 * Use `titleValue` when the visual title is not plain text, `icon` for decorative or meaningful tab adornments, `disabled` or `disabledKeys` for unavailable tabs, and the anchor fields (`href`, `target`, `rel`, `download`, `ping`, `referrerPolicy`) when a tab should also navigate.
 * Use `activationMode="manual"` when panels contain heavy content, and keep `destroyInactiveTabPanel={false}` when inactive panels should stay mounted.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Tabs>;

/**
 * Demonstrates the baseline solid tabs API with the component defaults and uncontrolled selection.
 */
export const Default: Story = {
  args: {
    items: baseItems,
    'aria-label': 'Documentation sections',
    onValueChange: action('value change')
  }
};

/**
 * The bordered variant increases structural definition when tabs sit near other dense content blocks.
 */
export const Bordered: Story = {
  args: {
    ...Default.args,
    variant: 'bordered'
  }
};

/**
 * The light variant keeps the surface minimal while still showing a semantic selected state.
 */
export const Light: Story = {
  args: {
    ...Default.args,
    variant: 'light'
  }
};

/**
 * The underlined variant is useful for lightweight navigation strips where the active indicator should stay subtle.
 */
export const Underlined: Story = {
  args: {
    ...Default.args,
    variant: 'underlined'
  }
};

/**
 * Vertical placement switches the interaction model to `aria-orientation="vertical"` while keeping the same item API.
 */
export const Vertical: Story = {
  args: {
    ...Default.args,
    placement: 'left'
  }
};

/**
 * Full-width tabs distribute horizontal items evenly, which is useful for dashboard or pricing-style layouts.
 */
export const FullWidth: Story = {
  args: {
    ...Default.args,
    fullWidth: true
  }
};

/**
 * This story isolates the semantic `color` prop so reviewers can compare accent treatments without mixing it with other variant differences.
 */
export const Colors: Story = {
  render: () => {
    return (
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col gap-2'>
          <span className='fs-small font-semibold tracking-ui text-text-secondary-light dark:text-text-secondary-dark'>
            Primary
          </span>
          <Tabs
            items={baseItems}
            aria-label='Primary documentation sections'
            color='primary'
            onValueChange={action('primary value change')}
          />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <span className='fs-small font-semibold tracking-ui text-text-secondary-light dark:text-text-secondary-dark'>
            Success
          </span>
          <Tabs
            items={baseItems}
            aria-label='Success documentation sections'
            color='success'
            onValueChange={action('success value change')}
          />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <span className='fs-small font-semibold tracking-ui text-text-secondary-light dark:text-text-secondary-dark'>
            Warning
          </span>
          <Tabs
            items={baseItems}
            aria-label='Warning documentation sections'
            color='warning'
            onValueChange={action('warning value change')}
          />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <span className='fs-small font-semibold tracking-ui text-text-secondary-light dark:text-text-secondary-dark'>
            Info
          </span>
          <Tabs
            items={baseItems}
            aria-label='Info documentation sections'
            color='info'
            onValueChange={action('info value change')}
          />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <span className='fs-small font-semibold tracking-ui text-text-secondary-light dark:text-text-secondary-dark'>
            Error
          </span>
          <Tabs
            items={baseItems}
            aria-label='Error documentation sections'
            color='error'
            onValueChange={action('error value change')}
          />
        </div>
      </div>
    );
  }
};

/**
 * Manual activation keeps focus movement separate from selection until users confirm with Enter or Space.
 */
export const ManualActivation: Story = {
  args: {
    ...Default.args,
    activationMode: 'manual'
  }
};

/**
 * Item icons can reinforce each tab meaning without changing the tablist keyboard model.
 */
export const WithIcons: Story = {
  args: {
    ...Default.args,
    items: [
      {
        key: 'overview',
        title: 'Overview',
        icon: <Icon decorative={true} name='layout-dashboard' size={18} />,
        content: baseItems[0]?.content
      },
      {
        key: 'usage',
        title: 'Usage',
        icon: <Icon decorative={true} name='play' size={18} />,
        content: baseItems[1]?.content
      },
      {
        key: 'accessibility',
        title: 'Accessibility',
        icon: <Icon decorative={true} name='accessibility' size={18} />,
        content: baseItems[2]?.content
      }
    ]
  }
};

/**
 * Tab panel `content` accepts any React node, so panels can render structured layouts instead of plain strings.
 */
export const RichContent: Story = {
  args: {
    ...Default.args,
    items: [
      {
        key: 'summary',
        title: 'Summary',
        content: (
          <div className='grid gap-3 rounded-lg border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
            <h3 className='fs-h6 font-semibold text-text-light dark:text-text-dark'>Release summary</h3>
            <p className='text-text-secondary-light dark:text-text-secondary-dark'>
              Use rich panel content for summaries, settings, forms, dashboards, or any composition that belongs to the
              selected tab.
            </p>
          </div>
        )
      },
      {
        key: 'metrics',
        title: 'Metrics',
        content: (
          <div className='grid gap-2 rounded-lg border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
            <span className='fs-small font-semibold tracking-ui text-text-secondary-light dark:text-text-secondary-dark'>
              Weekly usage
            </span>
            <strong className='fs-h4 text-brand-light dark:text-brand-dark'>24.8k events</strong>
          </div>
        )
      },
      {
        key: 'notes',
        title: 'Notes',
        content: (
          <ul className='grid gap-2 rounded-lg border border-border-light bg-surface-light p-4 text-text-secondary-light dark:border-border-dark dark:bg-surface-dark dark:text-text-secondary-dark'>
            <li>Keep keyboard focus inside the active panel flow.</li>
            <li>Use semantic markup inside each panel.</li>
            <li>Preserve `aria-label` or `aria-labelledby` on the tablist.</li>
          </ul>
        )
      }
    ]
  }
};

/**
 * Disabled items remain visible in the tablist but are skipped by keyboard roving focus and cannot be selected.
 */
export const DisabledItem: Story = {
  args: {
    ...Default.args,
    items: [baseItems[0], { ...baseItems[1], disabled: true }, baseItems[2]]
  }
};

/**
 * This controlled example keeps the selected key in parent state so routing, analytics, or persistence can observe value changes.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('usage');

    return (
      <Tabs
        items={baseItems}
        value={value}
        aria-label='Controlled documentation sections'
        onValueChange={(nextValue) => {
          action('value change')(nextValue);
          setValue(nextValue);
        }}
      />
    );
  }
};

/**
 * Keeping inactive panels mounted is useful when tab content holds local state or expensive layout measurements.
 */
export const PersistentPanels: Story = {
  args: {
    ...Default.args,
    destroyInactiveTabPanel: false,
    variant: 'bordered'
  }
};

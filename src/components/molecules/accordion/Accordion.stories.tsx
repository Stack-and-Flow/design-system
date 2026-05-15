import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion } from './Accordion';
import type { AccordionItem } from './types';

const baseItems: AccordionItem[] = [
  {
    id: 'overview',
    title: 'What is Stack-and-Flow?',
    content: 'Stack-and-Flow is a React design system focused on accessible, token-driven components.'
  },
  {
    id: 'usage',
    title: 'When should I use Accordion?',
    content: 'Use Accordion to organize related content sections when users only need to inspect some of them.'
  },
  {
    id: 'accessibility',
    title: 'How does keyboard navigation work?',
    content:
      'Use Tab to enter the accordion, arrow keys to move between triggers, and Enter or Space to toggle a panel.'
  }
];

/**
 * ## DESCRIPTION
 * Accordion organizes related content into collapsible sections so users can scan headings first and expand only the panels they need.
 * It is best for FAQs, settings groups, documentation sections, and dense explanatory content where showing everything at once would add noise.
 *
 * ## BEHAVIOR
 * - Renders a list of items with a trigger and an associated panel.
 * - Supports uncontrolled usage with `defaultExpandedKeys`.
 * - Supports controlled usage with `expandedKeys` and `onExpandedChange`.
 * - Supports single-section expansion by default, or multiple open sections with `allowsMultipleExpanded`.
 * - Allows closing the active section with `allowsToggle`.
 * - Supports disabled state at both accordion and item level.
 *
 * ## VISUAL OPTIONS
 * - `variant`: `default`, `surface`, `bordered`, `ghost`.
 * - `size`: `sm`, `md`, `lg`.
 * - `hideSeparator`: removes item dividers for softer grouped surfaces.
 * - `indicator`: lets each item provide a custom decorative expand/collapse marker.
 *
 * ## ACCESSIBILITY
 * - Each trigger is a native `button`.
 * - Triggers expose `aria-expanded`, `aria-controls`, and stable ids.
 * - Panels expose `aria-labelledby` and are hidden when collapsed.
 * - Keyboard users can toggle with Enter or Space.
 * - Arrow Up, Arrow Down, Home, and End move focus between enabled triggers.
 * - Disabled items are skipped by keyboard navigation.
 *
 * ## DEPENDENCIES
 * - Native `button` elements for trigger semantics.
 * - CVA for visual variants and size styles.
 * - Token classes from `theme.css` for surfaces, borders, text, focus ring, spacing, and disabled states.
 */
const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      autodocs: true,
      description: {
        component:
          'Accordion renders accessible collapsible content sections with controlled and uncontrolled expansion modes.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: baseItems,
    onExpandedChange: action('expanded change')
  }
};

/**
 * The `surface` variant wraps accordion items in a raised surface.
 * Use it when the accordion needs to read as a grouped content block.
 */
export const Surface: Story = {
  args: {
    ...Default.args,
    variant: 'surface'
  }
};

/**
 * The `bordered` variant increases container definition with stronger borders.
 * Use it when the accordion sits near other dense content and needs clearer separation.
 */
export const Bordered: Story = {
  args: {
    ...Default.args,
    variant: 'bordered'
  }
};

/**
 * The `ghost` variant removes strong container styling.
 * Use it for FAQ-like content where headings should feel lightweight.
 */
export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost'
  }
};

/**
 * The `sm` size reduces spacing and text scale for compact layouts.
 */
export const Small: Story = {
  args: {
    ...Default.args,
    size: 'sm'
  }
};

/**
 * The `lg` size increases trigger and panel spacing for prominent content groups.
 */
export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg'
  }
};

/**
 * `allowsMultipleExpanded` lets users keep more than one panel open at a time.
 * This is useful for comparison or documentation pages where sections are related.
 */
export const MultipleExpanded: Story = {
  args: {
    ...Default.args,
    allowsMultipleExpanded: true,
    defaultExpandedKeys: ['overview', 'accessibility']
  }
};

/**
 * The controlled pattern uses `expandedKeys` plus `onExpandedChange`.
 * Use this when parent state, routing, persistence, or analytics need to observe expansion state.
 */
export const Controlled: Story = {
  render: () => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>(['overview']);

    return (
      <Accordion
        items={baseItems}
        expandedKeys={expandedKeys}
        onExpandedChange={(keys) => {
          action('expanded change')(keys);
          setExpandedKeys(keys);
        }}
      />
    );
  }
};

/**
 * The `disabled` prop disables every trigger in the accordion.
 * Disabled accordions preserve visual structure while preventing expansion changes.
 */
export const DisabledAccordion: Story = {
  args: {
    ...Default.args,
    disabled: true,
    defaultExpandedKeys: ['overview']
  }
};

/**
 * Item-level `disabled` prevents interaction with one section while keeping other sections available.
 */
export const DisabledItem: Story = {
  args: {
    ...Default.args,
    items: [
      baseItems[0],
      {
        ...baseItems[1],
        disabled: true
      },
      baseItems[2]
    ],
    defaultExpandedKeys: ['overview']
  }
};

/**
 * `hideSeparator` removes item dividers for softer grouped surfaces.
 */
export const WithoutSeparator: Story = {
  args: {
    ...Default.args,
    hideSeparator: true,
    variant: 'surface'
  }
};

/**
 * Each item can provide a custom `indicator` node.
 * Keep custom indicators decorative and let the trigger text communicate the section label.
 */
export const CustomIndicator: Story = {
  args: {
    ...Default.args,
    items: baseItems.map((item) => ({
      ...item,
      indicator: <span className='font-bold text-brand-light dark:text-brand-dark'>+</span>
    }))
  }
};

/**
 * Long panel content should remain readable with consistent spacing, text color, and line height.
 */
export const LongContent: Story = {
  args: {
    ...Default.args,
    defaultExpandedKeys: ['long-content'],
    items: [
      {
        id: 'long-content',
        title: 'Long implementation guidance',
        content:
          'Accordions should keep content scannable without hiding critical actions. Long content remains readable with consistent panel spacing, text color, and line height.'
      },
      ...baseItems
    ]
  }
};

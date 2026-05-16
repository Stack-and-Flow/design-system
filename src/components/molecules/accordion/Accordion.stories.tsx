import { Icon } from '@atoms/icon';
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
 * ## Description
 * Accordion organizes related content into collapsible sections so users can scan headings first and expand only the panels they need.
 * It is best for FAQs, settings groups, documentation sections, and dense explanatory content where showing everything at once would add noise.
 *
 * ## Dependencies
 * - `Header` atom for item heading semantics.
 * - `Text` atom for string panel content.
 * - `Icon` atom for the default and custom indicators.
 *
 * ## Usage Guide
 * Use uncontrolled props (`defaultExpandedKeys`) for static content and controlled props (`expandedKeys`, `onExpandedChange`) when parent state, routing, persistence, or analytics need to observe expansion state.
 * Use `allowsMultipleExpanded` when users need to compare multiple panels, and keep custom indicators decorative because the trigger text owns the accessible label.
 */
const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      autodocs: true
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
 * `headingLevel` changes the semantic heading level while preserving the accordion interaction model.
 * Use it to keep the page outline correct when the accordion appears under different sections.
 */
export const HeadingLevel: Story = {
  args: {
    ...Default.args,
    headingLevel: 'h4'
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
      indicator: <Icon name='plus' size={18} color='text-color-brand-light' colorDark='dark:text-color-brand-dark' />
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

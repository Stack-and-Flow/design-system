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

export const Surface: Story = {
  args: {
    ...Default.args,
    variant: 'surface'
  }
};

export const Bordered: Story = {
  args: {
    ...Default.args,
    variant: 'bordered'
  }
};

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost'
  }
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'sm'
  }
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg'
  }
};

export const MultipleExpanded: Story = {
  args: {
    ...Default.args,
    allowsMultipleExpanded: true,
    defaultExpandedKeys: ['overview', 'accessibility']
  }
};

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

export const DisabledAccordion: Story = {
  args: {
    ...Default.args,
    disabled: true,
    defaultExpandedKeys: ['overview']
  }
};

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

export const WithoutSeparator: Story = {
  args: {
    ...Default.args,
    hideSeparator: true,
    variant: 'surface'
  }
};

export const CustomIndicator: Story = {
  args: {
    ...Default.args,
    items: baseItems.map((item) => ({
      ...item,
      indicator: <span className='font-bold text-brand-light dark:text-brand-dark'>+</span>
    }))
  }
};

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

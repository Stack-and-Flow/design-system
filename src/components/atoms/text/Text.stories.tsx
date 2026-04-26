import type { Meta, StoryObj } from '@storybook/react';
import Text from './Text';

/**
 * ## DESCRIPTION
 *
 * Text component is used to display text content with various styles and options.
 * It supports different fonts, tags, and can render HTML content if it's necessary.
 *
 */
const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false
  }
};

/**
 * - This option allows you to render the text as bold and prominent.
 * - It is useful for highlighting important text.
 */

export const Prominent: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: true,
    srOnly: false,
    isHtml: false
  }
};

/**
 * - This option allows you to render a custom tag instead of the default paragraph (`<p>`).
 * - You can specify any valid HTML tag such as `<span>` or `<small>`.
 */
export const CustomTag: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false
  }
};

/**
 * - You can asign a id if you need to reference the text element in your application.
 * - This is useful for linking to specific sections or elements within the page.
 */

export const WithId: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    id: 'text-id'
  }
};

/**
 * - You can assign a role to the text element for accessibility purposes.
 */

export const WithRole: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    role: 'status'
  }
};

/**
 * - This option allows you to render the text as HTML.
 * - Use this when you need to include HTML tags within the text content.
 */

export const WithHtml: Story = {
  args: {
    children: '<i>Lorem ipsum</i>',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: true
  }
};

/**
 * - This option allows you to customize the text color using Tailwind CSS classes.
 * - You can specify any valid Tailwind CSS color class to change the text color.
 */

export const CustomColors: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    className: 'text-yellow dark:text-pink'
  }
};
/**
 * - This option allows you to customize the text size using Tailwind CSS classes.
 * - You can specify any valid Tailwind CSS size class to change the text size.
 */

export const CustomSize: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    className: 'text-2xl'
  }
};

/**
 * - This option allows you to set the `aria-live` attribute for accessibility.
 * - It is useful for indicating to screen readers that the content may change dynamically.
 */

export const AriaLive: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    ariaLive: 'polite'
  }
};

/**
 * - This option allows you to render the text as screen reader only.
 * - It is useful for providing additional context or information that is not visible to sighted users.
 */
export const ScreenReaderOnly: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: true,
    isHtml: false
  }
};

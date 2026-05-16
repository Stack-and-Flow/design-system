import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

/**
 * ## Description
 * Text renders short and long-form copy with design-system typography tokens.
 *
 * ## Usage Guide
 * Use `tag` to choose the semantic element, `font` for typography weight presets,
 * `prominent` for emphasis, and `srOnly` for screen-reader-only helper copy.
 * HTML rendering is available for trusted rich text and is sanitized before render.
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
    prominent: false,
    srOnly: false,
    isHtml: false
  }
};

/** The `tag` prop controls semantic output while keeping tokenized typography. */
export const Tags: Story = {
  render: () => (
    <div className='grid gap-3'>
      <Text tag='p'>Paragraph text uses the base body rhythm.</Text>
      <Text tag='span'>Span text is inline-friendly and keeps the base size.</Text>
      <Text tag='small'>Small text is intended for captions, hints, and metadata.</Text>
    </div>
  )
};

/** Font presets map to the project typography tokens. */
export const Fonts: Story = {
  render: () => (
    <div className='grid gap-3'>
      <Text font='primary'>Primary font preset</Text>
      <Text font='secondary'>Secondary font preset</Text>
      <Text font='secondaryBold'>Secondary bold font preset</Text>
    </div>
  )
};

/** Use `prominent` for stronger emphasis without changing the semantic tag. */
export const Prominent: Story = {
  args: {
    children: 'Important supporting copy',
    font: 'secondary',
    prominent: true,
    srOnly: false,
    isHtml: false
  }
};

/** You can assign an `id` when the text needs to be referenced by another element. */
export const WithId: Story = {
  args: {
    children: 'Referenced text content',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    id: 'text-id'
  }
};

/** Use live-region roles only when content is dynamic. */
export const WithRole: Story = {
  args: {
    children: 'Saved successfully',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    role: 'status',
    ariaLive: 'polite'
  }
};

/** HTML content is sanitized before rendering. */
export const WithHtml: Story = {
  args: {
    children: '<strong>Formatted</strong> text with <em>safe inline emphasis</em>.',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: true
  }
};

/** Slot-level overrides should still use design-system token utilities. */
export const CustomTone: Story = {
  args: {
    children: 'Secondary text tone',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    className: 'text-text-secondary-light dark:text-text-secondary-dark'
  }
};

/** Size overrides should use the project fluid type scale. */
export const CustomSize: Story = {
  args: {
    children: 'Heading-sized body copy',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    className: 'fs-h6'
  }
};

/** `aria-live` announces dynamic text changes to assistive technology. */
export const AriaLive: Story = {
  args: {
    children: 'Background sync complete',
    font: 'secondary',
    tag: 'p',
    prominent: false,
    srOnly: false,
    isHtml: false,
    ariaLive: 'polite'
  }
};

/** Screen-reader-only text provides accessible context without visible copy. */
export const ScreenReaderOnly: Story = {
  args: {
    children: 'Additional screen reader context',
    font: 'secondary',
    tag: 'span',
    prominent: false,
    srOnly: true,
    isHtml: false
  }
};

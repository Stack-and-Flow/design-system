import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const stackClass =
  'flex flex-col gap-4 rounded-md border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark';

/**
 * ## Description
 * Header renders semantic `h1` through `h6` headings with design-system typography tokens.
 * Use it to preserve document outline while keeping heading visuals consistent.
 *
 * ## Usage Guide
 * Use `tag` for semantic hierarchy and `size` for visual scale. Keep heading levels
 * in document order for accessibility; do not pick a semantic tag only for styling.
 * `fontSize` remains supported as a backwards-compatible alias for `size`.
 */
const meta: Meta<typeof Header> = {
  title: 'Atoms/Header',
  component: Header,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    children: 'Build precise interfaces',
    font: 'primary',
    tag: 'h1',
    prominent: false,
    srOnly: false
  }
};

/** Semantic tags map to matching visual heading sizes by default. */
export const SemanticTags: Story = {
  render: () => (
    <div className={stackClass}>
      <Header tag='h1'>H1 semantic heading</Header>
      <Header tag='h2'>H2 semantic heading</Header>
      <Header tag='h3'>H3 semantic heading</Header>
      <Header tag='h4'>H4 semantic heading</Header>
      <Header tag='h5'>H5 semantic heading</Header>
      <Header tag='h6'>H6 semantic heading</Header>
    </div>
  )
};

/** Size changes visual scale without changing semantic level. */
export const VisualSizes: Story = {
  render: () => (
    <div className={stackClass}>
      <Header tag='h2' size='h1'>
        h2 rendered with H1 visual scale
      </Header>
      <Header tag='h2' size='h2'>
        h2 rendered with H2 visual scale
      </Header>
      <Header tag='h2' size='h3'>
        h2 rendered with H3 visual scale
      </Header>
      <Header tag='h2' size='h4'>
        h2 rendered with H4 visual scale
      </Header>
      <Header tag='h2' size='h5'>
        h2 rendered with H5 visual scale
      </Header>
      <Header tag='h2' size='h6'>
        h2 rendered with H6 visual scale
      </Header>
    </div>
  )
};

/** Font presets keep the single project font family while changing emphasis. */
export const Fonts: Story = {
  render: () => (
    <div className={stackClass}>
      <Header tag='h4' font='primary'>
        Primary heading
      </Header>
      <Header tag='h4' font='secondary'>
        Secondary heading
      </Header>
      <Header tag='h4' font='secondaryBold'>
        Secondary bold heading
      </Header>
    </div>
  )
};

/** Prominent headings increase emphasis without changing semantic level. */
export const Prominent: Story = {
  args: {
    children: 'Prominent heading',
    font: 'primary',
    tag: 'h2',
    prominent: true,
    srOnly: false
  }
};

/** Screen-reader-only headings provide accessible structure without visible text. */
export const ScreenReaderOnly: Story = {
  args: {
    children: 'Hidden section heading',
    font: 'primary',
    tag: 'h2',
    prominent: false,
    srOnly: true
  }
};

/** IDs allow headings to be referenced by links and ARIA relationships. */
export const WithId: Story = {
  args: {
    children: 'Referenced heading',
    font: 'primary',
    tag: 'h2',
    id: 'header-id',
    prominent: false,
    srOnly: false
  }
};

/** Slot-level color overrides should use design-system token utilities. */
export const CustomTone: Story = {
  args: {
    children: 'Secondary tone heading',
    font: 'primary',
    tag: 'h2',
    prominent: false,
    srOnly: false,
    className: 'text-text-secondary-light dark:text-text-secondary-dark'
  }
};

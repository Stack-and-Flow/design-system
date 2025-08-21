import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

/**
 * ## DESCRIPTION
 * Header component is used to display headings in various styles and sizes.
 * It supports different fonts, tags, and styles such as prominent and screen reader only.
 *
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
    children: 'Lorem ipsum',
    prominent: false,
    className: '',
    srOnly: false
  }
};

/**
 * - Different header tags (h1, h2, h3, h4, h5, h6) with primary font.
 */

export const PrimaryHeader: Story = {
  render: () => (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <Header tag='h1' font='primary'>
        Lorem Ipsum
      </Header>
      <Header tag='h2' font='primary'>
        Lorem Ipsum
      </Header>
      <Header tag='h3' font='primary'>
        Lorem Ipsum
      </Header>
      <Header tag='h4' font='primary'>
        Lorem Ipsum
      </Header>
      <Header tag='h5' font='primary'>
        Lorem Ipsum
      </Header>
      <Header tag='h6' font='primary'>
        Lorem Ipsum
      </Header>
    </div>
  )
};

/**
 * - Differnt header tags (h1, h2, h3, h4, h5, h6) with secondary font.
 */

export const SecondaryHeader: Story = {
  render: () => (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <Header tag='h1' font='secondary'>
        Lorem Ipsum
      </Header>
      <Header tag='h2' font='secondary'>
        Lorem Ipsum
      </Header>
      <Header tag='h3' font='secondary'>
        Lorem Ipsum
      </Header>
      <Header tag='h4' font='secondary'>
        Lorem Ipsum
      </Header>
      <Header tag='h5' font='secondary'>
        Lorem Ipsum
      </Header>
      <Header tag='h6' font='secondary'>
        Lorem Ipsum
      </Header>
    </div>
  )
};

/**
 * - Differnt header tags (h1, h2, h3, h4, h5, h6) with secondaryBold font.
 */

export const SecondaryHeaderBold: Story = {
  render: () => (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <Header tag='h1' font='secondaryBold'>
        Lorem Ipsum
      </Header>
      <Header tag='h2' font='secondaryBold'>
        Lorem Ipsum
      </Header>
      <Header tag='h3' font='secondaryBold'>
        Lorem Ipsum
      </Header>
      <Header tag='h4' font='secondaryBold'>
        Lorem Ipsum
      </Header>
      <Header tag='h5' font='secondaryBold'>
        Lorem Ipsum
      </Header>
      <Header tag='h6' font='secondaryBold'>
        Lorem Ipsum
      </Header>
    </div>
  )
};

/**
 * - You can use fontSize prop to change the font size of the header not changing the tag.
 *   For example, you can use `fontSize="h1"` to make the header look like an h1 tag but keep it as an h2 tag.
 */

export const FontSize: Story = {
  render: () => (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <Header tag='h5' fontSize='h1'>
        Lorem Ipsum
      </Header>
      <Header tag='h1' fontSize='h5'>
        Lorem Ipsum
      </Header>
    </div>
  )
};

/**
 * - Prominent prop makes the header bold.
 */
export const Prominent: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondaryBold',
    tag: 'h1',
    prominent: true,
    srOnly: false
  }
};

/**
 * - The `srOnly` prop hides the header visually but keeps it accessible for screen readers.
 */

export const ScreenReaderOnly: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondaryBold',
    tag: 'h1',
    prominent: false,
    srOnly: true
  }
};

/**
 * - You can use the `id` prop to set an ID for the header, which is useful for accessibility and linking.
 */
export const WithId: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondaryBold',
    tag: 'h1',
    prominent: false,
    srOnly: false,
    id: 'header-id'
  }
};

/**
 * - You can customize the header with a className.
 */

export const CustomColor: Story = {
  args: {
    children: 'Lorem ipsum',
    font: 'secondaryBold',
    tag: 'h1',
    prominent: false,
    srOnly: false,
    className: 'text-pink dark:text-pink'
  }
};

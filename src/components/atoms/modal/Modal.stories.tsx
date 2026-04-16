import type { Meta, StoryObj } from '@storybook/react';
import Button from '../button';
import IconButton from '../icon-button';
import Link from '../link';
import Modal from './Modal';

/**
 * ## DESCRIPTION
 * The Modal component is a versatile dialog box that can be used to display content, forms, or any other information in a focused manner. It supports various sizes, positions, and backdrop styles.
 * It can be triggered by a button or any other element, and it can contain custom headers, footers, and content.
 *
 * ## DEPENDENCIES
 * - [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)
 * - Header - for displaying a header in the modal
 * - Text - for displaying text content
 * - Icon - from Lucide React for the close button
 * - IconButton - for closing the modal
 * - Button - for closing the modal
 *
 */

const meta: Meta<typeof Modal> = {
  title: 'Atoms/Modal',
  component: Modal,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Modal>;

const CustomHeader = () => (
  <div className='w-full flex items-center justify-between bg-color-surface-light dark:bg-color-surface-dark border-1 border-color-brand-light dark:border-color-brand-dark border-dashed'>
    <p className='text-lg text-color-text-light dark:text-color-text-dark w-full text-center'>header</p>
  </div>
);

const CustomContent = () => (
  <div className='w-full flex items-center justify-between min-h-24 bg-color-surface-light dark:bg-color-surface-dark border-1 border-color-brand-light dark:border-color-brand-dark border-dashed'>
    <p className='text-lg text-color-text-light dark:text-color-text-dark w-full text-center'>content</p>
  </div>
);

const CustomFooter = () => (
  <div className='w-full flex items-center justify-between bg-color-surface-light dark:bg-color-surface-dark border-1 border-color-brand-light dark:border-color-brand-dark border-dashed'>
    <p className='text-lg text-color-text-light dark:text-color-text-dark w-full text-center'>footer</p>
  </div>
);

export const Default: Story = {
  args: {
    size: 'md',
    position: 'center',
    backdrop: 'opacity',
    children: <Button text='Open Modal' />,
    textContent: 'Modal content goes here.',
    title: 'Modal title'
  }
};

/**
 * - You can use the `header`, `content`, and `footer` props to customize the modal.
 * - The `header` prop can be used to display a custom header.
 * - The `content` prop can be used to display custom content.
 * - The `footer` prop can be used to display a custom footer.
 * - The `children` prop can be used to trigger the modal.
 */

export const WithCustomContent: Story = {
  args: {
    size: 'md',
    position: 'center',
    backdrop: 'opacity',
    children: <Button text='Open Modal' />,
    header: <CustomHeader />,
    content: <CustomContent />,
    footer: <CustomFooter />
  }
};

/**
 * - You can use a custom trigger element to open the modal.
 * - The `children` prop can be any React element that will trigger the modal when clicked.
 */

export const CustomTrigger: Story = {
  render: () => (
    <div className='flex justify-center items-center gap-4'>
      <Modal size='md' position='center' title='Custom Trigger Modal'>
        <Link size='md' variant='regular'>
          Lorem ipsum
        </Link>
      </Modal>
      <Modal size='md' position='center' title='Custom Trigger Modal'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Modal>
    </div>
  )
};

/**
 * - You can choose the size of the modal using the `size` prop.
 * - The `size` prop accepts the following values: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, and `full`.
 * - Each size corresponds to a different width and height of the modal.
 * - The modal will automatically adjust its size based on the content.
 */

export const Sizes: Story = {
  render: () => (
    <div className='max-w-full flex justify-center items-center gap-4 flex-wrap'>
      <Modal size='xs' title='XS'>
        <Button text='XS' />
      </Modal>
      <Modal size='sm' title='SM'>
        <Button text='SM' />
      </Modal>
      <Modal size='md' title='MD'>
        <Button text='MD' />
      </Modal>
      <Modal size='lg' title='LG'>
        <Button text='LG' />
      </Modal>
      <Modal size='xl' title='XL'>
        <Button text='XL' />
      </Modal>
      <Modal size='2xl' title='2XL'>
        <Button text='2XL' />
      </Modal>
      <Modal size='3xl' title='3XL'>
        <Button text='3XL' />
      </Modal>
      <Modal size='4xl' title='4XL'>
        <Button text='4XL' />
      </Modal>
      <Modal size='5xl' title='5XL'>
        <Button text='5XL' />
      </Modal>
      <Modal size='full' title='Full Screen'>
        <Button text='Full Screen' />
      </Modal>
    </div>
  )
};

/**
 * - You can choose the position of the modal using the `position` prop.
 * - The `position` prop accepts three values: `center`, `top`, and `bottom`.
 */

export const Positions: Story = {
  render: () => (
    <div className='flex justify-center items-center gap-4'>
      <Modal size='md' position='center' title='Center Position'>
        <Button text='Center Position' />
      </Modal>
      <Modal size='md' position='top' title='Top Position'>
        <Button text='Top Position' />
      </Modal>
      <Modal size='md' position='bottom' title='Bottom Position'>
        <Button text='Bottom Position' />
      </Modal>
    </div>
  )
};

/**
 * - You can choose the backdrop style of the modal using the `backdrop` prop.
 * - The `backdrop` prop accepts three values: `opacity`, `blur`, and `transparent`.
 * - The `opacity` backdrop provides a semi-transparent black background.
 * - The `blur` backdrop provides a blurred background effect.
 * - The `transparent` backdrop provides a fully transparent background.
 */

export const BackdropVariants: Story = {
  render: () => (
    <div className='flex justify-center items-center gap-4'>
      <Modal size='md' position='center' backdrop='opacity' title='Opacity Backdrop'>
        <Button text='Opacity Backdrop' />
      </Modal>
      <Modal size='md' position='center' backdrop='blur' title='Blur Backdrop'>
        <Button text='Blur Backdrop' />
      </Modal>
      <Modal size='md' position='center' backdrop='transparent' title='Transparent Backdrop'>
        <Button text='Transparent Backdrop' />
      </Modal>
    </div>
  )
};

/**
 * - You can customize teh backdrop of the modal using the `customBackdrop` prop.
 * - The `customBackdrop` prop accepts a string with Tailwind CSS classes to style the backdrop.
 * - This allows you to create unique visual effects, such as gradients or custom colors.
 */

export const CustomBackdrop: Story = {
  args: {
    size: 'md',
    position: 'center',
    customBackdrop: 'bg-linear-to-r from-red-500 to-background-dark',
    children: <Button text='Open Modal' />,
    title: 'Modal with Custom Backdrop'
  }
};

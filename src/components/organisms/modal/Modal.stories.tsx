import { Button } from '@atoms/button';
import { IconButton } from '@atoms/icon-button';
import { Link } from '@atoms/link';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import type { ModalActions } from './types';

/**
 * ## Description
 * Modal presents focused content in a dialog layer above the current page.
 *
 * ## Dependencies
 * Uses Radix Dialog for focus management and accessibility. The examples use `Button`, `IconButton`, and `Link` as trigger and footer content.
 *
 * ## Usage Guide
 * Use the default title and description props for standard confirmations. When you provide custom header or body content, also provide `title` and `textContent` so the dialog keeps a clear accessible name and description.
 * Custom `content` and `footer` can be render props that receive `{ close }`, allowing custom actions to dismiss the dialog without importing Radix internals.
 */
const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Modal>;

const CustomHeader = () => (
  <div className='rounded-md border border-border-light bg-surface-raised-light p-4 text-text-light dark:border-border-dark dark:bg-surface-raised-dark dark:text-text-dark'>
    <p className='fs-h6 font-semibold'>Transfer project ownership</p>
  </div>
);

const CustomBody = () => (
  <div className='rounded-md border border-border-light bg-surface-raised-light p-4 text-text-secondary-light dark:border-border-dark dark:bg-surface-raised-dark dark:text-text-secondary-dark'>
    <p>This action moves all billing and repository permissions to the new owner.</p>
  </div>
);

const CustomFooter = ({ close }: ModalActions) => {
  const handleCancel = () => {
    action('cancel-click')();
    close();
  };

  return (
    <div className='flex w-full justify-end gap-3'>
      <Button text='Cancel' variant='ghost' onClick={handleCancel} />
      <Button text='Transfer' variant='primary' onClick={action('transfer-click')} />
    </div>
  );
};

/**
 * Shows the default dialog configuration using its default variants.
 */
export const Default: Story = {
  args: {
    children: <Button text='Open modal' />,
    title: 'Delete workspace',
    textContent: 'This action removes the workspace and all related content.'
  }
};

/**
 * Shows a disabled trigger that keeps the dialog unavailable.
 */
export const Disabled: Story = {
  args: {
    children: <Button disabled={true} text='Open modal' />,
    title: 'Disabled modal trigger',
    textContent: 'This dialog cannot be opened until the trigger is enabled.'
  }
};

/**
 * Shows the full size scale from `xs` to `full`.
 */
export const Size: Story = {
  render: () => (
    <div className='flex max-w-full flex-wrap items-center justify-center gap-4'>
      <Modal size='xs' title='XS modal' textContent='Preview for the xs size.'>
        <Button emphasis='flat' text='XS' variant='secondary' />
      </Modal>
      <Modal size='sm' title='SM modal' textContent='Preview for the sm size.'>
        <Button emphasis='flat' text='SM' variant='secondary' />
      </Modal>
      <Modal size='md' title='MD modal' textContent='Preview for the md size.'>
        <Button emphasis='flat' text='MD' variant='secondary' />
      </Modal>
      <Modal size='lg' title='LG modal' textContent='Preview for the lg size.'>
        <Button emphasis='flat' text='LG' variant='secondary' />
      </Modal>
      <Modal size='xl' title='XL modal' textContent='Preview for the xl size.'>
        <Button emphasis='flat' text='XL' variant='secondary' />
      </Modal>
      <Modal size='2xl' title='2XL modal' textContent='Preview for the 2xl size.'>
        <Button emphasis='flat' text='2XL' variant='secondary' />
      </Modal>
      <Modal size='3xl' title='3XL modal' textContent='Preview for the 3xl size.'>
        <Button emphasis='flat' text='3XL' variant='secondary' />
      </Modal>
      <Modal size='4xl' title='4XL modal' textContent='Preview for the 4xl size.'>
        <Button emphasis='flat' text='4XL' variant='secondary' />
      </Modal>
      <Modal size='5xl' title='5XL modal' textContent='Preview for the 5xl size.'>
        <Button emphasis='flat' text='5XL' variant='secondary' />
      </Modal>
      <Modal size='full' title='Full modal' textContent='Preview for the full-screen size.'>
        <Button emphasis='flat' text='FULL' variant='secondary' />
      </Modal>
    </div>
  )
};

/**
 * Shows the available dialog placements inside the viewport.
 */
export const Position: Story = {
  render: () => (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      <Modal
        position='center'
        title='Centered dialog'
        textContent='Centered placement keeps the dialog anchored in the middle.'
      >
        <Button emphasis='flat' text='Center' variant='secondary' />
      </Modal>
      <Modal position='top' title='Top dialog' textContent='Top placement keeps the dialog close to the viewport edge.'>
        <Button emphasis='flat' text='Top' variant='secondary' />
      </Modal>
      <Modal
        position='bottom'
        title='Bottom dialog'
        textContent='Bottom placement is useful for mobile-oriented action sheets.'
      >
        <Button emphasis='flat' text='Bottom' variant='secondary' />
      </Modal>
    </div>
  )
};

/**
 * Shows the supported backdrop treatments for the overlay.
 */
export const Backdrop: Story = {
  render: () => (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      <Modal backdrop='opacity' title='Opacity backdrop' textContent='Uses the default overlay token without blur.'>
        <Button emphasis='flat' text='Opacity' variant='secondary' />
      </Modal>
      <Modal backdrop='blur' title='Blur backdrop' textContent='Uses the overlay blur token for extra separation.'>
        <Button emphasis='flat' text='Blur' variant='secondary' />
      </Modal>
      <Modal
        backdrop='transparent'
        title='Transparent backdrop'
        textContent='Keeps the page visible while preserving dialog focus handling.'
      >
        <Button emphasis='flat' text='Transparent' variant='secondary' />
      </Modal>
    </div>
  )
};

/**
 * Shows custom header, content, and footer slots while preserving accessible title and description text.
 */
export const CustomContent: Story = {
  args: {
    children: <Button text='Open custom modal' />,
    title: 'Transfer project ownership',
    textContent: 'Review the ownership transfer details before continuing.',
    header: <CustomHeader />,
    content: <CustomBody />,
    footer: (actions) => <CustomFooter {...actions} />
  }
};

/**
 * Shows that any single interactive element can be used as the dialog trigger.
 */
export const CustomTrigger: Story = {
  render: () => (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      <Modal
        title='Link trigger modal'
        textContent='A text link can open the dialog when it is the single trigger element.'
      >
        <Link size='md' variant='regular'>
          Read deployment details
        </Link>
      </Modal>
      <Modal
        title='Icon trigger modal'
        textContent='An icon button trigger works with the same focus and accessibility contract.'
      >
        <IconButton icon='menu' title='Open menu details' variant='primary' onClick={action('icon-trigger-click')} />
      </Modal>
    </div>
  )
};

/**
 * Shows a custom overlay class layered on top of the shared overlay positioning and animation contract.
 */
export const CustomBackdrop: Story = {
  args: {
    children: <Button text='Open custom backdrop modal' />,
    title: 'Custom backdrop modal',
    textContent: 'Custom backdrop classes can augment the shared overlay base styles.',
    customBackdrop: 'bg-black-tint-heavy backdrop-blur-overlay'
  }
};

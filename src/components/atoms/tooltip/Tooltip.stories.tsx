import type { Meta, StoryObj } from '@storybook/react';
import Button from '../button';
import IconButton from '../icon-button';
import Tooltip from './Tooltip';

/**
 * ## DESCRIPTION
 * The Tooltip component is a non-intrusive interface element that displays an informative text message or a short label when the user hovers over an interface element (such as a button or icon).
 *
 *
 * Its main purpose is to improve usability by providing immediate context about the element's function, without taking up permanent screen space.
 */

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'I`m a Tooltip',
    color: 'default',
    placement: 'top',
    onClick: false,
    onFocus: false,
    disabled: false,
    children: <Button text='Hover me' />,
    complement: 'default'
  }
};

/**
 *
 * With Props `content`, we can give you customised text for the tooltip.
 *
 */

export const Text: Story = {
  render: () => (
    <section className='flex items-center gap-4'>
      <Tooltip content='Menu'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Image'>
        <Button icon='image'></Button>
      </Tooltip>
    </section>
  )
};

/**
 *
 * We have 5 different colour variants so you can use it according to your needs.
 *
 */
export const colors: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip>
        <Button text='default'></Button>
      </Tooltip>
      <Tooltip color='primary'>
        <Button text='primary'></Button>
      </Tooltip>
      <Tooltip color='success'>
        <Button text='success'></Button>
      </Tooltip>
      <Tooltip color='warning'>
        <Button text='warning'></Button>
      </Tooltip>
      <Tooltip color='transparent'>
        <Button text='transparent'></Button>
      </Tooltip>
    </section>
  )
};

/**
 *
 * With regard to positioning, we also have several variables that give us different results.
 *
 */
export const Placement: Story = {
  render: () => (
    <section className=' flex flex-col gap-2 items-center'>
      <section className='flex gap-4'>
        <Tooltip placement='top-start'>
          <Button text='Top-start'></Button>
        </Tooltip>
        <Tooltip placement='top'>
          <Button text='top'></Button>
        </Tooltip>
        <Tooltip placement='top-end'>
          <Button text='top-end'></Button>
        </Tooltip>
      </section>
      <section className='flex gap-4'>
        <section className='flex flex-col gap-2 items-start'>
          <Tooltip placement='left-start'>
            <Button text='left-start'></Button>
          </Tooltip>
          <Tooltip placement='left'>
            <Button text='left'></Button>
          </Tooltip>
          <Tooltip placement='left-end'>
            <Button text='left-end'></Button>
          </Tooltip>
        </section>
        <section className='flex flex-col gap-2 items-end'>
          <Tooltip placement='right-start'>
            <Button text='right-start'></Button>
          </Tooltip>
          <Tooltip placement='right'>
            <Button text='right'></Button>
          </Tooltip>
          <Tooltip placement='right-end'>
            <Button text='right-end'></Button>
          </Tooltip>
        </section>
      </section>
      <section className='flex gap-4'>
        <Tooltip placement='bottom-start'>
          <Button text='bottom-start'></Button>
        </Tooltip>
        <Tooltip placement='bottom'>
          <Button text='bottom'></Button>
        </Tooltip>
        <Tooltip placement='bottom-end'>
          <Button text='bottom-end'></Button>
        </Tooltip>
      </section>
    </section>
  )
};

/**
 *
 * We can give it a delay time for both entry and exit thanks to the `delayShow` and `delayHide` props.
 *
 */
export const delay: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip>
        <Button text='delay in display - default'></Button>
      </Tooltip>
      <Tooltip delayShow={800}>
        <Button text='delay in display - 800'></Button>
      </Tooltip>
      <Tooltip delayHide={800}>
        <Button text='delay in hide - 800'></Button>
      </Tooltip>
    </section>
  )
};

/**
 *
 * With the `complement` property, we can add a small arrow depending on the positioning we use.
 *
 */

export const withArrow: Story = {
  render: () => (
    <section className='flex flex-col gap-4'>
      <Tooltip content='Arrow-Botom' complement='arrow-bottom'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Arrow-Right' placement='left' complement='arrow-right'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Arrow-Left' placement='right' complement='arrow-left'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
      <Tooltip content='Arrow-Top' placement='bottom' complement='arrow-top'>
        <IconButton className='' icon='menu' size={20} title='Menu' variant='primary' />
      </Tooltip>
    </section>
  )
};

/**
 * We can adjust the text to make it easier to read.
 */
export const width: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        width='default'
      >
        <Button text='widht - default'></Button>
      </Tooltip>
      <Tooltip
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        width='md'
      >
        <Button text='custom width - [200px]'></Button>
      </Tooltip>
      <Tooltip
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        width='xl'
      >
        <Button text='custom width - [500px]'></Button>
      </Tooltip>
    </section>
  )
};

/**
 * The tooltip is interactive by default (to comply with WCAG 2.1 success criterion 1.4.13). It will not close when the user hovers over the pop-up description before the leaveDelay expires. You can disable this behaviour (thus failing to meet the success criterion required to achieve AA level) by passing disableInteractive.
 */

export const DisabledIteractive: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip>
        <Button text='Enabled interactive'></Button>
      </Tooltip>
      <Tooltip disabled={true}>
        <Button text='Disabled interactive'></Button>
      </Tooltip>
    </section>
  )
};

/**
 * We can define the event that will trigger the tooltip.
 */
export const Triggers: Story = {
  render: () => (
    <section className='flex gap-4'>
      <Tooltip onFocus={true}>
        <Button text='On focus'></Button>
      </Tooltip>
      <Tooltip onClick={true}>
        <Button text='On Click'></Button>
      </Tooltip>
    </section>
  )
};

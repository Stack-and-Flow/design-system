import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

/**
 * ## Description
 * Progress communicates how much of a task has completed within a bounded range.
 * Use the indeterminate state when the work is in progress but the exact completion value is unknown.
 */
const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Progress>;

/**
 * Shows the default Progress configuration using the component default variants.
 */
export const Default: Story = {
  args: {
    value: 50,
    label: 'Upload progress',
    showValueLabel: true,
    className: 'w-96'
  }
};

/**
 * Shows the available size variants.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4 rounded bg-background-light p-4 dark:bg-background-dark'>
      <Progress value={60} size='sm' label='Small' className='w-96' />
      <Progress value={60} size='md' label='Medium' className='w-96' />
      <Progress value={60} size='lg' label='Large' className='w-96' />
    </div>
  )
};

/**
 * Shows the available color variants.
 */
export const Colors: Story = {
  render: () => (
    <div className='flex flex-col gap-4 rounded bg-background-light p-4 dark:bg-background-dark'>
      <Progress value={50} color='default' label='Default' className='w-96' />
      <Progress value={50} color='primary' label='Primary' className='w-96' />
      <Progress value={50} color='secondary' label='Secondary' className='w-96' />
      <Progress value={50} color='success' label='Success' className='w-96' />
      <Progress value={50} color='warning' label='Warning' className='w-96' />
      <Progress value={50} color='danger' label='Danger' className='w-96' />
    </div>
  )
};

/**
 * Shows the available rounded variants.
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex flex-col gap-4 rounded bg-background-light p-4 dark:bg-background-dark'>
      <Progress value={70} rounded='none' label='None' className='w-96' />
      <Progress value={70} rounded='sm' label='Small' className='w-96' />
      <Progress value={70} rounded='md' label='Medium' className='w-96' />
      <Progress value={70} rounded='lg' label='Large' className='w-96' />
      <Progress value={70} rounded='full' label='Full' className='w-96' />
    </div>
  )
};

/**
 * Shows labels and percentage values.
 */
export const WithValueLabel: Story = {
  render: () => (
    <div className='flex flex-col gap-4 rounded bg-background-light p-4 dark:bg-background-dark'>
      <Progress value={45} label='Uploading files' className='w-96' />
      <Progress value={75} label='Processing' showValueLabel={true} className='w-96' />
      <Progress value={100} label='Complete' showValueLabel={true} className='w-96' />
    </div>
  )
};

/**
 * Shows the indeterminate loading state.
 */
export const Indeterminate: Story = {
  render: () => (
    <div className='rounded bg-background-light p-4 dark:bg-background-dark'>
      <Progress isIndeterminate={true} label='Loading' color='primary' className='w-96' />
    </div>
  )
};

/**
 * Shows custom numeric ranges.
 */
export const CustomRange: Story = {
  render: () => (
    <div className='flex flex-col gap-4 rounded bg-background-light p-4 dark:bg-background-dark'>
      <Progress value={50} minValue={0} maxValue={100} label='0 to 100' showValueLabel={true} className='w-96' />
      <Progress value={75} minValue={0} maxValue={200} label='0 to 200' showValueLabel={true} className='w-96' />
      <Progress value={150} minValue={50} maxValue={200} label='50 to 200' showValueLabel={true} className='w-96' />
    </div>
  )
};

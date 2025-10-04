import type { Meta, StoryObj } from '@storybook/react';
import Progress from './Progress';

/**
 * ## DESCRIPTION
 * Progress component is used to track the progress of an activity.
 * It's a presentational component that displays a progress bar based on the value prop.
 * Supports different sizes, colors, rounded corners, and can show labels and percentage values.
 *
 * ## FEATURES
 * - Multiple sizes (sm, md, lg)
 * - Various color themes (default, primary, secondary, success, warning, danger)
 * - Customizable border radius
 * - Optional label and value display
 * - Indeterminate mode for unknown progress
 *
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

export const Default: Story = {
  args: {
    value: 50,
    size: 'md',
    color: 'default',
    rounded: 'full',
    className: 'w-96'
  }
};

/**
 * Progress bars can be displayed in different sizes.
 * Available sizes: sm, md, lg
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded'>
      <Progress value={60} size='sm' label='Small' className='w-96' />
      <Progress value={60} size='md' label='Medium' className='w-96' />
      <Progress value={60} size='lg' label='Large' className='w-96' />
    </div>
  )
};

/**
 * Progress bars support different color themes.
 * Available colors: default, primary, secondary, success, warning, danger
 */
export const Colors: Story = {
  render: () => (
    <div className='flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded'>
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
 * Border radius can be customized using the `rounded` prop.
 * Available options: none, sm, md, lg, full
 */
export const Rounded: Story = {
  render: () => (
    <div className='flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded'>
      <Progress value={70} rounded='none' label='None' className='w-96' />
      <Progress value={70} rounded='sm' label='Small' className='w-96' />
      <Progress value={70} rounded='md' label='Medium' className='w-96' />
      <Progress value={70} rounded='lg' label='Large' className='w-96' />
      <Progress value={70} rounded='full' label='Full' className='w-96' />
    </div>
  )
};

/**
 * Display labels and percentage values.
 * Use `label` prop to show a label and `showValueLabel` to display the percentage.
 */
export const WithLabel: Story = {
  render: () => (
    <div className='flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded'>
      <Progress value={45} label='Uploading files...' className='w-96' />
      <Progress value={75} label='Processing' showValueLabel={true} className='w-96' />
      <Progress value={100} label='Complete' showValueLabel={true} color='success' className='w-96' />
    </div>
  )
};

/**
 * Indeterminate progress bars show an animation when the exact progress is unknown.
 * Use `isIndeterminate` prop to enable this mode.
 */
export const Indeterminate: Story = {
  render: () => (
    <div className='bg-background-light dark:bg-background-dark p-4 rounded'>
      <Progress isIndeterminate={true} label='Loading...' color='primary' size='md' className='w-96' />
    </div>
  )
};

/**
 * Custom min and max values can be set.
 * The value will be clamped between minValue and maxValue.
 */
export const CustomRange: Story = {
  render: () => (
    <div className='flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded'>
      <Progress value={50} minValue={0} maxValue={100} label='0-100 range' showValueLabel={true} className='w-96' />
      <Progress value={75} minValue={0} maxValue={200} label='0-200 range' showValueLabel={true} className='w-96' />
      <Progress value={150} minValue={50} maxValue={200} label='50-200 range' showValueLabel={true} className='w-96' />
    </div>
  )
};

/**
 * Real-world usage examples combining different props.
 */
export const Examples: Story = {
  render: () => (
    <div className='flex flex-col gap-6 bg-background-light dark:bg-background-dark p-4 rounded'>
      <Progress value={25} label='Download progress' showValueLabel={true} color='primary' size='md' className='w-96' />
      <Progress value={80} label='Installation' showValueLabel={true} color='success' size='lg' className='w-96' />
      <Progress value={15} label='Storage used' showValueLabel={true} color='warning' className='w-96' />
      <Progress value={95} label='Memory usage' showValueLabel={true} color='danger' className='w-96' />
      <Progress isIndeterminate={true} label='Syncing data...' color='primary' size='sm' className='w-96' />
    </div>
  )
};

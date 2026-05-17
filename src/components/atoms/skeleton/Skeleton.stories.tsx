import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const frameClass =
  'flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-md border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark';
const rowClass = 'flex items-center gap-3';
const labelClass = 'text-sm font-medium text-text-light dark:text-text-dark';
const swatchClass = 'flex flex-col gap-2';

/**
 * ## Description
 * Skeleton renders decorative, token-based loading placeholders while content is being fetched.
 * It is hidden from assistive technologies by default so parent regions can own loading
 * announcements with `aria-busy`, live regions, or status text when needed.
 *
 * ## Usage Guide
 * Use `size` for the placeholder footprint and `rounded` for the radius token. Compose multiple
 * Skeleton instances to preview the shape of loading content without hardcoding dimensions.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div className={frameClass}>
      <span className={labelClass}>Default text placeholder</span>
      <Skeleton />
    </div>
  )
};

/** Size variants provide token-backed footprints for common loading placeholders. */
export const Sizes: Story = {
  render: () => (
    <div className={frameClass}>
      <div className={swatchClass}>
        <span className={labelClass}>Text</span>
        <Skeleton size='text' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>Title</span>
        <Skeleton size='title' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>Avatar + text</span>
        <div className={rowClass}>
          <Skeleton size='avatar' rounded='full' />
          <div className='flex flex-col gap-2'>
            <Skeleton size='text' />
            <Skeleton size='text' className='w-20' />
          </div>
        </div>
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>Thumbnail</span>
        <Skeleton size='thumbnail' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>Card</span>
        <Skeleton size='card' />
      </div>
    </div>
  )
};

/** Rounded variants map directly to the design-system radius tokens. */
export const Rounded: Story = {
  render: () => (
    <div className={frameClass}>
      <div className={swatchClass}>
        <span className={labelClass}>None</span>
        <Skeleton rounded='none' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>XS</span>
        <Skeleton rounded='xs' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>SM</span>
        <Skeleton rounded='sm' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>MD</span>
        <Skeleton rounded='md' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>LG</span>
        <Skeleton rounded='lg' />
      </div>
      <div className={swatchClass}>
        <span className={labelClass}>Full</span>
        <Skeleton size='avatar' rounded='full' />
      </div>
    </div>
  )
};

/** Multiple skeletons can preview the structure of a loading card while staying decorative. */
export const Composition: Story = {
  render: () => (
    <section className={frameClass} role='status' aria-busy='true' aria-label='Loading profile card'>
      <span className={labelClass}>Profile card loading state</span>
      <div className={rowClass}>
        <Skeleton size='avatar' rounded='full' />
        <div className='flex flex-col gap-2'>
          <Skeleton size='title' className='w-24' />
          <Skeleton size='text' className='w-20' />
        </div>
      </div>
      <Skeleton size='card' />
      <Skeleton size='text' />
      <Skeleton size='text' className='w-30' />
    </section>
  )
};

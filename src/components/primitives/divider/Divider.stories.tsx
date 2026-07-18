import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const surfaceClass =
  'rounded-md border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark';
const compactSurfaceClass = `${surfaceClass} flex w-96 flex-col gap-4`;
const wideSurfaceClass = `${surfaceClass} flex w-[28rem] flex-col gap-5`;
const verticalSurfaceClass = `${surfaceClass} flex h-48 w-96 items-end justify-center gap-7`;
const labelClass = 'text-xs font-medium uppercase tracking-wide text-text-tertiary-light dark:text-text-tertiary-dark';
const bodyTextClass = 'text-sm text-text-secondary-light dark:text-text-secondary-dark';
const rowClass = 'flex w-full flex-col gap-2';

const VariantLabel = ({ children }: { children: string }) => <span className={labelClass}>{children}</span>;

/**
 * ## Description
 * Divider renders a token-based separator that visually splits related content.
 * Use the semantic default for section boundaries and the decorative mode when a rule is purely visual.
 *
 * ## Usage Guide
 * Keep Divider visually simple and structural. Prefer orientation, size, thickness, and color tokens instead of
 * custom inline styles or decorative effects.
 */
const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Divider>;

/** Shows the divider in a realistic stacked content composition. */
export const Default: Story = {
  args: {},
  render: (args) => (
    <section className={compactSurfaceClass}>
      <div className='flex flex-col gap-1'>
        <VariantLabel>Account settings</VariantLabel>
        <p className={bodyTextClass}>Use dividers to create a quiet boundary between related content groups.</p>
      </div>
      <Divider {...args} />
      <p className={bodyTextClass}>The line remains simple, token-based, and structural.</p>
    </section>
  )
};

/** Shows the semantic difference between a default separator and a decorative-only divider. */
export const Decorative: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      <section className={`${surfaceClass} flex flex-col gap-4`}>
        <VariantLabel>Semantic separator</VariantLabel>
        <p className={bodyTextClass}>Assistive technology receives role="separator" and the orientation.</p>
        <Divider size='lg' />
      </section>
      <section className={`${surfaceClass} flex flex-col gap-4`}>
        <VariantLabel>Decorative only</VariantLabel>
        <p className={bodyTextClass}>Purely visual dividers are removed from the accessibility tree.</p>
        <Divider decorative={true} size='lg' />
      </section>
    </div>
  )
};

/** Shows a divider filling the available inline size, and a vertical divider filling a defined parent height. */
export const FullSize: Story = {
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      <section className={`${surfaceClass} flex flex-col gap-4`}>
        <VariantLabel>Horizontal full</VariantLabel>
        <p className={bodyTextClass}>Fills the available width of its parent.</p>
        <Divider size='full' />
      </section>
      <section className={`${surfaceClass} flex h-48 items-center justify-center gap-5`}>
        <div className='flex h-full flex-col justify-between py-2'>
          <span className={bodyTextClass}>Start</span>
          <span className={bodyTextClass}>End</span>
        </div>
        <Divider orientation='vertical' size='full' />
        <p className={`${bodyTextClass} max-w-32`}>Vertical full needs a parent with defined height.</p>
      </section>
    </div>
  )
};

/** Documents the horizontal size scale from extra-small to full width. */
export const HorizontalSizes: Story = {
  render: () => (
    <div className={wideSurfaceClass}>
      <div className={rowClass}>
        <VariantLabel>XS</VariantLabel>
        <Divider size='xs' />
      </div>
      <div className={rowClass}>
        <VariantLabel>SM</VariantLabel>
        <Divider size='sm' />
      </div>
      <div className={rowClass}>
        <VariantLabel>MD</VariantLabel>
        <Divider size='md' />
      </div>
      <div className={rowClass}>
        <VariantLabel>LG</VariantLabel>
        <Divider size='lg' />
      </div>
      <div className={rowClass}>
        <VariantLabel>XL</VariantLabel>
        <Divider size='xl' />
      </div>
      <div className={rowClass}>
        <VariantLabel>Full</VariantLabel>
        <Divider size='full' />
      </div>
    </div>
  )
};

/** Documents the vertical size scale from extra-small to full height. */
export const VerticalSizes: Story = {
  render: () => (
    <div className={verticalSurfaceClass}>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='xs' />
        <VariantLabel>XS</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='sm' />
        <VariantLabel>SM</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='md' />
        <VariantLabel>MD</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='lg' />
        <VariantLabel>LG</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='xl' />
        <VariantLabel>XL</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='full' />
        <VariantLabel>Full</VariantLabel>
      </div>
    </div>
  )
};

/** Documents horizontal divider thickness values while keeping the other props stable. */
export const HorizontalThicknesses: Story = {
  render: () => (
    <div className={wideSurfaceClass}>
      <div className={rowClass}>
        <VariantLabel>XS</VariantLabel>
        <Divider size='xl' thickness='xs' />
      </div>
      <div className={rowClass}>
        <VariantLabel>SM</VariantLabel>
        <Divider size='xl' thickness='sm' />
      </div>
      <div className={rowClass}>
        <VariantLabel>MD</VariantLabel>
        <Divider size='xl' thickness='md' />
      </div>
      <div className={rowClass}>
        <VariantLabel>LG</VariantLabel>
        <Divider size='xl' thickness='lg' />
      </div>
    </div>
  )
};

/** Documents vertical divider thickness values while keeping the other props stable. */
export const VerticalThicknesses: Story = {
  render: () => (
    <div className={verticalSurfaceClass}>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='xl' thickness='xs' />
        <VariantLabel>XS</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='xl' thickness='sm' />
        <VariantLabel>SM</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='xl' thickness='md' />
        <VariantLabel>MD</VariantLabel>
      </div>
      <div className='flex h-full flex-col items-center justify-end gap-3'>
        <Divider orientation='vertical' size='xl' thickness='lg' />
        <VariantLabel>LG</VariantLabel>
      </div>
    </div>
  )
};

/** Documents supported token-based divider colors without changing the structural behavior. */
export const Colors: Story = {
  render: () => (
    <div className={wideSurfaceClass}>
      <div className={rowClass}>
        <VariantLabel>Primary</VariantLabel>
        <Divider size='xl' color='bg-primary' />
      </div>
      <div className={rowClass}>
        <VariantLabel>Blue</VariantLabel>
        <Divider size='xl' color='bg-blue' />
      </div>
      <div className={rowClass}>
        <VariantLabel>Indigo</VariantLabel>
        <Divider size='xl' color='bg-indigo' />
      </div>
    </div>
  )
};

/** Documents the corner variants for thicker horizontal dividers. */
export const Corners: Story = {
  render: () => (
    <div className={wideSurfaceClass}>
      <div className={rowClass}>
        <VariantLabel>None</VariantLabel>
        <Divider size='xl' thickness='lg' corner='none' />
      </div>
      <div className={rowClass}>
        <VariantLabel>Rounded</VariantLabel>
        <Divider size='xl' thickness='lg' corner='rounded' />
      </div>
    </div>
  )
};

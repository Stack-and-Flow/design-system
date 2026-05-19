import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Link } from './Link';

const StoryCanvas = ({ children }: { children: ReactNode }) => (
  <section className='mx-auto my-xl flex max-w-4xl flex-col gap-5 p-lg'>{children}</section>
);

const VariantRow = ({ children }: { children: ReactNode }) => (
  <div className='flex flex-wrap items-center gap-4'>{children}</div>
);

/**
 * ## Description
 * Link renders navigation and action affordances with Stack-and-Flow typography, focus, and token styling.
 *
 * ## Dependencies
 * Uses `lucide-react/dynamic.js` when the optional `icon` prop is provided.
 *
 * ## Usage Guide
 * Use `regular` for inline navigation, `outlined` for secondary call-to-action links, and `button` when a link must visually match a primary action while preserving link semantics when `href` is present. When `href` is omitted, Link behaves as a local action control with button semantics and keyboard activation.
 */
const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  parameters: {
    layout: 'fullscreen',
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Link>;

/**
 * Shows the default inline link for body copy, release notes, and low-emphasis navigation.
 */
export const Default: Story = {
  args: {
    children: 'Read the release notes',
    href: 'https://github.com/egdev6'
  },
  render: (args) => (
    <StoryCanvas>
      <p className='fs-base text-text-light dark:text-text-dark'>
        Follow the product update in <Link {...args} /> for migration notes and release context.
      </p>
    </StoryCanvas>
  )
};

/**
 * Shows the three visual hierarchy levels: inline, secondary CTA, and primary CTA.
 */
export const Variants: Story = {
  render: () => (
    <StoryCanvas>
      <VariantRow>
        <Link href='https://github.com/egdev6'>Inline link</Link>
        <Link variant='outlined' href='https://github.com/egdev6'>
          Secondary CTA
        </Link>
        <Link variant='button' href='https://github.com/egdev6' onClick={action('primary-link-click')}>
          Primary CTA
        </Link>
      </VariantRow>
    </StoryCanvas>
  )
};

/**
 * Shows CTA-style links with their default glow and with glow disabled for quieter layouts.
 * Regular inline links stay glowless regardless of this option.
 */
export const Shadow: Story = {
  render: () => (
    <StoryCanvas>
      <div className='grid gap-4'>
        <VariantRow>
          <Link variant='outlined' href='https://github.com/egdev6'>
            Outlined with glow
          </Link>
          <Link variant='outlined' shadow={false} href='https://github.com/egdev6'>
            Outlined without glow
          </Link>
        </VariantRow>
        <VariantRow>
          <Link variant='button' href='https://github.com/egdev6'>
            Primary with glow
          </Link>
          <Link variant='button' shadow={false} href='https://github.com/egdev6'>
            Primary without glow
          </Link>
        </VariantRow>
      </div>
    </StoryCanvas>
  )
};

/**
 * Shows how size changes typography and horizontal rhythm while preserving each variant treatment.
 */
export const Sizes: Story = {
  render: () => (
    <StoryCanvas>
      <div className='grid gap-4'>
        <VariantRow>
          <Link size='sm' href='https://github.com/egdev6'>
            Small inline
          </Link>
          <Link size='md' href='https://github.com/egdev6'>
            Medium inline
          </Link>
          <Link size='lg' href='https://github.com/egdev6'>
            Large inline
          </Link>
        </VariantRow>
        <VariantRow>
          <Link size='sm' variant='outlined' href='https://github.com/egdev6'>
            Small outlined
          </Link>
          <Link size='md' variant='outlined' href='https://github.com/egdev6'>
            Medium outlined
          </Link>
          <Link size='lg' variant='outlined' href='https://github.com/egdev6'>
            Large outlined
          </Link>
        </VariantRow>
        <VariantRow>
          <Link size='sm' variant='button' href='https://github.com/egdev6'>
            Small button
          </Link>
          <Link size='md' variant='button' href='https://github.com/egdev6'>
            Medium button
          </Link>
          <Link size='lg' variant='button' href='https://github.com/egdev6'>
            Large button
          </Link>
        </VariantRow>
      </div>
    </StoryCanvas>
  )
};

/**
 * Shows icons inheriting current text color and keeping alignment consistent across variants.
 */
export const WithIcon: Story = {
  render: () => (
    <StoryCanvas>
      <VariantRow>
        <Link icon='external-link' href='https://github.com/egdev6'>
          External link
        </Link>
        <Link variant='outlined' icon='arrow-right' href='https://github.com/egdev6'>
          Continue
        </Link>
        <Link variant='button' icon='download' href='https://github.com/egdev6'>
          Download
        </Link>
      </VariantRow>
    </StoryCanvas>
  )
};

/**
 * Shows disabled links preserving their color treatment while reducing affordance through opacity and cursor state.
 */
export const Disabled: Story = {
  render: () => (
    <StoryCanvas>
      <VariantRow>
        <Link disabled={true} href='https://github.com/egdev6'>
          Inline disabled
        </Link>
        <Link disabled={true} variant='outlined' href='https://github.com/egdev6'>
          Outlined disabled
        </Link>
        <Link disabled={true} variant='button' href='https://github.com/egdev6'>
          Button disabled
        </Link>
      </VariantRow>
    </StoryCanvas>
  )
};

/**
 * Shows target values changing navigation behavior while preserving accessible link semantics.
 */
export const Target: Story = {
  render: () => (
    <StoryCanvas>
      <VariantRow>
        <Link href='https://github.com/egdev6' target='_blank' title='Open in new tab'>
          New tab
        </Link>
        <Link href='https://github.com/egdev6' target='_self' title='Open in same tab'>
          Same tab
        </Link>
        <Link href='https://github.com/egdev6' target='_parent' title='Open in parent frame'>
          Parent frame
        </Link>
        <Link href='https://github.com/egdev6' target='_top' title='Open in top frame'>
          Top frame
        </Link>
      </VariantRow>
    </StoryCanvas>
  )
};

/**
 * Shows title-backed accessible labels when visible text alone is not enough.
 */
export const Accessibility: Story = {
  render: () => (
    <StoryCanvas>
      <VariantRow>
        <Link href='https://github.com/egdev6' title='Open the Stack and Flow GitHub profile'>
          GitHub profile
        </Link>
        <Link variant='button' href='https://github.com/egdev6' title='Open documentation in a new tab'>
          Documentation
        </Link>
      </VariantRow>
    </StoryCanvas>
  )
};

/**
 * Shows local action behavior when no `href` is provided; these controls expose button semantics and support pointer plus keyboard activation.
 */
export const ActionSemantics: Story = {
  render: () => (
    <StoryCanvas>
      <VariantRow>
        <Link variant='button' onClick={action('local-link-action')}>
          Run local action
        </Link>
        <Link variant='outlined' onClick={action('secondary-local-link-action')}>
          Secondary action
        </Link>
      </VariantRow>
    </StoryCanvas>
  )
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Avatar } from '../avatar/Avatar';
import { Button } from '../button';
import Icon from '../icon/Icon';
import { Badge } from './Badge';

const colors = ['primary', 'secondary', 'success', 'warning', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['solid', 'flat', 'subtle'] as const;
const placements = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const;

/**
 * ## Description
 * A small status, count, or label indicator for notification counts, presence dots, and compact metadata.
 * Badge can render standalone or position itself over child content such as avatars, icons, or buttons.
 *
 * ## Dependencies
 * Uses `Avatar`, `Button`, and `Icon` in examples to demonstrate common composition patterns.
 *
 * ## Usage Guide
 * Provide `ariaLabel` for icon-only and dot badges, and for dynamic counts whose visible text needs more context.
 * Hidden badges are removed from the accessibility tree when `visibility` is `false`.
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Badge>;

/**
 * Shows the default badge variants positioned over a child avatar.
 */
export const Default: Story = {
  args: {
    content: '1',
    ariaLabel: '1 notification',
    children: <Avatar src='https://i.pravatar.cc/300?u=badge-default' alt='Avatar' rounded='full' size='lg' />
  }
};

/**
 * Compares the available badge sizes while preserving the same content and placement.
 */
export const Size: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      {sizes.map((size) => (
        <Badge key={size} content='1' size={size} ariaLabel={`${size} notification badge`}>
          <Avatar
            src={`https://i.pravatar.cc/300?u=badge-size-${size}`}
            alt={`${size} avatar`}
            rounded='full'
            size='lg'
          />
        </Badge>
      ))}
    </div>
  )
};

/**
 * Shows each semantic color as a positioned notification count.
 */
export const Color: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      {colors.map((color, index) => (
        <Badge key={color} content={index + 1} color={color} ariaLabel={`${color} badge`}>
          <Avatar
            src={`https://i.pravatar.cc/300?u=badge-color-${color}`}
            alt={`${color} avatar`}
            rounded='full'
            size='lg'
          />
        </Badge>
      ))}
    </div>
  )
};

/**
 * Compares solid, flat, and subtle visual treatments across semantic colors.
 */
export const Variant: Story = {
  render: () => (
    <div className='grid gap-3'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-wrap items-center gap-2'>
          {colors.map((color) => (
            <Badge key={`${variant}-${color}`} content={color} color={color} variant={variant} rounded={false} />
          ))}
        </div>
      ))}
    </div>
  )
};

/**
 * Demonstrates how placement changes when the badge is composed with child content.
 */
export const Placement: Story = {
  render: () => (
    <div className='flex items-center gap-5'>
      {placements.map((placement, index) => (
        <Badge key={placement} content={index + 1} placement={placement} ariaLabel={`${placement} badge`}>
          <Avatar
            src={`https://i.pravatar.cc/300?u=badge-placement-${placement}`}
            alt={`${placement} avatar`}
            rounded='full'
            size='lg'
          />
        </Badge>
      ))}
    </div>
  )
};

/**
 * Shows standalone badges for labels and compact metadata; placement is ignored without children.
 */
export const Standalone: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Badge content='New' color='primary' variant='subtle' size='sm' rounded={false} />
      <Badge content='Pro' color='warning' variant='flat' size='sm' rounded={false} />
      <Badge content='Beta' color='secondary' variant='flat' size='sm' rounded={false} />
      <Badge content='5' color='primary' variant='solid' size='sm' ariaLabel='5 notifications' />
      <Badge content='React' color='success' variant='subtle' size='sm' rounded={false} />
      <Badge content='TypeScript' color='secondary' variant='subtle' size='sm' rounded={false} />
    </div>
  )
};

/**
 * Shows number, text, icon, and dot content patterns.
 */
export const ContentExamples: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Badge content={3} color='primary' ariaLabel='3 notifications'>
        <Avatar
          src='https://i.pravatar.cc/300?u=badge-content-number'
          alt='Number badge avatar'
          rounded='full'
          size='lg'
        />
      </Badge>
      <Badge content='New' color='primary'>
        <Avatar src='https://i.pravatar.cc/300?u=badge-content-text' alt='Text badge avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='check' size={10} color='text-white' />}
        color='success'
        size='sm'
        placement='bottom-right'
        ariaLabel='Verified'
      >
        <Avatar src='https://i.pravatar.cc/300?u=badge-content-icon' alt='Icon badge avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content='' color='success' size='sm' placement='bottom-right' ariaLabel='Online'>
        <Avatar src='https://i.pravatar.cc/300?u=badge-content-dot' alt='Dot badge avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};

/**
 * Toggles `visibility`; hidden badges are removed while the child trigger remains visible.
 */
export const BadgeVisibility: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <div className='flex items-center gap-6'>
        <Badge content='5' color='danger' visibility={visible} ariaLabel='5 alerts'>
          <Icon name='bell-ring' size={28} colorDark='dark:text-white' />
        </Badge>
        <Button
          onClick={() => setVisible((prev) => !prev)}
          variant='outlined'
          text={visible ? 'Hide' : 'Show'}
          size='sm'
          className='w-20'
        />
      </div>
    );
  }
};

/**
 * Shows the supported decorative animation values with reduced-motion-safe CSS classes.
 */
export const Animation: Story = {
  render: () => (
    <div className='flex items-center gap-6'>
      {(['default', 'pulse', 'bounce', 'ping'] as const).map((animation) => (
        <Badge
          key={animation}
          content={<Icon name='bell-dot' size={12} color='text-white' />}
          color='primary'
          size='sm'
          animation={animation}
          ariaLabel={`${animation} notification animation`}
        >
          <Avatar
            src={`https://i.pravatar.cc/300?u=badge-animation-${animation}`}
            alt={`${animation} animation avatar`}
            rounded='full'
            size='lg'
          />
        </Badge>
      ))}
    </div>
  )
};

/**
 * Documents the accessibility props for dynamic and icon-only badge content.
 */
export const Accessibility: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Badge content='+99' color='danger' ariaLabel='More than 99 notifications' role='status' ariaLive='assertive'>
        <Icon name='bell-ring' size={34} colorDark='dark:text-white' />
      </Badge>
    </div>
  )
};

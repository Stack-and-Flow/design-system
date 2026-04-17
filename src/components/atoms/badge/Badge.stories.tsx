import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Avatar from '../avatar/Avatar';
import Button from '../button';
import Icon from '../icon/Icon';
import Badge from './Badge';

/**
 * ## DESCRIPTION
 * A Badge is a small indicator used to convey numerical values, statuses, or labels.
 *
 * They are commonly used to represent notifications, messages, counts, or statuses on top of icons or avatars.
 *
 * - Customizable in color, size, variant, position and animation.
 * - Can be combined with icons, avatars or any other component.
 * - Accessible via the `ariaLabel` prop.
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

export const Default: Story = {
  args: {
    color: 'primary',
    content: '1',
    variant: 'solid',
    placement: 'top-right',
    size: 'sm',
    rounded: true,
    visibility: true,
    animation: 'default',
    ariaLabel: '',
    ariaLive: 'off',
    role: 'status',
    children: <Avatar src='https://i.pravatar.cc/300?u=a042581f4e29026709d' alt='Avatar' rounded='full' size='lg' />
  }
};

/**
 * The `size` prop defines the height, padding and font-size of the badge.
 *
 * Available options:
 * - `sm` → Small
 * - `md` → Medium (default)
 * - `lg` → Large
 *
 * Use it to control the visual weight of the badge based on the element it accompanies.
 */
export const Size: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'1'} size='sm'>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e29026704d' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'1'} size='md'>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e2902asd4d' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'1'} size='lg'>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267012' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};

/**
 * The `color` prop sets the background and text color of the badge.
 *
 * Available options:
 * - `primary`
 * - `secondary`
 * - `success`
 * - `warning`
 * - `danger`
 *
 * Useful for conveying the meaning or status of the content (e.g. green for success, red for error).
 */
export const Color: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'1'} color={'primary'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267100' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'2'} color={'secondary'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267200' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'3'} color={'success'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267300' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'4'} color={'warning'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267400' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'5'} color={'danger'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267500' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};

/**
 * The `variant` prop defines visual style modifications for the badge.
 *
 * Available options:
 * - `solid` → Maximum prominence with full background color.
 * - `flat` → Medium prominence with opaque tinted background and border.
 * - `subtle` → Minimum prominence with very soft background, no border.
 *
 * Use variants to establish a clear visual hierarchy based on importance.
 */
export const Variant: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'5'} variant={'solid'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267600' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'5'} variant={'flat'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267700' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'5'} variant={'subtle'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};

/**
 * The `placement` prop determines the position of the badge relative to its child element.
 *
 * **Important:** `placement` only works when the Badge has `children` (e.g., an Avatar or Icon).
 * For standalone badges, the prop is ignored and the badge renders as an inline element.
 *
 * Available options:
 * - `top-right` (default)
 * - `bottom-right`
 * - `top-left`
 * - `bottom-left`
 *
 * Use this to position notification badges over avatars, icons, or buttons.
 */
export const Placement: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'1'} placement={'top-right'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267900' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'2'} placement={'bottom-right'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267000' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'3'} placement={'top-left'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290266800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'4'} placement={'bottom-left'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};

/**
 * When used without `children`, the badge renders as a standalone inline element.
 * The `placement` prop is ignored in this mode.
 *
 * Use standalone badges for labels, tags, and status indicators.
 */
export const Standalone: Story = {
  render: () => (
    <div className='flex gap-2 flex-wrap'>
      <Badge content={'New'} color={'primary'} variant={'subtle'} size={'sm'} rounded={false} />
      <Badge content={'Pro'} color={'warning'} variant={'flat'} size={'sm'} rounded={false} />
      <Badge content={'Beta'} color={'secondary'} variant={'flat'} size={'sm'} rounded={false} />
      <Badge content={'5'} color={'primary'} variant={'solid'} size={'sm'} />
      <Badge content={'React'} color={'success'} variant={'subtle'} size={'sm'} rounded={false} />
      <Badge content={'TypeScript'} color={'secondary'} variant={'subtle'} size={'sm'} rounded={false} />
    </div>
  )
};

/**
 * The `content` prop accepts four types of values:
 *
 * - **Number** → for unread counts or notifications
 * - **Text** → for short labels like "New" or "Beta"
 * - **Icon** → for status indicators
 * - **Empty string** → renders as a dot, useful for presence or activity indicators
 */
export const ContentExamples: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      {/* Number */}
      <Badge content={3} color={'primary'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e291262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      {/* Text */}
      <Badge content={'New'} color={'primary'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e295262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      {/* Icon */}
      <Badge
        content={<Icon name='check' size={10} color='text-white' />}
        color={'success'}
        size={'sm'}
        placement={'bottom-right'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e296262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      {/* Empty → dot */}
      <Badge content={''} color={'success'} size={'sm'} placement={'bottom-right'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e293262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};
/**
 * The `visibility` prop toggles whether the badge is shown.
 *
 * It accepts a boolean (`true` or `false`) and can be dynamically controlled.
 *
 * Useful for conditionally hiding or showing badges based on user interaction or state.
 */
export const BadgeVisibility: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <div className='flex gap-6 items-center'>
        <Badge content='5' color={'danger'} visibility={visible}>
          <Icon name='bell-ring' size={28} colorDark='dark:text-white' />
        </Badge>
        <Button
          onClick={() => setVisible((prev) => !prev)}
          variant={'outlined'}
          text={visible ? 'Hide' : 'Show'}
          size='sm'
          className='w-20'
        />
      </div>
    );
  }
};
/**
 * The `animation` prop allows you to apply movement or visual feedback to the badge.
 *
 * Available options:
 * - `default` → No animation
 * - `pulse` → Smooth fading in and out
 * - `bounce` → Subtle bounce
 * - `ping` → Expanding ripple effect
 * - `rotation` → Continuous rotation
 *
 * Use animations to draw attention to updates or notifications.
 */
export const Animation: Story = {
  render: () => (
    <div className='flex gap-6 items-center'>
      <Badge
        content={<Icon name='bell-dot' size={12} color='text-white' />}
        color={'primary'}
        size={'sm'}
        animation={'default'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e196262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='bell-dot' size={12} color='text-white' />}
        color={'primary'}
        size={'sm'}
        animation={'pulse'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e296262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='bell-dot' size={12} color='text-white' />}
        color={'primary'}
        size={'sm'}
        animation={'bounce'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e396262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='bell-dot' size={12} color='text-white' />}
        color={'primary'}
        size={'sm'}
        animation={'ping'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e496262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};
/**
 * The `ariaLabel`, `ariaLive`, and `role` props improve screen reader accessibility for badges.
 *
 * - `ariaLabel` provides a descriptive text alternative, useful for dynamic or icon-only content.
 * - `ariaLive` tells assistive technologies how urgently to announce updates to the badge. (e.g. `"polite"` or `"assertive"`).
 * - `role` defines the semantic meaning of the badge. Common value: `"status"` for dynamic content.
 *
 * ### Examples:
 * - `ariaLabel="5 unread notifications"`
 * - `ariaLive="assertive"`
 * - `role="status"`
 *
 * These props are especially helpful when the badge communicates real-time updates.
 */
export const Accessibility: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'+99'} color={'danger'} ariaLabel='more than 99 notifications' role='status' ariaLive='assertive'>
        <Icon name='bell-ring' size={34} colorDark='dark:text-white' />
      </Badge>
    </div>
  )
};

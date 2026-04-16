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
 * - `solid` → Default appearance with full background.
 * - `flat` → Reduced background opacity, text remains solid.
 * - `shadow` → Adds a soft shadow based on the color.
 * - `faded` → Uses a neutral gray background but keeps the text color from the selected color.
 *
 * Use variants to match the tone or prominence of your UI element.
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
      <Badge content={'5'} variant={'shadow'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e290267800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
    </div>
  )
};

/**
 * The `placement` prop determines the position of the badge relative to its parent.
 *
 * Available options:
 * - `top-right` (default)
 * - `bottom-right`
 * - `top-left`
 * - `bottom-left`
 *
 * Useful for adapting the badge position to different components like avatars, buttons or icons.
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
 * The `content` prop accepts a string, number, icon, or even custom JSX.
 *
 * Examples:
 * - Number (`3`) → for unread messages
 * - Text (`new`) → for labels
 * - Icon → for status indicators
 *
 * You can customize its appearance using other props like `color`, `size`, and `variant`.
 */
export const ContentExamples: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'3'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e291262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={''} color={'success'} placement={'bottom-right'} size={'sm'} variant={'flat'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e293262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'new'} size={'md'} color={'secondary'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e295262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='check' size={10} colorDark='dark:text-color-text-light' />}
        color={'success'}
        size={'sm'}
        placement={'bottom-right'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e296262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='bell-ring' size={14} color='text-color-text-light' colorDark='dark:text-color-text-dark' />}
        color={'danger'}
        size={'md'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e297262800' alt='Avatar' rounded='full' size='lg' />
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
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
      setVisible((prev) => !prev);
    };
    return (
      <div className='flex gap-4 items-center'>
        <Badge content='5' color={'secondary'} visibility={visible}>
          <Icon name='bell-ring' size={34} />
        </Badge>
        <Badge content='5' color={'secondary'} visibility={visible}>
          <Icon name='shopping-cart' size={34} />
        </Badge>
        <Button
          onClick={toggleVisibility}
          variant={'outlined'}
          text={visible ? 'Hide Badge' : 'Show Badge'}
          size='sm'
          className='min-w-30'
        ></Button>
      </div>
    );
  }
};
/**
 * The `animation` prop allows you to apply movement or visual feedback to the badge.
 *
 * Available options:
 * - `pulse` → Smooth fading effect (default if enabled)
 * - `bounce` → Subtle bounce animation
 * - `ping` → Expanding ripple animation
 * - `rotation` → Continuous rotation
 * - `default` → No animation
 *
 * Use animations to draw attention to updates or notifications.
 */
export const Animation: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Badge content={'1'} color={'primary'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e196262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={''} color={'success'} placement={'bottom-right'} size={'sm'} animation={'pulse'}>
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e296262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge
        content={<Icon name='bell-dot' size={14} colorDark='dark:text-color-text-dark' />}
        color={'success'}
        animation={'bounce'}
      >
        <Avatar src='https://i.pravatar.cc/300?u=a042581f4e396262800' alt='Avatar' rounded='full' size='lg' />
      </Badge>
      <Badge content={'?'} color={'warning'} animation={'ping'}>
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
        <Icon name='bell-ring' size={34} colorDark='dark:text-color-text-dark' />
      </Badge>
    </div>
  )
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Icon from '../icon';
import Switch from './Switch';
/**
 * ## DESCRIPTION
 * The Switch component is a customizable toggle input that allows users to switch between two states:
 * **on** and **off**.
 *
 * It is commonly used in forms, settings panels, or anywhere a binary choice needs to be represented.
 * The component supports multiple sizes, colors, labels, icons, and can also be disabled to prevent user interaction.
 */
const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Switch label',
    size: 'md',
    color: 'default',
    defaultChecked: true
  }
};

/**
 * The `Switch` component comes in three predefined sizes to adapt to different use cases:
 *
 * - `Small`: compact, best suited for tight layouts or when space is limited.
 * - `Medium`: the default size, balancing usability and compactness.
 * - `Large`: provides a bigger click/tap target, ideal for mobile interfaces or accessibility-first designs.
 *
 * Choosing the right size helps ensure that the switch fits naturally into the overall UI layout.
 */

export const Size: Story = {
  render: () => {
    return (
      <div className='flex gap-6'>
        <Switch size='sm' label='Small Switch' defaultChecked={true} />
        <Switch size='md' label='Medium Switch' defaultChecked={true} />
        <Switch size='lg' label='Large Switch' defaultChecked={true} />
      </div>
    );
  }
};

/**
 * The `Switch` component can be rendered in a **disabled state**, meaning:
 *
 * - It appears visually inactive (often with reduced opacity or a muted color).
 * - It cannot be toggled via mouse, keyboard, or touch interaction.
 * - The label remains visible, helping users understand the purpose of the switch.
 *
 * This state is useful when a particular option is not available due to conditions in the UI
 * (for example, a setting that depends on another being enabled).
 */
export const Disabled: Story = {
  render: () => {
    return (
      <div className='flex'>
        <Switch disabled={true} label='Disabled Switch' defaultChecked={true} color='disabled' />
      </div>
    );
  }
};

/**
 * The `Switch` component supports multiple **visual variants** that change its
 * overall style and appearance.
 *
 * Available variants:
 * - `Default`: standard style for most use cases.
 * - `Flat`: minimal, modern look with no shadows.
 * - `Glass`: translucent background with a frosted-glass effect.
 * - `Shadow`: elevated look with shadows, making it stand out in the UI.
 * - `Neon`: vibrant glowing effect, useful for dark themes or attention-grabbing designs.
 *
 * Variants provide flexibility to adapt the switch to different UI themes and branding needs.
 */
export const Variant: Story = {
  render: () => {
    return (
      <div className='flex gap-4'>
        <Switch variant='default' label='Default Variant' defaultChecked={true} />
        <Switch variant='bordered' label='Bordered Variant' defaultChecked={true} color='transparent' />
        <Switch variant='glass' label='Glass Variant' defaultChecked={true} />
        <Switch variant='shadow' label='Shadow Variant' defaultChecked={true} />
      </div>
    );
  }
};

/**
 * The `Switch` component supports different **border radius** options, allowing it to
 * appear more rounded or squared depending on the design needs.
 *
 * - `Rounded (true)`: gives the switch a softer, pill-shaped appearance.
 * - `Square (false)`: produces a rectangular look, better suited for strict or formal UI designs.
 *
 * This property is useful for ensuring consistency with the overall visual language of the interface.
 */
export const Rounded: Story = {
  render: () => {
    return (
      <div className='flex gap-4'>
        <Switch label='Rounded Switch' rounded={true} defaultChecked={true} />
        <Switch label='Square Switch' rounded={false} defaultChecked={true} />
      </div>
    );
  }
};
/**
 * The `Switch` component can display a **custom icon inside the thumb**, enhancing
 * its visual meaning.
 *
 * Typical use cases:
 * - A **moon/sun icon** for dark mode toggles.
 * - A **lock/unlock icon** for privacy or security settings.
 * - Any visual metaphor that helps users quickly understand the state.
 *
 * The `thumbIcon` prop accepts a ReactNode, allowing full customization with
 * your own icons or SVGs.
 */
export const WithThumbIcon: Story = {
  render: () => {
    return (
      <div className='flex'>
        <Switch
          label='With Thumb Icon'
          size='lg'
          color='default'
          thumbIcon={<Icon name='moon' colorDark='dark:text-color-brand-dark' color='text-color-brand-light' size={16} />}
          defaultChecked={true}
        />
      </div>
    );
  }
};

/**
 * The `Switch` component can display **custom icons** at both ends, enhancing
 * its visual meaning.
 *
 * Typical use cases:
 * - A **moon/sun icon** for dark mode toggles.
 * - A **lock/unlock icon** for privacy or security settings.
 * - Any visual metaphor that helps users quickly understand the state.
 *
 * The `startContent` and `endContent` props accept ReactNodes, allowing full
 * customization with your own icons or SVGs.
 */
export const WithIcon: Story = {
  render: () => {
    return (
      <div>
        <Switch
          size='lg'
          endContent={<Icon name='sun' size={20} colorDark='dark:text-color-text-dark' />}
          startContent={<Icon name='moon' size={20} colorDark='dark:text-color-text-dark' />}
          label='With Icons'
          defaultChecked={true}
        />
      </div>
    );
  }
};

/**
 * The `Switch` component allows **flexible positioning of labels** relative to the
 * switch itself.
 *
 * Available options:
 * - `Left`: places the label on the left side of the switch.
 * - `Right`: default placement, label on the right side.
 * - `Top`: displays the label above the switch.
 * - `Bottom`: displays the label below the switch.
 *
 * This flexibility makes it easier to adapt the component to different layouts
 * and accessibility needs.
 */

export const LabelPlacement: Story = {
  render: () => {
    return (
      <div className='flex gap-6'>
        <Switch label='Left Label' labelPlacement='left' defaultChecked={true} />
        <Switch label='Right Label' labelPlacement='right' defaultChecked={true} />
        <Switch label='Bottom Label' labelPlacement='bottom' defaultChecked={true} />
        <Switch label='Top Label' labelPlacement='top' defaultChecked={true} />
      </div>
    );
  }
};

/**
 * The `Switch` component can be used as a **controlled component**, meaning its
 * value is fully managed by React state.
 *
 * In this mode, the `checked` prop reflects the current state, and the `onChange`
 * handler is used to update it.
 *
 * Example use cases:
 * - Syncing the switch state with a form library.
 * - Toggling application-wide settings (e.g. dark mode).
 * - Handling more complex logic that depends on the switch’s value.
 *
 * Controlled switches give developers full control over how state is stored
 * and updated.
 */
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className='flex flex-col gap-4'>
        <Switch label={checked ? 'ON' : 'OFF'} checked={checked} onChange={setChecked} />
      </div>
    );
  }
};

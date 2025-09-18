import type { Meta, StoryObj } from '@storybook/react';
import Snippet from './Snippet';

/**
 * ## DESCRIPTION
 * The `Snippet` component displays code or text snippets with optional copy-to-clipboard functionality.
 * It supports multiple variants, colors, sizes, and rounded corners for flexible use in documentation and UI.
 * The component is fully accessible, keyboard-navigable, and screen-reader friendly.
 *
 * ## DEPENDENCIES
 * - `IconButton` (atom): Used for the copy-to-clipboard button, providing accessible icon button interactions.
 * - `class-variance-authority (CVA)`: Used for scalable and maintainable styling variants.
 */

const meta: Meta<typeof Snippet> = {
  title: 'Molecules/Snippet',
  component: Snippet,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Snippet>;

/**
 * Demonstrates the default usage of the Snippet component with the copy button enabled.
 *
 * **Props used:**
 * - No additional props (uses all default values)
 */
export const Default: Story = {
  args: {
    children: 'npm install @your/package'
  }
};

/**
 * Demonstrates the Snippet component with the copy button disabled for all variants.
 *
 * **Props used:**
 * - `disableCopy`: Disables the copy button.
 * - `variant`: solid | outline | shadow
 */
export const DisabledCopy: Story = {
  render: () => (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      <Snippet variant='solid' disableCopy={true}>
        npm install @your/package
      </Snippet>
      <Snippet variant='outline' disableCopy={true}>
        npm install @your/package
      </Snippet>
      <Snippet variant='shadow' disableCopy={true}>
        npm install @your/package
      </Snippet>
    </div>
  )
};

/**
 * Demonstrates the Snippet component with multiline content for each variant.
 *
 * **Props used:**
 * - `variant`: solid | outline | shadow
 * - `children`: Multiline string content
 */
export const MultiLine: Story = {
  render: () => (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      <Snippet variant='solid'>
        {`
# Instalación
npm install my-library

# Construcción
npm run build

# Inicio
npm start
    `}
      </Snippet>
      <Snippet variant='outline'>
        {`
# Instalación
npm install my-library

# Construcción
npm run build

# Inicio
npm start
    `}
      </Snippet>
      <Snippet variant='shadow'>
        {`
# Instalación
npm install my-library

# Construcción
npm run build

# Inicio
npm start
    `}
      </Snippet>
    </div>
  )
};

/**
 * Demonstrates the `variant` prop of the Snippet component, showing all color options for each variant: solid, outline, and shadow.
 *
 * The `variant` prop controls the visual style of the Snippet. Available options are:
 * - `solid`: Filled background (default)
 * - `outline`: Transparent background with border
 * - `shadow`: Adds a shadow effect
 */
export const Variant: Story = {
  render: () => (
    <div className='space-y-8'>
      <div>
        <div className='mb-2 font-semibold text-text-light dark:text-text-dark'>Solid variant</div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <Snippet variant='solid'>npm install @your/package</Snippet>
          <Snippet variant='solid' color='primary'>
            npm install @your/package
          </Snippet>
          <Snippet variant='solid' color='secondary'>
            npm install @your/package
          </Snippet>
          <Snippet variant='solid' color='info'>
            npm install @your/package
          </Snippet>
          <Snippet variant='solid' color='success'>
            npm install @your/package
          </Snippet>
          <Snippet variant='solid' color='warning'>
            npm install @your/package
          </Snippet>
          <Snippet variant='solid' color='danger'>
            npm install @your/package
          </Snippet>
        </div>
      </div>
      <div>
        <div className='mb-2 font-semibold text-text-light dark:text-text-dark'>Outline variant</div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <Snippet variant='outline'>npm install @your/package</Snippet>
          <Snippet variant='outline' color='primary'>
            npm install @your/package
          </Snippet>
          <Snippet variant='outline' color='secondary'>
            npm install @your/package
          </Snippet>
          <Snippet variant='outline' color='info'>
            npm install @your/package
          </Snippet>
          <Snippet variant='outline' color='success'>
            npm install @your/package
          </Snippet>
          <Snippet variant='outline' color='warning'>
            npm install @your/package
          </Snippet>
          <Snippet variant='outline' color='danger'>
            npm install @your/package
          </Snippet>
        </div>
      </div>
      <div>
        <div className='mb-2 font-semibold text-text-light dark:text-text-dark'>Shadow variant</div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <Snippet variant='shadow'>npm install @your/package</Snippet>
          <Snippet variant='shadow' color='primary'>
            npm install @your/package
          </Snippet>
          <Snippet variant='shadow' color='secondary'>
            npm install @your/package
          </Snippet>
          <Snippet variant='shadow' color='info'>
            npm install @your/package
          </Snippet>
          <Snippet variant='shadow' color='success'>
            npm install @your/package
          </Snippet>
          <Snippet variant='shadow' color='warning'>
            npm install @your/package
          </Snippet>
          <Snippet variant='shadow' color='danger'>
            npm install @your/package
          </Snippet>
        </div>
      </div>
    </div>
  )
};

/**
 * Demonstrates the different size options for the Snippet component.
 *
 * **Props used:**
 * - `size`: sm | md | lg
 */
export const Size: Story = {
  render: () => (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      <Snippet size='sm'>npm install @your/package</Snippet>
      <Snippet size='md'>npm install @your/package</Snippet>
      <Snippet size='lg'>npm install @your/package</Snippet>
    </div>
  )
};

/**
 * Demonstrates the different border radius (rounded) options for the Snippet component.
 *
 * **Props used:**
 * - `rounded`: none | xs | sm | md | lg | xl | full
 */
export const CustomRounded: Story = {
  render: () => (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      <Snippet rounded='none'>npm install @your/package</Snippet>
      <Snippet rounded='xs'>npm install @your/package</Snippet>
      <Snippet rounded='sm'>npm install @your/package</Snippet>
      <Snippet rounded='md'>npm install @your/package</Snippet>
      <Snippet rounded='lg'>npm install @your/package</Snippet>
      <Snippet rounded='xl'>npm install @your/package</Snippet>
      <Snippet rounded='full'>npm install @your/package</Snippet>
    </div>
  )
};

/**
 * Demonstrates usage of the `className` prop for custom styles.
 *
 * **Props used:**
 * - `className`: Custom Tailwind or CSS classes
 */
export const CustomClassName: Story = {
  args: {
    children: 'npm install @your/package',
    className:
      'bg-gradient-to-r from-blue-100 to-blue-300 dark:from-blue-600 dark:to-blue-900 border border-blue-800 dark:border-blue-500'
  }
};

/**
 * Demonstrates usage of the `aria-controls` and `aria-label` props for accessibility.
 *
 * **Props used:**
 * - `aria-label`: Accessible label for the copy button
 * - `aria-controls`: ARIA controls attribute for accessibility
 */
export const WithAriaControls: Story = {
  args: {
    children: 'npm install @your/package',
    'aria-label': 'Copy install command',
    'aria-controls': 'custom-snippet'
  }
};

/**
 * Demonstrates usage of the `onCopy` callback for custom copy feedback.
 *
 * **Props used:**
 * - `onCopy`: Callback executed after copying
 */
export const WithOnCopy: Story = {
  args: {
    children: 'npm install @your/package',
    onCopy: () => alert('Copied to clipboard!')
  }
};

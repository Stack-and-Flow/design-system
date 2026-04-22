import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { Text } from '../text';
import { Input } from './index';

/**
 * ## DESCRIPTION
 * The Input component is a versatile form element that allows users to enter text or other data.
 * It supports various input types, styles, and configurations to suit different use cases.
 * It can be used for text, email, password, number inputs, and more.
 * The component also supports features like labels, placeholders, hints, and different visual styles.
 * It can be customized with rounded corners, different sizes, and variants such as regular, underlined, line, and bordered.
 * Additionally, it can handle controlled and uncontrolled values, making it flexible for both simple and complex forms.
 * It also supports start and end content, allowing for additional elements like icons or text to be displayed alongside the input.
 * The Input component is designed to be accessible and user-friendly, providing a consistent experience across different devices and screen sizes.
 * It can be easily integrated into forms and other UI components, making it a fundamental building block for web applications.
 *
 * ## DEPENDENCIES
 * - Icon: Uses Icon component from `lucide-react` for icons.
 * - Text: Uses Text component for displaying labels and hints.
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    id: 'input',
    label: 'Lorem Ipsum',
    type: 'text',
    variant: 'regular',
    rounded: false,
    className: '',
    size: 'md',
    disabled: false,
    isFullWidth: false,
    isRequired: false
  }
};

/**
 * - **Controlled Input**: The value of the input is managed by React state. Changes to the input value are handled through an `onChange` event, allowing for immediate updates and validation.
 */

export const ControlledValue: Story = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import { useState, type ChangeEvent } from 'react';
import Input from './Input';
      
const ControlledInput = () => {
  const [value, setValue] = useState('Controlled Value');

  const handleChange = (e: ChangeEvent<HTMLInputElement>, value) => {
    setValue(value);
    console.log(value);
  }
  
  return (
    <Input
      id='controlled-input'
      label='Controlled Input'
      value={value}
      onChange={handleChange}
      variant='regular'
      size='md'
    />
  );
}
`
      }
    }
  },
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input1' label='Lorem Ipsum' variant='regular' size='md' />
    </div>
  )
};

/**
 * - **Uncontrolled Input**: The input value is not managed by React state. Instead, it uses a `defaultValue` prop to set the initial value, and changes are logged through an `onChange` event.
 */

export const UncontrolledValue: Story = {
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `
import { useState, type ChangeEvent } from 'react';
import Input from './Input';
      
const UncontrolledInput = () => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    console.log(value);
  };

  return (
    <Input
      id='controlled-input'
      label='Controlled Input'
      defaultValue={'Uncontrolled Value'}
      onChange={handleChange}
      variant='regular'
      size='md'
    />
  );
}
`
      }
    }
  },
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input2' label='Lorem Ipsum' variant='regular' size='md' />
    </div>
  )
};

/**
 * - You can use isRequired to indicate that the input field is mandatory.
 * - This will add an asterisk (*) next to the label to indicate that the field is required.
 */
export const Required: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input38' label='Lorem Ipsum' variant='regular' size='md' isRequired={true} />
      <Input id='input39' label='Lorem Ipsum' variant='regular' size='lg' isRequired={true} />
    </div>
  )
};
/**
 * - A standard input field with a solid background.
 */

export const Regular: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input3' label='Lorem Ipsum' variant='regular' size='sm' />
      <Input id='input4' label='Lorem Ipsum' variant='regular' size='md' />
      <Input id='input5' label='Lorem Ipsum' variant='regular' size='lg' />
    </div>
  )
};

/**
 * - A variant with an underlined style, suitable for minimalistic designs.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Underlined: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input6' label='Lorem Ipsum' variant='underlined' size='sm' />
      <Input id='input7' label='Lorem Ipsum' variant='underlined' size='md' />
      <Input id='input8' label='Lorem Ipsum' variant='underlined' size='lg' />
    </div>
  )
};

/**
 * - A variant with a line style, providing a clean and modern look.
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Line: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input9' label='Lorem Ipsum' variant='line' size='sm' />
      <Input id='input10' label='Lorem Ipsum' variant='line' size='md' />
      <Input id='input11' label='Lorem Ipsum' variant='line' size='lg' />
    </div>
  )
};

/**
 * - A bordered variant that provides a distinct outline around the input field.
 */

export const Bordered: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Input id='input12' label='Lorem Ipsum' variant='bordered' size='sm' />
      <Input id='input13' label='Lorem Ipsum' variant='bordered' size='md' />
      <Input id='input14' label='Lorem Ipsum' variant='bordered' size='lg' />
    </div>
  )
};

/**
 * - A variant with rounded corners for a softer appearance.
 * - This variant can be applied to any of the input styles (regular, underlined, line, bordered).
 */

export const Rounded: Story = {
  render: () => (
    <div className='flex flex-col justify-center gap-4'>
      <Input id='input15' label='Lorem Ipsum' variant='regular' rounded={true} />
      <Input id='input16' label='Lorem Ipsum' variant='underlined' rounded={true} />
      <Input id='input17' label='Lorem Ipsum' variant='line' rounded={true} />
      <Input id='input18' label='Lorem Ipsum' variant='bordered' rounded={true} />
    </div>
  )
};

/**
 * - Input fields for number inputs, allowing users to enter numeric values.
 */

export const InputNumber: Story = {
  render: () => (
    <div className='flex flex-col justify-center gap-4'>
      <Input id='input19' label='Lorem Ipsum' variant='regular' type='number' />
      <Input id='input20' label='Lorem Ipsum' variant='underlined' type='number' />
      <Input id='input21' label='Lorem Ipsum' variant='line' type='number' />
      <Input id='input22' label='Lorem Ipsum' variant='bordered' type='number' />
    </div>
  )
};

/**
 * - Input fields specifically for password entry, which typically include features like masking the input.
 */

export const InputPassword: Story = {
  render: () => (
    <div className='flex flex-col justify-center gap-4'>
      <Input id='input23' label='Lorem Ipsum' variant='regular' type='password' />
      <Input id='input24' label='Lorem Ipsum' variant='underlined' type='password' />
      <Input id='input25' label='Lorem Ipsum' variant='line' type='password' />
      <Input id='input26' label='Lorem Ipsum' variant='bordered' type='password' />
    </div>
  )
};

/**
 * - Input fields with hints to provide additional context or instructions to the user.
 * - Hints can be styled based on their type (error, warning, success, info).
 * - ⚠️ This variant uses a transparent background by default. To ensure proper visibility, place it inside a container with a solid or plain background.
 */

export const Hint: Story = {
  render: () => (
    <div className='flex flex-col justify-center gap-4'>
      <Input id='input27' label='Lorem Ipsum' variant='regular' hint={{ type: 'error', message: 'Lorem ipsum' }} />
      <Input id='input28' label='Lorem Ipsum' variant='regular' hint={{ type: 'warning', message: 'Lorem ipsum' }} />
      <Input id='input29' label='Lorem Ipsum' variant='regular' hint={{ type: 'success', message: 'Lorem ipsum' }} />
      <Input id='input30' label='Lorem Ipsum' variant='regular' hint={{ type: 'info', message: 'Lorem ipsum' }} />
    </div>
  )
};

/**
 * - Disabled input fields that cannot be interacted with.
 * - Useful for indicating that a field is not currently available for input.
 */

export const Disabled: Story = {
  render: () => (
    <div className='flex flex-col justify-center items-center gap-4'>
      <Input id='input31' label='Lorem Ipsum' variant='regular' disabled={true} />
      <Input id='input32' label='Lorem Ipsum' variant='underlined' disabled={true} />
      <Input id='input33' label='Lorem Ipsum' variant='line' disabled={true} />
      <Input id='input34' label='Lorem Ipsum' variant='bordered' disabled={true} />
    </div>
  )
};

/**
 * - Input fields with additional content at the start or end, such as icons or text.
 * - This can enhance the usability and visual appeal of the input field.
 */

export const StartAndEnd: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Input
        id='input35'
        placeholder='Placeholder'
        variant='regular'
        startContent={
          <Text tag='p' className='pt-[2px]'>
            Start
          </Text>
        }
        endContent={
          <Text tag='p' className='pt-[2px]'>
            End
          </Text>
        }
      />
      <Input
        id='input36'
        type='email'
        placeholder='Placeholder'
        startContent={<Icon name='mail' color='text-color-text-light' colorDark='dark:text-color-text-dark' />}
        endContent={
          <Text tag='p' className='pt-[2px]'>
            @gmail.com
          </Text>
        }
      />
      <Input
        id='input37'
        type='url'
        placeholder='Placeholder'
        startContent={
          <Text tag='p' className='pt-[2px]'>
            https://
          </Text>
        }
      />
    </div>
  )
};

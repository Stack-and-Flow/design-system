import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from './Slider';

/**
 * ## Description
 * Slider lets users choose one numeric value or an explicit two-value range within a bounded interval.
 * Use it for continuous preferences such as volume, brightness, storage, or price ranges.
 *
 * ## Dependencies
 * Uses `@radix-ui/react-slider` for pointer, drag, focus, keyboard, range, and disabled behavior.
 *
 * ## Usage Guide
 * Values are always `number[]`: one item renders single-value mode, and two items render explicit range mode.
 * When uncontrolled values are omitted, Slider initializes from `[min]` rather than hard-coding `[0]`.
 * Range mode should provide distinguishable thumb names with `thumbLabels`; otherwise the component falls back to
 * `Minimum value` and `Maximum value`. Use `color` and `rounded` to align Slider with nearby Progress indicators.
 * Visible labels, helper text, and output values are composed externally in the MVP.
 */
const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  parameters: { docs: { autodocs: true } },
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Slider>;

const frame = (children: ReactNode, gapClass = 'gap-3') => (
  <div
    className={cn(
      'flex w-96 max-w-full flex-col rounded-md border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark',
      gapClass
    )}
  >
    {children}
  </div>
);

/**
 * Shows the default uncontrolled single-value Slider with its default size and full-width behavior.
 */
export const Default: Story = {
  args: { ariaLabel: 'Volume', onValueChange: action('slider-change') },
  render: (args) => frame(<Slider {...args} />)
};

/**
 * Shows a controlled single-value Slider with externally composed label and output text.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState([40]);
    const logChange = action('controlled-slider-change');
    return frame(
      <>
        <div className='flex items-center justify-between px-5 text-sm font-medium text-text-light dark:text-text-dark'>
          <span id='controlled-slider-label'>Volume</span>
          <output aria-live='polite'>{value[0]}</output>
        </div>
        <Slider
          aria-labelledby='controlled-slider-label'
          value={value}
          onValueChange={(next) => {
            logChange(next);
            setValue(next);
          }}
        />
      </>
    );
  }
};

/**
 * Shows explicit two-thumb range mode with distinguishable accessible names for each thumb.
 */
export const Range: Story = {
  render: () => {
    const [value, setValue] = useState([25, 75]);
    const logChange = action('range-slider-change');
    return frame(
      <>
        <div className='flex items-center justify-between px-5 text-sm font-medium text-text-light dark:text-text-dark'>
          <span id='price-range-label'>Price range</span>
          <output aria-live='polite'>
            {value[0]} – {value[1]}
          </output>
        </div>
        <Slider
          aria-labelledby='price-range-label'
          value={value}
          thumbLabels={['Minimum price', 'Maximum price']}
          onValueChange={(next) => {
            logChange(next);
            setValue(next);
          }}
        />
      </>
    );
  }
};

/**
 * Shows the non-interactive disabled state with opacity-based disabled treatment.
 */
export const Disabled: Story = {
  args: {
    ariaLabel: 'Disabled volume',
    defaultValue: [40],
    disabled: true,
    onValueChange: action('disabled-slider-change')
  },
  render: (args) => frame(<Slider {...args} />)
};

/**
 * Shows the supported size variants while preserving the same 44px thumb hit area.
 */
export const Sizes: Story = {
  render: () =>
    frame(
      <>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Small</span>
          <Slider
            ariaLabel='Small slider'
            size='sm'
            defaultValue={[25]}
            onValueChange={action('small-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Medium</span>
          <Slider
            ariaLabel='Medium slider'
            size='md'
            defaultValue={[50]}
            onValueChange={action('medium-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Large</span>
          <Slider
            ariaLabel='Large slider'
            size='lg'
            defaultValue={[75]}
            onValueChange={action('large-slider-change')}
          />
        </div>
      </>,
      'gap-6'
    )
};

/**
 * Shows the available color variants.
 */
export const Colors: Story = {
  render: () =>
    frame(
      <>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Default</span>
          <Slider
            ariaLabel='Default slider'
            color='default'
            defaultValue={[50]}
            onValueChange={action('default-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Primary</span>
          <Slider
            ariaLabel='Primary slider'
            color='primary'
            defaultValue={[50]}
            onValueChange={action('primary-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Secondary</span>
          <Slider
            ariaLabel='Secondary slider'
            color='secondary'
            defaultValue={[50]}
            onValueChange={action('secondary-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Success</span>
          <Slider
            ariaLabel='Success slider'
            color='success'
            defaultValue={[50]}
            onValueChange={action('success-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Warning</span>
          <Slider
            ariaLabel='Warning slider'
            color='warning'
            defaultValue={[50]}
            onValueChange={action('warning-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Danger</span>
          <Slider
            ariaLabel='Danger slider'
            color='danger'
            defaultValue={[50]}
            onValueChange={action('danger-slider-change')}
          />
        </div>
      </>,
      'gap-6'
    )
};

/**
 * Shows the available rounded variants.
 */
export const Rounded: Story = {
  render: () =>
    frame(
      <>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>None</span>
          <Slider
            ariaLabel='Square slider'
            rounded='none'
            defaultValue={[70]}
            onValueChange={action('square-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Small</span>
          <Slider
            ariaLabel='Small rounded slider'
            rounded='sm'
            defaultValue={[70]}
            onValueChange={action('rounded-sm-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Medium</span>
          <Slider
            ariaLabel='Medium rounded slider'
            rounded='md'
            defaultValue={[70]}
            onValueChange={action('rounded-md-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Large</span>
          <Slider
            ariaLabel='Large rounded slider'
            rounded='lg'
            defaultValue={[70]}
            onValueChange={action('rounded-lg-slider-change')}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>Full</span>
          <Slider
            ariaLabel='Fully rounded slider'
            rounded='full'
            defaultValue={[70]}
            onValueChange={action('rounded-full-slider-change')}
          />
        </div>
      </>,
      'gap-6'
    )
};

/**
 * Shows how to associate Slider with a visible external label using `aria-labelledby`.
 */
export const WithExternalLabel: Story = {
  render: () =>
    frame(
      <>
        <label id='external-slider-label' className='px-5 text-sm font-medium text-text-light dark:text-text-dark'>
          Brightness
        </label>
        <Slider
          aria-labelledby='external-slider-label'
          defaultValue={[60]}
          onValueChange={action('brightness-change')}
        />
      </>
    )
};

/**
 * Shows externally composed field help text and current value output without adding built-in field layout props.
 */
export const WithFieldDescription: Story = {
  render: () => {
    const [value, setValue] = useState([60]);
    const logChange = action('storage-slider-change');
    return frame(
      <>
        <div className='flex items-center justify-between px-5 text-sm font-medium text-text-light dark:text-text-dark'>
          <span id='storage-slider-label'>Storage allocation</span>
          <output aria-live='polite'>{value[0]} GB</output>
        </div>
        <Slider
          aria-labelledby='storage-slider-label'
          aria-describedby='storage-slider-description'
          min={0}
          max={100}
          step={5}
          value={value}
          onValueChange={(next) => {
            logChange(next);
            setValue(next);
          }}
        />
        <p
          id='storage-slider-description'
          className='px-5 text-sm text-text-secondary-light dark:text-text-secondary-dark'
        >
          Choose the percentage of available storage reserved for this workspace.
        </p>
      </>
    );
  }
};

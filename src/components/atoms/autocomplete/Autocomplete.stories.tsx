import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Autocomplete } from './Autocomplete';

const countryOptions = [
  { key: 'ar', label: 'Argentina', description: 'Buenos Aires' },
  { key: 'br', label: 'Brazil', description: 'Brasília' },
  { key: 'cl', label: 'Chile', description: 'Santiago' },
  { key: 'co', label: 'Colombia', description: 'Bogotá' },
  { key: 'mx', label: 'Mexico', description: 'Mexico City' },
  { key: 'uy', label: 'Uruguay', description: 'Montevideo' }
];

const longCountryOptions = [
  { key: 'argentina', label: 'Argentina', description: 'Buenos Aires' },
  { key: 'australia', label: 'Australia', description: 'Canberra' },
  { key: 'austria', label: 'Austria', description: 'Vienna' },
  { key: 'belgium', label: 'Belgium', description: 'Brussels' },
  { key: 'bolivia', label: 'Bolivia', description: 'Sucre' },
  { key: 'brazil', label: 'Brazil', description: 'Brasília' },
  { key: 'canada', label: 'Canada', description: 'Ottawa' },
  { key: 'chile', label: 'Chile', description: 'Santiago' },
  { key: 'china', label: 'China', description: 'Beijing' },
  { key: 'colombia', label: 'Colombia', description: 'Bogotá' },
  { key: 'costa-rica', label: 'Costa Rica', description: 'San José' },
  { key: 'croatia', label: 'Croatia', description: 'Zagreb' },
  { key: 'cuba', label: 'Cuba', description: 'Havana' },
  { key: 'denmark', label: 'Denmark', description: 'Copenhagen' },
  { key: 'dominican-republic', label: 'Dominican Republic', description: 'Santo Domingo' },
  { key: 'ecuador', label: 'Ecuador', description: 'Quito' },
  { key: 'egypt', label: 'Egypt', description: 'Cairo' },
  { key: 'el-salvador', label: 'El Salvador', description: 'San Salvador' },
  { key: 'finland', label: 'Finland', description: 'Helsinki' },
  { key: 'france', label: 'France', description: 'Paris' },
  { key: 'germany', label: 'Germany', description: 'Berlin' },
  { key: 'greece', label: 'Greece', description: 'Athens' },
  { key: 'guatemala', label: 'Guatemala', description: 'Guatemala City' },
  { key: 'honduras', label: 'Honduras', description: 'Tegucigalpa' },
  { key: 'hungary', label: 'Hungary', description: 'Budapest' },
  { key: 'india', label: 'India', description: 'New Delhi' },
  { key: 'indonesia', label: 'Indonesia', description: 'Jakarta' },
  { key: 'ireland', label: 'Ireland', description: 'Dublin' },
  { key: 'italy', label: 'Italy', description: 'Rome' },
  { key: 'japan', label: 'Japan', description: 'Tokyo' },
  { key: 'mexico', label: 'Mexico', description: 'Mexico City' },
  { key: 'netherlands', label: 'Netherlands', description: 'Amsterdam' },
  { key: 'new-zealand', label: 'New Zealand', description: 'Wellington' },
  { key: 'norway', label: 'Norway', description: 'Oslo' },
  { key: 'panama', label: 'Panama', description: 'Panama City' },
  { key: 'paraguay', label: 'Paraguay', description: 'Asunción' },
  { key: 'peru', label: 'Peru', description: 'Lima' },
  { key: 'poland', label: 'Poland', description: 'Warsaw' },
  { key: 'portugal', label: 'Portugal', description: 'Lisbon' },
  { key: 'romania', label: 'Romania', description: 'Bucharest' },
  { key: 'south-africa', label: 'South Africa', description: 'Pretoria' },
  { key: 'south-korea', label: 'South Korea', description: 'Seoul' },
  { key: 'spain', label: 'Spain', description: 'Madrid' },
  { key: 'sweden', label: 'Sweden', description: 'Stockholm' },
  { key: 'switzerland', label: 'Switzerland', description: 'Bern' },
  { key: 'thailand', label: 'Thailand', description: 'Bangkok' },
  { key: 'united-kingdom', label: 'United Kingdom', description: 'London' },
  { key: 'united-states', label: 'United States', description: 'Washington, D.C.' },
  { key: 'uruguay', label: 'Uruguay', description: 'Montevideo' },
  { key: 'venezuela', label: 'Venezuela', description: 'Caracas' }
];

/**
 * ## Description
 * Autocomplete lets users search and select a single option from a popover-backed list while keeping the
 * trigger visually aligned with `Select`. The trigger opens the popover and the internal search input owns
 * the combobox relationship for filtering and keyboard navigation.
 *
 * ## Usage Guide
 * Use this component when people need help narrowing down a long single-select list without switching to a
 * full inline combobox. Keep the option labels concise, provide a visible label when possible, and rely on
 * `searchAriaLabel` only when the trigger label is not enough context for the search field.
 */
const meta: Meta<typeof Autocomplete> = {
  title: 'Atoms/Autocomplete',
  component: Autocomplete,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

/**
 * Demonstrates the baseline searchable select with the default visual variants and public API.
 */
export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    searchPlaceholder: 'Search countries',
    options: countryOptions,
    onChange: action('change'),
    onClear: action('clear'),
    onOpenChange: action('open-change')
  }
};

/**
 * Demonstrates the size scale so reviewers can compare spacing, touch target, and label behavior.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-end gap-6'>
      <div className='w-56'>
        <Autocomplete
          label='Small'
          size='sm'
          placeholder='Search…'
          options={countryOptions}
          onChange={action('sm-change')}
        />
      </div>
      <div className='w-56'>
        <Autocomplete
          label='Medium'
          size='md'
          placeholder='Search…'
          options={countryOptions}
          onChange={action('md-change')}
        />
      </div>
      <div className='w-56'>
        <Autocomplete
          label='Large'
          size='lg'
          placeholder='Search…'
          options={countryOptions}
          onChange={action('lg-change')}
        />
      </div>
    </div>
  )
};

/**
 * Shows the non-interactive disabled state that relies on opacity instead of alternate disabled colors.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true
  }
};

/**
 * Shows the loading experience where the popover replaces the search input and options with a status row.
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    loadingLabel: 'Loading countries...'
  }
};

/**
 * Shows the clear action when a selected value is already present.
 */
export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('ar');
    return (
      <div className='w-56'>
        <Autocomplete
          label='Country'
          placeholder='Select a country'
          searchPlaceholder='Search countries'
          options={countryOptions}
          value={value}
          isClearable={true}
          onChange={(key) => setValue(key)}
          onClear={() => setValue(null)}
        />
      </div>
    );
  }
};

/**
 * Shows helper text placed above the trigger for supporting field context.
 */
export const WithDescription: Story = {
  args: {
    ...Default.args,
    description: 'We use this to localize content and pricing.'
  }
};

/**
 * Shows all hint tones (error, warning, success, info) side by side so reviewers can compare semantic feedback states.
 */
export const Hints: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-6'>
      <div className='w-56'>
        <Autocomplete
          label='Error'
          placeholder='Search…'
          options={countryOptions}
          hint={{ message: 'Country is required.', type: 'error' }}
          onChange={action('error-change')}
        />
      </div>
      <div className='w-56'>
        <Autocomplete
          label='Warning'
          placeholder='Search…'
          options={countryOptions}
          hint={{ message: 'Double-check the selected market.', type: 'warning' }}
          onChange={action('warning-change')}
        />
      </div>
      <div className='w-56'>
        <Autocomplete
          label='Success'
          placeholder='Search…'
          options={countryOptions}
          hint={{ message: 'Selection looks good.', type: 'success' }}
          onChange={action('success-change')}
        />
      </div>
      <div className='w-56'>
        <Autocomplete
          label='Info'
          placeholder='Search…'
          options={countryOptions}
          hint={{ message: 'Pick the market used for reporting.', type: 'info' }}
          onChange={action('info-change')}
        />
      </div>
    </div>
  )
};

/**
 * Shows filtering over a long option list so maintainers can verify the component still reads as a form control, not a menu wall.
 */
export const LongListFiltering: Story = {
  args: {
    ...Default.args,
    options: longCountryOptions
  }
};

/**
 * Shows disabled options mixed with enabled ones so reviewers can verify the visual treatment and keyboard skip behavior.
 */
export const WithDisabledOptions: Story = {
  args: {
    ...Default.args,
    options: [
      { key: 'ar', label: 'Argentina', description: 'Buenos Aires', disabled: true },
      { key: 'br', label: 'Brazil', description: 'Brasília' },
      { key: 'cl', label: 'Chile', description: 'Santiago', disabled: true },
      { key: 'co', label: 'Colombia', description: 'Bogotá' },
      { key: 'mx', label: 'Mexico', description: 'Mexico City', disabled: true },
      { key: 'uy', label: 'Uruguay', description: 'Montevideo' }
    ]
  }
};

/**
 * Shows the single-result Enter flow by narrowing the list to one expected match through the initial data set.
 */
export const SingleMatchEnter: Story = {
  args: {
    ...Default.args,
    options: countryOptions
  }
};

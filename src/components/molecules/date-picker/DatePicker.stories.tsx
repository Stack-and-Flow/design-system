import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

/**
 * ## Description
 * DatePicker lets users choose one local calendar date from an accessible popover field.
 * It is intended for forms that need a `Date | null` value, optional hidden input serialization, and Calendar-powered date constraints.
 *
 * ## Dependencies
 * - `Popover` anchors the calendar surface and manages dialog semantics.
 * - `Calendar` renders the date grid and owns calendar keyboard behavior.
 *
 * ## Usage Guide
 * Provide either a visible `label` or an `ariaLabel` so the trigger has an accessible name.
 * Use `name` when the selected date should serialize as a local `YYYY-MM-DD` hidden input value.
 */
const meta: Meta<typeof DatePicker> = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

/**
 * Default field with a visible label and no selected date.
 */
export const Default: Story = {
  args: {
    id: 'storybook-date-picker-default',
    label: 'Event date',
    name: 'eventDate',
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

/**
 * Initial values display with the configured formatter and serialize through the hidden input when a name is provided.
 */
export const WithInitialValue: Story = {
  args: {
    id: 'storybook-date-picker-initial',
    label: 'Start date',
    name: 'startDate',
    defaultValue: new Date(2024, 4, 15),
    isClearable: true,
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

/**
 * Controlled usage keeps the selected date in parent state while still reporting Storybook actions.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2024, 5, 20));

    return (
      <DatePicker
        id='storybook-date-picker-controlled'
        label='Controlled date'
        name='controlledDate'
        value={value}
        isClearable={true}
        onDateChange={(date) => {
          action('date change')(date);
          setValue(date);
        }}
        onOpenChange={action('open change')}
      />
    );
  }
};

/**
 * Validation copy is announced through the trigger description and uses the error visual state.
 */
export const ValidationError: Story = {
  args: {
    id: 'storybook-date-picker-error',
    label: 'Required date',
    description: 'Choose the date that should appear on the booking.',
    isRequired: true,
    validationState: 'error',
    validationMessage: 'Choose an available date.',
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

/**
 * Disabled fields do not open and do not render a hidden input value.
 */
export const Disabled: Story = {
  args: {
    id: 'storybook-date-picker-disabled',
    label: 'Disabled date',
    name: 'disabledDate',
    defaultValue: new Date(2024, 7, 10),
    disabled: true,
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

/**
 * Read-only fields remain readable and keep their hidden input value while preventing user-driven changes.
 */
export const ReadOnly: Story = {
  args: {
    id: 'storybook-date-picker-readonly',
    label: 'Read-only date',
    name: 'readonlyDate',
    defaultValue: new Date(2024, 7, 10),
    readOnly: true,
    isClearable: true,
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

/**
 * Clearable fields render the clear action as a sibling button when a date is selected.
 */
export const Clearable: Story = {
  args: {
    id: 'storybook-date-picker-clearable',
    label: 'Clearable date',
    name: 'clearableDate',
    defaultValue: new Date(2024, 8, 3),
    isClearable: true,
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

/**
 * Calendar constraints, multiple visible months, and Gregorian locale formatting can be configured together.
 */
export const WithConstraints: Story = {
  args: {
    id: 'storybook-date-picker-constraints',
    label: 'Booking date',
    description: 'Only the visible booking window is selectable.',
    minDate: new Date(2024, 4, 1),
    maxDate: new Date(2024, 5, 30),
    disabledDates: [new Date(2024, 4, 12), new Date(2024, 4, 19)],
    firstDayOfWeek: 1,
    visibleMonths: 2,
    locale: 'en-GB',
    formatOptions: {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    },
    defaultValue: new Date(2024, 4, 15),
    onDateChange: action('date change'),
    onOpenChange: action('open change')
  }
};

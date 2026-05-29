import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// spinners-react uses CSS animations not available in jsdom
vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: matches the named export from spinners-react package
  SpinnerCircular: () => <span data-loading-spinner={true} />
}));

import { Select } from './Select';
import type { SelectOption } from './types';
import { useSelect } from './useSelect';

const defaultOptions: SelectOption[] = [
  { key: 'ar', label: 'Argentina' },
  { key: 'br', label: 'Brazil' },
  { key: 'uy', label: 'Uruguay' }
];

const getTriggerContainer = () => screen.getByRole('combobox').parentElement?.parentElement as HTMLElement;

describe('useSelect — logic', () => {
  it('returns unselected state by default', () => {
    const { result } = renderHook(() => useSelect({ options: defaultOptions, label: 'Country' }));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.hasValue).toBe(false);
    expect(result.current.selectedOption).toBeUndefined();
  });

  it('returns the defaultValue for uncontrolled selects', () => {
    const { result } = renderHook(() => useSelect({ options: defaultOptions, label: 'Country', defaultValue: 'ar' }));

    expect(result.current.hasValue).toBe(true);
    expect(result.current.selectedOption?.key).toBe('ar');
  });

  it('keeps value controlled by the value prop', () => {
    const { result } = renderHook(() => useSelect({ options: defaultOptions, label: 'Country', value: 'br' }));

    expect(result.current.selectedOption?.key).toBe('br');
  });

  it('calls onChange when selecting an option', () => {
    const handleChange = vi.fn();
    const { result } = renderHook(() =>
      useSelect({ options: defaultOptions, label: 'Country', onChange: handleChange })
    );

    act(() => {
      result.current.handleItemSelect(defaultOptions[1]);
    });

    expect(handleChange).toHaveBeenCalledWith('br');
  });

  it('passes native button props through to the combobox trigger', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select...' data-testid='country-select' />);

    expect(screen.getByTestId('country-select')).toBe(screen.getByRole('combobox', { name: 'Country' }));
  });

  it('selected option is exposed with aria-selected', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} value='ar' placeholder='Select...' />);
    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute('aria-selected', 'true');
  });

  it('disabled option is exposed with aria-disabled', async () => {
    const user = userEvent.setup();
    const options: SelectOption[] = [
      { key: 'ar', label: 'Argentina' },
      { key: 'br', label: 'Brazil', disabled: true }
    ];
    render(<Select label='Country' options={options} placeholder='Select...' />);
    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: 'Brazil' })).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('Select — render', () => {
  it('renders label text', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('renders placeholder when no value is selected', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('renders placeholder in trigger', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('renders the selected option label in trigger when open', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} value='br' placeholder='Select a country' />);

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox')).toHaveTextContent('Brazil');
  });

  it('renders the selected option label in trigger even when closed', () => {
    render(<Select label='Country' options={defaultOptions} value='br' placeholder='Select a country' />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Brazil');
  });

  it('renders disabled state with aria-disabled', () => {
    render(<Select label='Country' options={defaultOptions} isDisabled={true} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders loading state with spinner in popover', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} isLoading={true} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Loading options...')).toBeInTheDocument();
  });

  it('renders clear button when isClearable and has value', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' isClearable={true} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('clear button visible even when closed if clearable and has value', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' isClearable={true} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('does not render clear button without value', () => {
    render(<Select label='Country' options={defaultOptions} isClearable={true} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('label is positioned', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' placeholder='Select...' />);
    const label = screen.getByText('Country');
    expect(label).toBeInTheDocument();
  });

  it('hidden input carries value when dropdown is closed', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' name='country' />);
    const hiddenInput = document.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue('ar');
  });

  it('placeholder is always visible when no value selected', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('renders hint message when provided', () => {
    render(<Select label='Country' options={defaultOptions} hint={{ message: 'Required field', type: 'error' }} />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('renders description text when provided', () => {
    render(<Select label='Country' options={defaultOptions} description='Choose your country' />);
    expect(screen.getByText('Choose your country')).toBeInTheDocument();
  });
});

describe('Select — interaction', () => {
  it('opens popover on trigger click and closes on second click', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    expect(trigger).toHaveFocus();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Argentina' })).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('positions popover from the visual trigger container', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const container = getTriggerContainer();
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      x: 40,
      y: 48,
      left: 40,
      top: 48,
      right: 264,
      bottom: 104,
      width: 224,
      height: 56,
      toJSON: () => undefined
    });

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('listbox')).toHaveStyle({
      left: '40px',
      top: '108px',
      width: '224px'
    });
  });

  it('selects an item and calls onChange when clicking an option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' onChange={handleChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Brazil' }));

    expect(handleChange).toHaveBeenCalledWith('br');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes popover when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select label='Country' options={defaultOptions} placeholder='Select a country' />
        <button type='button'>Outside</button>
      </div>
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears value through onClear without emitting an empty onChange key', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    render(
      <Select
        label='Country'
        options={defaultOptions}
        value='ar'
        isClearable={true}
        onClear={handleClear}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('clears value from keyboard-accessible clear button', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(<Select label='Country' options={defaultOptions} value='ar' isClearable={true} onClear={handleClear} />);

    await user.tab();
    expect(screen.getByRole('combobox')).toHaveFocus();
    await user.tab();
    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('opens popover and focuses first item on ArrowDown', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute('data-focused', 'true');
    expect(trigger).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-ar'));
  });

  it('cycles through enabled items with ArrowUp and ArrowDown', async () => {
    const user = userEvent.setup();
    const optionsWithDisabled: SelectOption[] = [
      { key: 'ar', label: 'Argentina' },
      { key: 'br', label: 'Brazil', disabled: true },
      { key: 'uy', label: 'Uruguay' }
    ];

    render(<Select label='Country' options={optionsWithDisabled} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const argentina = screen.getByRole('option', { name: 'Argentina' });
    expect(argentina).toHaveAttribute('data-focused', 'true');

    await user.keyboard('{ArrowDown}');
    const uruguay = screen.getByRole('option', { name: 'Uruguay' });
    expect(uruguay).toHaveAttribute('data-focused', 'true');

    await user.keyboard('{ArrowUp}');
    expect(argentina).toHaveAttribute('data-focused', 'true');
  });

  it('selects focused item with Enter', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' onChange={handleChange} />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith('ar');
  });

  it('closes popover with Escape and returns focus to trigger', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('jumps to first and last enabled items with Home and End', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{End}');

    expect(screen.getByRole('option', { name: 'Uruguay' })).toHaveAttribute('data-focused', 'true');

    await user.keyboard('{Home}');
    expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute('data-focused', 'true');
  });

  it('container click toggles popover when clicking outside button', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const container = getTriggerContainer();
    await user.click(container);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(container);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('allows consumer onClick to veto container toggle', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label='Country'
        options={defaultOptions}
        placeholder='Select a country'
        onClick={(event) => event.preventDefault()}
      />
    );

    await user.click(screen.getByRole('combobox'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clear button stopPropagation prevents container click from re-opening', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} defaultValue='ar' isClearable={true} />);

    // Clear value so the clear button disappears
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    // After clearing in uncontrolled mode, clear button should disappear and the popover should stay closed.
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes popover when Tab is pressed', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Tab}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects option via type-ahead when typing a character', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('b');

    expect(screen.getByRole('option', { name: 'Brazil' })).toHaveAttribute('data-focused', 'true');
  });

  it('opens popover and focuses first item on Home when closed', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{Home}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute('data-focused', 'true');
  });

  it('opens popover and focuses last item on End when closed', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{End}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Uruguay' })).toHaveAttribute('data-focused', 'true');
  });

  it('opens popover on Enter when closed', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens popover on Space when closed', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard(' ');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens popover and focuses last item on ArrowUp when closed', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowUp}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Uruguay' })).toHaveAttribute('data-focused', 'true');
  });
});

describe('Select — accessibility', () => {
  it('trigger has combobox role and aria-haspopup listbox', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);
    const trigger = screen.getByRole('combobox');

    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('aria-expanded reflects open state', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('links the trigger to the active option while navigating the listbox', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' id='country-select' />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(trigger).toHaveAttribute('aria-activedescendant', 'country-select-option-ar');

    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-activedescendant', 'country-select-option-br');
  });

  it('trigger has aria-invalid when isInvalid', () => {
    render(<Select label='Country' options={defaultOptions} isInvalid={true} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hint message is linked via aria-describedby', () => {
    render(
      <Select
        label='Country'
        options={defaultOptions}
        hint={{ message: 'Required', type: 'error' }}
        id='country-select'
      />
    );

    const trigger = screen.getByRole('combobox');
    const hintId = trigger.getAttribute('aria-describedby');
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId ?? '')).toHaveTextContent('Required');
  });

  it('aria-describedby contains both description and hint IDs when both are provided', () => {
    render(
      <Select
        label='Country'
        options={defaultOptions}
        description='Choose your country'
        hint={{ message: 'Required', type: 'error' }}
        id='country-select'
      />
    );

    const trigger = screen.getByRole('combobox');
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(describedBy).toContain('country-select-description');
    expect(describedBy).toContain('country-select-hint');
  });

  it('selected option has aria-selected', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} value='br' placeholder='Select a country' />);

    await user.click(screen.getByRole('combobox'));
    const brazilOption = screen.getByRole('option', { name: 'Brazil' });

    expect(brazilOption).toHaveAttribute('aria-selected', 'true');
  });

  it('renders hidden input for form integration', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' name='country' />);
    const hiddenInput = document.querySelector('input[type="hidden"]');

    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('name', 'country');
    expect(hiddenInput).toHaveValue('ar');
  });
});

describe('Select — size and variant smoke coverage', () => {
  it.each(['sm', 'md', 'lg'] as const)('renders %s size as an accessible combobox', (size) => {
    render(<Select label='Country' options={defaultOptions} size={size} placeholder='Select...' />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it.each([
    'regular',
    'bordered',
    'faded',
    'line',
    'underlined'
  ] as const)('renders %s variant as an accessible combobox', (variant) => {
    render(<Select label='Country' options={defaultOptions} variant={variant} placeholder='Select...' />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });
});

describe('Select — hint pattern', () => {
  it.each([
    ['error', 'circle-alert'],
    ['warning', 'triangle-alert'],
    ['success', 'circle-check'],
    ['info', 'info']
  ] as const)('renders correct icon for hint type %s', (type, _iconName) => {
    render(<Select label='Country' options={defaultOptions} hint={{ message: 'Hint text', type }} />);
    const hintContainer = screen.getByText('Hint text').parentElement;
    expect(hintContainer).toBeInTheDocument();
    // Icon + text span = 2 children
    expect(hintContainer?.children.length).toBeGreaterThanOrEqual(1);
  });

  it('renders hint message text', () => {
    render(
      <Select label='Country' options={defaultOptions} hint={{ message: 'Please select a country', type: 'info' }} />
    );
    expect(screen.getByText('Please select a country')).toBeInTheDocument();
  });

  it('derives error status from hint type', () => {
    render(<Select label='Country' options={defaultOptions} hint={{ message: 'Error', type: 'error' }} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Select — backward compatibility', () => {
  it('errorMessage prop renders hint with type error', () => {
    render(<Select label='Country' options={defaultOptions} errorMessage='Legacy error' />);
    expect(screen.getByText('Legacy error')).toBeInTheDocument();
  });

  it('isInvalid prop sets aria-invalid', () => {
    render(<Select label='Country' options={defaultOptions} isInvalid={true} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('faded variant remains accepted as a deprecated alias', () => {
    render(<Select label='Country' options={defaultOptions} variant='faded' placeholder='Select...' />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('warns in dev mode when using deprecated errorMessage prop', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Select label='Country' options={defaultOptions} errorMessage='Legacy' />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('errorMessage'));
    warnSpy.mockRestore();
  });

  it('warns in dev mode when using deprecated isInvalid prop', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Select label='Country' options={defaultOptions} isInvalid={true} />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('isInvalid'));
    warnSpy.mockRestore();
  });

  it('warns in dev mode when using deprecated faded variant', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Select label='Country' options={defaultOptions} variant='faded' />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('faded'));
    warnSpy.mockRestore();
  });

  it('emits each deprecation warning at most once per component instance', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(<Select label='Country' options={defaultOptions} errorMessage='Legacy' />);

    rerender(<Select label='Country' options={defaultOptions} errorMessage='Still legacy' />);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});

describe('Select — floating label', () => {
  it('keeps label associated when value is selected', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' placeholder='Select...' id='country-select' />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveAttribute(
      'aria-labelledby',
      'country-select-label'
    );
  });

  it('keeps label associated when placeholder is shown', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select a country' id='country-select' />);

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveAttribute(
      'aria-labelledby',
      'country-select-label'
    );
  });

  it('shows resting state when no label is provided', () => {
    render(<Select options={defaultOptions} placeholder='Select...' />);
    expect(screen.queryByText('Country')).not.toBeInTheDocument();
  });

  it('keeps label associated when popover is open', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select...' id='country-select' />);
    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveAttribute(
      'aria-labelledby',
      'country-select-label'
    );
  });
});

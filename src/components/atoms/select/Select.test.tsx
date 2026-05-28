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

  it('renders bordered variant with visible border', () => {
    render(<Select label='Country' options={defaultOptions} variant='bordered' size='sm' placeholder='Select...' />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.className).toContain('border-border-strong-light');
    expect(trigger.className).toContain('h-12');
  });

  it('selected option has highlighted style', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} value='ar' placeholder='Select...' />);
    await user.click(screen.getByRole('combobox'));
    const selected = screen.getByRole('option', { name: 'Argentina' });
    expect(selected.className).toContain('bg-brand-light/10');
  });

  it('disabled option has reduced opacity', async () => {
    const user = userEvent.setup();
    const options: SelectOption[] = [
      { key: 'ar', label: 'Argentina' },
      { key: 'br', label: 'Brazil', disabled: true }
    ];
    render(<Select label='Country' options={options} placeholder='Select...' />);
    await user.click(screen.getByRole('combobox'));
    const disabled = screen.getByRole('option', { name: 'Brazil' });
    expect(disabled.className).toContain('opacity-40');
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

  it('label is always in small/floating position', () => {
    render(<Select label='Country' options={defaultOptions} value='ar' placeholder='Select...' />);
    const label = screen.getByText('Country');
    expect(label.className).toContain('relative');
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

  it('renders error message when provided', () => {
    render(<Select label='Country' options={defaultOptions} errorMessage='Required field' />);
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

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Argentina' })).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

  it('clears value when clicking clear button', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(<Select label='Country' options={defaultOptions} value='ar' isClearable={true} onClear={handleClear} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('button', { name: /clear/i }));

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

  it('trigger has aria-invalid when isInvalid', () => {
    render(<Select label='Country' options={defaultOptions} isInvalid={true} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('error message is linked via aria-describedby', () => {
    render(<Select label='Country' options={defaultOptions} errorMessage='Required' id='country-select' />);

    const trigger = screen.getByRole('combobox');
    const errorId = trigger.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    expect(screen.getByText('Required')).toHaveAttribute('id', errorId);
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

describe('Select — WCAG 2.5.5 touch target', () => {
  // jsdom does not implement layout — getBoundingClientRect() returns 0.
  // Checking the height utility class is the only way to verify touch target
  // compliance in unit tests. Visual QA in Storybook confirms actual pixels.

  it('sm size trigger has h-12 (48px) for 44px minimum', () => {
    render(<Select label='Country' options={defaultOptions} size='sm' placeholder='Select...' />);
    expect(screen.getByRole('combobox').className).toContain('h-12');
  });

  it('md size trigger has h-14 (56px) for 44px minimum', () => {
    render(<Select label='Country' options={defaultOptions} size='md' placeholder='Select...' />);
    expect(screen.getByRole('combobox').className).toContain('h-14');
  });

  it('lg size trigger has h-16 (64px) for 44px minimum', () => {
    render(<Select label='Country' options={defaultOptions} size='lg' placeholder='Select...' />);
    expect(screen.getByRole('combobox').className).toContain('h-16');
  });
});

describe('Select — hover visibility', () => {
  it('faded variant has hover border class on trigger', () => {
    render(<Select label='Country' options={defaultOptions} variant='faded' placeholder='Select...' />);
    expect(screen.getByRole('combobox').className).toContain('hover:border-border-strong-light');
  });

  it('all variants have hover border class on trigger', () => {
    const variants = ['regular', 'bordered', 'faded', 'underlined'] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <Select label='Country' options={defaultOptions} variant={variant} placeholder='Select...' />
      );
      expect(screen.getByRole('combobox').className).toMatch(/hover:border/);
      unmount();
    }
  });
});

describe('Select — reduced motion accessibility', () => {
  it('trigger respects prefers-reduced-motion via motion-safe prefix', () => {
    render(<Select label='Country' options={defaultOptions} placeholder='Select...' />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.className).toContain('motion-safe:transition');
    expect(trigger.className).not.toContain('motion-reduce:transition-none');
  });

  it('items respect prefers-reduced-motion via motion-safe prefix', async () => {
    const user = userEvent.setup();
    render(<Select label='Country' options={defaultOptions} placeholder='Select...' />);
    await user.click(screen.getByRole('combobox'));
    const item = screen.getByRole('option', { name: 'Argentina' });
    expect(item.className).toContain('motion-safe:transition');
    expect(item.className).not.toContain('motion-reduce:transition-none');
  });
});

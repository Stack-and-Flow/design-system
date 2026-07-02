import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => <span data-testid='autocomplete-spinner' />
}));

import { Autocomplete } from './Autocomplete';
import type { AutocompleteOption } from './types';
import { useAutocomplete } from './useAutocomplete';

const defaultOptions: AutocompleteOption[] = [
  { key: 'ar', label: 'Argentina' },
  { key: 'br', label: 'Brazil' },
  { key: 'uy', label: 'Uruguay' }
];

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useAutocomplete — logic', () => {
  it('returns unselected state by default', () => {
    const { result } = renderHook(() => useAutocomplete({ options: defaultOptions, label: 'Country' }));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.hasValue).toBe(false);
    expect(result.current.selectedOption).toBeUndefined();
    expect(result.current.activeOptionKey).toBeNull();
  });

  it('returns the defaultValue for uncontrolled state', () => {
    const { result } = renderHook(() =>
      useAutocomplete({ options: defaultOptions, label: 'Country', defaultValue: 'ar' })
    );

    expect(result.current.hasValue).toBe(true);
    expect(result.current.selectedOption?.key).toBe('ar');
  });

  it('keeps value controlled by the value prop', () => {
    const { result } = renderHook(() => useAutocomplete({ options: defaultOptions, label: 'Country', value: 'br' }));

    expect(result.current.selectedOption?.key).toBe('br');
  });

  it('filters options from the search input change handler', () => {
    const { result } = renderHook(() => useAutocomplete({ options: defaultOptions, label: 'Country' }));

    act(() => {
      result.current.searchInputProps.onChange?.({
        target: { value: 'bra' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredOptions.map((option) => option.key)).toEqual(['br']);
  });

  it('opens from the trigger container click and keeps trigger free of listbox ownership attrs', () => {
    const { result } = renderHook(() => useAutocomplete({ options: defaultOptions, label: 'Country' }));

    act(() => {
      result.current.containerProps.onClick?.({
        defaultPrevented: false
      } as React.MouseEvent<HTMLDivElement>);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.triggerProps['aria-controls']).toBeUndefined();
    expect(result.current.triggerProps['aria-activedescendant']).toBeUndefined();
  });
});

describe('Autocomplete — component behavior', () => {
  it('renders a trigger button with visible label and placeholder', () => {
    render(<Autocomplete label='Country' options={defaultOptions} placeholder='Select a country' />);

    expect(screen.getByRole('button', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('opens the popover and focuses the search input', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} placeholder='Select a country' />);

    await user.click(screen.getByRole('button', { name: 'Country' }));

    const searchInput = screen.getByRole('combobox', { name: 'Search options' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });
    expect(searchInput).not.toHaveAttribute('aria-activedescendant');
  });

  it('filters the visible options while typing', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} placeholder='Select a country' />);

    await user.click(screen.getByRole('button', { name: 'Country' }));
    await user.type(screen.getByRole('combobox', { name: 'Search options' }), 'bra');

    expect(screen.getByRole('option', { name: 'Brazil' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Argentina' })).not.toBeInTheDocument();
  });

  it('renders the empty message when options are empty from the start', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={[]} emptyMessage='No countries yet' />);

    await user.click(screen.getByRole('button', { name: 'Country' }));

    expect(screen.getByText('No countries yet')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('selects the only enabled filtered option when pressing Enter from the search input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Autocomplete label='Country' options={defaultOptions} onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: 'Country' }));
    const searchInput = screen.getByRole('combobox', { name: 'Search options' });
    await user.type(searchInput, 'bra');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith('br');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not select when the only visible result is disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Autocomplete
        label='Country'
        options={[
          { key: 'ar', label: 'Argentina', disabled: true },
          { key: 'br', label: 'Brazil' }
        ]}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Country' }));
    const searchInput = screen.getByRole('combobox', { name: 'Search options' });
    await user.type(searchInput, 'arg');
    await user.keyboard('{Enter}');

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('keeps disabled visible options out of arrow navigation', async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        label='Country'
        options={[
          { key: 'ar', label: 'Argentina', disabled: true },
          { key: 'br', label: 'Brazil', disabled: true }
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Country' }));
    const searchInput = screen.getByRole('combobox', { name: 'Search options' });
    await user.keyboard('{ArrowDown}');

    expect(searchInput).not.toHaveAttribute('aria-activedescendant');
    expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: 'Brazil' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows loading state without rendering the search input', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} isLoading={true} loadingLabel='Loading countries' />);

    await user.click(screen.getByRole('button', { name: 'Country' }));

    expect(screen.getByTestId('autocomplete-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading countries')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Search options' })).not.toBeInTheDocument();
  });

  it('closes the loading popover on Escape from the trigger', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} isLoading={true} loadingLabel='Loading countries' />);

    const trigger = screen.getByRole('button', { name: 'Country' });
    await user.click(trigger);

    expect(screen.getByText('Loading countries')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(screen.queryByText('Loading countries')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('closes the loading popover on Tab and moves focus out of the component', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Autocomplete label='Country' options={defaultOptions} isLoading={true} loadingLabel='Loading countries' />
        <button type='button'>Next field</button>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Country' });
    await user.click(trigger);

    expect(screen.getByText('Loading countries')).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByText('Loading countries')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next field' })).toHaveFocus();
  });

  it('renders and wires the clear button without toggling the popover', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(
      <Autocomplete label='Country' options={defaultOptions} value='ar' isClearable={true} onClear={handleClear} />
    );

    const trigger = screen.getByRole('button', { name: 'Country' });
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('keeps the clear button keyboard reachable and clears without opening the popover', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(
      <div>
        <Autocomplete label='Country' options={defaultOptions} value='ar' isClearable={true} onClear={handleClear} />
        <button type='button'>Next field</button>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Country' });
    const clearButton = screen.getByRole('button', { name: 'Clear selection' });

    await user.tab();
    expect(trigger).toHaveFocus();

    await user.tab();
    expect(clearButton).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('navigates to first/last option with Home/End keys without prior arrow press', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} />);

    await user.click(screen.getByRole('button', { name: 'Country' }));
    const searchInput = screen.getByRole('combobox', { name: 'Search options' });

    await user.keyboard('{End}');
    expect(searchInput).toHaveAttribute('aria-activedescendant', expect.stringContaining('uy'));

    await user.keyboard('{Home}');
    expect(searchInput).toHaveAttribute('aria-activedescendant', expect.stringContaining('ar'));
  });

  it('renders empty state with correct ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={[]} emptyMessage='No results' />);

    await user.click(screen.getByRole('button', { name: 'Country' }));
    const emptyDiv = screen.getByText('No results');
    expect(emptyDiv).toHaveAttribute('role', 'status');
    expect(emptyDiv).toHaveAttribute('aria-live', 'polite');
  });

  it('renders an empty listbox that matches the search input aria-controls', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={[]} emptyMessage='No results' />);

    await user.click(screen.getByRole('button', { name: 'Country' }));
    const searchInput = screen.getByRole('combobox', { name: 'Search options' });
    const listboxId = searchInput.getAttribute('aria-controls');

    expect(listboxId).toBeTruthy();
    const listbox = document.getElementById(listboxId ?? '');
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute('role', 'listbox');
  });

  it('warns in development when neither label nor ariaLabel is provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Autocomplete options={defaultOptions} />);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Provide either `label`, `ariaLabel`, or `aria-label`')
    );
    warnSpy.mockRestore();
  });

  it('computes needsScopedDarkPortal after mount', async () => {
    const user = userEvent.setup();
    render(
      <div className='dark'>
        <Autocomplete label='Country' options={defaultOptions} />
      </div>
    );
    await user.click(screen.getByRole('button', { name: 'Country' }));
    const portalWrapper = document.querySelector('[style="display: contents;"]');
    expect(portalWrapper).toHaveClass('dark');
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} />);

    const trigger = screen.getByRole('button', { name: 'Country' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on Tab without refocusing the trigger', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Autocomplete label='Country' options={defaultOptions} />
        <button type='button'>Next field</button>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Country' });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Search options' })).toHaveFocus();
    });

    await user.tab();

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).not.toHaveFocus();
    expect(screen.getByRole('button', { name: 'Next field' })).toHaveFocus();
  });

  it('closes on outside click and keeps focus on the clicked control', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Autocomplete label='Country' options={defaultOptions} />
        <button type='button'>Outside</button>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Country' });
    const outsideButton = screen.getByRole('button', { name: 'Outside' });
    await user.click(trigger);
    await user.click(outsideButton);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(outsideButton).toHaveFocus();
    });
  });

  it('assigns combobox ownership attrs to the search input only', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label='Country' options={defaultOptions} />);

    const trigger = screen.getByRole('button', { name: 'Country' });
    await user.click(trigger);

    const searchInput = screen.getByRole('combobox', { name: 'Search options' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).not.toHaveAttribute('aria-activedescendant');
    expect(searchInput).toHaveAttribute('aria-controls');
    expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('serializes the selected key through the hidden input when a name is provided', () => {
    render(<Autocomplete label='Country' options={defaultOptions} value='ar' name='country' />);

    const hiddenInput = document.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue('ar');
    expect(hiddenInput).toHaveAttribute('name', 'country');
  });

  it('warns in development for deprecated props', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Autocomplete label='Country' options={defaultOptions} errorMessage='Required' isInvalid={true} variant='faded' />
    );

    expect(warnSpy).toHaveBeenCalledTimes(3);
  });

  it('does not submit the form when pressing Enter with the popover open and no resolved selection', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <form onSubmit={handleSubmit}>
        <Autocomplete label='Country' options={[]} emptyMessage='No results' />
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Country' }));
    await user.keyboard('{Enter}');

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});

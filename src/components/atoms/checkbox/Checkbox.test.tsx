import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ChangeEvent, type ComponentProps, type KeyboardEvent, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({
    name,
    size,
    className,
    ...props
  }: { name: string; size?: number; className?: string } & ComponentProps<'svg'>) => (
    <svg data-testid='icon' data-icon={name} data-size={size} className={className} {...props} />
  )
}));

import { Checkbox } from './Checkbox';
import { useCheckbox } from './useCheckbox';

const createChangeEvent = (checked: boolean) =>
  ({ currentTarget: { checked }, preventDefault: vi.fn() }) as unknown as ChangeEvent<HTMLInputElement>;

const createKeyboardEvent = (key: string) =>
  ({ key, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLInputElement>;

describe('useCheckbox — logic', () => {
  it('returns unchecked state by default', () => {
    const { result } = renderHook(() => useCheckbox({ label: 'Accept terms' }));

    expect(result.current.checked).toBe(false);
    expect(result.current.controlState).toBe('unchecked');
    expect(result.current.isInvalid).toBe(false);
  });

  it('updates uncontrolled state and emits the next checked value', () => {
    const handleChange = vi.fn();
    const { result } = renderHook(() => useCheckbox({ label: 'Accept terms', onChange: handleChange }));

    act(() => {
      result.current.inputProps.onChange?.(createChangeEvent(true));
    });

    expect(result.current.checked).toBe(true);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0]?.[0]).toBe(true);
  });

  it('keeps checked controlled by the checked prop', () => {
    const { result } = renderHook(() => useCheckbox({ label: 'Accept terms', checked: true, defaultChecked: false }));

    expect(result.current.checked).toBe(true);
    expect(result.current.controlState).toBe('checked');
  });

  it('sanitizes labelHtml with the strict inline profile', () => {
    const { result } = renderHook(() =>
      useCheckbox({
        labelHtml:
          '<strong>Safe</strong> <a href="https://example.com">link</a> <button type="button">button</button> <img src="/image.png">'
      })
    );

    expect(result.current.labelHtml).toBe('<strong>Safe</strong> link button ');
  });

  it('throws when no accessible name is available at runtime', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useCheckbox({} as never))).toThrow(
      'Checkbox requires an accessible name. Provide label, labelHtml, ariaLabel, aria-label, ariaLabelledBy, or aria-labelledby.'
    );

    consoleError.mockRestore();
  });

  it('throws when label and labelHtml are both provided', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      renderHook(() => useCheckbox({ label: 'Visible label', labelHtml: '<strong>Visible label</strong>' } as never))
    ).toThrow('Checkbox accepts either label or labelHtml, but not both.');

    consoleError.mockRestore();
  });

  it.each([
    '<img src="/image.png">',
    '&nbsp;'
  ])('throws when sanitized labelHtml loses all meaningful text and no fallback name exists for %s', (labelHtml) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useCheckbox({ labelHtml } as never))).toThrow(
      'Checkbox labelHtml must retain meaningful text after sanitization or be paired with ariaLabel/aria-labelledby.'
    );

    consoleError.mockRestore();
  });

  it('marks the checkbox invalid when errorMessage is present and merges described-by ids in stable order', () => {
    const { result } = renderHook(() =>
      useCheckbox({
        id: 'consent',
        label: 'Email me updates',
        description: 'Helper copy',
        errorMessage: 'Required field',
        ariaDescribedBy: 'external-description'
      })
    );

    expect(result.current.isInvalid).toBe(true);
    expect(result.current.inputProps['aria-describedby']).toBe(
      'external-description consent-description consent-error'
    );
    expect(result.current.inputProps['aria-invalid']).toBe(true);
  });

  it('merges visible and external labelled-by ids when both are provided', () => {
    const { result } = renderHook(() =>
      useCheckbox({ id: 'consent', label: 'Accept terms', ariaLabelledBy: 'external-label' })
    );

    expect(result.current.inputProps['aria-labelledby']).toBe('consent-label external-label');
  });

  it('prevents read-only Space toggles in the keyboard handler', () => {
    const event = createKeyboardEvent(' ');
    const { result } = renderHook(() => useCheckbox({ label: 'Read only', readOnly: true }));

    act(() => {
      result.current.inputProps.onKeyDown?.(event);
    });

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('keeps peer-driven visual-state selectors wired on the input and control classes', () => {
    const { result } = renderHook(() => useCheckbox({ label: 'Accept terms' }));

    expect(result.current.inputProps.className).toContain('peer');
    expect(result.current.controlClassName).toContain('peer-hover:bg-surface-raised-light');
    expect(result.current.controlClassName).toContain('peer-active:scale-[0.98]');
    expect(result.current.controlClassName).toContain('peer-focus-visible:shadow-glow-focus-light');
  });

  it.each([
    ['default', 'peer-hover:bg-brand-light'],
    ['primary', 'peer-hover:bg-brand-light'],
    ['danger', 'peer-hover:bg-error-light']
  ] as const)('preserves the selected fill hover classes for %s variants', (variant, hoverClassName) => {
    const { result } = renderHook(() => useCheckbox({ label: 'Accept terms', checked: true, variant }));

    expect(result.current.controlClassName).toContain(hoverClassName);
    expect(result.current.controlClassName).not.toContain('peer-hover:bg-surface-raised-light');
  });
});

describe('Checkbox — component behavior', () => {
  it('renders a checkbox with an accessible name from the visible label', () => {
    render(<Checkbox label='Accept terms' />);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
    expect(screen.getByText('Accept terms').tagName).toBe('SPAN');
  });

  it('renders sanitized labelHtml through Text without leaving interactive HTML behind', () => {
    render(
      <Checkbox labelHtml='I agree to the <strong>privacy policy</strong> <a href="https://example.com">details</a>.' />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'I agree to the privacy policy details.' });

    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('privacy policy').tagName).toBe('STRONG');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('toggles when the control hit area is activated', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox label='Receive updates' onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Receive updates' });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0]?.[0]).toBe(true);
    expect(handleChange.mock.calls[0]?.[1]).toHaveProperty('type', 'change');
    expect(handleChange.mock.calls[0]?.[1]).toHaveProperty('target', checkbox);
  });

  it('does not toggle when the visible label text is clicked', async () => {
    const user = userEvent.setup();

    render(<Checkbox label='Email notifications' />);

    const checkbox = screen.getByRole('checkbox', { name: 'Email notifications' });
    await user.click(screen.getByText('Email notifications'));

    expect(checkbox).not.toBeChecked();
  });

  it('does not toggle when labelHtml text is clicked', async () => {
    const user = userEvent.setup();

    render(<Checkbox labelHtml='Review the <strong>release notes</strong>.' />);

    const checkbox = screen.getByRole('checkbox', { name: 'Review the release notes.' });
    await user.click(screen.getByText('release notes'));

    expect(checkbox).not.toBeChecked();
  });

  it('does not toggle when description text is clicked', async () => {
    const user = userEvent.setup();

    render(<Checkbox label='Product updates' description='We only send release notes and security advisories.' />);

    const checkbox = screen.getByRole('checkbox', { name: 'Product updates' });
    await user.click(screen.getByText('We only send release notes and security advisories.'));

    expect(checkbox).not.toBeChecked();
  });

  it('does not toggle when error text is clicked', async () => {
    const user = userEvent.setup();

    render(<Checkbox label='Accept terms' errorMessage='You must accept the terms before continuing.' />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    await user.click(screen.getByText('You must accept the terms before continuing.'));

    expect(checkbox).not.toBeChecked();
  });

  it('toggles with Space when focused', async () => {
    const user = userEvent.setup();

    render(<Checkbox label='Keyboard toggle' />);

    const checkbox = screen.getByRole('checkbox', { name: 'Keyboard toggle' });
    checkbox.focus();
    await user.keyboard('[Space]');

    expect(checkbox).toBeChecked();
  });

  it('keeps readOnly focusable but blocks pointer and Space toggles', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox label='Read-only checkbox' readOnly={true} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Read-only checkbox' });

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    checkbox.focus();
    await user.keyboard('[Space]');

    expect(checkbox).toHaveFocus();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('aria-readonly', 'true');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('keeps indeterminate synchronized in aria and DOM state', () => {
    render(<Checkbox label='Select all rows' checked={false} indeterminate={true} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' });

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
  });

  it('re-syncs indeterminate after native activation clears the DOM property', async () => {
    const user = userEvent.setup();

    render(<Checkbox label='Select all rows' indeterminate={true} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
  });

  it('maps ariaLabelledBy and ariaDescribedBy aliases to native input attributes', () => {
    render(
      <>
        <span id='external-label'>External checkbox label</span>
        <span id='external-description'>External checkbox description</span>
        <Checkbox
          id='consent'
          ariaLabelledBy='external-label'
          ariaDescribedBy='external-description'
          description='Helper copy'
          errorMessage='Required field'
        />
      </>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'External checkbox label' });

    expect(checkbox).toHaveAttribute('aria-labelledby', 'external-label');
    expect(checkbox).toHaveAttribute('aria-describedby', 'external-description consent-description consent-error');
  });

  it('makes errorMessage imply aria-invalid', () => {
    render(<Checkbox label='Accept terms' errorMessage='Required field' />);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards native form props and preserves native checked submission semantics', () => {
    render(
      <>
        <form id='preferences-form' />
        <Checkbox
          label='Email me updates'
          name='marketingEmails'
          value='yes'
          form='preferences-form'
          required={true}
          defaultChecked={true}
        />
      </>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Email me updates' });
    const form = document.getElementById('preferences-form') as HTMLFormElement;
    const formData = new FormData(form);

    expect(checkbox).toHaveAttribute('name', 'marketingEmails');
    expect(checkbox).toHaveAttribute('value', 'yes');
    expect(checkbox).toHaveAttribute('form', 'preferences-form');
    expect(checkbox).toBeRequired();
    expect(formData.get('marketingEmails')).toBe('yes');
  });

  it('respects controlled state from the parent', async () => {
    const user = userEvent.setup();

    const ControlledCheckbox = () => {
      const [checked, setChecked] = useState(false);

      return <Checkbox label={checked ? 'Enabled' : 'Disabled'} checked={checked} onChange={setChecked} />;
    };

    render(<ControlledCheckbox />);

    await user.click(screen.getByRole('checkbox', { name: 'Disabled' }));

    expect(screen.getByRole('checkbox', { name: 'Enabled' })).toBeChecked();
  });

  it('does not toggle or call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox label='Disabled checkbox' disabled={true} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Disabled checkbox' });
    await user.click(checkbox);

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });
});

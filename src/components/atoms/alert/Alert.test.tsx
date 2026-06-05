import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let prefersReducedMotion = false;

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name, ...props }: { name: string }) => <svg data-testid={`icon-${name}`} {...props} />
}));

import { Alert } from './Alert';
import { useAlert } from './useAlert';

const setReducedMotion = (matches: boolean) => {
  prefersReducedMotion = matches;
};

beforeEach(() => {
  prefersReducedMotion = false;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useAlert — logic', () => {
  it('returns the approved defaults and derived icon', () => {
    const { result } = renderHook(() => useAlert({ title: 'Important update' }));

    expect(result.current.dismissible).toBe(false);
    expect(result.current.closeButtonAriaLabel).toBe('Dismiss alert');
    expect(result.current.resolvedIconName).toBe('info');
    expect(result.current.rootProps['data-state']).toBe('open');
    expect(result.current.shouldRender).toBe(true);
  });

  it('uses the provided iconName instead of the color default', () => {
    const { result } = renderHook(() => useAlert({ iconName: 'badge-check', title: 'Verified' }));

    expect(result.current.resolvedIconName).toBe('badge-check');
  });

  it('starts closed when defaultOpen is false', () => {
    const { result } = renderHook(() => useAlert({ defaultOpen: false, title: 'Hidden at first' }));

    expect(result.current.rootProps['data-state']).toBe('closed');
    expect(result.current.shouldRender).toBe(false);
  });

  it('returns shouldRender false when no text content is provided', () => {
    const { result } = renderHook(() =>
      useAlert({ endContent: <span>Action</span>, startContent: <span>Icon only</span> })
    );

    expect(result.current.shouldRender).toBe(false);
  });
});

describe('Alert — component behavior', () => {
  it('renders role="alert" with heading and description wiring', () => {
    render(<Alert subtitle='Retry again in a minute.' title='Connection lost' />);

    const alert = screen.getByRole('alert');
    const title = screen.getByText('Connection lost');
    const description = screen.getByText('Retry again in a minute.').closest('[id]');

    expect(alert).toHaveAttribute('aria-labelledby', title.getAttribute('id'));
    expect(alert).toHaveAttribute('aria-describedby', description?.getAttribute('id'));
  });

  it('renders rich description content', () => {
    render(
      <Alert
        subtitle={
          <span>
            Retry from the <strong>deployments</strong> page.
          </span>
        }
        title='Deployment failed'
      />
    );

    expect(screen.getByText('deployments')).toBeInTheDocument();
    expect(screen.getByText('deployments').tagName).toBe('STRONG');
  });

  it('renders the default close button label when dismissible', () => {
    render(<Alert dismissible={true} subtitle='You can dismiss this message.' title='Dismissible' />);

    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
  });

  it('supports a custom close button aria label', () => {
    render(
      <Alert
        closeButtonAriaLabel='Close deployment warning'
        dismissible={true}
        subtitle='A custom label improves context.'
        title='Custom close label'
      />
    );

    expect(screen.getByRole('button', { name: 'Close deployment warning' })).toBeInTheDocument();
  });

  it('renders title-only alerts without description wiring', () => {
    render(<Alert dismissible={true} title='Title only' />);

    const alert = screen.getByRole('alert');

    const closeButton = screen.getByRole('button', { name: 'Dismiss alert' });

    expect(alert).toHaveAttribute('aria-labelledby');
    expect(alert).not.toHaveAttribute('aria-describedby');
    expect(closeButton).toHaveClass('h-9', 'w-9');
    expect(screen.getByTestId('icon-x')).toHaveAttribute('size', '14');
  });

  it('calls onOpenChange(false) and removes the alert after the exit motion in uncontrolled mode', async () => {
    vi.useFakeTimers();
    const handleOpenChange = vi.fn();

    render(
      <Alert dismissible={true} onOpenChange={handleOpenChange} subtitle='The alert will close.' title='Uncontrolled' />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }));

    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('requests dismissal in controlled mode without hiding until the parent updates open', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Alert
        dismissible={true}
        onOpenChange={handleOpenChange}
        open={true}
        subtitle='Parent owns visibility.'
        title='Controlled'
      />
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss alert' }));

    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not call onOpenChange when a controlled open prop changes externally', async () => {
    vi.useFakeTimers();
    const handleOpenChange = vi.fn();
    const { rerender } = render(
      <Alert
        dismissible={true}
        onOpenChange={handleOpenChange}
        open={true}
        subtitle='Visible now.'
        title='Externally controlled'
      />
    );

    rerender(
      <Alert
        dismissible={true}
        onOpenChange={handleOpenChange}
        open={false}
        subtitle='Visible now.'
        title='Externally controlled'
      />
    );

    expect(handleOpenChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(['{Enter}', '{Space}'])('dismisses from the native close button with %s', async (key) => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Alert
        dismissible={true}
        onOpenChange={handleOpenChange}
        open={true}
        subtitle='Keyboard dismiss.'
        title='Keyboard'
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Dismiss alert' });
    closeButton.focus();

    await user.keyboard(key);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not dismiss when Escape is pressed', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Alert
        dismissible={true}
        onOpenChange={handleOpenChange}
        open={true}
        subtitle='Escape should do nothing.'
        title='No escape'
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Dismiss alert' });
    closeButton.focus();

    await user.keyboard('{Escape}');

    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not autofocus on mount and keeps the root out of the tab order', () => {
    const { rerender } = render(<button type='button'>Before</button>);
    const beforeButton = screen.getByRole('button', { name: 'Before' });

    beforeButton.focus();
    expect(beforeButton).toHaveFocus();

    rerender(
      <>
        <button type='button'>Before</button>
        <Alert dismissible={true} subtitle='Focus remains where it was.' title='No autofocus' />
      </>
    );

    expect(beforeButton).toHaveFocus();
    expect(screen.getByRole('alert')).not.toHaveAttribute('tabindex');
  });

  it('does not relocate focus after dismissing the alert', async () => {
    vi.useFakeTimers();

    render(
      <>
        <button type='button'>Before</button>
        <Alert dismissible={true} subtitle='Closing should not focus siblings.' title='Dismiss me' />
        <button type='button'>After</button>
      </>
    );

    const closeButton = screen.getByRole('button', { name: 'Dismiss alert' });
    const afterButton = screen.getByRole('button', { name: 'After' });
    closeButton.focus();

    fireEvent.click(closeButton);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(afterButton).not.toHaveFocus();
  });

  it('removes the alert immediately when reduced motion is preferred', async () => {
    setReducedMotion(true);
    const user = userEvent.setup();

    render(<Alert dismissible={true} subtitle='Close immediately.' title='Reduced motion' />);

    await user.click(screen.getByRole('button', { name: 'Dismiss alert' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders valid falsy ReactNode content without breaking aria references', () => {
    render(
      <Alert endContent={0} startContent={0} subtitle={0} title={0}>
        {0}
      </Alert>
    );

    const alert = screen.getByRole('alert');
    const labelledBy = alert.getAttribute('aria-labelledby');
    const describedBy = alert.getAttribute('aria-describedby');

    expect(document.getElementById(labelledBy ?? '')).toHaveTextContent('0');
    expect(document.getElementById(describedBy ?? '')).toHaveTextContent('00');
    expect(alert).toHaveTextContent('0000');
  });

  it('renders null when title, subtitle, and children are all missing', () => {
    render(<Alert endContent={<span>Action</span>} startContent={<span>Icon</span>} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

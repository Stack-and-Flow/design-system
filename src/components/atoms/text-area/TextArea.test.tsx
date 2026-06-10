import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, createRef, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// --- Mocks (declared before component import) ---

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

// --- Imports after mocks ---

import * as RootExports from '../../../index';
import { TextArea } from './TextArea';
import { useTextArea } from './useTextArea';

type RenderControlledTextAreaProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const renderControlledTextArea = ({ value, onValueChange }: RenderControlledTextAreaProps) => (
  <TextArea id='controlled' label='Controlled' autosize={true} value={value} onValueChange={onValueChange} />
);

const withExternalLabels = (children: ReactNode) => (
  <div>
    <span id='external-label'>External label</span>
    <span id='external-description'>External description</span>
    {children}
  </div>
);

const setTextAreaScrollHeight = (height: number) => {
  Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => height
  });
};

const mockComputedTextAreaMetrics = () => {
  const originalGetComputedStyle = window.getComputedStyle.bind(window);

  return vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
    const originalStyle = originalGetComputedStyle(element, pseudoElement);

    if (!(element instanceof HTMLTextAreaElement)) {
      return originalStyle;
    }

    return {
      ...originalStyle,
      lineHeight: '20px',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      getPropertyValue: originalStyle.getPropertyValue.bind(originalStyle)
    } as CSSStyleDeclaration;
  });
};

let restoreResizeObserver: (() => void) | undefined;

const installResizeObserverMock = () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const observedElements = new Set<Element>();
  let activeCallback: ResizeObserverCallback | undefined;
  let activeObserver: ResizeObserver | undefined;
  let constructorCalls = 0;

  class MockResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      activeCallback = callback;
      activeObserver = this as unknown as ResizeObserver;
      constructorCalls += 1;
    }

    observe(element: Element) {
      observedElements.add(element);
    }

    unobserve(element: Element) {
      observedElements.delete(element);
    }

    disconnect() {
      observedElements.clear();
    }
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: MockResizeObserver
  });

  restoreResizeObserver = () => {
    if (originalResizeObserver) {
      Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        writable: true,
        value: originalResizeObserver
      });
      return;
    }

    Reflect.deleteProperty(globalThis, 'ResizeObserver');
  };

  return {
    get constructorCalls() {
      return constructorCalls;
    },
    observedElements,
    trigger: (observations: { target: Element; width: number }[]) => {
      const entries = observations.map(({ target, width }) => ({
        target,
        contentRect: { width } as DOMRectReadOnly
      })) as ResizeObserverEntry[];

      activeCallback?.(entries, activeObserver as ResizeObserver);
    }
  };
};

afterEach(() => {
  restoreResizeObserver?.();
  restoreResizeObserver = undefined;
  vi.restoreAllMocks();
});

describe('useTextArea — logic', () => {
  it('derives default rows, status, and resize for the non-autosize mode', () => {
    const { result } = renderHook(() => useTextArea({ id: 'message', label: 'Message' }, null));

    expect(result.current.textareaProps.rows).toBe(3);
    expect(result.current.textareaProps['data-status']).toBe('default');
    expect(result.current.textareaProps['data-resize']).toBe('vertical');
  });

  it('respects consumer rows when autosize is disabled', () => {
    const { result } = renderHook(() => useTextArea({ id: 'message', label: 'Message', rows: 7 }, null));

    expect(result.current.textareaProps.rows).toBe(7);
    expect(result.current.textareaProps['data-autosize']).toBeUndefined();
  });

  it('keeps size styling from overriding the row-based height source', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { result } = renderHook(() =>
        useTextArea({ id: `message-${size}`, label: 'Message', size, rows: 1, minRows: 1 }, null)
      );

      expect(result.current.textareaProps.rows).toBe(1);
      expect(result.current.surfaceProps.className).not.toMatch(/\bmin-h-(24|28|32)\b/);
    }
  });

  it('lets explicit status override hint tone for the visual status', () => {
    const { result } = renderHook(() =>
      useTextArea(
        {
          id: 'message',
          label: 'Message',
          status: 'success',
          hint: { message: 'Needs attention', type: 'error' }
        },
        null
      )
    );

    expect(result.current.textareaProps['data-status']).toBe('success');
    expect(result.current.textareaProps['aria-invalid']).toBe('true');
  });

  it('dedupes aria-describedby sources while preserving order', () => {
    const { result } = renderHook(() =>
      useTextArea(
        {
          id: 'message',
          label: 'Message',
          ariaDescribedBy: ['external-description', 'message-hint'],
          'aria-describedby': 'external-description',
          hint: { message: 'Helpful text', type: 'info' }
        },
        null
      )
    );

    expect(result.current.textareaProps['aria-describedby']).toBe('external-description message-hint');
  });

  it('uses autosize mode defaults without passing native rows or fixed surface min-height as the height source', () => {
    const { result } = renderHook(() =>
      useTextArea({ id: 'message', label: 'Message', autosize: true, rows: 9, minRows: 2 }, null)
    );

    expect(result.current.textareaProps.rows).toBeUndefined();
    expect(result.current.textareaProps['data-autosize']).toBe('true');
    expect(result.current.textareaProps['data-resize']).toBe('none');
    expect(result.current.surfaceProps.className).not.toMatch(/\bmin-h-(24|28|32)\b/);
  });
});

describe('TextArea — component behavior', () => {
  it('renders a native textarea with a visible label connected to the id', () => {
    render(<TextArea id='message' label='Message' placeholder='Write a message' />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(screen.getByText('Message')).toHaveAttribute('for', 'message');
    expect(textarea).toHaveAttribute('id', 'message');
  });

  it('supports external accessible names through ariaLabelledBy and native aria-labelledby', () => {
    render(
      withExternalLabels(
        <>
          <TextArea id='camel-label' ariaLabelledBy='external-label' />
          <TextArea id='native-label' aria-labelledby='external-label' />
          <TextArea id='external-overrides-label' label='Visible label' ariaLabelledBy='external-label' />
        </>
      )
    );

    const externallyLabelledTextareas = screen.getAllByRole('textbox', { name: 'External label' });

    expect(externallyLabelledTextareas).toHaveLength(3);
    expect(externallyLabelledTextareas[0]).toHaveAttribute('id', 'camel-label');
    expect(externallyLabelledTextareas[1]).toHaveAttribute('id', 'native-label');
    expect(externallyLabelledTextareas[2]).toHaveAttribute('id', 'external-overrides-label');
    expect(externallyLabelledTextareas[2]).toHaveAttribute('aria-labelledby', 'external-label');
  });

  it('uses placeholder as a fallback accessible name when no label source exists without reserving label space', () => {
    render(<TextArea id='fallback' placeholder='Describe your project' />);
    const textarea = screen.getByRole('textbox', { name: 'Describe your project' });

    expect(textarea).toBeInTheDocument();
    expect(textarea).not.toHaveClass('pt-5');
  });

  it('merges external descriptions with the generated hint', () => {
    render(
      withExternalLabels(
        <TextArea
          id='message'
          label='Message'
          ariaDescribedBy='external-description'
          hint={{ message: 'Keep it short', type: 'info' }}
        />
      )
    );

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAccessibleDescription(
      'External description Keep it short'
    );
  });

  it('renders semantic hints and exposes required semantics', () => {
    render(<TextArea id='message' label='Message' isRequired={true} hint={{ message: 'Required', type: 'error' }} />);
    const textarea = screen.getByRole('textbox', { name: /Message/i });

    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Required');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('preserves native aria-invalid values when no error status is present', () => {
    render(<TextArea id='message' label='Message' aria-invalid='grammar' />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('aria-invalid', 'grammar');
  });

  it('preserves native aria-required unless required semantics force true', () => {
    render(
      <>
        <TextArea id='optional' label='Optional' aria-required='false' />
        <TextArea id='forced' label='Forced' aria-required='false' isRequired={true} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Optional' })).toHaveAttribute('aria-required', 'false');
    expect(screen.getByRole('textbox', { name: /Forced/i })).toHaveAttribute('aria-required', 'true');
  });

  it('supports controlled value, onChange(event, value), and onValueChange(value)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();
    render(
      <TextArea id='message' label='Message' value='Hi' onChange={handleChange} onValueChange={handleValueChange} />
    );

    await user.type(screen.getByRole('textbox', { name: 'Message' }), '!');

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Hi');
    expect(handleChange.mock.lastCall?.[1]).toBe('Hi!');
    expect(handleValueChange).toHaveBeenLastCalledWith('Hi!');
  });

  it('supports uncontrolled defaultValue and forwarded refs', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} id='message' label='Message' defaultValue='Draft text' />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Draft text');
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Message' }));
  });

  it('keeps disabled and read-only semantics distinct', () => {
    render(
      <>
        <TextArea id='disabled' label='Disabled' disabled={true} />
        <TextArea id='readonly' label='Read only' readOnly={true} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('textbox', { name: 'Read only' })).toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: 'Read only' })).not.toBeDisabled();
  });

  it('exposes stable data affordances for layout, variants, sizes, and rounded geometry', () => {
    render(
      <TextArea
        id='message'
        label='Message'
        isFullWidth={true}
        variant='bordered'
        size='lg'
        rounded={true}
        status='warning'
      />
    );
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea).toHaveAttribute('data-full-width', 'true');
    expect(textarea).toHaveAttribute('data-variant', 'bordered');
    expect(textarea).toHaveAttribute('data-size', 'lg');
    expect(textarea).toHaveAttribute('data-rounded', 'true');
    expect(textarea).toHaveAttribute('data-status', 'warning');
  });

  it('passes safe native textarea props through', () => {
    render(
      <TextArea
        id='message'
        label='Message'
        name='project-message'
        maxLength={140}
        minLength={10}
        spellCheck={false}
        autoComplete='off'
        form='contact-form'
        wrap='hard'
        data-testid='native-message'
      />
    );
    const textarea = screen.getByTestId('native-message');

    expect(textarea).toHaveAttribute('name', 'project-message');
    expect(textarea).toHaveAttribute('maxlength', '140');
    expect(textarea).toHaveAttribute('minlength', '10');
    expect(textarea).toHaveAttribute('spellcheck', 'false');
    expect(textarea).toHaveAttribute('autocomplete', 'off');
    expect(textarea).toHaveAttribute('form', 'contact-form');
    expect(textarea).toHaveAttribute('wrap', 'hard');
  });

  it('respects non-autosize rows precedence and minRows defaults', () => {
    render(
      <>
        <TextArea id='default-rows' label='Default rows' />
        <TextArea id='consumer-rows' label='Consumer rows' rows={8} minRows={2} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Default rows' })).toHaveAttribute('rows', '3');
    expect(screen.getByRole('textbox', { name: 'Consumer rows' })).toHaveAttribute('rows', '8');
  });

  it('calculates autosize height on mount and clamps by maxRows', () => {
    const computedStyle = mockComputedTextAreaMetrics();
    setTextAreaScrollHeight(200);

    render(<TextArea id='message' label='Message' autosize={true} minRows={2} maxRows={4} defaultValue='Long text' />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(computedStyle).toHaveBeenCalledWith(textarea);
    expect(textarea).not.toHaveAttribute('rows');
    expect(textarea.style.height).toBe('98px');
    expect(textarea.style.overflowY).toBe('auto');
  });

  it('top-composes an empty labeled textarea and reserves label space before focus', () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const originalStyle = originalGetComputedStyle(element, pseudoElement);

      if (!(element instanceof HTMLTextAreaElement)) {
        return originalStyle;
      }

      return {
        ...originalStyle,
        lineHeight: '20px',
        paddingTop: element.getAttribute('aria-labelledby') ? '20px' : '0px',
        paddingBottom: '0px',
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
        getPropertyValue: originalStyle.getPropertyValue.bind(originalStyle)
      } as CSSStyleDeclaration;
    });
    setTextAreaScrollHeight(40);

    render(<TextArea id='message' label='Message' autosize={true} minRows={2} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    const label = screen.getByText('Message');

    expect(textarea).toHaveAttribute('aria-labelledby', 'message-label');
    expect(label).toHaveClass('top-1.5');
    expect(label).not.toHaveClass('top-1/2');
    expect(label).not.toHaveClass('-translate-y-1/2');
    expect(textarea.style.height).toBe('60px');
  });

  it('renders on the server without a React useLayoutEffect warning', async () => {
    const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    vi.resetModules();
    Object.defineProperty(globalThis, 'window', { configurable: true, value: undefined });

    try {
      const [{ renderToString }, { TextArea: ServerTextArea }] = await Promise.all([
        import('react-dom/server'),
        import('./TextArea')
      ]);

      renderToString(createElement(ServerTextArea, { id: 'server-message', label: 'Server message' }));
    } finally {
      if (originalWindowDescriptor) {
        Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
      }
    }

    const warningOutput = consoleError.mock.calls.flat().join('\n');

    expect(warningOutput).not.toContain('useLayoutEffect');
  });

  it('recalculates autosize when size changes textarea metrics without changing value or focus', () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const originalStyle = originalGetComputedStyle(element, pseudoElement);

      if (!(element instanceof HTMLTextAreaElement)) {
        return originalStyle;
      }

      return {
        ...originalStyle,
        lineHeight: element.dataset.size === 'lg' ? '24px' : '16px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
        getPropertyValue: originalStyle.getPropertyValue.bind(originalStyle)
      } as CSSStyleDeclaration;
    });
    setTextAreaScrollHeight(0);

    const { rerender } = render(<TextArea id='message' label='Message' autosize={true} minRows={2} size='sm' />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea.style.height).toBe('32px');

    rerender(<TextArea id='message' label='Message' autosize={true} minRows={2} size='lg' />);

    expect(textarea.style.height).toBe('48px');
  });

  it('recalculates autosize when adding or removing a label changes floating-label offset without changing value or focus', () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const originalStyle = originalGetComputedStyle(element, pseudoElement);

      if (!(element instanceof HTMLTextAreaElement)) {
        return originalStyle;
      }

      return {
        ...originalStyle,
        lineHeight: '20px',
        paddingTop: element.getAttribute('aria-labelledby') ? '20px' : '0px',
        paddingBottom: '0px',
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
        getPropertyValue: originalStyle.getPropertyValue.bind(originalStyle)
      } as CSSStyleDeclaration;
    });
    setTextAreaScrollHeight(0);

    const { rerender } = render(
      <TextArea id='message' autosize={true} minRows={2} placeholder='Describe your project' />
    );
    const textarea = screen.getByRole('textbox', { name: 'Describe your project' });

    expect(textarea.style.height).toBe('40px');

    rerender(<TextArea id='message' label='Message' autosize={true} minRows={2} placeholder='Describe your project' />);

    expect(textarea.style.height).toBe('60px');

    rerender(<TextArea id='message' autosize={true} minRows={2} placeholder='Describe your project' />);

    expect(textarea.style.height).toBe('40px');
  });

  it('clears autosize-managed inline styles when autosize is disabled', () => {
    mockComputedTextAreaMetrics();
    setTextAreaScrollHeight(200);
    const { rerender } = render(
      <TextArea id='message' label='Message' autosize={true} minRows={1} maxRows={2} defaultValue='Long text' />
    );
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea.style.height).toBe('58px');
    expect(textarea.style.overflowY).toBe('auto');

    rerender(<TextArea id='message' label='Message' autosize={false} rows={4} defaultValue='Long text' />);

    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea.style.height).toBe('');
    expect(textarea.style.overflowY).toBe('');
  });

  it('recalculates autosize after uncontrolled typing without stealing focus', async () => {
    const user = userEvent.setup();
    mockComputedTextAreaMetrics();
    setTextAreaScrollHeight(96);
    render(<TextArea id='message' label='Message' autosize={true} minRows={1} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, 'Hello');

    expect(textarea).toHaveFocus();
    expect(textarea.style.height).toBe('96px');
    expect(textarea.style.overflowY).toBe('hidden');
  });

  it('recalculates autosize when a controlled value changes', () => {
    const handleValueChange = vi.fn();
    mockComputedTextAreaMetrics();
    setTextAreaScrollHeight(70);
    const { rerender } = render(renderControlledTextArea({ value: 'Short', onValueChange: handleValueChange }));

    setTextAreaScrollHeight(120);
    rerender(renderControlledTextArea({ value: 'Short\nLonger', onValueChange: handleValueChange }));

    expect(screen.getByRole('textbox', { name: 'Controlled' }).style.height).toBe('120px');
  });

  it('recalculates autosize when ResizeObserver reports a width change', () => {
    const resizeObserver = installResizeObserverMock();
    mockComputedTextAreaMetrics();
    setTextAreaScrollHeight(70);

    render(<TextArea id='message' label='Message' autosize={true} minRows={1} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    const surface = screen.getByTestId('message-surface');

    expect(resizeObserver.constructorCalls).toBe(1);
    expect(resizeObserver.observedElements.has(textarea)).toBe(true);
    expect(resizeObserver.observedElements.has(surface)).toBe(true);
    expect(textarea.style.height).toBe('70px');

    act(() => {
      resizeObserver.trigger([
        { target: textarea, width: 320 },
        { target: surface, width: 320 }
      ]);
    });

    setTextAreaScrollHeight(120);

    act(() => {
      resizeObserver.trigger([{ target: textarea, width: 260 }]);
    });

    expect(textarea.style.height).toBe('120px');
  });

  it('does not install a ResizeObserver when autosize is disabled', () => {
    const resizeObserver = installResizeObserverMock();

    render(<TextArea id='message' label='Message' autosize={false} />);

    expect(resizeObserver.constructorCalls).toBe(0);
  });

  it('keeps autosize safe when ResizeObserver is unavailable', () => {
    const originalResizeObserver = globalThis.ResizeObserver;

    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: undefined
    });
    restoreResizeObserver = () => {
      if (originalResizeObserver) {
        Object.defineProperty(globalThis, 'ResizeObserver', {
          configurable: true,
          writable: true,
          value: originalResizeObserver
        });
        return;
      }

      Reflect.deleteProperty(globalThis, 'ResizeObserver');
    };
    mockComputedTextAreaMetrics();
    setTextAreaScrollHeight(80);

    expect(() => render(<TextArea id='message' label='Message' autosize={true} minRows={1} />)).not.toThrow();
    expect(screen.getByRole('textbox', { name: 'Message' }).style.height).toBe('80px');
  });

  it('uses resize defaults and explicit resize overrides', () => {
    render(
      <>
        <TextArea id='default-resize' label='Default resize' />
        <TextArea id='autosize-resize' label='Autosize resize' autosize={true} />
        <TextArea id='explicit-resize' label='Explicit resize' autosize={true} resize='horizontal' />
        <TextArea id='both-resize' label='Both resize' resize='both' />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Default resize' })).toHaveAttribute('data-resize', 'vertical');
    expect(screen.getByRole('textbox', { name: 'Autosize resize' })).toHaveAttribute('data-resize', 'none');
    expect(screen.getByRole('textbox', { name: 'Explicit resize' })).toHaveAttribute('data-resize', 'horizontal');
    expect(screen.getByRole('textbox', { name: 'Both resize' })).toHaveAttribute('data-resize', 'both');
  });

  it('falls back to a safe row height when computed line height is unavailable', () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const originalStyle = originalGetComputedStyle(element, pseudoElement);

      if (!(element instanceof HTMLTextAreaElement)) {
        return originalStyle;
      }

      return {
        ...originalStyle,
        lineHeight: 'normal',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
        getPropertyValue: originalStyle.getPropertyValue.bind(originalStyle)
      } as CSSStyleDeclaration;
    });
    setTextAreaScrollHeight(0);

    render(<TextArea id='fallback-height' label='Fallback height' autosize={true} minRows={2} />);

    expect(screen.getByRole('textbox', { name: 'Fallback height' }).style.height).toBe('40px');
  });

  it('focuses the textarea when the visible surface is clicked', async () => {
    const user = userEvent.setup();
    render(<TextArea id='message' label='Message' />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.click(screen.getByTestId('message-surface'));

    expect(textarea).toHaveFocus();
  });

  it('exports TextArea from the component folder and package root only with TextArea casing', () => {
    expect(TextArea.displayName).toBe('TextArea');
    expect(RootExports.TextArea).toBe(TextArea);
    expect(RootExports).not.toHaveProperty('Textarea');
  });
});

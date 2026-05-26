/** @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';
import { useTooltip } from './useTooltip';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('useTooltip — logic', () => {
  it('uses hover and focus as the default interactions', () => {
    const { result } = renderHook(() => useTooltip({ content: 'Tooltip content' }));

    expect(result.current.resolvedPosition).toBe('top');
    expect(result.current.enableHover).toBe(true);
    expect(result.current.enableFocus).toBe(true);
    expect(result.current.enableClick).toBe(false);
    expect(result.current.describedById).toMatch(/^tooltip-/);
  });

  it('treats missing content as no tooltip content', () => {
    const { result } = renderHook(() => useTooltip({}));

    expect(result.current.content).toBeUndefined();
    expect(result.current.hasTooltipContent).toBe(false);
    expect(result.current.describedById).toBeUndefined();
  });

  it('maps convenience props to the new public API', () => {
    const { result } = renderHook(() =>
      useTooltip({
        content: 'Convenience tooltip',
        placement: 'left',
        delayShow: 120,
        openOnClick: true
      })
    );

    expect(result.current.resolvedPosition).toBe('left');
    expect(result.current.enableHover).toBe(false);
    expect(result.current.enableFocus).toBe(false);
    expect(result.current.enableClick).toBe(true);
  });

  it('keeps native event handlers separate from tooltip trigger mode', () => {
    const { result } = renderHook(() =>
      useTooltip({
        content: 'Native event tooltip',
        onClick: () => undefined,
        onFocus: () => undefined
      })
    );

    expect(result.current.enableHover).toBe(true);
    expect(result.current.enableFocus).toBe(true);
    expect(result.current.enableClick).toBe(false);
  });
});

describe('Tooltip — component behavior', () => {
  it('shows the tooltip on hover with role and aria-describedby', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content='Helpful tooltip text'>
        <button type='button'>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });
    expect(trigger).toHaveAttribute('aria-describedby');

    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Helpful tooltip text');

    await waitFor(() => {
      expect(tooltip).toHaveClass('opacity-100');
    });

    expect(tooltip.className).not.toContain('animate-fadeIn');
  });

  it('merges consumer aria-describedby onto the trigger child', () => {
    render(
      <Tooltip aria-describedby='external-description' content='Merged tooltip'>
        <button aria-describedby='existing-description' type='button'>
          Merge trigger
        </button>
      </Tooltip>
    );

    expect(screen.getByRole('button', { name: 'Merge trigger' })).toHaveAttribute(
      'aria-describedby',
      expect.stringMatching(/^existing-description external-description tooltip-/)
    );
  });

  it('does not clone fragments with DOM-only tooltip attributes', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <Tooltip content='Fragment tooltip'>
        <>
          <button type='button'>Fragment trigger</button>
        </>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Fragment trigger' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    expect(trigger.closest('span')).toHaveAttribute('aria-describedby', expect.stringMatching(/^tooltip-/));
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('applies aria-describedby to the wrapper when the trigger cannot be cloned', () => {
    render(
      <Tooltip aria-describedby='external-description' content='Wrapper tooltip' tabIndex={0}>
        Wrapper trigger
      </Tooltip>
    );

    expect(screen.getByText('Wrapper trigger')).toHaveAttribute(
      'aria-describedby',
      expect.stringMatching(/^external-description tooltip-/)
    );
  });

  it('renders numeric zero content as valid tooltip content', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content={0}>
        <button type='button'>Zero trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Zero trigger' });
    expect(trigger).toHaveAttribute('aria-describedby');

    await user.hover(trigger);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('0');
  });

  it('portals to body while preserving scoped dark mode inheritance', async () => {
    const user = userEvent.setup();

    render(
      <div className='dark'>
        <Tooltip content='Dark scoped tooltip'>
          <button type='button'>Dark trigger</button>
        </Tooltip>
      </div>
    );

    await user.hover(screen.getByRole('button', { name: 'Dark trigger' }));

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Dark scoped tooltip');
    expect(document.body).toContainElement(tooltip);
    expect(tooltip.parentElement).toHaveClass('dark');
  });

  it('shows the tooltip on focus by default', async () => {
    render(
      <Tooltip content='Focus tooltip'>
        <button type='button'>Focus me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Focus me' });

    act(() => {
      trigger.focus();
    });

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Focus tooltip');
  });

  it('positions the tooltip from viewport coordinates and keeps it in view', async () => {
    const user = userEvent.setup();

    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRectMock(
      this: Element
    ) {
      if ((this as HTMLElement).getAttribute('role') === 'tooltip') {
        return { bottom: 30, height: 30, left: 0, right: 120, top: 0, width: 120, x: 0, y: 0 } as DOMRect;
      }

      if ((this as HTMLElement).tagName === 'SPAN') {
        return { bottom: 124, height: 44, left: 300, right: 360, top: 80, width: 60, x: 300, y: 80 } as DOMRect;
      }

      return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 } as DOMRect;
    });
    vi.stubGlobal('innerWidth', 360);
    vi.stubGlobal('innerHeight', 240);

    render(
      <Tooltip content='Positioned tooltip' position='right'>
        <button type='button'>Position trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Position trigger' }));

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveStyle({ left: '232px', top: '87px' });
  });

  it('composes consumer event handlers with tooltip behavior', async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();
    const onFocus = vi.fn();

    render(
      <Tooltip content='Composed tooltip' onFocus={onFocus} onMouseEnter={onMouseEnter}>
        <button type='button'>Composed trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Composed trigger' });
    await user.hover(trigger);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Composed tooltip');

    act(() => {
      trigger.focus();
    });

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('does not open or notify when tooltip content is empty', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Tooltip content={null} onOpenChange={onOpenChange}>
        <button type='button'>Empty trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Empty trigger' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(true);
  });

  it('cancels a delayed open when content becomes empty before the timer fires', async () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Tooltip content='Delayed content' delayMs={200} onOpenChange={onOpenChange}>
        <button type='button'>Delayed content trigger</button>
      </Tooltip>
    );

    act(() => {
      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Delayed content trigger' }));
    });

    rerender(
      <Tooltip content={null} delayMs={200} onOpenChange={onOpenChange}>
        <button type='button'>Delayed content trigger</button>
      </Tooltip>
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(true);
  });

  it('only toggles on click when click interaction is configured', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content='Click tooltip' triggerInteraction='click'>
        <button type='button'>Click me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Click me' });

    await user.hover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Click tooltip');
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content='Escape tooltip'>
        <button type='button'>Dismiss me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Dismiss me' });
    await user.hover(trigger);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Escape tooltip');

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('does not attach tooltip behavior when disabled', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content='Disabled tooltip' disabled={true}>
        <button type='button'>Disabled trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Disabled trigger' });
    expect(trigger).not.toHaveAttribute('aria-describedby');

    await user.hover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('respects delayMs before showing the tooltip', async () => {
    vi.useFakeTimers();

    render(
      <Tooltip content='Delayed tooltip' delayMs={200}>
        <button type='button'>Delayed trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Delayed trigger' });

    act(() => {
      fireEvent.mouseEnter(trigger);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Delayed tooltip');
  });
});

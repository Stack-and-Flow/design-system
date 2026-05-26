/** @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Tooltip from './Tooltip';
import { useTooltip } from './useTooltip';

afterEach(() => {
  cleanup();
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

  it('maps legacy props to the new public API', () => {
    const { result } = renderHook(() =>
      useTooltip({
        content: 'Legacy tooltip',
        placement: 'left',
        delayShow: 120,
        onClick: true
      })
    );

    expect(result.current.resolvedPosition).toBe('left');
    expect(result.current.enableHover).toBe(false);
    expect(result.current.enableFocus).toBe(false);
    expect(result.current.enableClick).toBe(true);
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

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful tooltip text');
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

  it('shows the tooltip on focus by default', async () => {
    render(
      <Tooltip content='Focus tooltip'>
        <button type='button'>Focus me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Focus me' });
    trigger.focus();

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Focus tooltip');
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

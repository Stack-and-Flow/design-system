import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';
import type { AccordionItem } from './types';
import { useAccordion } from './useAccordion';

const items: AccordionItem[] = [
  {
    id: 'first',
    title: 'First section',
    content: 'First panel content'
  },
  {
    id: 'second',
    title: 'Second section',
    content: 'Second panel content'
  },
  {
    id: 'third',
    title: 'Third section',
    content: 'Third panel content'
  }
];

describe('useAccordion — logic', () => {
  it('starts with no expanded keys by default', () => {
    const { result } = renderHook(() => useAccordion({ items }));
    expect(result.current.expandedKeys).toEqual([]);
  });

  it('uses defaultExpandedKeys in uncontrolled mode', () => {
    const { result } = renderHook(() => useAccordion({ items, defaultExpandedKeys: ['first'] }));
    expect(result.current.expandedKeys).toEqual(['first']);
    expect(result.current.isExpanded('first')).toBe(true);
  });

  it('toggles one item in single-expanded mode', () => {
    const { result } = renderHook(() => useAccordion({ items }));

    act(() => {
      result.current.toggleItem('first');
    });

    expect(result.current.expandedKeys).toEqual(['first']);

    act(() => {
      result.current.toggleItem('second');
    });

    expect(result.current.expandedKeys).toEqual(['second']);
  });

  it('supports multiple-expanded mode', () => {
    const { result } = renderHook(() => useAccordion({ items, allowsMultipleExpanded: true }));

    act(() => {
      result.current.toggleItem('first');
      result.current.toggleItem('second');
    });

    expect(result.current.expandedKeys).toEqual(['first', 'second']);
  });

  it('does not toggle disabled items', () => {
    const { result } = renderHook(() =>
      useAccordion({
        items: [items[0], { ...items[1], disabled: true }, items[2]]
      })
    );

    act(() => {
      result.current.toggleItem('second');
    });

    expect(result.current.expandedKeys).toEqual([]);
  });

  it('calls onExpandedChange when expanded keys change', () => {
    const handleExpandedChange = vi.fn();
    const { result } = renderHook(() => useAccordion({ items, onExpandedChange: handleExpandedChange }));

    act(() => {
      result.current.toggleItem('first');
    });

    expect(handleExpandedChange).toHaveBeenCalledWith(['first']);
  });
});

describe('Accordion — component behavior', () => {
  it('renders all item triggers', () => {
    render(<Accordion items={items} />);

    expect(screen.getByRole('button', { name: 'First section' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second section' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Third section' })).toBeInTheDocument();
  });

  it('sets aria-expanded and aria-controls on triggers', () => {
    render(<Accordion items={items} idPrefix='test-accordion' />);

    const trigger = screen.getByRole('button', { name: 'First section' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', 'test-accordion-panel-first');
  });

  it('renders triggers with the configured Header level', () => {
    render(<Accordion items={items} headingLevel='h4' />);

    expect(screen.getByRole('heading', { level: 4, name: 'First section' })).toBeInTheDocument();
  });

  it('renders string panel content with Text', () => {
    render(<Accordion items={items} defaultExpandedKeys={['first']} />);

    expect(screen.getByText('First panel content').tagName).toBe('P');
  });

  it('supports configured Text tag for string panel content', () => {
    render(<Accordion items={items} defaultExpandedKeys={['first']} contentTextTag='small' />);

    expect(screen.getByText('First panel content').tagName).toBe('SMALL');
  });

  it('hides collapsed panels', () => {
    render(<Accordion items={items} idPrefix='test-accordion' />);

    expect(document.getElementById('test-accordion-panel-first')).toHaveAttribute('hidden');
  });

  it('toggles item with click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} idPrefix='test-accordion' />);

    const trigger = screen.getByRole('button', { name: 'First section' });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('test-accordion-panel-first')).not.toHaveAttribute('hidden');
  });

  it('supports controlled expandedKeys', () => {
    render(<Accordion items={items} expandedKeys={['second']} idPrefix='test-accordion' />);

    expect(screen.getByRole('button', { name: 'Second section' })).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('test-accordion-panel-second')).not.toHaveAttribute('hidden');
  });

  it('calls onExpandedChange from the component', async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();
    render(<Accordion items={items} onExpandedChange={handleExpandedChange} />);

    await user.click(screen.getByRole('button', { name: 'First section' }));

    expect(handleExpandedChange).toHaveBeenCalledWith(['first']);
  });

  it('prevents toggling when the accordion is disabled', async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();
    render(<Accordion items={items} disabled={true} onExpandedChange={handleExpandedChange} />);

    const trigger = screen.getByRole('button', { name: 'First section' });
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(handleExpandedChange).not.toHaveBeenCalled();
  });

  it('prevents toggling a disabled item', async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();
    render(
      <Accordion
        items={[items[0], { ...items[1], disabled: true }, items[2]]}
        onExpandedChange={handleExpandedChange}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Second section' });
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(handleExpandedChange).not.toHaveBeenCalled();
  });

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} idPrefix='test-accordion' />);

    const trigger = screen.getByRole('button', { name: 'First section' });
    trigger.focus();

    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('moves focus with ArrowDown, ArrowUp, Home, and End', async () => {
    const user = userEvent.setup();
    render(<Accordion items={[items[0], { ...items[1], disabled: true }, items[2]]} />);

    const firstTrigger = screen.getByRole('button', { name: 'First section' });
    const thirdTrigger = screen.getByRole('button', { name: 'Third section' });

    firstTrigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(thirdTrigger).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(firstTrigger).toHaveFocus();

    await user.keyboard('{End}');
    expect(thirdTrigger).toHaveFocus();

    await user.keyboard('{Home}');
    expect(firstTrigger).toHaveFocus();
  });
});

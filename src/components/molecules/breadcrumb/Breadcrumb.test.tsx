import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name, size }: { name: string; size: number }) => (
    <svg data-name={name} data-size={String(size)} data-testid='breadcrumb-icon' />
  )
}));

import Breadcrumb from './Breadcrumb';
import { Breadcrumb as BreadcrumbFromIndex } from './index';
import type { BreadcrumbItem } from './types';
import { breadcrumbBase } from './types';
import { useBreadcrumb } from './useBreadcrumb';

const items: BreadcrumbItem[] = [
  { title: 'Home', href: '#home' },
  { title: 'Components', href: '#components' },
  { title: 'Navigation', href: '#components-navigation' },
  { title: 'Breadcrumb' }
];

describe('useBreadcrumb — logic', () => {
  it('does not collapse when the collapsed trigger would exceed maxItems', () => {
    const { result } = renderHook(() =>
      useBreadcrumb({
        items,
        maxItems: 3,
        itemsBeforeCollapse: 2,
        itemsAfterCollapse: 1
      })
    );

    expect(result.current.processedItems).toHaveLength(items.length);
    expect(result.current.processedItems.every((entry) => entry.type === 'item')).toBe(true);
  });

  it('tracks original indexes across collapsed entries', () => {
    const { result } = renderHook(() =>
      useBreadcrumb({
        items,
        maxItems: 3,
        itemsBeforeCollapse: 1,
        itemsAfterCollapse: 1
      })
    );

    expect(result.current.processedItems).toMatchObject([
      { type: 'item', originalIndex: 0 },
      { type: 'collapsed', hiddenItemIndexes: [1, 2] },
      { type: 'item', originalIndex: 3, isLast: true }
    ]);
  });

  it('does not duplicate trailing items when itemsAfterCollapse is zero', () => {
    const { result } = renderHook(() =>
      useBreadcrumb({
        items,
        maxItems: 3,
        itemsBeforeCollapse: 1,
        itemsAfterCollapse: 0
      })
    );

    expect(result.current.processedItems).toMatchObject([
      { type: 'item', originalIndex: 0 },
      { type: 'collapsed', hiddenItemIndexes: [1, 2, 3], isLast: true }
    ]);
  });
});

describe('Breadcrumb — component behavior', () => {
  it('is exported from the molecule barrel', () => {
    expect(BreadcrumbFromIndex).toBe(Breadcrumb);
  });

  it('marks the last item as the current page and keeps it non-interactive', () => {
    render(<Breadcrumb items={items} />);

    expect(screen.getByText('Breadcrumb').closest('[aria-current="page"]')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Breadcrumb' })).not.toBeInTheDocument();
  });

  it('calls onItemClick with the original index for visible links', async () => {
    const user = userEvent.setup();
    const handleItemClick = vi.fn();

    render(<Breadcrumb items={items} onItemClick={handleItemClick} />);

    await user.click(screen.getByRole('link', { name: 'Components' }));

    expect(handleItemClick).toHaveBeenCalledWith(items[1], 1);
  });

  it('calls onItemClick with the original index for hidden collapsed links', async () => {
    const user = userEvent.setup();
    const handleItemClick = vi.fn();
    const duplicatedItems: BreadcrumbItem[] = [
      { title: 'Home', href: '#home' },
      { title: 'Docs', href: '#docs' },
      { title: 'Docs', href: '#docs-api' },
      { title: 'API', href: '#api' },
      { title: 'Current' }
    ];

    render(
      <Breadcrumb
        items={duplicatedItems}
        maxItems={3}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={1}
        onItemClick={handleItemClick}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Show 3 hidden breadcrumb items' }));

    const hiddenLink = screen.getByRole('link', { name: 'API' });
    expect(hiddenLink).toHaveClass('min-w-0');
    await user.click(hiddenLink);

    expect(handleItemClick).toHaveBeenCalledWith(duplicatedItems[3], 3);
  });

  it('renders string separators as text instead of icon names', () => {
    render(<Breadcrumb items={items} separator='→' />);

    expect(screen.getAllByText('→')).toHaveLength(3);
    expect(screen.queryByTestId('breadcrumb-icon')).not.toBeInTheDocument();
  });

  it('wraps a custom collapsed element with accessible trigger behavior', async () => {
    const user = userEvent.setup();
    const handleCollapsedClick = vi.fn();

    render(
      <Breadcrumb
        items={items}
        maxItems={3}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={1}
        collapsedElement={<span>More</span>}
        onCollapsedClick={handleCollapsedClick}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Show 2 hidden breadcrumb items' });
    await user.click(trigger);

    expect(handleCollapsedClick).toHaveBeenCalledWith([items[1], items[2]]);
    expect(document.getElementById(trigger.getAttribute('aria-controls') ?? '')).toBeInTheDocument();
  });

  it('allows breadcrumb labels to shrink before truncating', () => {
    render(<Breadcrumb items={items} />);

    expect(screen.getByRole('link', { name: 'Components' })).toHaveClass('min-w-0', 'max-w-full');
    expect(screen.getByText('Breadcrumb').closest('li')).toHaveClass('min-w-0');
  });

  it('uses the established design-system classes for sizing and important rounded variants', () => {
    expect(breadcrumbBase({ size: 'xs' })).toContain('fs-xs');
    expect(breadcrumbBase({ size: 'md' })).toContain('fs-base');
    expect(breadcrumbBase({ variant: 'underlined' })).toContain('rounded-none!');
  });
});

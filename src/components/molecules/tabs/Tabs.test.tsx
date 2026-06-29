import { Icon } from '@atoms/icon';
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';
import type { TabsItem, TabsProps } from './types';
import { useTabs } from './useTabs';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({
    name,
    size,
    className,
    ...props
  }: { name: string; size?: number; className?: string } & ComponentProps<'svg'>) => (
    <svg data-icon={name} data-size={size} className={className} {...props} />
  )
}));

const items: TabsItem[] = [
  {
    key: 'overview',
    title: 'Overview',
    content: 'Overview panel'
  },
  {
    key: 'usage',
    title: 'Usage',
    content: 'Usage panel'
  },
  {
    key: 'api',
    title: 'API',
    content: 'API panel'
  }
];

const createRect = ({ height, width, x, y }: { height: number; width: number; x: number; y: number }) =>
  ({
    bottom: y + height,
    height,
    left: x,
    right: x + width,
    top: y,
    width,
    x,
    y,
    toJSON: () => ({ bottom: y + height, height, left: x, right: x + width, top: y, width, x, y })
  }) as DOMRect;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTabs — logic', () => {
  it('selects the first enabled item by default', () => {
    const { result } = renderHook(() => useTabs({ items, 'aria-label': 'Documentation sections' }));

    expect(result.current.items[0]?.selected).toBe(true);
    expect(result.current.items[0]?.tabIndex).toBe(0);
    expect(result.current.items[1]?.selected).toBe(false);
  });

  it('honors a valid defaultValue in uncontrolled mode', () => {
    const { result } = renderHook(() =>
      useTabs({ items, defaultValue: 'usage', 'aria-label': 'Documentation sections' })
    );

    expect(result.current.items[1]?.selected).toBe(true);
    expect(result.current.items[1]?.tabIndex).toBe(0);
  });

  it('falls back to the first enabled item when defaultValue points to a disabled tab', () => {
    const { result } = renderHook(() =>
      useTabs({
        items,
        defaultValue: 'usage',
        disabledKeys: ['usage'],
        'aria-label': 'Documentation sections'
      })
    );

    expect(result.current.items[0]?.selected).toBe(true);
    expect(result.current.items[1]?.selected).toBe(false);
  });

  it('warns when a controlled value does not match any item key', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    renderHook(() => useTabs({ items, value: 'missing', 'aria-label': 'Documentation sections' }));

    expect(warnSpy).toHaveBeenCalledWith('[Tabs] Controlled value `missing` does not match any item key.');
  });

  it('warns when a controlled value points to a disabled tab', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    renderHook(() =>
      useTabs({
        items,
        value: 'usage',
        disabledKeys: ['usage'],
        'aria-label': 'Documentation sections'
      })
    );

    expect(warnSpy).toHaveBeenCalledWith('[Tabs] Controlled value `usage` points to a disabled tab.');
  });

  it('falls back safely when untyped consumers pass invalid visual props', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const invalidVisualProps = {
      items,
      'aria-label': 'Documentation sections',
      variant: 'ghost',
      color: 'brand',
      size: 'xl',
      radius: 'circle',
      placement: 'center',
      activationMode: 'hover'
    } as unknown as TabsProps;

    const { result } = renderHook(() => useTabs(invalidVisualProps));

    expect(result.current.tabListProps['aria-orientation']).toBe('horizontal');
    expect(result.current.items[0]?.selected).toBe(true);
    expect(result.current.shouldRenderCursor).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith('[Tabs] Invalid variant `ghost`; falling back to `solid`.');
    expect(warnSpy).toHaveBeenCalledWith('[Tabs] Invalid color `brand`; falling back to `primary`.');
  });
});

describe('Tabs — component behavior', () => {
  it('renders the tablist with an accessible name and selected panel', () => {
    render(<Tabs items={items} aria-label='Documentation sections' />);

    expect(screen.getByRole('tablist', { name: 'Documentation sections' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview panel');
  });

  it('makes tab icons inherit the tab text color', () => {
    render(
      <Tabs
        items={[
          {
            key: 'overview',
            title: 'Overview',
            icon: <Icon decorative={true} name='layout-dashboard' size={18} />,
            content: 'Overview panel'
          },
          items[1] as TabsItem
        ]}
        aria-label='Documentation sections'
      />
    );

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const icon = overviewTab.querySelector('svg');

    expect(overviewTab).toHaveClass('text-brand-light');
    expect(icon).toHaveClass('text-current');
  });

  it('renders an empty tablist safely when items is empty', () => {
    const { container } = render(<Tabs items={[]} aria-label='Empty sections' />);

    expect(screen.getByRole('tablist', { name: 'Empty sections' })).toBeInTheDocument();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(container.querySelector('[role="tablist"] > span[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('warns when the tablist has no accessible name', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(<Tabs items={items} />);

    expect(warnSpy).toHaveBeenCalledWith(
      '[Tabs] Provide `aria-label` or `aria-labelledby` so the tablist has an accessible name.'
    );
  });

  it('uses vertical orientation when placement is left', () => {
    render(<Tabs items={items} aria-label='Documentation sections' placement='left' />);

    expect(screen.getByRole('tablist', { name: 'Documentation sections' })).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );
  });

  it('moves vertical focus with ArrowDown and ArrowUp while ignoring horizontal arrows', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        items={items}
        aria-label='Documentation sections'
        placement='left'
        disabledKeys={['usage']}
        defaultValue='overview'
      />
    );

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const apiTab = screen.getByRole('tab', { name: 'API' });

    overviewTab.focus();
    await user.keyboard('{ArrowDown}');

    expect(apiTab).toHaveFocus();
    expect(apiTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'API' })).toHaveTextContent('API panel');

    await user.keyboard('{ArrowRight}');

    expect(apiTab).toHaveFocus();
    expect(apiTab).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowUp}');

    expect(overviewTab).toHaveFocus();
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
  });

  it('moves focus and selection with arrow keys in automatic mode while skipping disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} aria-label='Documentation sections' disabledKeys={['usage']} defaultValue='overview' />);

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const apiTab = screen.getByRole('tab', { name: 'API' });

    overviewTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(apiTab).toHaveFocus();
    expect(apiTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'API' })).toHaveTextContent('API panel');
  });

  it('keeps focus and selection separate in manual activation mode until Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} aria-label='Documentation sections' activationMode='manual' />);

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const usageTab = screen.getByRole('tab', { name: 'Usage' });

    overviewTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(usageTab).toHaveFocus();
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(usageTab).toHaveAttribute('aria-selected', 'false');

    await user.keyboard('{Enter}');

    expect(usageTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Usage' })).toHaveTextContent('Usage panel');
  });

  it('supports Home and End navigation', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} aria-label='Documentation sections' />);

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const apiTab = screen.getByRole('tab', { name: 'API' });

    overviewTab.focus();
    await user.keyboard('{End}');
    expect(apiTab).toHaveFocus();

    await user.keyboard('{Home}');
    expect(overviewTab).toHaveFocus();
  });

  it('selects on pointer down when shouldSelectOnPressUp is false', () => {
    render(<Tabs items={items} aria-label='Documentation sections' shouldSelectOnPressUp={false} />);

    const usageTab = screen.getByRole('tab', { name: 'Usage' });

    fireEvent.mouseDown(usageTab, { button: 0 });

    expect(usageTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Usage' })).toHaveTextContent('Usage panel');
  });

  it('preserves the selected panel while the whole tabs component is disabled', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(
      <Tabs
        items={items}
        aria-label='Documentation sections'
        defaultValue='usage'
        isDisabled={true}
        onValueChange={handleValueChange}
      />
    );

    const usageTab = screen.getByRole('tab', { name: 'Usage' });
    const apiTab = screen.getByRole('tab', { name: 'API' });

    expect(usageTab).toBeDisabled();
    expect(apiTab).toBeDisabled();
    expect(usageTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Usage' })).toHaveTextContent('Usage panel');

    await user.click(apiTab);

    expect(apiTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel', { name: 'Usage' })).toHaveTextContent('Usage panel');
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('keeps inactive panels mounted and hidden when destroyInactiveTabPanel is false', () => {
    render(<Tabs items={items} aria-label='Documentation sections' destroyInactiveTabPanel={false} />);

    expect(screen.getByText('Usage panel').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
    expect(screen.getByText('API panel').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
  });

  it('renders only the selected panel when destroyInactiveTabPanel is true', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} aria-label='Documentation sections' destroyInactiveTabPanel={true} />);

    expect(screen.queryByText('Usage panel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Usage' }));

    expect(screen.getByText('Usage panel')).toBeInTheDocument();
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
  });

  it('adds a panel tab stop only when the active panel has no focusable children', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        aria-label='Documentation sections'
        items={[
          {
            key: 'summary',
            title: 'Summary',
            content: 'Static text only'
          },
          {
            key: 'actions',
            title: 'Actions',
            content: <button type='button'>Focusable action</button>
          }
        ]}
      />
    );

    const summaryTab = screen.getByRole('tab', { name: 'Summary' });
    const summaryPanel = screen.getByRole('tabpanel', { name: 'Summary' });

    expect(summaryPanel).toHaveAttribute('tabindex', '0');

    summaryTab.focus();
    await user.tab();

    expect(summaryPanel).toHaveFocus();

    await user.click(screen.getByRole('tab', { name: 'Actions' }));

    const actionsTab = screen.getByRole('tab', { name: 'Actions' });
    const actionsPanel = screen.getByRole('tabpanel', { name: 'Actions' });
    const focusableAction = screen.getByRole('button', { name: 'Focusable action' });

    expect(actionsPanel).not.toHaveAttribute('tabindex');

    actionsTab.focus();
    await user.tab();

    expect(focusableAction).toHaveFocus();
  });

  it('does not select a link-like tab on a modified click', () => {
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(
      <Tabs
        aria-label='Documentation sections'
        items={[
          items[0] as TabsItem,
          {
            ...items[1],
            href: '/docs/usage'
          }
        ]}
      />
    );

    const usageTab = screen.getByRole('tab', { name: 'Usage' });

    fireEvent.click(usageTab, { button: 0, detail: 1, metaKey: true });

    expect(usageTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('navigates link-like tabs when activated with Enter', async () => {
    const user = userEvent.setup();
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(
      <Tabs
        aria-label='Documentation sections'
        items={[
          items[0] as TabsItem,
          {
            ...items[1],
            href: '/docs/usage'
          }
        ]}
      />
    );

    const usageTab = screen.getByRole('tab', { name: 'Usage' });
    usageTab.focus();

    await user.keyboard('{Enter}');

    expect(usageTab).toHaveAttribute('aria-selected', 'true');
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('navigates link-like tabs when activated with Space', async () => {
    const user = userEvent.setup();
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(
      <Tabs
        aria-label='Documentation sections'
        items={[
          items[0] as TabsItem,
          {
            ...items[1],
            href: '/docs/usage'
          }
        ]}
      />
    );

    const usageTab = screen.getByRole('tab', { name: 'Usage' });
    usageTab.focus();

    await user.keyboard('[Space]');

    expect(usageTab).toHaveAttribute('aria-selected', 'true');
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('generates unique tab and panel ids for keys with the same normalized segment', () => {
    render(
      <Tabs
        aria-label='Documentation sections'
        items={[
          { key: 'a b', title: 'First', content: 'First panel' },
          { key: 'a-b', title: 'Second', content: 'Second panel' }
        ]}
      />
    );

    const firstTab = screen.getByRole('tab', { name: 'First' });
    const secondTab = screen.getByRole('tab', { name: 'Second' });
    const firstPanel = screen.getByRole('tabpanel', { name: 'First' });
    const secondPanel = screen.getByText('Second panel').closest('[role="tabpanel"]');

    expect(secondPanel).not.toBeNull();
    expect(firstTab.id).not.toBe(secondTab.id);
    expect(firstPanel.id).not.toBe(secondPanel?.id);
    expect(firstTab).toHaveAttribute('aria-controls', firstPanel.id);
    expect(secondTab).toHaveAttribute('aria-controls', secondPanel?.id);
    expect(firstPanel).toHaveAttribute('aria-labelledby', firstTab.id);
    expect(secondPanel).toHaveAttribute('aria-labelledby', secondTab.id);
  });

  it('keeps the selected cursor aligned after selection changes', async () => {
    const user = userEvent.setup();
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(
      this: Element
    ) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect({ x: 100, y: 50, width: 330, height: 50 });
      }

      if (this.getAttribute('role') === 'tab' && this.textContent?.trim() === 'Overview') {
        return createRect({ x: 108, y: 58, width: 100, height: 40 });
      }

      if (this.getAttribute('role') === 'tab' && this.textContent?.trim() === 'Usage') {
        return createRect({ x: 220, y: 58, width: 80, height: 40 });
      }

      return createRect({ x: 0, y: 0, width: 0, height: 0 });
    });

    const { container } = render(<Tabs items={items} aria-label='Documentation sections' />);
    const cursor = container.querySelector<HTMLSpanElement>('[role="tablist"] > span[aria-hidden="true"]');

    if (!cursor) {
      throw new Error('Tabs cursor was not rendered.');
    }

    expect(cursor).toHaveStyle({ height: '40px', transform: 'translate(8px, 8px)', width: '100px' });

    await user.click(screen.getByRole('tab', { name: 'Usage' }));

    await waitFor(() => {
      expect(cursor).toHaveStyle({ height: '40px', transform: 'translate(120px, 8px)', width: '80px' });
    });
  });

  it('calls onValueChange when selection changes', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(<Tabs items={items} aria-label='Documentation sections' onValueChange={handleValueChange} />);

    await user.click(screen.getByRole('tab', { name: 'Usage' }));

    expect(handleValueChange).toHaveBeenCalledWith('usage');
  });

  it('does not call onValueChange when re-selecting the active tab', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(<Tabs items={items} aria-label='Documentation sections' onValueChange={handleValueChange} />);

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });

    await user.click(overviewTab);
    overviewTab.focus();
    await user.keyboard('{Enter}');

    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('updates a controlled selection when the parent changes the value', async () => {
    const user = userEvent.setup();

    const ControlledTabs = () => {
      const [value, setValue] = useState('overview');

      return (
        <Tabs
          items={items}
          value={value}
          aria-label='Documentation sections'
          onValueChange={(nextValue) => {
            setValue(nextValue);
          }}
        />
      );
    };

    render(<ControlledTabs />);

    await user.click(screen.getByRole('tab', { name: 'API' }));

    expect(screen.getByRole('tab', { name: 'API' })).toHaveAttribute('aria-selected', 'true');
  });
});

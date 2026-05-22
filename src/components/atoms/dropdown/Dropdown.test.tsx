import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  ChevronRightIcon: () => <span data-testid='submenu-chevron' />
}));

import { Dropdown } from './Dropdown';
import type { DropdownItem, DropdownSchema } from './types';
import { useDropdown } from './useDropdown';

const menuItems: DropdownSchema = [
  { type: 'label', label: 'My Account' },
  { type: 'separator' },
  { type: 'item', label: 'Profile', onClick: vi.fn() },
  { type: 'item', label: 'Archive', disabled: true, onClick: vi.fn() },
  {
    type: 'submenu',
    label: 'Team',
    items: [{ type: 'item', label: 'Invite users', onClick: vi.fn() }]
  }
];

describe('useDropdown — logic', () => {
  it('returns the default placement and width values', () => {
    const { result } = renderHook(() => useDropdown({ items: [...menuItems], children: <span>Open</span> }));

    expect(result.current.contentProps.side).toBe('bottom');
    expect(result.current.contentProps.align).toBe('start');
    expect(result.current.contentProps.className).toEqual(expect.any(String));
  });

  it('uses the first menu label for content labeling without overriding visible trigger text', () => {
    const { result } = renderHook(() => useDropdown({ items: [...menuItems], children: <span>Open</span> }));

    expect(result.current.triggerProps['aria-label']).toBeUndefined();
    expect(result.current.contentProps['aria-labelledby']).toEqual(expect.any(String));
  });

  it('prefers the explicit ariaLabel prop when provided', () => {
    const { result } = renderHook(() =>
      useDropdown({ ariaLabel: 'Open account actions', items: [...menuItems], children: <span>Open</span> })
    );

    expect(result.current.triggerProps['aria-label']).toBe('Open account actions');
  });

  it('keeps the menu open when closeOnSelect is false', () => {
    const item: DropdownItem = { type: 'item', label: 'Stay open', onClick: vi.fn() };
    const { result } = renderHook(() =>
      useDropdown({ closeOnSelect: false, items: [item], children: <span>Open</span> })
    );

    const element = result.current.elements[0];

    if (element.type !== 'item') {
      throw new Error('Expected the first element to be an item');
    }

    const itemProps = result.current.getItemProps(element);
    const event = new Event('select');
    const preventDefault = vi.spyOn(event, 'preventDefault');

    itemProps.onSelect(event);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(item.onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Dropdown — component behavior', () => {
  it('renders a button trigger using the visible trigger text as its accessible name', () => {
    render(
      <Dropdown
        items={[
          { type: 'label', label: 'My Account' },
          { type: 'item', label: 'Profile', onClick: vi.fn() }
        ]}
      >
        <span>Open menu</span>
      </Dropdown>
    );

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('uses ariaLabel for an icon-only trigger', () => {
    render(
      <Dropdown ariaLabel='Open account actions' items={[{ type: 'item', label: 'Profile', onClick: vi.fn() }]}>
        <span aria-hidden='true'>⋯</span>
      </Dropdown>
    );

    expect(screen.getByRole('button', { name: 'Open account actions' })).toBeInTheDocument();
  });

  it('opens the menu and calls the item action on click', async () => {
    const onClick = vi.fn();
    render(
      <Dropdown items={[{ type: 'item', label: 'Profile', onClick }]}>
        <span>Open menu</span>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Profile' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('does not call the action for a disabled item', async () => {
    const onClick = vi.fn();
    render(
      <Dropdown items={[{ type: 'item', label: 'Archive', disabled: true, onClick }]}>
        <span>Open menu</span>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Archive' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading status semantics without rendering actionable menu items', async () => {
    render(
      <Dropdown
        loading={true}
        items={[
          { type: 'label', label: 'Account actions' },
          { type: 'item', label: 'Profile', onClick: vi.fn() }
        ]}
      >
        <span>Open menu</span>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const menu = await screen.findByRole('menu', { name: 'Account actions' });
    expect(menu).not.toHaveAttribute('aria-labelledby');
    expect(await screen.findByRole('status')).toHaveTextContent('Loading menu items');
    expect(screen.queryByRole('menuitem', { name: 'Profile' })).not.toBeInTheDocument();
  });

  it('keeps the menu open after selection when closeOnSelect is false', async () => {
    const onClick = vi.fn();
    render(
      <Dropdown closeOnSelect={false} items={[{ type: 'item', label: 'Profile', onClick }]}>
        <span>Open menu</span>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Profile' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports keyboard opening, roving focus, and Escape close', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        items={[
          { type: 'item', label: 'Profile', onClick: vi.fn() },
          { type: 'item', label: 'Billing', onClick: vi.fn() }
        ]}
      >
        <span>Open menu</span>
      </Dropdown>
    );

    const trigger = screen.getByRole('button', { name: 'Open menu' });
    trigger.focus();

    await user.keyboard('{ArrowDown}');

    const profileItem = await screen.findByRole('menuitem', { name: 'Profile' });
    expect(profileItem).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Billing' })).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('renders submenu content when the submenu trigger is opened', async () => {
    render(
      <Dropdown
        items={[
          {
            type: 'submenu',
            label: 'Team',
            items: [{ type: 'item', label: 'Invite users', onClick: vi.fn() }]
          }
        ]}
      >
        <span>Open menu</span>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.hover(await screen.findByRole('menuitem', { name: 'Team' }));

    expect(await screen.findByRole('menuitem', { name: 'Invite users' })).toBeInTheDocument();
  });
});

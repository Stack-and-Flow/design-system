import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: () => null
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => <span data-testid='button-spinner' />
}));

import { Button } from '@atoms/button';
import { Drawer as RootDrawer } from '@/index';
import { Drawer } from './Drawer';
import { Drawer as BarrelDrawer } from './index';

const drawerMemberNames = ['Trigger', 'Content', 'Header', 'Title', 'Description', 'Body', 'Footer', 'Close'];

const BasicDrawer = ({ dismissible, closeOnEscape }: { dismissible?: boolean; closeOnEscape?: boolean }) => (
  <Drawer>
    <Drawer.Trigger>Open drawer</Drawer.Trigger>
    <Drawer.Content dismissible={dismissible} closeOnEscape={closeOnEscape}>
      <Drawer.Header>
        <Drawer.Title>Account settings</Drawer.Title>
        <Drawer.Description>Update your profile details.</Drawer.Description>
      </Drawer.Header>
      <Drawer.Body>Drawer body</Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close>Done</Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
);

describe('Drawer — public API', () => {
  it('exposes exactly the approved compound members', () => {
    for (const memberName of drawerMemberNames) {
      expect(Drawer).toHaveProperty(memberName);
    }

    expect(Drawer).not.toHaveProperty('Portal');
    expect(Drawer).not.toHaveProperty('Overlay');
    expect(Drawer).not.toHaveProperty('Backdrop');
    expect(
      Object.keys(Drawer)
        .filter((key) => /^[A-Z]/.test(key))
        .sort()
    ).toEqual([...drawerMemberNames].sort());
  });

  it('is exported from the drawer barrel and package root', () => {
    expect(BarrelDrawer).toBe(Drawer);
    expect(RootDrawer).toBe(Drawer);
  });
});

describe('Drawer — dialog behavior and accessibility', () => {
  it('renders a named dialog with optional description from Drawer.Title and Drawer.Description', async () => {
    render(<BasicDrawer />);

    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }));

    const dialog = screen.getByRole('dialog', { name: 'Account settings' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription('Update your profile details.');
  });

  it('renders the native trigger fallback as button type=button and opens uncontrolled content', async () => {
    render(<BasicDrawer />);

    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    expect(trigger).toHaveAttribute('type', 'button');

    await userEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();
  });

  it('only links aria-controls while the dialog content is mounted', async () => {
    render(<BasicDrawer />);

    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');

    await userEvent.click(trigger);

    const controlsId = trigger.getAttribute('aria-controls');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(controlsId).toBeTruthy();
    expect(document.getElementById(controlsId as string)).toBe(
      screen.getByRole('dialog', { name: 'Account settings' })
    );
  });

  it('requests controlled state changes without owning controlled open state', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    const { rerender } = render(
      <Drawer open={false} onOpenChange={handleOpenChange}>
        <Drawer.Trigger>Open controlled drawer</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Controlled drawer</Drawer.Title>
          <Drawer.Body>Controlled body</Drawer.Body>
        </Drawer.Content>
      </Drawer>
    );

    await user.click(screen.getByRole('button', { name: 'Open controlled drawer' }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog', { name: 'Controlled drawer' })).not.toBeInTheDocument();

    rerender(
      <Drawer open={true} onOpenChange={handleOpenChange}>
        <Drawer.Trigger>Open controlled drawer</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Controlled drawer</Drawer.Title>
          <Drawer.Body>Controlled body</Drawer.Body>
          <Drawer.Close>Close controlled drawer</Drawer.Close>
        </Drawer.Content>
      </Drawer>
    );

    expect(screen.getByRole('dialog', { name: 'Controlled drawer' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close controlled drawer' }));

    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog', { name: 'Controlled drawer' })).toBeInTheDocument();
  });

  it('closes uncontrolled content through Drawer.Close', async () => {
    render(<BasicDrawer />);

    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Account settings' })).not.toBeInTheDocument();
    });
  });

  it('throws in test runtime when Drawer.Content is missing Drawer.Title', () => {
    expect(() =>
      render(
        <Drawer defaultOpen={true}>
          <Drawer.Content>
            <Drawer.Body>Missing title</Drawer.Body>
          </Drawer.Content>
        </Drawer>
      )
    ).toThrow(/Drawer\.Content requires a Drawer\.Title/i);
  });

  it('gives the built-in icon-only close control the accessible name Close drawer', async () => {
    render(
      <Drawer defaultOpen={true}>
        <Drawer.Content>
          <Drawer.Title>Closable drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
          <Drawer.Close />
        </Drawer.Content>
      </Drawer>
    );

    expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
  });

  it('keeps outside dismissal and Escape dismissal independent', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<BasicDrawer dismissible={false} closeOnEscape={true} />);

    await user.click(screen.getByRole('button', { name: 'Open drawer' }));
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Account settings' })).not.toBeInTheDocument();
    });

    rerender(<BasicDrawer dismissible={true} closeOnEscape={false} />);

    await user.click(screen.getByRole('button', { name: 'Open drawer' }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Done' }));
  });

  it('restores focus to the recorded native trigger after close', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);

    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('restores focus to an asChild project Button trigger', async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <Drawer.Trigger asChild={true}>
          <Button text='Open with Button' variant='secondary' />
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Button trigger drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
          <Drawer.Close>Close Button drawer</Drawer.Close>
        </Drawer.Content>
      </Drawer>
    );

    const trigger = screen.getByRole('button', { name: 'Open with Button' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close Button drawer' }));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' ']
  ] as const)('opens asChild project Button triggers once with %s', async (_label, key) => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Drawer open={false} onOpenChange={handleOpenChange}>
        <Drawer.Trigger asChild={true}>
          <Button text='Keyboard Button trigger' variant='secondary' />
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Keyboard Button drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer.Content>
      </Drawer>
    );

    screen.getByRole('button', { name: 'Keyboard Button trigger' }).focus();
    await user.keyboard(key);

    expect(handleOpenChange).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not open or request state changes from a disabled trigger', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Drawer onOpenChange={handleOpenChange}>
        <Drawer.Trigger disabled={true}>Disabled drawer trigger</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Disabled trigger drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer.Content>
      </Drawer>
    );

    await user.click(screen.getByRole('button', { name: 'Disabled drawer trigger' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Disabled trigger drawer' })).not.toBeInTheDocument();
  });
});

const OpenLayoutDrawer = ({
  backdrop,
  placement,
  size
}: {
  backdrop?: 'opacity' | 'blur' | 'transparent';
  placement?: 'start' | 'end' | 'top' | 'bottom';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}) => (
  <Drawer defaultOpen={true}>
    <Drawer.Content backdrop={backdrop} placement={placement} size={size}>
      <Drawer.Header>
        <Drawer.Title>Layout drawer</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>Scrollable drawer body</Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close>Close layout drawer</Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
);

describe('Drawer — layout, placement, and visual seams', () => {
  it('defaults to preferred end placement with mobile bottom adaptation seams', () => {
    render(<OpenLayoutDrawer />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-placement', 'end');
    expect(dialog).toHaveAttribute('data-effective-placement', 'end');
    expect(dialog).toHaveAttribute('data-mobile-placement', 'bottom');
    expect(dialog).toHaveAttribute('data-placement-axis', 'inline');
  });

  it.each(['start', 'end', 'top', 'bottom'] as const)('supports placement %s through semantic seams', (placement) => {
    render(<OpenLayoutDrawer placement={placement} />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-placement', placement);
    expect(dialog).toHaveAttribute('data-effective-placement', placement);
    expect(dialog).toHaveAttribute(
      'data-placement-axis',
      placement === 'start' || placement === 'end' ? 'inline' : 'block'
    );
  });

  it('exposes RTL logical mapping seams for inline placements on md and wider viewports', () => {
    render(<OpenLayoutDrawer placement='start' />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-logical-placement', 'inline-start');
    expect(dialog).toHaveAttribute('data-rtl-placement', 'right');
    expect(dialog).toHaveAttribute('data-ltr-placement', 'left');
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const)('supports size %s with sizing utility evidence', (size) => {
    render(<OpenLayoutDrawer placement='bottom' size={size} />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-size', size);
    expect(dialog).toHaveAttribute('data-block-size-utility', `max-h-drawer-${size}`);
  });

  it('maps side placement sizes to modal width utilities and mobile block-height utilities', () => {
    render(<OpenLayoutDrawer placement='end' size='lg' />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-size-mode', 'responsive-inline');
    expect(dialog).toHaveAttribute('data-inline-size-utility', 'max-w-modal-lg');
    expect(dialog).toHaveAttribute('data-block-size-utility', 'max-h-drawer-lg');
  });

  it.each(['opacity', 'blur', 'transparent'] as const)('supports backdrop variant %s', (backdrop) => {
    render(<OpenLayoutDrawer backdrop={backdrop} />);

    expect(screen.getByRole('dialog', { name: 'Layout drawer' })).toHaveAttribute('data-backdrop', backdrop);
    expect(document.querySelector('[data-slot="drawer-overlay"]')).toHaveAttribute('data-backdrop', backdrop);
  });

  it('keeps header and footer static while body is the internal scroll region', () => {
    render(<OpenLayoutDrawer />);

    expect(document.querySelector('[data-slot="drawer-header"]')).toHaveAttribute('data-scroll-lock', 'static');
    expect(document.querySelector('[data-slot="drawer-body"]')).toHaveAttribute('data-scroll-region', 'internal');
    expect(document.querySelector('[data-slot="drawer-footer"]')).toHaveAttribute('data-scroll-lock', 'static');
  });

  it('exposes safe-area and reduced-motion seams without transition-all', () => {
    render(<OpenLayoutDrawer placement='bottom' />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-safe-area', 'block-end');
    expect(dialog).toHaveAttribute('data-motion', 'placement-slide');
    expect(dialog).toHaveAttribute('data-reduced-motion', 'supported');
  });
});

describe('Drawer — layout cross-product regressions', () => {
  it('combines start placement with RTL logical placement seams', () => {
    render(<OpenLayoutDrawer placement='start' size='sm' />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-logical-placement', 'inline-start');
    expect(dialog).toHaveAttribute('data-rtl-placement', 'right');
    expect(dialog).toHaveAttribute('data-inline-size-utility', 'max-w-modal-sm');
  });

  it('combines end placement with mobile effective bottom seams', () => {
    render(<OpenLayoutDrawer placement='end' size='xl' />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-mobile-placement', 'bottom');
    expect(dialog).toHaveAttribute('data-logical-placement', 'inline-end');
    expect(dialog).toHaveAttribute('data-block-size-utility', 'max-h-drawer-xl');
  });

  it('combines bottom placement and full size with safe-area max-height seams', () => {
    render(<OpenLayoutDrawer placement='bottom' size='full' />);

    const dialog = screen.getByRole('dialog', { name: 'Layout drawer' });
    expect(dialog).toHaveAttribute('data-size', 'full');
    expect(dialog).toHaveAttribute('data-safe-area', 'block-end');
    expect(dialog).toHaveAttribute('data-block-size-utility', 'max-h-drawer-full');
  });

  it('keeps transparent backdrop drawers accessible and explicitly closable', async () => {
    render(<OpenLayoutDrawer backdrop='transparent' />);

    expect(screen.getByRole('dialog', { name: 'Layout drawer' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close layout drawer' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Layout drawer' })).not.toBeInTheDocument();
    });
  });
});

describe('Drawer — composition edge cases', () => {
  it.each([
    ['Enter', 'Enter'],
    ['Space', ' ']
  ] as const)('opens non-native asChild triggers with %s', async (_label, key) => {
    render(
      <Drawer>
        <Drawer.Trigger asChild={true}>
          <span>Keyboard trigger</span>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Keyboard trigger drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer.Content>
      </Drawer>
    );

    const trigger = screen.getByRole('button', { name: 'Keyboard trigger' });
    expect(trigger).toHaveAttribute('tabIndex', '0');

    fireEvent.keyDown(trigger, { key });

    expect(screen.getByRole('dialog', { name: 'Keyboard trigger drawer' })).toBeInTheDocument();
  });

  it('blocks disabled asChild project Button triggers before child click side effects', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <Drawer onOpenChange={handleOpenChange}>
        <Drawer.Trigger asChild={true} disabled={true}>
          <Button text='Disabled Button trigger' onClick={handleClick} variant='secondary' />
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Disabled Button drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer.Content>
      </Drawer>
    );

    const trigger = screen.getByRole('button', { name: 'Disabled Button trigger' });
    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Disabled Button drawer' })).not.toBeInTheDocument();
  });

  it('blocks disabled asChild anchor triggers before child click side effects', () => {
    const handleClick = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <Drawer onOpenChange={handleOpenChange}>
        <Drawer.Trigger asChild={true} disabled={true}>
          <a href='#drawer-target' onClick={handleClick}>
            Disabled anchor trigger
          </a>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Disabled anchor drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer.Content>
      </Drawer>
    );

    const trigger = screen.getByRole('link', { name: 'Disabled anchor trigger' });
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).toHaveAttribute('tabIndex', '-1');

    fireEvent.click(trigger);

    expect(handleClick).not.toHaveBeenCalled();
    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Disabled anchor drawer' })).not.toBeInTheDocument();
  });

  it('preserves asChild trigger click handlers while opening and recording the trigger', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Drawer>
        <Drawer.Trigger asChild={true}>
          <button type='button' onClick={handleClick}>
            Custom trigger
          </button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Custom trigger drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
          <Drawer.Close>Close custom trigger drawer</Drawer.Close>
        </Drawer.Content>
      </Drawer>
    );

    const trigger = screen.getByRole('button', { name: 'Custom trigger' });
    await user.click(trigger);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: 'Custom trigger drawer' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close custom trigger drawer' }));
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('lets custom close controls rely on their own visible text or explicit accessible name', async () => {
    render(
      <Drawer defaultOpen={true}>
        <Drawer.Content>
          <Drawer.Title>Custom close drawer</Drawer.Title>
          <Drawer.Body>Body</Drawer.Body>
          <Drawer.Close asChild={true}>
            <button type='button' aria-label='Dismiss panel'>
              ×
            </button>
          </Drawer.Close>
          <Drawer.Close>Close by text</Drawer.Close>
        </Drawer.Content>
      </Drawer>
    );

    expect(screen.getByRole('button', { name: 'Dismiss panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close by text' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close drawer' })).not.toBeInTheDocument();
  });

  it('keeps an explicit close path available for a non-dismissible drawer', async () => {
    render(<BasicDrawer dismissible={false} closeOnEscape={false} />);

    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
    await userEvent.keyboard('{Escape}');
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Account settings' })).not.toBeInTheDocument();
    });
  });
});

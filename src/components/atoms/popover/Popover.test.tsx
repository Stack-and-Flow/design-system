/** @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';
import { popoverArrowVariants, popoverContentVariants, popoverHeaderVariants } from './types';
import { PopoverRootProvider, usePopoverContent, usePopoverRoot } from './usePopover';

const HeaderSlot = ({ children }: { children: ReactNode }) => <>{children}</>;
const BodySlot = ({ children }: { children: ReactNode }) => <>{children}</>;

HeaderSlot.displayName = 'Popover.Header';
BodySlot.displayName = 'Popover.Body';

beforeAll(() => {
  if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
      observe() {
        // no-op for jsdom positioning tests
      }

      unobserve() {
        // no-op for jsdom positioning tests
      }

      disconnect() {
        // no-op for jsdom positioning tests
      }
    }

    window.ResizeObserver = ResizeObserver;
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('usePopoverRoot — logic', () => {
  it('uses uncontrolled state by default', () => {
    const { result } = renderHook(() => usePopoverRoot({ children: null, defaultOpen: true }));

    expect(result.current.rootProps.open).toBe(true);
    expect(result.current.contextValue.contentId).toMatch(/^popover-/);
  });
});

describe('usePopoverContent — logic', () => {
  it('maps placement to side/alignment and enables collision handling by default', () => {
    const wrapper = ({ children }: { children: ReactNode }) => {
      const { contextValue } = usePopoverRoot({ children: null });

      return <PopoverRootProvider value={contextValue}>{children}</PopoverRootProvider>;
    };

    const { result } = renderHook(
      () =>
        usePopoverContent({
          ariaLabel: 'Popover details',
          children: <BodySlot>Body content</BodySlot>,
          placement: 'right-end'
        }),
      { wrapper }
    );

    expect(result.current.contentProps.side).toBe('right');
    expect(result.current.contentProps.align).toBe('end');
    expect(result.current.contentProps.avoidCollisions).toBe(true);
    expect(result.current.contentProps.collisionPadding).toBe(8);
    expect(result.current.contentProps['aria-describedby']).toMatch(/^popover-/);
  });

  it('uses the header slot as the accessible label source when present', () => {
    const wrapper = ({ children }: { children: ReactNode }) => {
      const { contextValue } = usePopoverRoot({ children: null });

      return <PopoverRootProvider value={contextValue}>{children}</PopoverRootProvider>;
    };

    const { result } = renderHook(
      () =>
        usePopoverContent({
          children: (
            <>
              <HeaderSlot>Popover title</HeaderSlot>
              <BodySlot>Popover body</BodySlot>
            </>
          )
        }),
      { wrapper }
    );

    expect(result.current.contentProps['aria-labelledby']).toMatch(/^popover-/);
    expect(result.current.contentProps['aria-label']).toBeUndefined();
  });

  it('maps the info color to semantic content, header, and arrow classes', () => {
    expect(popoverContentVariants({ color: 'info' })).toContain('border-info-light/30');
    expect(popoverHeaderVariants({ color: 'info' })).toContain('text-info-light');
    expect(popoverArrowVariants({ color: 'info' })).toContain('fill-info-light/15');
  });
});

describe('Popover — component behavior', () => {
  it('opens on click and exposes dialog semantics with header and body slots', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <Popover.Trigger>
          <button type='button'>Open details</button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>Profile details</Popover.Header>
          <Popover.Body>Popover body content</Popover.Body>
        </Popover.Content>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open details' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Profile details' });
    expect(dialog).toHaveAttribute('data-slot', 'popover-content');
    expect(dialog).toHaveAttribute('aria-describedby');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Popover body content')).toBeInTheDocument();
  });

  it('supports keyboard opening and returns focus to the trigger on Escape close', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <Popover.Trigger>
          <button type='button'>Keyboard trigger</button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>Keyboard popover</Popover.Header>
          <Popover.Body>
            <button type='button'>Focusable action</button>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Keyboard trigger' });
    trigger.focus();

    await user.keyboard('{Enter}');
    expect(await screen.findByRole('dialog', { name: 'Keyboard popover' })).toBeInTheDocument();

    await user.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Focusable action' })).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Keyboard popover' })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes when clicking outside of the content', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type='button'>Outside action</button>
        <Popover>
          <Popover.Trigger>
            <button type='button'>Open outside close</button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Header>Outside close</Popover.Header>
            <Popover.Body>Dismiss me</Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Open outside close' }));
    expect(await screen.findByRole('dialog', { name: 'Outside close' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside action' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Outside close' })).not.toBeInTheDocument();
    });
  });

  it('supports controlled mode without mutating visibility until the owner updates props', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover onOpenChange={onOpenChange} open={false}>
        <Popover.Trigger>
          <button type='button'>Controlled trigger</button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>Controlled popover</Popover.Header>
          <Popover.Body>Controlled content</Popover.Body>
        </Popover.Content>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Controlled trigger' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog', { name: 'Controlled popover' })).not.toBeInTheDocument();
  });

  it('renders uncontrolled defaultOpen content immediately and restores focus to the trigger when closed', async () => {
    const user = userEvent.setup();

    render(
      <div className='space-y-2'>
        <button type='button'>Outside close target</button>
        <Popover defaultOpen={true}>
          <Popover.Trigger>
            <button type='button'>Initially open</button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Header>Default open</Popover.Header>
            <Popover.Body>Visible on mount</Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Initially open' });
    expect(screen.getByRole('dialog', { name: 'Default open' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside close target' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Default open' })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('does not open when the trigger is disabled', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <Popover.Trigger disabled={true}>
          <button type='button'>Disabled trigger</button>
        </Popover.Trigger>
        <Popover.Content ariaLabel='Disabled content'>Disabled body</Popover.Content>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Disabled trigger' });
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole('dialog', { name: 'Disabled content' })).not.toBeInTheDocument();
  });

  it('supports a non-button custom trigger with keyboard activation', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <Popover.Trigger>
          <span>Open custom trigger</span>
        </Popover.Trigger>
        <Popover.Content ariaLabel='Custom trigger popover'>Custom trigger content</Popover.Content>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open custom trigger' });
    trigger.focus();

    await user.keyboard(' ');

    expect(await screen.findByRole('dialog', { name: 'Custom trigger popover' })).toBeInTheDocument();
  });

  it('preserves input trigger keyboard behavior while typing', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover onOpenChange={onOpenChange} open={false}>
        <Popover.Trigger>
          <input aria-label='Search trigger' />
        </Popover.Trigger>
        <Popover.Content ariaLabel='Search suggestions'>Suggestions content</Popover.Content>
      </Popover>
    );

    const trigger = screen.getByRole('textbox', { name: 'Search trigger' });
    trigger.focus();

    await user.keyboard('hello world{Enter}');

    expect(trigger).toHaveValue('hello world');
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Search suggestions' })).not.toBeInTheDocument();
  });

  it('renders the frosted variant with an arrow while preserving scoped dark-mode portal rendering', async () => {
    const user = userEvent.setup();

    render(
      <div className='dark'>
        <Popover>
          <Popover.Trigger>
            <button type='button'>Open frosted</button>
          </Popover.Trigger>
          <Popover.Content variant='frosted'>
            <Popover.Arrow />
            <Popover.Header>Frosted popover</Popover.Header>
            <Popover.Body>Scoped dark content</Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Open frosted' }));

    const dialog = await screen.findByRole('dialog', { name: 'Frosted popover' });
    expect(dialog).toHaveAttribute('data-variant', 'frosted');
    expect(dialog.closest('.dark')).not.toBeNull();
    expect(document.body).toContainElement(dialog);
    expect(document.querySelector('[data-slot="popover-arrow"]')).toBeInTheDocument();
  });

  it('preserves scoped dark-mode portal rendering for initially-open popovers', () => {
    render(
      <div className='dark'>
        <Popover defaultOpen={true}>
          <Popover.Trigger>
            <button type='button'>Dark trigger</button>
          </Popover.Trigger>
          <Popover.Content variant='frosted'>
            <Popover.Header>Initially open dark scope</Popover.Header>
            <Popover.Body>Scoped dark content</Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    );

    const dialog = screen.getByRole('dialog', { name: 'Initially open dark scope' });
    expect(dialog.closest('.dark')).not.toBeNull();
    expect(document.body).toContainElement(dialog);
  });

  it('renders placement attributes for collision and flip smoke coverage', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <Popover.Trigger>
          <button type='button'>Open placed popover</button>
        </Popover.Trigger>
        <Popover.Content placement='right-end'>
          <Popover.Header>Placed popover</Popover.Header>
          <Popover.Body>Placement smoke test</Popover.Body>
        </Popover.Content>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open placed popover' }));

    const dialog = await screen.findByRole('dialog', { name: 'Placed popover' });
    expect(dialog).toHaveAttribute('data-side', 'right');
    expect(dialog).toHaveAttribute('data-align', 'end');
  });

  it('supports external labelling when no header slot is rendered', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <span id='external-popover-title'>External label</span>
        <Popover>
          <Popover.Trigger>
            <button type='button'>Open external label</button>
          </Popover.Trigger>
          <Popover.Content ariaLabelledBy='external-popover-title'>
            <Popover.Body>Externally labelled content</Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Open external label' }));

    expect(await screen.findByRole('dialog', { name: 'External label' })).toBeInTheDocument();
  });

  it('requires an accessible label when no header slot is rendered', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Expected React error noise for this negative render path.
    });

    expect(() => {
      render(
        <Popover defaultOpen={true}>
          <Popover.Trigger>
            <button type='button'>Missing label</button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Body>Missing accessible name</Popover.Body>
          </Popover.Content>
        </Popover>
      );
    }).toThrow('Popover.Content requires Popover.Header, ariaLabel, or ariaLabelledBy for accessible naming.');

    consoleErrorSpy.mockRestore();
  });
});

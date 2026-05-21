import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('lucide-react/dynamic.js', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  DynamicIcon: ({ name, size }: { name: string; size?: number | string }) => (
    <svg data-name={name} data-size={String(size ?? '')} data-testid='modal-icon' />
  )
}));

vi.mock('spinners-react', () => ({
  // biome-ignore lint/style/useNamingConvention: must match library export name
  SpinnerCircular: () => <span data-testid='spinner' />
}));

import { Button } from '@atoms/button';
import { Modal as ModalFromIndex } from './index';
import { Modal } from './Modal';
import { useModal } from './useModal';

describe('useModal — logic', () => {
  it('returns default accessible content and trigger semantics', () => {
    const { result } = renderHook(() =>
      useModal({
        children: <button type='button'>Open modal</button>
      })
    );

    expect(result.current.title).toBe('Modal title');
    expect(result.current.textContent).toBe('Modal content goes here.');
    expect(result.current.getTriggerProps()).toMatchObject({
      'aria-expanded': false,
      'aria-haspopup': 'dialog'
    });
    expect(result.current.getTriggerProps()['aria-controls']).toBe(result.current.contentId);
  });

  it('generates unique ids for each modal instance', () => {
    const first = renderHook(() => useModal({ children: <button type='button'>First</button> }));
    const second = renderHook(() => useModal({ children: <button type='button'>Second</button> }));

    expect(first.result.current.contentId).not.toBe(second.result.current.contentId);
    expect(first.result.current.getTriggerProps()['aria-controls']).not.toBe(
      second.result.current.getTriggerProps()['aria-controls']
    );
  });

  it('re-exports the component as a named export from the barrel', () => {
    expect(ModalFromIndex).toBe(Modal);
  });
});

describe('Modal — component behavior', () => {
  it('opens the dialog and wires trigger aria attributes', async () => {
    const user = userEvent.setup();

    render(
      <Modal title='Delete workspace' textContent='This action removes the workspace.'>
        <Button text='Open modal' />
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: 'Open modal' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');

    await user.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Delete workspace' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('This action removes the workspace.')).toBeInTheDocument();
  });

  it('does not open when the trigger is disabled', async () => {
    const user = userEvent.setup();

    render(
      <Modal title='Disabled modal trigger' textContent='This dialog cannot be opened until the trigger is enabled.'>
        <Button disabled={true} text='Open modal' />
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(screen.queryByRole('dialog', { name: 'Disabled modal trigger' })).not.toBeInTheDocument();
  });

  it('closes from the footer button and restores focus to the trigger', async () => {
    const user = userEvent.setup();

    render(
      <Modal title='Delete workspace' textContent='This action removes the workspace.'>
        <Button text='Open modal' />
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Delete workspace' })).not.toBeInTheDocument();
    });

    expect(trigger).toHaveFocus();
  });

  it('closes from the icon close button', async () => {
    const user = userEvent.setup();

    render(
      <Modal title='Delete workspace' textContent='This action removes the workspace.'>
        <Button text='Open modal' />
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Delete workspace' })).not.toBeInTheDocument();
    });
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();

    render(
      <Modal title='Delete workspace' textContent='This action removes the workspace.'>
        <Button text='Open modal' />
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Delete workspace' })).not.toBeInTheDocument();
    });

    expect(trigger).toHaveFocus();
  });

  it('passes close action to custom content and footer render props', async () => {
    const user = userEvent.setup();

    render(
      <Modal
        title='Render prop modal'
        textContent='Custom slots can close the dialog.'
        content={({ close }) => (
          <button type='button' onClick={close}>
            Close from content
          </button>
        )}
        footer={({ close }) => (
          <button type='button' onClick={close}>
            Close from footer
          </button>
        )}
      >
        <button type='button'>Open render prop modal</button>
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: 'Open render prop modal' });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close from content' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Render prop modal' })).not.toBeInTheDocument();
    });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close from footer' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Render prop modal' })).not.toBeInTheDocument();
    });
  });

  it('keeps valid aria references when custom header and content are provided', async () => {
    const user = userEvent.setup();

    render(
      <Modal
        title='Transfer project ownership'
        textContent='Review the ownership transfer details before continuing.'
        header={<div>Custom header</div>}
        content={<div>Transfer action details.</div>}
        footer={<button type='button'>Transfer</button>}
      >
        <button type='button'>Open transfer modal</button>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Open transfer modal' }));

    const dialog = screen.getByRole('dialog', { name: 'Transfer project ownership' });

    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Custom header')).toBeInTheDocument();
    expect(screen.getByText('Transfer action details.')).toBeInTheDocument();
  });
});

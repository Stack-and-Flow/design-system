import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination as PaginationFromIndex } from './index';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary
} from './Pagination';
import {
  usePagination,
  usePaginationControl,
  usePaginationEllipsis,
  usePaginationNext,
  usePaginationPrevious
} from './usePagination';

describe('usePagination — logic', () => {
  it('returns the default landmark label and medium size', () => {
    const { result } = renderHook(() => usePagination({ children: <span>Pages</span> }));

    expect(result.current['aria-label']).toBe('Pagination');
    expect(result.current.size).toBe('md');
  });

  it('keeps current page controls interactive in anchor mode', () => {
    const handleClick = vi.fn();
    const { result } = renderHook(() =>
      usePaginationControl({
        href: '?page=2',
        isCurrent: true,
        onClick: handleClick,
        children: '2'
      })
    );

    expect(result.current.isAnchor).toBe(true);
    expect(result.current.isCurrent).toBe(true);
    expect(result.current.isDisabled).toBe(false);
  });

  it('uses accessible defaults for previous, next, and ellipsis', () => {
    const previous = renderHook(() => usePaginationPrevious({}));
    const next = renderHook(() => usePaginationNext({}));
    const ellipsis = renderHook(() => usePaginationEllipsis({}));

    expect(previous.result.current['aria-label']).toBe('Go to previous page');
    expect(previous.result.current.children).toBe('Previous');
    expect(next.result.current['aria-label']).toBe('Go to next page');
    expect(next.result.current.children).toBe('Next');
    expect(ellipsis.result.current.label).toBe('More pages');
  });
});

describe('Pagination — component behavior', () => {
  it('is exported from the molecule barrel', () => {
    expect(PaginationFromIndex).toBe(Pagination);
  });

  it('renders a navigation landmark with the default accessible name', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders content as list and listitem structure', () => {
    render(
      <Pagination aria-label='Results pages'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('marks the current page with aria-current and keeps it clickable', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href='?page=2'
              isCurrent={true}
              onClick={(event) => {
                event.preventDefault();
                handleClick(event);
              }}
            >
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const current = screen.getByRole('link', { name: '2' });
    expect(current).toHaveAttribute('aria-current', 'page');

    await user.click(current);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders previous and next controls with accessible labels', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='?page=1' />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href='?page=3' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole('link', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to next page' })).toBeInTheDocument();
  });

  it('renders ellipsis as non-interactive text with screen-reader text', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByText('More pages')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'More pages' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'More pages' })).not.toBeInTheDocument();
  });

  it('disabled button controls cannot be activated', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isDisabled={true} onClick={handleClick}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const button = screen.getByRole('button', { name: '1' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disabled anchor controls expose disabled semantics and block handlers', () => {
    const handleClick = vi.fn();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href='?page=3' isDisabled={true} onClick={handleClick} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link = screen.getByRole('link', { name: 'Go to next page' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');

    fireEvent.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('anchor mode renders valid href links', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href='?page=4'>4</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole('link', { name: '4' })).toHaveAttribute('href', '?page=4');
  });

  it('button mode calls onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink onClick={handleClick}>5</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    await user.click(screen.getByRole('button', { name: '5' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('preserves semantic rendering across size variants', () => {
    render(
      <div>
        <Pagination aria-label='Small pages' size='sm'>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Pagination aria-label='Large pages' size='lg'>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href='?page=2'>2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );

    expect(screen.getByRole('navigation', { name: 'Small pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Large pages' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument();
  });

  it('allows keyboard focus to reach enabled controls in DOM order', async () => {
    const user = userEvent.setup();

    render(
      <Pagination>
        <PaginationSummary>Showing 1-10 of 100 results</PaginationSummary>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '1' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toHaveFocus();
  });
});

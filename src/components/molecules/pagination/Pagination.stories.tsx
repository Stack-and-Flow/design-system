import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
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

/**
 * ## Description
 * Pagination renders accessible navigation controls for paged content. It provides a compound API for consumers that already own the page range model.
 *
 * ## Usage Guide
 * Compose `Pagination`, `PaginationContent`, `PaginationItem`, page links, previous/next controls, ellipsis, and optional summary text. Use `href` for anchor navigation or omit it for button-based client-side pagination.
 */
const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      autodocs: true
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/**
 * Default pagination with previous, numeric pages, current page, and next controls.
 */
export const Default: Story = {
  render: () => (
    <Pagination aria-label='Results pages'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='?page=1' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink aria-label='Go to page 1' href='?page=1'>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink aria-label='Current page, page 2' href='?page=2' isCurrent={true}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink aria-label='Go to page 3' href='?page=3'>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='?page=3' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

/**
 * Skipped page ranges use a non-interactive ellipsis indicator.
 */
export const WithEllipsis: Story = {
  render: () => (
    <Pagination aria-label='Results pages'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='?page=4' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='?page=1'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='?page=5' isCurrent={true}>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis aria-label='More ending pages' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='?page=10'>10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='?page=6' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

/**
 * Summary text can sit beside or above pagination content depending on consumer layout.
 */
export const WithSummary: Story = {
  render: () => (
    <div className='w-fit max-w-full rounded-md bg-background-light p-4 dark:bg-background-dark'>
      <Pagination aria-label='Results pages'>
        <PaginationSummary>Showing 1-10 of 100 results</PaginationSummary>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='?page=1' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='?page=1' isCurrent={true}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='?page=2'>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href='?page=2' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
};

/**
 * Simple previous and next controls without numeric pages.
 */
export const PreviousNextOnly: Story = {
  render: () => (
    <Pagination aria-label='Article pages'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='?page=1' />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='?page=3' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

/**
 * Boundary controls expose disabled semantics at the first or last page.
 */
export const DisabledBoundary: Story = {
  render: () => (
    <Pagination aria-label='Results pages'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious isDisabled={true} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isCurrent={true}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={action('next page')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

/**
 * Size variants are controlled by the root and propagated to child controls.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex w-fit max-w-full flex-col gap-6 rounded-md border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark'>
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-medium text-text-light dark:text-text-dark'>Small</span>
        <Pagination aria-label='Small results pages' size='sm'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='?page=1' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='?page=1'>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='?page=2' isCurrent={true}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='?page=3' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className='flex flex-col gap-2'>
        <span className='text-sm font-medium text-text-light dark:text-text-dark'>Medium</span>
        <Pagination aria-label='Medium results pages' size='md'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='?page=1' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='?page=1'>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='?page=2' isCurrent={true}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='?page=3' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className='flex flex-col gap-2'>
        <span className='text-sm font-medium text-text-light dark:text-text-dark'>Large</span>
        <Pagination aria-label='Large results pages' size='lg'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='?page=1' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='?page=1'>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='?page=2' isCurrent={true}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='?page=3' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
};

/**
 * Button mode supports client-side state pagination without URLs.
 */
export const ButtonMode: Story = {
  render: () => (
    <Pagination aria-label='Client-side pages'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={action('previous page')} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={action('page 1')}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isCurrent={true} onClick={action('page 2')}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={action('next page')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

/**
 * Anchor mode supports URL-style pagination and browser navigation affordances.
 */
export const AnchorMode: Story = {
  render: () => (
    <Pagination aria-label='URL pages'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='?page=1' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='?page=1'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='?page=2' isCurrent={true}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='?page=3' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

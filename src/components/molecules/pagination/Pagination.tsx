import type { FC } from 'react';
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
  PaginationSummaryProps
} from './types';
import {
  PaginationSizeProvider,
  usePagination,
  usePaginationContent,
  usePaginationControl,
  usePaginationEllipsis,
  usePaginationItem,
  usePaginationNext,
  usePaginationPrevious,
  usePaginationSummary
} from './usePagination';

export const Pagination: FC<PaginationProps> = (props) => {
  const { children, className, size, ...navProps } = usePagination(props);

  return (
    <PaginationSizeProvider value={size}>
      <nav {...navProps} className={className}>
        {children}
      </nav>
    </PaginationSizeProvider>
  );
};

export const PaginationSummary: FC<PaginationSummaryProps> = (props) => {
  const { children, className, ...summaryProps } = usePaginationSummary(props);

  return (
    <p {...summaryProps} className={className}>
      {children}
    </p>
  );
};

export const PaginationContent: FC<PaginationContentProps> = (props) => {
  const { children, className, ...contentProps } = usePaginationContent(props);

  return (
    <ul {...contentProps} className={className}>
      {children}
    </ul>
  );
};

export const PaginationItem: FC<PaginationItemProps> = (props) => {
  const { children, className, ...itemProps } = usePaginationItem(props);

  return (
    <li {...itemProps} className={className}>
      {children}
    </li>
  );
};

export const PaginationLink: FC<PaginationLinkProps> = (props) => {
  const control = usePaginationControl(props);

  if ('href' in props && typeof props.href === 'string') {
    const { children, className, isCurrent, isDisabled, onClick, ...anchorProps } = props;

    return (
      <a
        {...anchorProps}
        className={control.className}
        aria-current={control.isCurrent ? 'page' : undefined}
        aria-disabled={control.isDisabled ? true : undefined}
        tabIndex={control.isDisabled ? -1 : anchorProps.tabIndex}
        onClick={control.onClick}
      >
        {children}
      </a>
    );
  }

  const { children, className, isCurrent, isDisabled, onClick, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type='button'
      className={control.className}
      aria-current={control.isCurrent ? 'page' : undefined}
      disabled={control.isDisabled}
      onClick={control.onClick}
    >
      {children}
    </button>
  );
};

export const PaginationPrevious: FC<PaginationPreviousProps> = (props) => {
  const control = usePaginationPrevious(props);

  if ('href' in props && typeof props.href === 'string') {
    const { children, className, isDisabled, onClick, ...anchorProps } = props;

    return (
      <a
        {...anchorProps}
        className={control.className}
        aria-label={control['aria-label']}
        aria-disabled={control.isDisabled ? true : undefined}
        tabIndex={control.isDisabled ? -1 : anchorProps.tabIndex}
        onClick={control.onClick}
      >
        {control.children}
      </a>
    );
  }

  const { children, className, isDisabled, onClick, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type='button'
      className={control.className}
      aria-label={control['aria-label']}
      disabled={control.isDisabled}
      onClick={control.onClick}
    >
      {control.children}
    </button>
  );
};

export const PaginationNext: FC<PaginationNextProps> = (props) => {
  const control = usePaginationNext(props);

  if ('href' in props && typeof props.href === 'string') {
    const { children, className, isDisabled, onClick, ...anchorProps } = props;

    return (
      <a
        {...anchorProps}
        className={control.className}
        aria-label={control['aria-label']}
        aria-disabled={control.isDisabled ? true : undefined}
        tabIndex={control.isDisabled ? -1 : anchorProps.tabIndex}
        onClick={control.onClick}
      >
        {control.children}
      </a>
    );
  }

  const { children, className, isDisabled, onClick, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type='button'
      className={control.className}
      aria-label={control['aria-label']}
      disabled={control.isDisabled}
      onClick={control.onClick}
    >
      {control.children}
    </button>
  );
};

export const PaginationEllipsis: FC<PaginationEllipsisProps> = (props) => {
  const { className, label, ...ellipsisProps } = usePaginationEllipsis(props);

  return (
    <span {...ellipsisProps} className={className}>
      <span aria-hidden='true'>…</span>
      <span className='sr-only'>{label}</span>
    </span>
  );
};

import type { MouseEvent } from 'react';
import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import {
  type PaginationContentProps,
  type PaginationControlClickHandler,
  type PaginationEllipsisProps,
  type PaginationItemProps,
  type PaginationLinkProps,
  type PaginationNextProps,
  type PaginationPreviousProps,
  type PaginationProps,
  type PaginationSize,
  type PaginationSummaryProps,
  paginationContentVariants,
  paginationControlVariants,
  paginationEllipsisVariants,
  paginationItemVariants,
  paginationRootVariants,
  paginationSummaryVariants
} from './types';

const PaginationSizeContext = createContext<PaginationSize>('md');

export const PaginationSizeProvider = PaginationSizeContext.Provider;

export const usePaginationSize = (): PaginationSize => useContext(PaginationSizeContext);

type UsePaginationReturn = Omit<PaginationProps, 'size' | 'className'> & {
  className: string;
  size: PaginationSize;
};

export const usePagination = ({
  className,
  size = 'md',
  'aria-label': ariaLabel,
  ...props
}: PaginationProps): UsePaginationReturn => ({
  ...props,
  'aria-label': ariaLabel ?? 'Pagination',
  className: cn(paginationRootVariants({ size }), className),
  size
});

type UsePaginationContentReturn = PaginationContentProps & {
  className: string;
};

export const usePaginationContent = ({ className, ...props }: PaginationContentProps): UsePaginationContentReturn => {
  const size = usePaginationSize();

  return {
    ...props,
    className: cn(paginationContentVariants({ size }), className)
  };
};

type UsePaginationItemReturn = PaginationItemProps & {
  className: string;
};

export const usePaginationItem = ({ className, ...props }: PaginationItemProps): UsePaginationItemReturn => ({
  ...props,
  className: cn(paginationItemVariants(), className)
});

type UsePaginationSummaryReturn = PaginationSummaryProps & {
  className: string;
};

export const usePaginationSummary = ({ className, ...props }: PaginationSummaryProps): UsePaginationSummaryReturn => {
  const size = usePaginationSize();

  return {
    ...props,
    className: cn(paginationSummaryVariants({ size }), className)
  };
};

type UsePaginationControlReturn = {
  className: string;
  isAnchor: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

export const usePaginationControl = ({
  className,
  isCurrent = false,
  isDisabled = false,
  onClick,
  ...props
}: PaginationLinkProps): UsePaginationControlReturn => {
  const size = usePaginationSize();

  return {
    className: cn(paginationControlVariants({ size, isCurrent, isDisabled }), className),
    isAnchor: 'href' in props && typeof props.href === 'string',
    isCurrent,
    isDisabled,
    onClick: getControlClickHandler(isDisabled, onClick)
  };
};

type UsePaginationDirectionalControlReturn = {
  'aria-label': string;
  children: PaginationPreviousProps['children'];
  className: string;
  isAnchor: boolean;
  isDisabled: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

export const usePaginationPrevious = ({
  children = 'Previous',
  'aria-label': ariaLabel,
  ...props
}: PaginationPreviousProps): UsePaginationDirectionalControlReturn => {
  const control = useDirectionalControl(props);

  return {
    ...control,
    'aria-label': ariaLabel ?? 'Go to previous page',
    children
  };
};

export const usePaginationNext = ({
  children = 'Next',
  'aria-label': ariaLabel,
  ...props
}: PaginationNextProps): UsePaginationDirectionalControlReturn => {
  const control = useDirectionalControl(props);

  return {
    ...control,
    'aria-label': ariaLabel ?? 'Go to next page',
    children
  };
};

type UsePaginationEllipsisReturn = PaginationEllipsisProps & {
  className: string;
  label: string;
};

export const usePaginationEllipsis = ({
  className,
  'aria-label': ariaLabel,
  ...props
}: PaginationEllipsisProps): UsePaginationEllipsisReturn => {
  const size = usePaginationSize();
  const label = ariaLabel ?? 'More pages';

  return {
    ...props,
    className: cn(paginationEllipsisVariants({ size }), className),
    label
  };
};

const useDirectionalControl = ({
  className,
  isDisabled = false,
  onClick,
  ...props
}: Omit<PaginationPreviousProps, 'aria-label' | 'children'>): Omit<
  UsePaginationDirectionalControlReturn,
  'aria-label' | 'children'
> => {
  const size = usePaginationSize();

  return {
    className: cn(paginationControlVariants({ size, isDisabled, isCurrent: false }), className),
    isAnchor: 'href' in props && typeof props.href === 'string',
    isDisabled,
    onClick: getControlClickHandler(isDisabled, onClick)
  };
};

const getControlClickHandler = (isDisabled: boolean, onClick?: PaginationControlClickHandler) => {
  return (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };
};

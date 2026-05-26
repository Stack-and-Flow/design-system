import { isValidElement } from 'react';
import { cn } from '@/lib/utils';
import type { BadgeProps } from './types';
import { badgeVariants } from './types';

type BadgeSize = NonNullable<BadgeProps['size']>;
type BadgePlacement = NonNullable<BadgeProps['placement']>;

type BadgeElementProps = {
  className: string;
  'aria-label'?: string;
  role: BadgeProps['role'];
  'aria-live': NonNullable<BadgeProps['ariaLive']>;
};

export type UseBadgeReturn = {
  content: BadgeProps['content'];
  children: BadgeProps['children'];
  badgeProps: BadgeElementProps;
  hasChildren: boolean;
  isDot: boolean;
  isSquare: boolean;
  shouldRenderBadge: boolean;
  shouldAnimateIn: boolean;
  resolvedPlacement?: BadgePlacement;
};

const squareSizeClasses: Record<BadgeSize, string> = {
  sm: '!w-4-5 !px-0',
  md: '!w-6 !px-0',
  lg: '!w-7 !px-0'
};

export const useBadge = ({
  content = '',
  className,
  color,
  rounded,
  size,
  variant,
  placement,
  visibility = true,
  ariaLabel,
  animation,
  children = null,
  ariaLive = 'off',
  role = 'status'
}: BadgeProps): UseBadgeReturn => {
  const hasChildren = children !== null && children !== undefined;
  const isIconContent = isValidElement(content);
  const isDot = content === '' || content === null || content === undefined;
  const isSquare = isIconContent || isDot;
  const hasValidContent = isDot || typeof content === 'string' || typeof content === 'number' || isIconContent;
  const shouldRenderBadge = visibility && hasValidContent;
  const resolvedSize = size ?? 'md';
  const shouldAnimateIn = animation === undefined || animation === 'default';
  const resolvedPlacement = hasChildren ? (placement ?? 'top-right') : undefined;

  const badgeClass = badgeVariants({
    color,
    rounded,
    size,
    variant,
    placement: resolvedPlacement,
    animation
  });

  const badgeClassName = cn(
    badgeClass,
    isSquare && squareSizeClasses[resolvedSize],
    shouldAnimateIn && 'motion-safe:animate-badgeIn motion-reduce:animate-none',
    className
  );

  return {
    content,
    children,
    badgeProps: {
      className: badgeClassName,
      'aria-label': ariaLabel || undefined,
      role,
      'aria-live': ariaLive
    },
    hasChildren,
    isDot,
    isSquare,
    shouldRenderBadge,
    shouldAnimateIn,
    resolvedPlacement
  };
};

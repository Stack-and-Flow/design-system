import React from 'react';
import type { BadgeProps } from './types';
import { badgeVariants } from './types';
export const useBadge = ({
  content = '',
  className = '',
  color = 'primary',
  rounded = true,
  size = 'md',
  variant = 'solid',
  placement = 'top-right',
  visibility = true,
  ariaLabel = '',
  animation = 'default',
  children = null,
  ariaLive = 'off',
  role = 'status'
}: BadgeProps) => {
  const hasChildren = children !== null && children !== undefined;

  // Icon content or empty string → needs square shape (no horizontal padding)
  const isIconContent = React.isValidElement(content);
  const isDot = content === '' || content === null || content === undefined;
  const isSquare = isIconContent || isDot;

  // Only apply placement when there are children (positioned badge)
  // Otherwise, placement is ignored (standalone badge)
  const badgeClass = badgeVariants({
    color,
    rounded,
    size,
    variant,
    placement: hasChildren ? placement : undefined,
    animation
  });

  // Render the badge element as long as there is valid content — visibility controls animation only.
  // We keep the span in the DOM so badgeOut can animate before disappearing.
  const hasValidContent =
    isDot || typeof content === 'string' || typeof content === 'number' || React.isValidElement(content);
  const showRenderBadge = hasValidContent;

  return {
    content,
    className,
    color,
    rounded,
    size,
    variant,
    placement,
    visibility,
    ariaLabel,
    animation,
    children,
    badgeClass,
    showRenderBadge,
    ariaLive,
    role,
    hasChildren,
    isDot,
    isSquare
  };
};

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
  const badgeClass = badgeVariants({ color, rounded, size, variant, placement, animation });
  const showRenderBadge =
    visibility && (typeof content === 'string' || typeof content === 'number' || React.isValidElement(content));

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
    role
  };
};

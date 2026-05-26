import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { type AvatarProps, avatarVariants } from './types';

type UseAvatarReturn = Omit<AvatarProps, 'onClick'> & {
  alt: string;
  className: string;
  fallback: string;
  imageAlt: string;
  interactive: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const useAvatar = ({
  src,
  alt = 'Avatar',
  className,
  size = 'md',
  rounded = 'md',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}: AvatarProps): UseAvatarReturn => {
  const normalizedAlt = normalizeAlt(alt);
  const interactive = typeof onClick === 'function';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  return {
    ...props,
    src,
    alt: normalizedAlt,
    disabled,
    type,
    interactive,
    imageAlt: '',
    fallback: getInitials(normalizedAlt),
    className: cn(avatarVariants({ size, rounded }), className),
    handleClick
  };
};

const normalizeAlt = (alt: string): string => {
  const trimmedAlt = alt.trim();
  return trimmedAlt || 'Avatar';
};

const getInitials = (alt: string): string => {
  const initials = alt
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return initials || 'A';
};

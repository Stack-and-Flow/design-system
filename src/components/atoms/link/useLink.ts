import type { KeyboardEvent, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { type LinkProps, linkVariants } from './types';

type UseLinkReturn = Omit<LinkProps, 'onClick' | 'onKeyDown'> & {
  ariaLabel: string | undefined;
  className: string;
  disabled: boolean;
  handleClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLAnchorElement>) => void;
  iconWidth: number;
  isExternal: boolean;
  rel: string | undefined;
  role: 'button' | 'link';
  tabIndex: number | undefined;
  target: NonNullable<LinkProps['target']>;
};

export const useLink = ({
  children,
  icon = undefined,
  variant = 'regular',
  size = 'md',
  shadow = true,
  target = '_blank',
  className,
  href,
  title,
  disabled = false,
  onClick,
  onKeyDown,
  ...rest
}: LinkProps): UseLinkReturn => {
  const iconWidth = { sm: 18, md: 20, lg: 24 }[size] ?? 20;
  const isExternal = target === '_blank';
  const ariaLabel = title ?? (typeof children === 'string' ? children : undefined);
  const isAction = !href;
  const role = isAction ? 'button' : 'link';

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onKeyDown?.(event);

    if (event.defaultPrevented || !isAction || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    event.currentTarget.click();
  };

  return {
    ...rest,
    href,
    target,
    rel: isExternal ? 'noopener noreferrer' : undefined,
    isExternal,
    title,
    children,
    className: cn(linkVariants({ variant, size, shadow }), className),
    icon,
    iconWidth,
    disabled,
    ariaLabel,
    role,
    tabIndex: disabled ? -1 : (rest.tabIndex ?? (isAction ? 0 : undefined)),
    handleClick,
    handleKeyDown
  };
};

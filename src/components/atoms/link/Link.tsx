import { DynamicIcon } from 'lucide-react/dynamic.js';
import type { FC } from 'react';
import type { LinkProps } from './types';
import { useLink } from './useLink';

export const Link: FC<LinkProps> = (props) => {
  const {
    href,
    target,
    rel,
    title,
    children,
    className,
    icon,
    iconWidth,
    disabled,
    isExternal: _isExternal,
    ariaLabel,
    role,
    tabIndex,
    handleClick,
    handleKeyDown,
    ...rest
  } = useLink(props);

  return (
    <a
      {...rest}
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? true : undefined}
      data-external={_isExternal ? true : undefined}
      role={role}
      title={title ?? ariaLabel}
      tabIndex={tabIndex}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {icon && <DynamicIcon name={icon} color='currentColor' size={iconWidth} aria-hidden={true} />}
      {children}
    </a>
  );
};

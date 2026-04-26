import type { VariantProps } from 'class-variance-authority';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { type LinkProps, linkVariants } from './types';
import { useLink } from './useLink';

const Link: FC<LinkProps & VariantProps<typeof linkVariants> & ComponentProps<'a'>> = ({ ...props }) => {
  const { href, target, isExternal, title, children, variant, size, className, icon, iconWidth, ...rest } =
    useLink(props);

  return (
    <a
      {...rest}
      href={href}
      target={target}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={title || children}
      aria-current={props['aria-current'] || undefined}
      role={variant === 'button' || variant === 'outlined' ? 'button' : 'link'}
      title={title ?? children}
      tabIndex={0}
      className={cn(linkVariants({ variant, size, className }))}
    >
      {icon && <DynamicIcon name={icon} color='currentColor' size={iconWidth} />}
      {children}
    </a>
  );
};

export default Link;

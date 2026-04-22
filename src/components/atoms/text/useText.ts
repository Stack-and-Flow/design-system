import { sanitizeHtml } from '@utils/sanitizeHtml';
import { cn } from '@/lib/utils';
import { type TextProps, textVariants } from './types';

export const useText = ({
  font = 'secondary',
  tag = 'p',
  prominent,
  className,
  children,
  isHtml = false,
  ariaLive,
  srOnly,
  role,
  id,
  ...rest
}: TextProps) => {
  const sanitizedHtml = isHtml ? sanitizeHtml(children as string) : undefined;

  const props = {
    className: cn(textVariants({ font, tag, prominent, srOnly }), className),
    'aria-live': ariaLive || undefined,
    role: role || undefined,
    id: id || undefined,
    ...rest
  };
  return { tag, isHtml, sanitizedHtml, children, ...props };
};

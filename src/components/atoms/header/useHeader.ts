import { cn } from '@/lib/utils';
import { type HeaderProps, headerVariants } from './types';

type UseHeaderReturn = HeaderProps & {
  tag: NonNullable<HeaderProps['tag']>;
  className: string;
};

export const useHeader = ({
  font = 'primary',
  tag = 'h1',
  size,
  fontSize,
  prominent = false,
  className,
  children,
  srOnly = false,
  id,
  ...rest
}: HeaderProps): UseHeaderReturn => {
  const resolvedSize = size ?? fontSize ?? tag;

  return {
    tag,
    children,
    className: cn(headerVariants({ font, size: resolvedSize, prominent, srOnly }), className),
    id: id || undefined,
    ...rest
  };
};

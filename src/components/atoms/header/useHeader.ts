import { cn } from '@/lib/utils';
import { type HeaderProps, headerVariants } from './types';

export const useHeader = ({
  font = 'primary',
  tag = 'h1',
  prominent = false,
  className,
  children,
  srOnly = false,
  id,
  fontSize,
  ...rest
}: HeaderProps) => {
  const fontByTag = (fs: string) => {
    switch (fs) {
      case 'h1':
        return 'fs-h1 tablet:fs-tablet-h1';
      case 'h2':
        return 'fs-h2 tablet:fs-tablet-h2';
      case 'h3':
        return 'fs-h3 tablet:fs-tablet-h3';
      case 'h4':
        return 'fs-h4 tablet:fs-tablet-h4';
      case 'h5':
        return 'fs-h5 tablet:fs-tablet-h5';
      case 'h6':
        return 'fs-h6 tablet:fs-tablet-h6';
      default:
        return '';
    }
  };

  const prop = {
    className: cn(
      fontSize ? fontByTag(fontSize) : headerVariants({ tag }),
      headerVariants({ font, prominent, srOnly }),
      className
    ),
    id: id || undefined,
    ...rest
  };

  return {
    tag,
    children,
    ...prop
  };
};

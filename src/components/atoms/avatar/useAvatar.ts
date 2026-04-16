import type { AvatarProps } from './types';

export const useAvatar = ({ src, alt = 'EG', className, size = 'md', rounded = 'md', onClick }: AvatarProps) => {
  const sizeClasses = {
    sm: '30px',
    md: '40px',
    lg: '50px',
    xl: '60px',
    '2xl': '70px',
    '3xl': '80px'
  };
  const textClasses = {
    sm: 'text-[0.8em]',
    md: 'text-[1em]',
    lg: 'text-[1.2em]',
    xl: 'text-[1.4em]',
    '2xl': 'text-[1.6em]',
    '3xl': 'text-[1.8em]'
  };

  const roundedClass = rounded ? `rounded-${rounded}` : '';
  const sizeClass = sizeClasses[size];
  const textClass = textClasses[size];

  const initials = alt
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return {
    src,
    alt,
    initials,
    className,
    sizeClass,
    textClass,
    roundedClass,
    onClick
  };
};

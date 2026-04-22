import type { ThemeRounded } from '@/types';

export type AvatarProps = {
  /** @control src */
  src: string;
  /** @control select */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** @control text */
  alt: string;
  /** @control text */
  className?: string;
  /** @control select */
  rounded?: ThemeRounded;
  /** Passing onClick enables hover/active scale effect and cursor-pointer automatically */
  onClick?: () => void;
};

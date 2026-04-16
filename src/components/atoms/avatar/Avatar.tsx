import { cn } from '@/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { ComponentProps, FC } from 'react';
import type { AvatarProps } from './types';
import { useAvatar } from './useAvatar';

function AvatarContainer({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot='avatar-image' className={cn('aspect-square size-full', className)} {...props} />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}

const Avatar: FC<AvatarProps> = ({ ...props }) => {
  const { src, alt, sizeClass, className, textClass, roundedClass } = useAvatar({ ...props });

  return (
    <AvatarContainer
      className={cn(
        'bg-[var(--color-surface-dark)] flex items-center justify-center shadow-sm shadow-[var(--color-border-strong-light)] dark:shadow-[var(--color-border-dark)]',
        roundedClass,
        className
      )}
      style={{ width: sizeClass, height: sizeClass }}
      role='img'
      aria-label={alt}
    >
      <AvatarImage src={src} style={{ width: sizeClass, height: sizeClass }} alt={alt} />
      <AvatarFallback
        className={cn('text-text-light dark:text-text-dark leading-[1.2] pt-[0.2em]', textClass)}
      ></AvatarFallback>
    </AvatarContainer>
  );
};

export default Avatar;

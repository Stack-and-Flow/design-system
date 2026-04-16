import { cn } from '@/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { ComponentProps, FC } from 'react';
import type { AvatarProps } from './types';
import { useAvatar } from './useAvatar';

function AvatarContainer({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn('relative flex size-8 shrink-0 overflow-hidden', className)}
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
      className={cn('flex size-full items-center justify-center', className)}
      {...props}
    />
  );
}

const Avatar: FC<AvatarProps> = ({ ...props }) => {
  const { src, alt, initials, sizeClass, className, textClass, roundedClass, onClick } = useAvatar({ ...props });
  const interactive = !!onClick;

  return (
    <AvatarContainer
      className={cn(
        'bg-[var(--color-surface-raised-light)] dark:bg-[var(--color-surface-raised-dark)]',
        'shadow-[inset_0_0_0_1px_var(--color-border-strong-light)] dark:shadow-[inset_0_0_0_1px_var(--color-border-strong-dark)]',
        'flex items-center justify-center',
        interactive && 'cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-100',
        roundedClass,
        className
      )}
      style={{ width: sizeClass, height: sizeClass }}
      role='img'
      aria-label={alt}
      onClick={onClick}
    >
      <AvatarImage src={src} style={{ width: sizeClass, height: sizeClass }} alt={alt} />
      <AvatarFallback
        className={cn(
          'bg-[var(--color-surface-raised-light)] dark:bg-[var(--color-surface-raised-dark)]',
          'shadow-[inset_0_0_0_1px_var(--color-border-strong-light)] dark:shadow-[inset_0_0_0_1px_var(--color-border-strong-dark)]',
          'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]',
          'font-[var(--font-weight-semibold)] leading-[1.2] pt-[0.2em]',
          roundedClass,
          textClass
        )}
      >{initials}</AvatarFallback>
    </AvatarContainer>
  );
};

export default Avatar;

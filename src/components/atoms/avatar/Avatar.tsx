import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { FC } from 'react';
import type { AvatarProps } from './types';
import { useAvatar } from './useAvatar';

export const Avatar: FC<AvatarProps> = (props) => {
  const { src, alt, imageAlt, fallback, className, interactive, handleClick, disabled, type, ...rootProps } =
    useAvatar(props);

  const content = (
    <>
      <AvatarPrimitive.Image data-slot='avatar-image' className='aspect-square size-full' src={src} alt={imageAlt} />
      <AvatarPrimitive.Fallback data-slot='avatar-fallback' className='flex size-full items-center justify-center'>
        {fallback}
      </AvatarPrimitive.Fallback>
    </>
  );

  return interactive ? (
    <AvatarPrimitive.Root asChild={true}>
      <button
        data-slot='avatar'
        data-interactive={true}
        className={className}
        type={type}
        aria-label={alt}
        onClick={handleClick}
        disabled={disabled}
        {...rootProps}
      >
        {content}
      </button>
    </AvatarPrimitive.Root>
  ) : (
    <AvatarPrimitive.Root
      data-slot='avatar'
      data-interactive={false}
      className={className}
      role='img'
      aria-label={alt}
      {...rootProps}
    >
      {content}
    </AvatarPrimitive.Root>
  );
};

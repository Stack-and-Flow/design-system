import clsx from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { chipVariants } from './types';
import type { ChipProps } from './types';

const cn = (...v: any[]) => twMerge(clsx(v));
const isText = (n: React.ReactNode) => typeof n === 'string' || typeof n === 'number';

export function useChip(props: ChipProps) {
  const {
    variant = 'solid',
    color = 'primary',
    size = 'md',
    radius,
    animation = 'default',
    startContent,
    endContent,
    children,
    avatar,
    className,
    classNames,
    isDisabled,
    onClick,
    as,
    selectable,
    selected,
    defaultSelected,
    onSelectedChange,
    closable,
    onClose,
    ariaLabel,
    ...rest
  } = props;

  const isControlled = typeof selected === 'boolean';
  const [innerSelected, setInnerSelected] = React.useState<boolean>(!!defaultSelected);
  const isSelected = isControlled ? !!selected : innerSelected;

  const setSelected = (next: boolean) => {
    if (!isControlled) {
      setInnerSelected(next);
    }
    onSelectedChange?.(next);
  };

  const startKind = startContent == null ? 'default' : isText(startContent) ? 'text' : 'icon';
  const endKind = endContent == null ? 'default' : isText(endContent) ? 'text' : 'icon';

  const interactive = !!onClick || !!selectable;
  const Tag: 'div' | 'button' = as ?? (interactive ? 'button' : 'div');

  const baseClasses = chipVariants({
    variant,
    color,
    size,
    radiusSize: radius,
    startContent: startKind,
    endContent: endKind,
    animation
  });

  const hasText = (n: React.ReactNode) => !(n === null || n === undefined || (typeof n === 'string' && n.length === 0));

  const isDot = variant === 'dot';
  const hasChildren = hasText(children);
  const hasStart = !!startContent || !!avatar;
  const hasEnd = !!endContent;

  const pieceCount =
    (hasStart ? 1 : 0) + (hasEnd ? 1 : 0) + (hasChildren ? 1 : 0) + (isDot ? 1 : 0) + (closable ? 1 : 0);

  const iconBySize =
    size === 'sm'
      ? '[&_svg]:h-3.5 [&_svg]:w-3.5'
      : size === 'lg'
        ? '[&_svg]:h-4.5 [&_svg]:w-4.5'
        : '[&_svg]:h-4   [&_svg]:w-4';

  const slots = {
    base: cn(
      baseClasses,
      'min-w-0',
      pieceCount > 1 && 'gap-2',
      className,
      classNames?.base,
      interactive ? 'cursor-pointer' : 'cursor-auto',
      isSelected && 'ring-2 ring-offset-0 ring-inset ring-accent',
      iconBySize
    ),
    content: cn('truncate', classNames?.content),
    dot: cn('inline-block w-2 h-2 rounded-full shrink-0 bg-[var(--chip-dot)]', classNames?.dot),
    avatar: cn('shrink-0 ltr:mr-2 rtl:ml-2', classNames?.avatar),
    closeButton: cn(
      'relative ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full',
      'shrink-0 aspect-square leading-none',
      'pointer-events-auto cursor-pointer select-none',
      'transition-all duration-150',
      'hover:bg-[currentColor]/12 dark:hover:bg-[currentColor]/22',
      'hover:ring-1 hover:ring-current hover:ring-inset',
      'focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-accent',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg,white)]',
      '[&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:stroke-current',
      'hover:[&_svg]:scale-110 hover:[&_svg]:opacity-90',
      'motion-reduce:transition-none motion-reduce:[&_svg]:transform-none',
      classNames?.closeButton
    )
  };

  const handleActivate = (e: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      return;
    }
    if (selectable) {
      setSelected(!isSelected);
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (Tag === 'div' && interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const fake = new MouseEvent('click', { bubbles: true });
      (e.currentTarget as HTMLElement).dispatchEvent(fake);
    }

    if (closable && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      onClose?.();
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isDisabled) {
      return;
    }
    onClose?.();
  };

  const computedAriaLabel = isDot && !hasChildren ? ariaLabel : undefined;
  const a11yProps =
    Tag === 'button'
      ? {
          type: 'button' as const,
          'aria-disabled': isDisabled || undefined,
          disabled: isDisabled || undefined,
          'aria-pressed': selectable ? isSelected : undefined
        }
      : {
          role: interactive ? 'button' : undefined,
          tabIndex: interactive ? 0 : undefined,
          'aria-disabled': isDisabled || undefined,
          'aria-pressed': selectable ? isSelected : undefined,
          onKeyDown: handleKeyDown
        };

  return {
    Tag,
    slots,
    isDot,
    hasChildren,
    isSelected,
    interactive,
    propsBase: {
      ...rest,
      ...a11yProps,
      'aria-label': computedAriaLabel,
      onClick: interactive ? handleActivate : onClick
    },
    pieces: { avatar, startContent, endContent, children },
    closable,
    handleClose
  };
}

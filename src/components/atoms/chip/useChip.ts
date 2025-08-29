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

  const interactive = !!onClick || !!selectable; // ← define interactividad
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
        : '[&_svg]:h-4 [&_svg]:w-4';

  const closeBtnBoxBySize =
    size === 'sm' ? 'h-[18px] w-[18px]' : size === 'lg' ? 'h-[20px] w-[20px]' : 'h-[18px] w-[18px]';

  const closeGlyphSizeBySize = size === 'sm' ? 'text-[16px]' : size === 'lg' ? 'text-[20px]' : 'text-[18px]';

  const slots = {
    base: cn(
      baseClasses,
      'min-w-0',
      pieceCount > 1 && (closable ? 'gap-1' : 'gap-2'),
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
      'relative inline-flex items-center justify-center overflow-visible',
      'shrink-0 leading-none select-none pointer-events-auto cursor-pointer',
      'p-0 m-0 ltr:-ml-0.5 rtl:-mr-0.5 rounded',
      closeBtnBoxBySize,
      closeGlyphSizeBySize,
      'text-white dark:text-white font-bold',
      'hover:bg-transparent hover:ring-0',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg,white)]',
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
      'data-interactive': interactive ? 'true' : 'false',
      onClick: interactive ? handleActivate : onClick
    },
    pieces: { avatar, startContent, endContent, children },
    closable,
    handleClose
  };
}

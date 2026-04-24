import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ChipProps } from './types';
import { chipVariants } from './types';

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
    disabled,
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

  const isDisabledComputed = disabled ?? isDisabled ?? false;

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

  const interactive = (as === 'button' || !!onClick || !!selectable) && !isDisabledComputed;
  const splitActions = !!closable && interactive;
  const wantsButtonTag = as === 'button' || (as == null && interactive);
  const componentTag: 'div' | 'button' = wantsButtonTag && !closable ? 'button' : 'div';

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

  const iconBySize =
    size === 'sm'
      ? '[&_svg]:h-3.5 [&_svg]:w-3.5'
      : size === 'lg'
        ? '[&_svg]:h-[18px] [&_svg]:w-[18px]'
        : '[&_svg]:h-4 [&_svg]:w-4';

  const closeBtnBoxBySize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-[18px] w-[18px]' : 'h-4 w-4';

  const closeIconSizeBySize: 10 | 12 | 14 = size === 'sm' ? 10 : size === 'lg' ? 14 : 12;

  const slots = {
    base: cn(
      baseClasses,
      'min-w-0',
      className,
      classNames?.base,
      interactive ? 'cursor-pointer' : 'cursor-auto',
      splitActions &&
        'focus-within:ring-2 focus-within:ring-[var(--color-accent)] dark:focus-within:ring-[var(--color-text-dark)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--surface-bg,white)]',
      isSelected && 'ring-2 ring-offset-0 ring-inset ring-[var(--color-accent)] dark:ring-[var(--color-text-dark)]',
      iconBySize
    ),
    content: cn('truncate', classNames?.content),
    dot: cn('inline-block w-2 h-2 rounded-full shrink-0 bg-[var(--chip-dot)]', classNames?.dot),
    avatar: cn('shrink-0 ltr:mr-px rtl:ml-px', classNames?.avatar),

    actionButton: cn(
      'inline-flex min-w-0 flex-1 items-center justify-center gap-0.5 rounded-inherit bg-transparent p-0 m-0 border-0 text-inherit',
      'focus-visible:outline-none transition-transform duration-200 ease-in-out active:translate-y-[1px] active:scale-[0.985]',
      'disabled:cursor-not-allowed disabled:opacity-100',
      classNames?.actionButton
    ),

    closeButton: cn(
      'inline-flex items-center justify-center overflow-visible rounded-full',
      'shrink-0 leading-none select-none pointer-events-auto cursor-pointer',
      'p-0 m-0 ltr:-ml-0.5 rtl:-mr-0.5',
      closeBtnBoxBySize,
      'text-current/80 hover:text-current',
      'hover:bg-transparent hover:ring-0',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:focus-visible:ring-[var(--color-text-dark)]',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg,white)]',
      'disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-current/45 disabled:opacity-100',
      classNames?.closeButton
    )
  };

  const handleActivate = (e: React.MouseEvent<HTMLElement>) => {
    if (isDisabledComputed) {
      return;
    }
    if (selectable) {
      setSelected(!isSelected);
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (componentTag === 'div' && interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const fake = new MouseEvent('click', { bubbles: true });
      (e.currentTarget as HTMLElement).dispatchEvent(fake);
    }
    if (!isDisabledComputed && closable && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      onClose?.(e);
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isDisabledComputed) {
      return;
    }
    onClose?.(e);
  };

  const childrenAsText =
    typeof children === 'string' || typeof children === 'number'
      ? String(children).trim()
      : Array.isArray(children)
        ? children
            .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child).trim() : ''))
            .filter(Boolean)
            .join(' ')
        : '';

  const hasReadableText = childrenAsText.length > 0;

  const computedAriaLabel =
    ariaLabel ?? (hasReadableText ? undefined : closable ? 'Chip item (closable)' : interactive ? 'Chip item' : 'Chip');

  const closeButtonAriaLabel = hasReadableText ? `Remove ${childrenAsText}` : 'Remove chip';

  const isDotOnly = isDot && !hasChildren;

  const computedRole = componentTag === 'button' ? undefined : interactive ? 'button' : isDotOnly ? 'img' : undefined;

  const a11yProps =
    splitActions
      ? {
          role: 'group' as const,
          'aria-disabled': isDisabledComputed || undefined
        }
      : componentTag === 'button'
      ? {
          type: 'button' as const,
          'aria-disabled': isDisabledComputed || undefined,
          disabled: isDisabledComputed || undefined,
          'aria-pressed': selectable ? isSelected : undefined
        }
      : {
          role: computedRole,
          tabIndex: interactive ? 0 : undefined,
          'aria-disabled': isDisabledComputed || undefined,
          'aria-pressed': selectable ? isSelected : undefined,
          onKeyDown: handleKeyDown
        };

  const primaryActionProps = splitActions
    ? {
        type: 'button' as const,
        onClick: handleActivate as React.MouseEventHandler<HTMLButtonElement>,
        disabled: isDisabledComputed || undefined,
        'aria-disabled': isDisabledComputed || undefined,
        'aria-pressed': selectable ? isSelected : undefined,
        'aria-label': computedAriaLabel
      }
    : undefined;

  return {
    componentTag,
    slots,
    isDot,
    hasChildren,
    isSelected,
    interactive,
    splitActions,
    propsBase: {
      ...rest,
      ...a11yProps,
      'aria-label': splitActions ? undefined : computedAriaLabel,
      'data-interactive': interactive ? 'true' : 'false',
      'data-disabled': isDisabledComputed ? 'true' : 'false',
      onClick: splitActions ? undefined : interactive ? handleActivate : isDisabledComputed ? undefined : onClick
    },
    primaryActionProps,
    pieces: { avatar, startContent, endContent, children },
    closable,
    isDisabled: isDisabledComputed,
    handleClose,
    closeIconSize: closeIconSizeBySize,
    closeButtonAriaLabel
  };
}

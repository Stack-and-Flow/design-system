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
        ? '[&_svg]:h-5 [&_svg]:w-5'
        : '[&_svg]:h-4 [&_svg]:w-4';

  const avatarSizeClass = size === 'sm' ? 'chip-avatar-sm' : size === 'lg' ? 'chip-avatar-lg' : 'chip-avatar-md';

  const closeBtnBoxBySize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  const closeIconSizeBySize: 10 | 12 | 14 = size === 'sm' ? 10 : size === 'lg' ? 14 : 12;

  const normalizedColor = color ?? 'primary';

  const selectedClassByColor: Record<NonNullable<ChipProps['color']>, string> = {
    primary: 'border-transparent bg-brand-light text-white dark:bg-brand-dark dark:text-white',
    secondary:
      'border-transparent bg-surface-raised-light text-text-light dark:bg-surface-raised-dark dark:text-text-dark',
    success: 'border-transparent bg-success-light text-text-light dark:bg-success dark:text-text-light',
    warning: 'border-transparent bg-warning-light text-text-light dark:bg-warning dark:text-text-light',
    danger: 'border-transparent bg-error-light text-white dark:bg-error dark:text-white',
    info: 'border-transparent bg-info-light text-white dark:bg-info dark:text-text-light'
  };

  const dotClassByColor: Record<NonNullable<ChipProps['color']>, string> = {
    primary: 'bg-brand-light dark:bg-brand-dark',
    secondary: 'bg-text-secondary-light dark:bg-text-secondary-dark',
    success: 'bg-success-light dark:bg-success',
    warning: 'bg-warning-light dark:bg-warning',
    danger: 'bg-error-light dark:bg-error',
    info: 'bg-info-light dark:bg-info'
  };

  const closeButtonHoverByColor: Record<NonNullable<ChipProps['color']>, string> = {
    primary: 'hover:bg-red-tint-low',
    secondary: 'hover:bg-surface-raised-light dark:hover:bg-surface-raised-dark',
    success: 'hover:bg-success-tint',
    warning: 'hover:bg-warning-tint',
    danger: 'hover:bg-error-tint',
    info: 'hover:bg-info-tint'
  };

  const slots = {
    base: cn(
      baseClasses,
      'min-w-0',
      className,
      classNames?.base,
      interactive ? 'cursor-pointer' : 'cursor-auto',
      splitActions && '[&:has(:focus-visible)]:focus-ring',
      isSelected && selectedClassByColor[normalizedColor],
      iconBySize
    ),
    content: cn('truncate', classNames?.content),
    dot: cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', dotClassByColor[normalizedColor], classNames?.dot),
    avatar: cn(
      'grid shrink-0 place-items-center overflow-hidden rounded-full ltr:mr-px rtl:ml-px',
      avatarSizeClass,
      classNames?.avatar
    ),

    actionButton: cn(
      'inline-flex flex-1 items-center justify-center gap-1 rounded-[inherit] border-0 bg-transparent p-0 m-0 text-inherit',
      'focus-visible:focus-ring transition-transform duration-200 ease-in-out motion-safe:active:translate-y-px motion-safe:active:scale-95',
      'disabled:cursor-not-allowed disabled:opacity-40',
      classNames?.actionButton
    ),

    closeButton: cn(
      'relative inline-flex items-center justify-center overflow-visible rounded-full',
      'shrink-0 leading-none select-none pointer-events-auto cursor-pointer',
      'p-0 m-0 ltr:-ml-0.5 rtl:-mr-0.5',
      closeBtnBoxBySize,

      'text-current/70 hover:text-current',
      closeButtonHoverByColor[normalizedColor],
      'hover:ring-0',
      'focus-visible:focus-ring',
      'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40',
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

  const a11yProps = splitActions
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
        onKeyDown: handleKeyDown as React.KeyboardEventHandler<HTMLButtonElement>,
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

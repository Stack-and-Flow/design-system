import { Text, type TextProps } from '@atoms/text';
import type { ComponentProps, KeyboardEvent, ReactNode, RefCallback } from 'react';
import { createElement, useCallback, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  type AccordionItem,
  type AccordionProps,
  accordionContentTextVariants,
  accordionDefaultIconVariants,
  accordionIndicatorVariants,
  accordionItemVariants,
  accordionPanelVariants,
  accordionTitleTextVariants,
  accordionTriggerVariants,
  accordionVariants
} from './types';

type UseAccordionItem = AccordionItem & {
  index: number;
  expanded: boolean;
  triggerId: string;
  panelId: string;
  disabled: boolean;
  panelContent: ReactNode;
};

type UseAccordionReturn = {
  contentTextTag: NonNullable<AccordionProps['contentTextTag']>;
  headingLevel: NonNullable<AccordionProps['headingLevel']>;
  items: UseAccordionItem[];
  expandedKeys: string[];
  containerProps: ComponentProps<'div'>;
  getItemClassName: () => string;
  getTriggerClassName: () => string;
  getPanelClassName: () => string;
  getDefaultIconClassName: (expanded: boolean) => string;
  getTitleTextClassName: () => string;
  getIndicatorClassName: () => string;
  getTriggerProps: (item: UseAccordionItem) => ComponentProps<'button'>;
  getPanelProps: (item: UseAccordionItem) => ComponentProps<'div'>;
  isExpanded: (id: string) => boolean;
  toggleItem: (id: string) => void;
};

const renderAccordionPanelContent = (
  content: ReactNode,
  contentTextTag: NonNullable<AccordionProps['contentTextTag']>,
  contentTextClassName: string
) => {
  if (typeof content !== 'string') {
    return content;
  }

  const textProps: TextProps = {
    tag: contentTextTag,
    className: contentTextClassName,
    isHtml: false,
    children: content
  };

  return createElement(Text, textProps);
};

const getNextExpandedKeys = ({
  currentKeys,
  id,
  allowsMultipleExpanded,
  allowsToggle
}: {
  currentKeys: string[];
  id: string;
  allowsMultipleExpanded: boolean;
  allowsToggle: boolean;
}) => {
  const isOpen = currentKeys.includes(id);

  if (allowsMultipleExpanded) {
    if (isOpen) {
      return currentKeys.filter((key) => key !== id);
    }

    return [...currentKeys, id];
  }

  if (isOpen) {
    return allowsToggle ? [] : currentKeys;
  }

  return [id];
};

export const useAccordion = ({
  items,
  defaultExpandedKeys = [],
  expandedKeys: controlledExpandedKeys,
  onExpandedChange,
  allowsMultipleExpanded = false,
  allowsToggle = true,
  disabled = false,
  variant = 'default',
  size = 'md',
  hideSeparator = false,
  headingLevel = 'h3',
  contentTextTag = 'p',
  className,
  idPrefix,
  ...props
}: AccordionProps): UseAccordionReturn => {
  const generatedId = useId().replaceAll(':', '');
  const prefix = idPrefix ?? `accordion-${generatedId}`;
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [uncontrolledExpandedKeys, setUncontrolledExpandedKeys] = useState<string[]>(defaultExpandedKeys);
  const expandedKeys = controlledExpandedKeys ?? uncontrolledExpandedKeys;

  const enabledItems = useMemo(
    () => items.map((item, index) => ({ item, index })).filter(({ item }) => !disabled && !item.disabled),
    [disabled, items]
  );

  const isExpanded = useCallback((id: string) => expandedKeys.includes(id), [expandedKeys]);

  const toggleItem = useCallback(
    (id: string) => {
      const item = items.find((candidate) => candidate.id === id);

      if (disabled || item?.disabled || !item) {
        return;
      }

      if (controlledExpandedKeys !== undefined) {
        const nextKeys = getNextExpandedKeys({
          currentKeys: expandedKeys,
          id,
          allowsMultipleExpanded,
          allowsToggle
        });

        onExpandedChange?.(nextKeys);
        return;
      }

      setUncontrolledExpandedKeys((currentKeys) => {
        const nextKeys = getNextExpandedKeys({
          currentKeys,
          id,
          allowsMultipleExpanded,
          allowsToggle
        });

        onExpandedChange?.(nextKeys);
        return nextKeys;
      });
    },
    [allowsMultipleExpanded, allowsToggle, controlledExpandedKeys, disabled, expandedKeys, items, onExpandedChange]
  );

  const focusEnabledItem = useCallback(
    (currentIndex: number, direction: 'next' | 'previous' | 'first' | 'last') => {
      if (enabledItems.length === 0) {
        return;
      }

      const currentEnabledIndex = enabledItems.findIndex(({ index }) => index === currentIndex);
      const fallbackIndex = direction === 'previous' || direction === 'last' ? enabledItems.length - 1 : 0;
      const baseIndex = currentEnabledIndex >= 0 ? currentEnabledIndex : fallbackIndex;
      const targetEnabledIndex = (() => {
        switch (direction) {
          case 'first':
            return 0;
          case 'last':
            return enabledItems.length - 1;
          case 'previous':
            return (baseIndex - 1 + enabledItems.length) % enabledItems.length;
          default:
            return (baseIndex + 1) % enabledItems.length;
        }
      })();
      const targetIndex = enabledItems[targetEnabledIndex]?.index;

      if (targetIndex !== undefined) {
        triggerRefs.current[targetIndex]?.focus();
      }
    },
    [enabledItems]
  );

  const getTriggerRef = useCallback(
    (index: number): RefCallback<HTMLButtonElement> =>
      (node) => {
        triggerRefs.current[index] = node;
      },
    []
  );

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, item: UseAccordionItem) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          toggleItem(item.id);
          break;
        case 'ArrowDown':
          event.preventDefault();
          focusEnabledItem(item.index, 'next');
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusEnabledItem(item.index, 'previous');
          break;
        case 'Home':
          event.preventDefault();
          focusEnabledItem(item.index, 'first');
          break;
        case 'End':
          event.preventDefault();
          focusEnabledItem(item.index, 'last');
          break;
      }
    },
    [focusEnabledItem, toggleItem]
  );

  const containerProps = {
    ...props,
    className: cn(accordionVariants({ variant, size, disabled }), className)
  };

  const getItemClassName = () =>
    accordionItemVariants({
      variant,
      hideSeparator
    });

  const getTriggerClassName = () => accordionTriggerVariants({ variant, size });

  const getPanelClassName = () => accordionPanelVariants({ size });

  const getContentTextClassName = () => accordionContentTextVariants({ size });

  const getDefaultIconClassName = (expanded: boolean) => accordionDefaultIconVariants({ expanded });

  const getTitleTextClassName = () => accordionTitleTextVariants({ size });

  const getIndicatorClassName = () => accordionIndicatorVariants();

  const preparedItems = items.map((item, index) => {
    const expanded = isExpanded(item.id);

    return {
      ...item,
      index,
      expanded,
      triggerId: `${prefix}-trigger-${item.id}`,
      panelId: `${prefix}-panel-${item.id}`,
      disabled: disabled || item.disabled === true,
      panelContent: renderAccordionPanelContent(item.content, contentTextTag, getContentTextClassName())
    };
  });

  const getTriggerProps = (item: UseAccordionItem): ComponentProps<'button'> => ({
    ref: getTriggerRef(item.index),
    id: item.triggerId,
    type: 'button',
    disabled: item.disabled,
    'aria-disabled': item.disabled || undefined,
    'aria-expanded': item.expanded,
    'aria-controls': item.panelId,
    onClick: () => toggleItem(item.id),
    onKeyDown: (event) => handleTriggerKeyDown(event, item)
  });

  const getPanelProps = (item: UseAccordionItem): ComponentProps<'div'> => ({
    id: item.panelId,
    role: 'region',
    'aria-labelledby': item.triggerId,
    hidden: !item.expanded
  });

  return {
    contentTextTag,
    headingLevel,
    items: preparedItems,
    expandedKeys,
    containerProps,
    getItemClassName,
    getTriggerClassName,
    getPanelClassName,
    getDefaultIconClassName,
    getIndicatorClassName,
    getTitleTextClassName,
    getTriggerProps,
    getPanelProps,
    isExpanded,
    toggleItem
  };
};

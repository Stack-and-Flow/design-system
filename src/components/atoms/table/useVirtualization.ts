import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

interface UseVirtualizationProps<T> {
  items: T[];
  containerHeight: number;
  itemHeight: number;
  isVirtualized?: boolean;
  overscan?: number;
}

export const useVirtualization = <T>({
  items,
  containerHeight,
  itemHeight,
  isVirtualized = false,
  overscan = 5
}: UseVirtualizationProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const virtualizedResult = useMemo(() => {
    if (!isVirtualized || items.length === 0) {
      return {
        virtualItems: items.map((item, index) => ({ item, index })),
        totalHeight: items.length * itemHeight,
        startIndex: 0,
        endIndex: items.length - 1,
        offsetY: 0
      };
    }

    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= 0 && i < items.length) {
        virtualItems.push({
          item: items[i],
          index: i
        });
      }
    }

    return {
      virtualItems,
      totalHeight: items.length * itemHeight,
      startIndex,
      endIndex,
      offsetY: startIndex * itemHeight
    };
  }, [items, containerHeight, itemHeight, scrollTop, isVirtualized, overscan]);

  return {
    ...virtualizedResult,
    handleScroll,
    scrollTop
  };
};

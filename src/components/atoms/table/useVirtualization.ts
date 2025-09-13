import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

/**
 * Configuration options for the useVirtualization hook.
 * @template T - The type of data items being virtualized
 */
interface UseVirtualizationProps<T> {
  /** Array of items to virtualize */
  items: T[];
  /** Height of the container in pixels */
  containerHeight: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Whether virtualization is enabled */
  isVirtualized?: boolean;
  /** Number of items to render outside the visible area for smoother scrolling */
  overscan?: number;
}

/**
 * A hook for virtualizing large lists to improve performance by only rendering visible items.
 * Automatically handles scroll positioning, visible item calculation, and smooth scrolling behavior.
 *
 * @template T - The type of data items being virtualized
 * @param props - Configuration options for virtualization
 * @returns Object containing virtualized items and scroll handlers
 *
 * @example
 * ```tsx
 * const virtualization = useVirtualization({
 *   items: largeDataSet,
 *   containerHeight: 400,
 *   itemHeight: 56,
 *   isVirtualized: true,
 *   overscan: 5
 * });
 *
 * // Use in component
 * <div
 *   style={{ height: 400, overflow: 'auto' }}
 *   onScroll={virtualization.handleScroll}
 * >
 *   <div style={{ height: virtualization.totalHeight }}>
 *     <div style={{ transform: `translateY(${virtualization.offsetY}px)` }}>
 *       {virtualization.virtualItems.map(({ item, index }) => (
 *         <div key={index} style={{ height: 56 }}>
 *           {item}
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 * </div>
 * ```
 */
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

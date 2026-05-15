import { Icon } from '@atoms/icon';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { AccordionProps } from './types';
import { useAccordion } from './useAccordion';

export const Accordion: FC<AccordionProps> = ({ ...props }) => {
  const {
    items,
    containerProps,
    getItemClassName,
    getTriggerClassName,
    getPanelClassName,
    getDefaultIconClassName,
    getIndicatorClassName,
    getTriggerProps,
    getPanelProps
  } = useAccordion(props);

  return (
    <div {...containerProps}>
      {items.map((item) => (
        <div key={item.id} className={getItemClassName()}>
          <h3>
            <button {...getTriggerProps(item)} className={getTriggerClassName()}>
              <span>{item.title}</span>
              <span className={cn(getIndicatorClassName(), item.disabled && 'opacity-40')} aria-hidden='true'>
                {item.indicator ?? (
                  <Icon
                    name='chevron-down'
                    size={20}
                    className={getDefaultIconClassName(item.expanded)}
                    color='text-color-brand-light'
                    colorDark='dark:text-color-brand-dark'
                  />
                )}
              </span>
            </button>
          </h3>
          <div {...getPanelProps(item)} className={getPanelClassName()}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;

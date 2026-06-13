import { Header } from '@atoms/header';
import { Icon } from '@atoms/icon';
import { Text } from '@atoms/text';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { AccordionProps } from './types';
import { useAccordion } from './useAccordion';

export const Accordion: FC<AccordionProps> = ({ ...props }) => {
  const {
    headingLevel,
    items,
    containerProps,
    getItemClassName,
    getTriggerClassName,
    getPanelClassName,
    getDefaultIconClassName,
    getIndicatorClassName,
    getTitleTextClassName,
    getTriggerProps,
    getPanelProps
  } = useAccordion(props);

  return (
    <div {...containerProps}>
      {items.map((item) => (
        <div key={item.id} className={getItemClassName()}>
          <Header tag={headingLevel} className='contents'>
            <button {...getTriggerProps(item)} className={getTriggerClassName()}>
              <Text tag='span' className={getTitleTextClassName()}>
                {item.title}
              </Text>
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
          </Header>
          <div {...getPanelProps(item)} className={getPanelClassName()}>
            {item.panelContent}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;

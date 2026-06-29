import { cloneElement, type FC, isValidElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { TabsProps } from './types';
import { useTabs } from './useTabs';

type TabLabelProps = {
  icon?: ReactNode;
  tabContentClassName: string;
  title: ReactNode;
};

const renderTabIcon = (icon?: ReactNode) => {
  if (!isValidElement<{ className?: string }>(icon)) {
    return icon;
  }

  return cloneElement(icon, {
    className: cn(icon.props.className, 'text-current')
  });
};

const TabLabel: FC<TabLabelProps> = ({ icon, tabContentClassName, title }) => {
  return (
    <span className={tabContentClassName}>
      {renderTabIcon(icon)}
      <span className='truncate'>{title}</span>
    </span>
  );
};

export const Tabs: FC<TabsProps> = (props) => {
  const {
    cursorClassName,
    cursorStyle,
    getButtonTabProps,
    getPanelProps,
    getTabClassName,
    items,
    listClassName,
    panelClassName,
    panelContainerClassName,
    registerPanelRef,
    renderPanelsFirst,
    rootProps,
    shouldRenderCursor,
    tabContentClassName,
    tabListProps,
    tabWrapperClassName
  } = useTabs(props);

  const renderPanels = () => {
    if (props.destroyInactiveTabPanel) {
      const selectedItem = items.find((item) => item.selected);

      if (!selectedItem) {
        return null;
      }

      return (
        <div className={panelContainerClassName}>
          <div {...getPanelProps(selectedItem)} ref={registerPanelRef(selectedItem.key)} className={panelClassName}>
            {selectedItem.content}
          </div>
        </div>
      );
    }

    return (
      <div className={panelContainerClassName}>
        {items.map((item) => (
          <div key={item.key} {...getPanelProps(item)} ref={registerPanelRef(item.key)} className={panelClassName}>
            {item.content}
          </div>
        ))}
      </div>
    );
  };

  const renderTabs = () => (
    <div {...tabListProps} className={listClassName}>
      {shouldRenderCursor && (
        <span aria-hidden={true} className={cursorClassName} role='presentation' style={cursorStyle} />
      )}
      {items.map((item) => (
        <div key={item.key} className={tabWrapperClassName} role='presentation'>
          <button {...getButtonTabProps(item)} className={getTabClassName(item)}>
            <TabLabel icon={item.icon} tabContentClassName={tabContentClassName} title={item.title} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div {...rootProps}>
      {renderPanelsFirst && renderPanels()}
      {renderTabs()}
      {!renderPanelsFirst && renderPanels()}
    </div>
  );
};

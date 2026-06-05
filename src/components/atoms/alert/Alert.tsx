import type { FC } from 'react';
import { Icon } from '../icon';
import type { AlertProps } from './types';
import { useAlert } from './useAlert';

export const Alert: FC<AlertProps> = (props) => {
  const {
    shouldRender,
    dismissible,
    closeButtonAriaLabel,
    rootClassName,
    innerClassName,
    contentClassName,
    startContentClassName,
    iconClassName,
    textContentClassName,
    titleClassName,
    descriptionClassName,
    subtitleClassName,
    bodyClassName,
    endContentClassName,
    closeButtonClassName,
    titleId,
    descriptionId,
    hasTitle,
    hasSubtitle,
    hasBody,
    hasStartContent,
    hasEndContent,
    showDefaultIcon,
    resolvedIconName,
    handleDismiss,
    handleCloseKeyDown,
    rootProps,
    pieces
  } = useAlert(props);

  if (!shouldRender) {
    return null;
  }

  return (
    <div {...rootProps} className={rootClassName}>
      <div className={innerClassName}>
        <div className={contentClassName}>
          {(hasStartContent || showDefaultIcon) && (
            <div className={startContentClassName}>
              {hasStartContent ? (
                pieces.startContent
              ) : (
                <Icon className={iconClassName} decorative={true} name={resolvedIconName} size={20} tone='default' />
              )}
            </div>
          )}

          <div className={textContentClassName}>
            {hasTitle && (
              <div className={titleClassName} id={titleId}>
                {pieces.title}
              </div>
            )}

            {(hasSubtitle || hasBody) && (
              <div className={descriptionClassName} id={descriptionId}>
                {hasSubtitle && <div className={subtitleClassName}>{pieces.subtitle}</div>}
                {hasBody && <div className={bodyClassName}>{pieces.children}</div>}
              </div>
            )}
          </div>

          {(hasEndContent || dismissible) && (
            <div className={endContentClassName}>
              {hasEndContent && pieces.endContent}
              {dismissible && (
                <button
                  aria-label={closeButtonAriaLabel}
                  className={closeButtonClassName}
                  onClick={handleDismiss}
                  onKeyDown={handleCloseKeyDown}
                  type='button'
                >
                  <Icon
                    color='text-current'
                    colorDark='dark:text-current'
                    decorative={true}
                    name='x'
                    size={14}
                    tone='default'
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

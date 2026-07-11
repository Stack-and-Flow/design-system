import { Button } from '@atoms/button';
import { buttonVariants } from '@atoms/button/types';
import { Icon } from '@atoms/icon';
import { IconButton } from '@atoms/icon-button';
import { Progress } from '@atoms/progress';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { SpinnerCircular } from 'spinners-react';
import { cn } from '@/lib/utils';
import type { ToastProviderProps, ToastStatus } from './types';
import { getToastIndicatorTone, useToast } from './useToast';

const getStatusIconName = (status: ToastStatus) => {
  switch (status) {
    case 'success':
      return 'circle-check';
    case 'warning':
      return 'triangle-alert';
    case 'error':
      return 'circle-x';
    case 'loading':
      return null;
    default:
      return 'info';
  }
};

const isTextActionLabel = (label: ReactNode): label is string | number => {
  return typeof label === 'string' || typeof label === 'number';
};

const renderAction = ({
  ariaLabel,
  disabled,
  label,
  onAction,
  size
}: {
  ariaLabel?: string;
  disabled?: boolean;
  label: ReactNode;
  onAction: () => void;
  size: 'sm' | 'md';
}) => {
  if (isTextActionLabel(label)) {
    return (
      <Button
        ariaLabel={ariaLabel}
        disabled={disabled}
        onClick={onAction}
        size={size}
        text={String(label)}
        variant='secondary'
      />
    );
  }

  if (!ariaLabel) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.warn('Toast actions with non-text labels require ariaLabel.');
    }

    return null;
  }

  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        buttonVariants({
          emphasis: 'flat',
          fullWidth: false,
          rounded: true,
          size,
          variant: 'secondary'
        })
      )}
      disabled={disabled}
      onClick={onAction}
      type='button'
    >
      <span className='flex items-center justify-center gap-1'>{label}</span>
    </button>
  );
};

const ToastViewport = ({ props }: { props: ReturnType<typeof useToast> }) => {
  const { renderItems, viewportProps } = props;

  return (
    <div {...viewportProps}>
      {renderItems.map((toastItem) => {
        const fallbackIcon = getStatusIconName(toastItem.status);
        const indicatorTone = getToastIndicatorTone(toastItem.status);

        return (
          <div
            key={toastItem.id}
            {...toastItem.rootProps}
            ref={toastItem.setRef}
            className={toastItem.className}
            style={toastItem.rootStyle}
          >
            <div className={toastItem.contentClassName}>
              <div className={toastItem.indicatorClassName}>
                {toastItem.icon ??
                  (toastItem.isLoading ? (
                    <SpinnerCircular color='currentColor' size={toastItem.spinnerSize} thickness={180} />
                  ) : fallbackIcon ? (
                    <Icon decorative={true} name={fallbackIcon} size={toastItem.iconSize} tone={indicatorTone} />
                  ) : null)}
              </div>

              <div className='min-w-0 flex-1'>
                <div className='flex min-w-0 items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <div className={toastItem.titleClassName} id={toastItem.titleId}>
                      {toastItem.title}
                    </div>
                    {toastItem.description && (
                      <div className={toastItem.descriptionClassName} id={toastItem.descriptionId}>
                        {toastItem.description}
                      </div>
                    )}
                  </div>
                </div>

                {toastItem.action && (
                  <div className={toastItem.actionClassName}>
                    {renderAction({ ...toastItem.action, size: toastItem.actionButtonSize })}
                  </div>
                )}
              </div>

              {toastItem.dismissible && (
                <IconButton
                  className={toastItem.closeButtonClassName}
                  icon='x'
                  onClick={toastItem.close}
                  size={toastItem.closeButtonSize}
                  title='Dismiss notification'
                  variant='ghost'
                />
              )}
            </div>

            {toastItem.showProgress && (
              <Progress
                aria-label='Toast timeout remaining'
                className={toastItem.progressClassName}
                color={toastItem.progressColor}
                rounded='none'
                size='sm'
                value={toastItem.progressValue}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ToastProvider = (props: ToastProviderProps) => {
  const toastState = useToast(props);
  const viewport = <ToastViewport props={toastState} />;

  return (
    <div className='contents'>
      {toastState.children}
      {toastState.inlineViewport ? viewport : createPortal(viewport, toastState.viewportTarget as HTMLElement)}
    </div>
  );
};

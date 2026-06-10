import { forwardRef } from 'react';
import { Icon } from '../icon';
import type { TextAreaProps } from './types';
import { useTextArea } from './useTextArea';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const {
    hasHint,
    hasLabel,
    hintIconProps,
    hintMessage,
    hintMessageClassName,
    isRequired,
    label,
    labelProps,
    surfaceProps,
    textareaProps,
    textareaRef,
    wrapperClassName
  } = useTextArea(props, ref);

  return (
    <div className={wrapperClassName}>
      <div {...surfaceProps}>
        {hasLabel && (
          <label {...labelProps}>
            {label}{' '}
            {isRequired && (
              <span className='text-brand-light dark:text-brand-dark' aria-hidden={true}>
                *
              </span>
            )}
          </label>
        )}
        <textarea {...textareaProps} ref={textareaRef} />
      </div>
      {hasHint && (
        <div id={`${props.id}-hint`} className='flex items-center gap-2 py-0.5'>
          {hintIconProps && <Icon {...hintIconProps} decorative={true} />}
          <span className={hintMessageClassName}>{hintMessage}</span>
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

import type { FC } from 'react';
import { IconButton } from '@/components/atoms/icon-button';
import type { SnippetProps } from './types';
import { useSnippet } from './useSnippet';

export const Snippet: FC<SnippetProps> = (props) => {
  const {
    children,
    copyAnnouncement,
    copyButtonProps,
    copyButtonWrapperClassName,
    preProps,
    preRef,
    rootProps,
    showCopyButton,
    statusClassName
  } = useSnippet(props);

  return (
    <div {...rootProps}>
      <pre {...preProps} ref={preRef}>
        {children}
      </pre>
      {showCopyButton ? (
        <div className={copyButtonWrapperClassName}>
          <IconButton {...copyButtonProps} />
          <span aria-live='polite' className={statusClassName} role='status'>
            {copyAnnouncement}
          </span>
        </div>
      ) : null}
    </div>
  );
};

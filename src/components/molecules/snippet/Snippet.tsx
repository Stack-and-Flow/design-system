import IconButton from '@/components/atoms/icon-button';
import type { FC } from 'react';
import type { SnippetProps } from './types';
import { useSnippet } from './useSnippet';

/**
 * Snippet component
 *
 * Displays a code or text snippet with optional copy-to-clipboard functionality.
 * Supports multiple variants, colors, sizes, and rounded corners.
 *
 * @component
 * @param {SnippetProps} props - Props for Snippet component
 * @returns {JSX.Element}
 */
const Snippet: FC<SnippetProps> = ({ ...props }) => {
  const { preRef, size, copied, handleCopy, slots, children, ariaProps } = useSnippet(props);
  return (
    <div className={`${slots.base}`} {...ariaProps}>
      <pre
        ref={preRef}
        className={`${slots.pre}`}
        /* If you use Tailwind Scrollbar plugin, these classes will work. Otherwise, add custom CSS below. */
      >
        {children}
      </pre>
      {!props.disableCopy && (
        <div className='flex items-center justify-center h-full'>
          <IconButton
            className={slots.copyButtonAnimations}
            icon={copied ? 'check' : 'copy'}
            size={slots.sizeButton[size]}
            title='copy to clipboard'
            variant='ghost'
            onClick={handleCopy}
          />
        </div>
      )}
    </div>
  );
};

export default Snippet;

import { useCallback, useRef, useState } from 'react';
import { type SizeButton, type SnippetProps, snippetBase } from './types';

/**
 * Custom hook for Snippet component logic.
 *
 * Handles copy-to-clipboard, slot class generation, and accessibility props.
 *
 * @param {SnippetProps} props - Props for the Snippet component
 * @returns {{
 *   preRef: React.RefObject<HTMLPreElement>,
 *   copied: boolean,
 *   handleCopy: () => Promise<void>,
 *   slots: any,
 *   children: React.ReactNode,
 *   size: string,
 *   variant: string,
 *   color: string,
 *   ariaProps: object
 * }}
 */
export function useSnippet({
  children,
  size = 'md',
  rounded = 'md',
  className,
  color = 'default',
  variant = 'solid',
  disableCopy,
  onCopy,
  ...ariaProps
}: SnippetProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  /**
   * Copies the snippet content to clipboard and triggers feedback.
   */
  const handleCopy = useCallback(async () => {
    if (disableCopy || !preRef.current) {
      return;
    }

    const text = preRef.current.textContent || '';
    await navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    });
  }, [disableCopy, onCopy]);

  const slots = {
    base: snippetBase({ size, variant, color, rounded, className }),
    pre: 'w-full max-w-full overflow-x-auto whitespace-pre break-words box-border scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent flex-1 m-0 bg-transparent border-none',
    sizeButton: {
      sm: 12,
      md: 16,
      lg: 20
    } as const satisfies SizeButton,
    copyButtonAnimations: `transition-opacity duration-300 ease-in-out opacity-100`
  };

  return {
    preRef,
    copied,
    handleCopy,
    slots,
    children,
    size,
    variant,
    color,
    ariaProps
  };
}

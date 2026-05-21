import type { MouseEventHandler, MutableRefObject } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { IconButtonProps } from '@/components/atoms/icon-button';
import { cn } from '@/lib/utils';
import {
  type SnippetProps,
  snippetBase,
  snippetCopyButtonClassName,
  snippetCopyButtonIcons,
  snippetCopyButtonSizes,
  snippetCopyButtonWrapperClassName,
  snippetPreClassName,
  snippetStatusClassName
} from './types';

type SnippetRootProps = Omit<
  SnippetProps,
  | 'aria-controls'
  | 'aria-label'
  | 'children'
  | 'className'
  | 'color'
  | 'disableCopy'
  | 'onCopy'
  | 'rounded'
  | 'size'
  | 'variant'
> & {
  className: string;
};

type SnippetPreProps = {
  className: string;
  id?: string;
};

type SnippetCopyButtonProps = {
  'aria-controls': string;
  'aria-label': string;
  className: string;
  icon: NonNullable<IconButtonProps['icon']>;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size: NonNullable<IconButtonProps['size']>;
  title: string;
  variant: NonNullable<IconButtonProps['variant']>;
};

export type UseSnippetReturn = {
  children: SnippetProps['children'];
  copied: boolean;
  copyAnnouncement: string | undefined;
  copyButtonProps: SnippetCopyButtonProps;
  copyButtonWrapperClassName: string;
  preProps: SnippetPreProps;
  preRef: MutableRefObject<HTMLPreElement | null>;
  rootProps: SnippetRootProps;
  showCopyButton: boolean;
  statusClassName: string;
};

export const useSnippet = ({
  children,
  size = 'md',
  rounded = 'md',
  className,
  color = 'default',
  variant = 'solid',
  disableCopy = false,
  onCopy,
  id,
  'aria-controls': ariaControls,
  'aria-label': ariaLabel,
  ...rootProps
}: SnippetProps): UseSnippetReturn => {
  const generatedId = useId();
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const contentId = ariaControls ?? (id ? `${id}-content` : `snippet-${generatedId}`);
  const copyLabel = ariaLabel ?? (copied ? 'Snippet copied' : 'Copy snippet');

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    },
    []
  );

  const handleCopy: MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
    if (disableCopy || !preRef.current || typeof navigator.clipboard?.writeText !== 'function') {
      return;
    }

    await navigator.clipboard.writeText(preRef.current.textContent ?? '');

    setCopied(true);
    onCopy?.();

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [disableCopy, onCopy]);

  return {
    children,
    copied,
    copyAnnouncement: copied ? 'Snippet copied to clipboard' : undefined,
    copyButtonProps: {
      'aria-controls': contentId,
      'aria-label': copyLabel,
      className: snippetCopyButtonClassName,
      icon: copied ? snippetCopyButtonIcons.success : snippetCopyButtonIcons.idle,
      onClick: handleCopy,
      size: snippetCopyButtonSizes[size],
      title: copyLabel,
      variant: 'ghost'
    },
    copyButtonWrapperClassName: snippetCopyButtonWrapperClassName,
    preProps: {
      className: snippetPreClassName,
      id: contentId
    },
    preRef,
    rootProps: {
      ...rootProps,
      className: cn(snippetBase({ size, rounded, variant, color }), className),
      id
    },
    showCopyButton: !disableCopy,
    statusClassName: snippetStatusClassName
  };
};

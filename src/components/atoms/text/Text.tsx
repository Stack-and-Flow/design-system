import type { TextProps } from './types';
import { useText } from './useText';

export const Text = (props: TextProps) => {
  const { tag, isHtml, sanitizedHtml, children, ...rest } = useText(props);
  const Component = tag ?? 'p';
  if (isHtml && typeof sanitizedHtml === 'string') {
    return (
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML input is sanitized in useText before rendering.
      <Component {...rest} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    );
  }

  return <Component {...rest}>{children}</Component>;
};

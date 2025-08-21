import type { FC } from 'react';
import type { HeaderProps } from './types';
import { useHeader } from './useHeader';

const Header: FC<HeaderProps> = ({ ...props }) => {
  const { tag, children, ...rest } = useHeader(props);
  const Component = tag ?? 'h1';
  return <Component {...rest}>{children}</Component>;
};

export default Header;

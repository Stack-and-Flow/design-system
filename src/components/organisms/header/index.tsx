import type { FC } from 'react';

const Header: FC = () => (
  <header
    className='w-full h-[60px] sm:h-[80px] py-0 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-[var(--z-navbar)] bg-[var(--color-navbar-light)] dark:bg-[var(--color-navbar-dark)] backdrop-blur-[16px] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)] border-b border-b-[var(--color-border-light)] dark:border-b-[var(--color-border-dark)]'
  >
    <nav />
  </header>
);

export default Header;

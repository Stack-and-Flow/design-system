import type { FC } from 'react';

const NavigationHeader: FC = () => (
  <header className='w-full h-[60px] sm:h-[80px] py-0 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-navbar bg-navbar-light dark:bg-navbar-dark backdrop-blur-[16px] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)] border-b border-b-border-light dark:border-b-border-dark'>
    <nav />
  </header>
);

export { NavigationHeader };

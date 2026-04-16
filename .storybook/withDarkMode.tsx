import type { Decorator } from '@storybook/react';
import React, { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { useTheme } from '../src/infrastructure/hooks/use-theme';

export const withDarkMode: Decorator = (Story) => {
  const isDark = useDarkMode();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    const bg = isDark ? '#060C13' : '#f4f5f7';
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
  }, [isDark, setTheme]);

  return (
    <div
      className='flex flex-row justify-center items-center w-full transition-colors duration-300 p-12'
      style={{
        minHeight: 'fit-content',
        background: isDark
          ? `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px) 0 0 / 40px 40px,
             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px) 0 0 / 40px 40px,
             #060C13`
          : `linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px) 0 0 / 40px 40px,
             linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px) 0 0 / 40px 40px,
             #f4f5f7`
      }}
    >
      <Story />
    </div>
  );
};

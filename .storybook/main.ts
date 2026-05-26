import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import _ from '../src/components/utils/types/safelist';

const config: StorybookConfig = {
  stories: ['./*.mdx', '../stories/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../src/assets'],
  addons: [
    '@storybook/addon-controls',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    },
    '@storybook/addon-interactions',
    'storybook-dark-mode',
    '@storybook/addon-docs',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      base: './',
      resolve: {
        tsconfig: './tsconfig.json'
      },
      server: {
        hmr: true
      },
      cache: false,
      build: {
        rollupOptions: {
          treeshake: false,
          output: {
            assetFileNames: (assetInfo: { name?: string }) => {
              if (assetInfo.name?.includes('preview') && assetInfo.name?.endsWith('.css')) {
                return 'assets/preview.css';
              }
              return assetInfo.name ? `assets/${assetInfo.name}` : 'assets/[name].[hash][extname]';
            }
          }
        }
      },
      css: {
        preprocessorOptions: {
          postcss: true // Asegúrate de que PostCSS esté habilitado
        }
      }
    });
  }
};
export default config;

import { ArgTypes } from '@storybook/addon-docs';
import { Description, Primary, Stories, Subtitle, Title } from '@storybook/blocks';
import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/global.css';
import withA11y from '@storybook/addon-a11y';
import theme from './theme';
import { withDarkMode } from './withDarkMode';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    options: {
      theme: theme,
      storySort: {
        order: ['Controls', 'Docs', 'Stories']
      }
    },
    darkMode: {
      stylePreview: true,
      dark: {
        class: 'dark',
        style: {
          backgroundColor: '#000000'
        }
      },
      light: {
        class: '',
        style: {
          backgroundColor: '#f4f5f7'
        }
      }
    },
    controls: {
      expanded: true
    },
    viewport: {
      viewports: {
        phonePortrait: {
          name: '[XS] Phone Portrait [default]',
          styles: {
            width: '500px',
            height: '100%'
          }
        },
        phoneLandscape: {
          name: '[XS] Phone Landscape [xsl]',
          styles: {
            width: '567px',
            height: '100%'
          }
        },
        tabletPortrait: {
          name: '[MD] Tablet Portrait [mdp]',
          styles: {
            width: '767px',
            height: '100%'
          }
        },
        tabletLandscape: {
          name: '[MD] Tablet Landscape [mdl]',
          styles: {
            width: '1024px',
            height: '100%'
          }
        },
        desktop: {
          name: '[LG] Desktop [lg]',
          styles: {
            width: '1440px',
            height: '100%'
          }
        }
      }
    },
    docs: {
      theme: theme,
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgTypes />
          <Stories />
        </>
      ),
      disableInjectedStyles: true
    },
    tags: ['autodocs'],
    viewMode: 'docs',
    decorators: [withDarkMode, withA11y]
  }
};

export default preview;

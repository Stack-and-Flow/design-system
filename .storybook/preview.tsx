import { ArgTypes } from '@storybook/addon-docs';
import { Description, Primary, Stories, Subtitle, Title } from '@storybook/blocks';
import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/global.css';
import theme from './theme';
import { withDarkMode } from './withDarkMode';

const preview: Preview = {
  initialGlobals: {
    darkMode: true
  },
  parameters: {
    darkMode: {
      dark: { ...theme },
      light: { ...theme },
      // Now we can safely use empty string for light mode (patch applied)
      darkClass: 'dark',
      lightClass: '',
      classTarget: 'html',
      stylePreview: true
    },
    actions: { argTypesRegex: '^on.*' },
    options: {
      theme: theme,
      storySort: {
        order: ['Controls', 'Docs', 'Stories']
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
    }
  }
};

preview.decorators = [withDarkMode];

export default preview;

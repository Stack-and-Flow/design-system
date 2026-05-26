const { checkA11y, configureAxe, injectAxe } = require('axe-playwright');

const config = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page) {
    await configureAxe(page, {
      rules: [
        // Disable color-contrast rule — tokens are under active review (issue #91)
        { id: 'color-contrast', enabled: false }
      ]
    });

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      }
    });
  }
};

module.exports = config;

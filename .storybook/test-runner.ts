import type { TestRunnerConfig } from '@storybook/test-runner'
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright'

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },

  async postVisit(page) {
    await configureAxe(page, {
      rules: [
        // Disable color-contrast rule — tokens are under active review (issue #91)
        { id: 'color-contrast', enabled: false },
      ],
    })

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    })
  },
}

export default config

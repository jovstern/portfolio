import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const routes = [
  { name: 'home', path: '/' },
  { name: 'project', path: '/projects/portfolio' },
]
const notFoundPath = '/projects/does-not-exist'

async function expectNoViolations(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
}

// Dark mode follows prefers-color-scheme, so each theme is a colour-scheme emulation.
for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`axe in ${colorScheme} mode`, () => {
    test.use({ colorScheme })

    for (const route of routes) {
      test(`${route.name} has no WCAG 2.2 AA violations`, async ({ page }) => {
        const response = await page.goto(route.path)
        expect(response?.status()).toBe(200)
        await expectNoViolations(page)
      })
    }

    test.describe('not found', () => {
      test.use({ allowDocument404: true })

      test('404 has no WCAG 2.2 AA violations', async ({ page }) => {
        const response = await page.goto(notFoundPath)
        expect(response?.status()).toBe(404)
        await expectNoViolations(page)
      })
    })
  })
}

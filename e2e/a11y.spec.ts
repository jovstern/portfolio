import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'

const routes = [
  { name: 'home', path: '/' },
  { name: 'project', path: '/projects/portfolio' },
  { name: '404', path: '/projects/does-not-exist' },
]

// Dark mode follows prefers-color-scheme, so each theme is a colour-scheme emulation.
for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`axe in ${colorScheme} mode`, () => {
    test.use({ colorScheme })

    for (const route of routes) {
      test(`${route.name} has no WCAG 2.2 AA violations`, async ({ page }) => {
        await page.goto(route.path)
        await page.evaluate(() => document.fonts.ready)
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
        expect(results.violations).toEqual([])
      })
    }
  })
}

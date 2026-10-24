import { expect, test } from './fixtures'

const widths = [360, 768, 1024, 1440]
// The fixture holds the longest title, summary and stack word (Review Focus #2).
const paths = ['/', '/projects/portfolio', '/projects/long-content-fixture']

for (const width of widths) {
  test.describe(`at ${width} px`, () => {
    test.use({ viewport: { width, height: 900 } })

    for (const path of paths) {
      test(`${path} has no horizontal scroll`, async ({ page }) => {
        await page.goto(path, { waitUntil: 'load' })
        await page.evaluate(() => document.fonts.ready)
        const { scrollWidth, innerWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }))
        expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
      })
    }
  })
}

test.describe('at 360×740', () => {
  test.use({ viewport: { width: 360, height: 740 } })

  test('the hero headline is fully visible above the fold', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport({ ratio: 1 })
  })
})

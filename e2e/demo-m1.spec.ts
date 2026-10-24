import { expect, test } from './fixtures'
import type { Page } from '@playwright/test'

// The milestone 1 demo (plan, "Demo flow"); recorded with DEMO=1 so fixtures are absent.
async function demoFlow(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.waitForTimeout(1000)

  await page.getByRole('link', { name: 'View projects', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)
  const grid = page.getByRole('list', { name: 'Projects' })
  await expect(grid).toBeInViewport()
  await page.waitForTimeout(1000)

  await grid.getByRole('link', { name: 'Portfolio', exact: true }).click()
  await expect(page).toHaveURL('/projects/portfolio')
  const main = page.getByRole('main')
  await expect(
    main.getByRole('heading', { level: 1, name: 'Portfolio', exact: true }),
  ).toBeVisible()
  await page.waitForTimeout(1000)

  // Scroll through the case study.
  await main.getByRole('heading', { level: 2 }).first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)

  await main.getByRole('link', { name: 'All projects', exact: true }).click()
  await expect(page).toHaveURL('/#projects')
  await expect(page.getByRole('list', { name: 'Projects' })).toBeVisible()
  await page.waitForTimeout(1000)
}

test('M1 demo: home → projects → Portfolio → back to the grid', async ({ page }) => {
  await demoFlow(page)
})

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('M1 demo at 390×844', async ({ page }) => {
    await demoFlow(page)
  })
})

import { expect, test } from './fixtures'

test('the home page has exactly one h1', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
})

test('"View projects" lands on the projects heading, below the sticky header', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'View projects', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)

  const heading = page.getByRole('heading', { name: 'Projects', exact: true })
  await expect(heading).toBeInViewport()
  // Scroll can still be settling after the hash jump; poll until the heading clears the header.
  await expect
    .poll(async () => {
      const headingBox = await heading.boundingBox()
      const headerBox = await page.getByRole('banner').boundingBox()
      if (!headingBox || !headerBox) return Number.NEGATIVE_INFINITY
      return headingBox.y - (headerBox.y + headerBox.height)
    })
    .toBeGreaterThanOrEqual(0)
})

test('the Portfolio card title opens its project page', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('list', { name: 'Projects' })
    .getByRole('link', { name: 'Portfolio', exact: true })
    .click()
  await expect(page).toHaveURL('/projects/portfolio')
  await expect(
    page.getByRole('main').getByRole('heading', { level: 1, name: 'Portfolio', exact: true }),
  ).toBeVisible()
})

import { expect, test } from './fixtures'

test('the home page has exactly one h1', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

test('the home page has a meta description', async ({ page }) => {
  await page.goto('/')
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description?.trim()).toBeTruthy()
})

test('a keyboard focus ring never flashes an outline', async ({ page }) => {
  await page.goto('/')
  const target = page.getByRole('link', { name: 'View projects', exact: true })
  // Tab through the page until the link has keyboard focus, so :focus-visible applies.
  for (let step = 0; step < 20; step++) {
    await page.keyboard.press('Tab')
    if (await target.evaluate((element) => element === document.activeElement)) break
  }
  await expect(target).toBeFocused()
  // Sampled straight after focus, inside the 150 ms colour transition: the outline that keeps
  // the ring visible in forced-colours mode must already be transparent.
  const outlineColor = await target.evaluate((element) => getComputedStyle(element).outlineColor)
  expect(outlineColor).toBe('rgba(0, 0, 0, 0)')
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

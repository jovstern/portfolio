import { expect, test } from './fixtures'

test('the project h1 matches the card title it was opened from', async ({ page }) => {
  await page.goto('/')
  const cardLink = page
    .getByRole('list', { name: 'Projects' })
    .getByRole('link', { name: 'Portfolio', exact: true })
  const cardTitle = (await cardLink.textContent())?.trim() ?? ''
  expect(cardTitle).not.toBe('')
  await cardLink.click()
  await expect(page).toHaveURL('/projects/portfolio')
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveText(cardTitle)
})

test('"All projects" returns to the projects grid', async ({ page }) => {
  await page.goto('/projects/portfolio')
  await page.getByRole('main').getByRole('link', { name: 'All projects', exact: true }).click()
  await expect(page).toHaveURL('/#projects')
  await expect(page.getByRole('list', { name: 'Projects' })).toBeVisible()
})

test('external links open in a new tab with rel noopener', async ({ page }) => {
  await page.goto('/projects/portfolio')
  const external = page.locator('a[target="_blank"]')
  const count = await external.count()
  expect(count).toBeGreaterThan(0)
  for (let index = 0; index < count; index++) {
    await expect(external.nth(index)).toHaveAttribute('rel', /\bnoopener\b/)
  }
  // Every off-site link opens in a new tab.
  const offSite = page.locator('a[href^="http"]:not([target="_blank"])')
  await expect(offSite).toHaveCount(0)
})

for (const path of ['/projects/does-not-exist', '/projects/Foo']) {
  test(`${path} responds 404 with the not-found page`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole('main').getByRole('heading', { level: 1, name: "This page doesn't exist" }),
    ).toBeVisible()
  })
}

test('a trailing slash redirects to the canonical project URL', async ({ page }) => {
  const response = await page.goto('/projects/portfolio/')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveURL('/projects/portfolio')
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible()
})

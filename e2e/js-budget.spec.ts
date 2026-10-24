import { gzipSync } from 'node:zlib'
import { expect, test } from './fixtures'

// Spec §9: first-load JS per route, gzip.
const BUDGET_BYTES = 180 * 1024

for (const path of ['/', '/projects/portfolio']) {
  test(`${path} loads at most 180 kB of gzipped JS`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'load' })
    const urls = await page.evaluate(() => {
      // nomodule scripts are legacy polyfills a modern browser never downloads.
      const scripts = Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[src]:not([nomodule])'),
      )
      const preloads = Array.from(
        document.querySelectorAll<HTMLLinkElement>(
          'link[rel="modulepreload"], link[rel="preload"][as="script"]',
        ),
      )
      return [...new Set([...scripts.map((s) => s.src), ...preloads.map((l) => l.href)])]
    })
    expect(urls.length).toBeGreaterThan(0)

    let total = 0
    for (const url of urls) {
      const response = await page.request.get(url, { headers: { 'accept-encoding': 'gzip' } })
      expect(response.ok(), url).toBe(true)
      const body = await response.body()
      // Playwright hands back the decoded body, so gzip it here whatever the server sent.
      total += gzipSync(body).length
    }

    const kB = (total / 1024).toFixed(1)
    test.info().annotations.push({
      type: 'js-budget',
      description: `${path}: ${kB} kB gzip across ${urls.length} scripts`,
    })
    expect(total).toBeLessThanOrEqual(BUDGET_BYTES)
  })
}

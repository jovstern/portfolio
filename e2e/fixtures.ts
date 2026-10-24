import { test as base, expect } from '@playwright/test'

// Every test fails on a browser console error or an uncaught exception, so runtime
// problems surface in the gates instead of in production.
export const test = base.extend({
  page: async ({ page }, runTest) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() !== 'error') return
      // Chrome logs a document's own 404 as a console error. A not-found page answering 404
      // is the intended behaviour (tests assert the status), so only that one is let through.
      const isDocument404 =
        message.text().includes('status of 404') && message.location().url === page.url()
      if (!isDocument404) problems.push(message.text())
    })
    page.on('pageerror', (error) => problems.push(error.message))
    await runTest(page)
    expect(problems, 'browser console errors').toEqual([])
  },
})

export { expect }

import { test as base, expect } from '@playwright/test'

type Options = {
  /**
   * Chrome logs a document's own 404 response as a console error. Tests that deliberately
   * visit a not-found page opt in with `test.use({ allowDocument404: true })`, so that one
   * message is let through; everywhere else it fails the test like any other error.
   */
  allowDocument404: boolean
}

// Every test fails on a browser console error or an uncaught exception, so runtime
// problems surface in the gates instead of in production.
export const test = base.extend<Options>({
  allowDocument404: [false, { option: true }],
  page: async ({ page, allowDocument404 }, runTest) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() !== 'error') return
      const isDocument404 =
        message.text().includes('status of 404') && message.location().url === page.url()
      if (allowDocument404 && isDocument404) return
      problems.push(message.text())
    })
    page.on('pageerror', (error) => problems.push(error.message))
    await runTest(page)
    expect(problems, 'browser console errors').toEqual([])
  },
})

export { expect }

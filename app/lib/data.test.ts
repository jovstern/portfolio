import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadProjects, type ContentReader } from './data'

const validMeta = {
  title: 'A project',
  summary: 'One sentence about the project.',
  stack: ['TypeScript'],
  cover: { src: '/cover.png', width: 1600, height: 1000 },
  coverAlt: 'A cover',
  repoUrl: 'https://github.com/ada/project',
  date: '2026-09',
}

function reader(entries: Record<string, unknown>): ContentReader {
  return {
    listSlugs: async () => Object.keys(entries),
    readMeta: async (_source, slug) => entries[slug],
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('loadProjects', () => {
  it('parses, filters and sorts the entries', async () => {
    const projects = await loadProjects(
      ['projects'],
      reader({
        older: { ...validMeta, date: '2026-01' },
        newer: validMeta,
        hidden: { ...validMeta, draft: true },
      }),
      'production',
    )
    expect(projects.map((project) => project.slug)).toEqual(['newer', 'older'])
  })

  it('throws a message that names the bad slug and the failing field, and logs it', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const load = loadProjects(
      ['projects'],
      reader({ good: validMeta, 'bad-entry': { ...validMeta, date: '2026-13' } }),
      undefined,
    )

    await expect(load).rejects.toThrow(/bad-entry[\s\S]*date/)
    expect(log).toHaveBeenCalledTimes(1)
  })
})

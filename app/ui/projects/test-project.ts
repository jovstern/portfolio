import type { Project } from '@/app/lib/definitions'

/** A project for unit tests, so they never depend on the real content. */
export function testProject(slug: string, overrides: Partial<Project> = {}): Project {
  return {
    slug,
    source: 'fixtures',
    title: `Project ${slug}`,
    summary: `The summary of ${slug}.`,
    stack: ['TypeScript', 'React'],
    cover: { src: '/cover.png', width: 1600, height: 1000 },
    coverAlt: `The ${slug} cover`,
    repoUrl: `https://github.com/ada/${slug}`,
    liveUrl: `https://${slug}.example.com`,
    date: '2026-01',
    draft: false,
    ...overrides,
  }
}

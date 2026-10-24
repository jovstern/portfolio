import { describe, expect, it } from 'vitest'
import type { Project } from './definitions'
import { adjacentProjects, filterPublished, sortProjects } from './utils'

function project(slug: string, overrides: Partial<Project> = {}): Project {
  return {
    slug,
    source: 'projects',
    title: slug,
    summary: 'A summary.',
    stack: ['TypeScript'],
    cover: { src: '/cover.png', width: 1600, height: 1000 },
    coverAlt: 'A cover',
    repoUrl: 'https://github.com/ada/project',
    date: '2026-01',
    draft: false,
    ...overrides,
  }
}

const slugs = (projects: Project[]) => projects.map((entry) => entry.slug)

describe('sortProjects', () => {
  it('puts the newest month first', () => {
    const sorted = sortProjects([
      project('march', { date: '2026-03' }),
      project('september', { date: '2026-09' }),
    ])
    expect(slugs(sorted)).toEqual(['september', 'march'])
  })

  it('breaks ties by title, A to Z', () => {
    const sorted = sortProjects([
      project('b', { title: 'Beta', date: '2026-03' }),
      project('a', { title: 'Alpha', date: '2026-03' }),
    ])
    expect(slugs(sorted)).toEqual(['a', 'b'])
  })

  it('does not change the list it is given', () => {
    const list = [project('march', { date: '2026-03' }), project('sept', { date: '2026-09' })]
    sortProjects(list)
    expect(slugs(list)).toEqual(['march', 'sept'])
  })
})

describe('filterPublished', () => {
  const list = [project('published'), project('draft', { draft: true })]

  it('drops drafts in production', () => {
    expect(slugs(filterPublished(list, 'production'))).toEqual(['published'])
  })

  it('keeps drafts in preview and outside Vercel', () => {
    expect(slugs(filterPublished(list, 'preview'))).toEqual(['published', 'draft'])
    expect(slugs(filterPublished(list, undefined))).toEqual(['published', 'draft'])
  })
})

describe('adjacentProjects', () => {
  const a = project('a')
  const b = project('b')
  const c = project('c')

  it('has no neighbours with one project', () => {
    expect(adjacentProjects([a], 'a')).toEqual({ previous: null, next: null })
  })

  it('does not wrap with two projects', () => {
    expect(adjacentProjects([a, b], 'a')).toEqual({ previous: null, next: b })
    expect(adjacentProjects([a, b], 'b')).toEqual({ previous: a, next: null })
  })

  it('wraps around with three or more projects', () => {
    expect(adjacentProjects([a, b, c], 'a')).toEqual({ previous: c, next: b })
    expect(adjacentProjects([a, b, c], 'c')).toEqual({ previous: b, next: a })
  })

  it('has no neighbours for an unknown slug', () => {
    expect(adjacentProjects([a, b, c], 'missing')).toEqual({ previous: null, next: null })
  })
})

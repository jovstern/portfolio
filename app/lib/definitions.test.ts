import { describe, expect, it } from 'vitest'
import { ProjectMetaSchema, SLUG_PATTERN, parseProject } from './definitions'

const validMeta = {
  title: 'A project',
  summary: 'One sentence about the project.',
  stack: ['Next.js', 'TypeScript'],
  cover: { src: '/_next/static/media/cover.png', width: 1600, height: 1000 },
  coverAlt: 'The home page of the project',
  repoUrl: 'https://github.com/ada/project',
  date: '2026-09',
}

describe('ProjectMetaSchema', () => {
  it('accepts a valid entry', () => {
    expect(ProjectMetaSchema.safeParse(validMeta).success).toBe(true)
  })

  it('rejects an http repo URL', () => {
    const result = ProjectMetaSchema.safeParse({ ...validMeta, repoUrl: 'http://github.com/a/b' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty stack', () => {
    expect(ProjectMetaSchema.safeParse({ ...validMeta, stack: [] }).success).toBe(false)
  })

  it('rejects 9 stack items', () => {
    const stack = Array.from({ length: 9 }, (_, index) => `Tool ${index}`)
    expect(ProjectMetaSchema.safeParse({ ...validMeta, stack }).success).toBe(false)
  })

  it('rejects a month that does not exist', () => {
    expect(ProjectMetaSchema.safeParse({ ...validMeta, date: '2026-13' }).success).toBe(false)
  })

  it('makes liveUrl and demo optional and defaults draft to false', () => {
    const result = ProjectMetaSchema.parse(validMeta)
    expect(result.liveUrl).toBeUndefined()
    expect(result.demo).toBeUndefined()
    expect(result.draft).toBe(false)
  })

  it('accepts a liveUrl and a demo', () => {
    const result = ProjectMetaSchema.safeParse({
      ...validMeta,
      liveUrl: 'https://project.example.com',
      demo: { mp4: '/media/demo.mp4', webm: '/media/demo.webm', poster: validMeta.cover },
    })
    expect(result.success).toBe(true)
  })
})

describe('SLUG_PATTERN', () => {
  it('accepts kebab-case and rejects anything else', () => {
    expect(SLUG_PATTERN.test('long-content-fixture')).toBe(true)
    expect(SLUG_PATTERN.test('Bad_Slug')).toBe(false)
    expect(SLUG_PATTERN.test('trailing-')).toBe(false)
  })
})

describe('parseProject', () => {
  it('returns the meta with its slug', () => {
    const project = parseProject('a-project', validMeta)
    expect(project.slug).toBe('a-project')
    expect(project.title).toBe('A project')
  })

  it('names the slug when the slug is invalid', () => {
    expect(() => parseProject('Bad_Slug', validMeta)).toThrow(/Bad_Slug/)
  })

  it('names the slug and the field when the meta is invalid', () => {
    const summary = 'a'.repeat(161)
    expect(() => parseProject('a-project', { ...validMeta, summary })).toThrow(
      /a-project[\s\S]*summary/,
    )
  })
})

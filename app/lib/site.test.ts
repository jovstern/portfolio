import { describe, expect, it } from 'vitest'
import { SiteSchema } from './definitions'
import { resolveSiteUrl, site } from './site'

const validSite = {
  name: 'Ada',
  role: 'Frontend engineer',
  location: 'London',
  url: 'https://example.com',
  email: 'ada@example.com',
  links: { github: 'https://github.com/ada', linkedin: 'https://www.linkedin.com/in/ada' },
  openToWork: true,
  hero: { greeting: 'Hi', headline: 'A headline', lead: 'A lead.' },
  projectsIntro: 'An intro.',
  projectsEmpty: 'Nothing yet.',
  notFound: 'Not here.',
  about: { paragraphs: ['A paragraph.'] },
  skills: [{ group: 'Languages', items: ['TypeScript'] }],
}

describe('site', () => {
  it('is valid site content', () => {
    expect(SiteSchema.safeParse(site).success).toBe(true)
  })
})

describe('SiteSchema', () => {
  it('accepts valid content', () => {
    expect(SiteSchema.safeParse(validSite).success).toBe(true)
  })

  it('rejects an http GitHub link', () => {
    const result = SiteSchema.safeParse({
      ...validSite,
      links: { ...validSite.links, github: 'http://github.com/ada' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(SiteSchema.safeParse({ ...validSite, email: 'ada-at-example' }).success).toBe(false)
  })

  it('accepts the local http fallback as the site url', () => {
    expect(SiteSchema.safeParse({ ...validSite, url: 'http://localhost:3100' }).success).toBe(true)
  })
})

describe('resolveSiteUrl', () => {
  it('prefers NEXT_PUBLIC_SITE_URL', () => {
    expect(
      resolveSiteUrl({ siteUrl: 'https://ada.dev', vercelProductionUrl: 'ada.vercel.app' }),
    ).toBe('https://ada.dev')
  })

  it('falls back to the Vercel production domain over https', () => {
    expect(resolveSiteUrl({ siteUrl: '', vercelProductionUrl: 'ada.vercel.app' })).toBe(
      'https://ada.vercel.app',
    )
  })

  it('falls back to localhost when neither is set', () => {
    expect(resolveSiteUrl({})).toBe('http://localhost:3100')
  })
})

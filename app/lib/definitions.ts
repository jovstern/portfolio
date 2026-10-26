import { z } from 'zod'

const text = z.string().trim().min(1)

// Every link in the content must be https; only the site's own url may fall back to local http.
const httpsUrl = z.url({ protocol: /^https$/ })

export const SiteSchema = z.object({
  name: text,
  role: text,
  location: text,
  url: z.url({ protocol: /^https?$/ }),
  email: z.email(),
  links: z.object({ github: httpsUrl, linkedin: httpsUrl }),
  openToWork: z.boolean(),
  hero: z.object({ greeting: text, headline: text, lead: text }),
  projectsIntro: text,
  /** Shown in place of the grid while there are no published projects. */
  projectsEmpty: text,
  /** The line under the 404 heading. */
  notFound: text,
  about: z.object({ paragraphs: z.array(text).min(1) }),
  skills: z.array(z.object({ group: text, items: z.array(text).min(1) })).min(1),
})

export type Site = z.infer<typeof SiteSchema>

/** A project's folder name: lower-case words joined by single hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// The shape of a static image import (`import cover from './cover.png'`), as next/image takes it.
const StaticImageSchema = z.object({
  src: z.string(),
  width: z.number(),
  height: z.number(),
  blurDataURL: z.string().optional(),
})

export const ProjectMetaSchema = z.object({
  title: text.max(60),
  summary: text.max(160),
  stack: z.array(text.max(24)).min(1).max(8),
  cover: StaticImageSchema,
  coverAlt: text.max(200),
  repoUrl: httpsUrl,
  liveUrl: httpsUrl.optional(),
  date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, 'Expected a month as YYYY-MM'),
  demo: z.object({ mp4: text, webm: text, poster: StaticImageSchema }).optional(),
  draft: z.boolean().default(false),
})

export type ProjectMeta = z.infer<typeof ProjectMetaSchema>

/** Where the entry's folder lives: real content, or test-only fixtures. */
export type ProjectSource = 'projects' | 'fixtures'

export type Project = ProjectMeta & { slug: string; source: ProjectSource }

/** Validates one entry's `meta` export; the message names the slug so a failed build says which. */
export function parseProject(
  slug: string,
  raw: unknown,
  source: ProjectSource = 'projects',
): Project {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `Invalid project slug "${slug}": use lower-case letters, digits and single hyphens.`,
    )
  }
  const result = ProjectMetaSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(`Invalid meta in project "${slug}":\n${z.prettifyError(result.error)}`)
  }
  return { ...result.data, slug, source }
}

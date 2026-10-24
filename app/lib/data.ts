import fs from 'node:fs/promises'
import path from 'node:path'
import { cacheLife } from 'next/cache'
import { parseProject, type Project, type ProjectSource } from '@/app/lib/definitions'
import { logger } from '@/app/lib/logger'
import { adjacentProjects, filterPublished, sortProjects } from '@/app/lib/utils'

async function listSlugs(source: ProjectSource): Promise<string[]> {
  const entries = await fs.readdir(path.join(process.cwd(), 'content', source), {
    withFileTypes: true,
  })
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

async function readProject(source: ProjectSource, slug: string): Promise<Project> {
  // A template-literal import is untyped; `meta` stays unknown until Zod has checked it.
  const entry: Record<string, unknown> = await import(`@/content/${source}/${slug}/index.mdx`)
  return parseProject(slug, entry.meta, source)
}

/** Every published project, newest first. Cached, so the result is part of the static build. */
export async function getProjects(): Promise<Project[]> {
  'use cache'
  cacheLife('max')

  // Fixtures are test-only content: the e2e server sets CONTENT_FIXTURES=1, nothing else does.
  const sources: ProjectSource[] =
    process.env.CONTENT_FIXTURES === '1' ? ['projects', 'fixtures'] : ['projects']

  try {
    const projects = await Promise.all(
      sources.map(async (source) => {
        const slugs = await listSlugs(source)
        return Promise.all(slugs.map((slug) => readProject(source, slug)))
      }),
    )
    return sortProjects(filterPublished(projects.flat(), process.env.VERCEL_ENV))
  } catch (error) {
    // Logged once here; a validation error's message names the slug and the field.
    logger.error('Could not load the projects', { sources }, error)
    throw new Error('Could not load the projects; see the log above for the entry that failed.')
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((project) => project.slug === slug) ?? null
}

export async function getAdjacentProjects(
  slug: string,
): Promise<{ previous: Project | null; next: Project | null }> {
  return adjacentProjects(await getProjects(), slug)
}

import fs from 'node:fs/promises'
import path from 'node:path'
import { cacheLife } from 'next/cache'
import { parseProject, type Project, type ProjectSource } from '@/app/lib/definitions'
import { logger } from '@/app/lib/logger'
import { adjacentProjects, filterPublished, sortProjects } from '@/app/lib/utils'

/** How entries are read; injected so the load-and-parse step can be tested without files. */
export type ContentReader = {
  listSlugs: (source: ProjectSource) => Promise<string[]>
  readMeta: (source: ProjectSource, slug: string) => Promise<unknown>
}

const contentReader: ContentReader = {
  async listSlugs(source) {
    const entries = await fs.readdir(path.join(process.cwd(), 'content', source), {
      withFileTypes: true,
    })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  },
  async readMeta(source, slug) {
    // A template-literal import is untyped; `meta` stays unknown until Zod has checked it.
    const entry: Record<string, unknown> = await import(`@/content/${source}/${slug}/index.mdx`)
    return entry.meta
  },
}

/** Reads, validates, filters and sorts every entry. A bad entry throws, failing the build. */
export async function loadProjects(
  sources: ProjectSource[],
  reader: ContentReader,
  vercelEnv: string | undefined,
): Promise<Project[]> {
  try {
    const projects = await Promise.all(
      sources.map(async (source) => {
        const slugs = await reader.listSlugs(source)
        return Promise.all(
          slugs.map(async (slug) =>
            parseProject(slug, await reader.readMeta(source, slug), source),
          ),
        )
      }),
    )
    return sortProjects(filterPublished(projects.flat(), vercelEnv))
  } catch (error) {
    logger.error('Could not load the projects', { sources }, error)
    // The message keeps the slug and the Zod issue: it is the headline of a failed build.
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`Could not load the projects. ${reason}`, { cause: error })
  }
}

/** Every published project, newest first. Cached, so the result is part of the static build. */
export async function getProjects(): Promise<Project[]> {
  'use cache'
  cacheLife('max')

  // Fixtures are test-only content: the e2e server sets CONTENT_FIXTURES=1, nothing else does.
  const sources: ProjectSource[] =
    process.env.CONTENT_FIXTURES === '1' ? ['projects', 'fixtures'] : ['projects']
  return loadProjects(sources, contentReader, process.env.VERCEL_ENV)
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

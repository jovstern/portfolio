import type { Project } from '@/app/lib/definitions'

/** Newest first (`YYYY-MM` sorts as text), then by title A to Z. */
export function sortProjects(projects: Project[]): Project[] {
  return projects.toSorted(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'en'),
  )
}

/** Drafts show in development and previews, never in production. */
export function filterPublished(projects: Project[], env: string | undefined): Project[] {
  return env === 'production' ? projects.filter((project) => !project.draft) : projects
}

/** Neighbours in list order; wraps around only from 3 projects up, where it never repeats one. */
export function adjacentProjects(
  projects: Project[],
  slug: string,
): { previous: Project | null; next: Project | null } {
  const index = projects.findIndex((project) => project.slug === slug)
  const count = projects.length
  if (index === -1) return { previous: null, next: null }
  if (count >= 3) {
    return {
      previous: projects[(index - 1 + count) % count],
      next: projects[(index + 1) % count],
    }
  }
  return { previous: projects[index - 1] ?? null, next: projects[index + 1] ?? null }
}

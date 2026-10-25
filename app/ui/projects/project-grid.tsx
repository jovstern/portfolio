import type { Project, Site } from '@/app/lib/definitions'
import ButtonLink from '@/app/ui/button-link'
import ProjectCard from '@/app/ui/projects/project-card'

type ProjectGridProps = {
  projects: Project[]
  site: Site
}

/** One column, two from md, three from xl. A last short row keeps its cards' width. */
export default function ProjectGrid({ projects, site }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 md:p-12">
        <p className="max-w-xl text-lead">{site.projectsEmpty}</p>
        <ButtonLink href={site.links.github} variant="secondary" external className="mt-6">
          GitHub
        </ButtonLink>
      </div>
    )
  }

  return (
    <ul aria-label="Projects" className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}

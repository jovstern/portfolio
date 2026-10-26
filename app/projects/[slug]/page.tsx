import type { MDXContent } from 'mdx/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAdjacentProjects, getProject, getProjects } from '@/app/lib/data'
import Container from '@/app/ui/container'
import ProjectHeader from '@/app/ui/projects/project-header'
import ProjectMedia from '@/app/ui/projects/project-media'
import ProjectNav from '@/app/ui/projects/project-nav'

// Every project page is part of the static build; nothing renders per request.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()
  return { title: project.title, description: project.summary }
}

export default async function Page({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const [project, { previous, next }] = await Promise.all([
    getProject(slug),
    getAdjacentProjects(slug),
  ])
  if (!project) notFound()

  // The component is imported here, not in data.ts: a component can't be stored in a cache.
  const { default: CaseStudy }: { default: MDXContent } = await import(
    `@/content/${project.source}/${project.slug}/index.mdx`
  )

  return (
    <Container as="article" className="py-section">
      <ProjectHeader project={project} />
      <div className="mt-12 lg:mt-16">
        <ProjectMedia project={project} />
      </div>
      <div className="mt-16 max-w-narrow lg:mt-20">
        <CaseStudy />
      </div>
      {previous || next ? (
        <div className="mt-16 border-t border-border pt-10 lg:mt-20">
          <ProjectNav previous={previous} next={next} />
        </div>
      ) : null}
    </Container>
  )
}

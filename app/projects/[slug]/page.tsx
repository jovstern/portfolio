import type { MDXContent } from 'mdx/types'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/app/lib/data'
import Container from '@/app/ui/container'

// Every project page is part of the static build; nothing renders per request.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function Page({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  // The component is imported here, not in data.ts: a component can't be stored in a cache.
  const { default: CaseStudy }: { default: MDXContent } = await import(
    `@/content/${project.source}/${project.slug}/index.mdx`
  )

  return (
    <Container as="article" className="py-section">
      <div className="max-w-[44rem]">
        <h1 className="text-h2 wrap-break-word">{project.title}</h1>
        <div className="mt-10">
          <CaseStudy />
        </div>
      </div>
    </Container>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/app/lib/definitions'
import ExternalLink from '@/app/ui/external-link'
import StackList from '@/app/ui/projects/stack-list'

const actionLink =
  'relative z-10 inline-flex h-11 items-center gap-1 rounded-sm px-3 text-small font-medium text-text transition-[background-color] hover:bg-surface active:bg-border'

type ProjectCardProps = { project: Project }

/**
 * Spec §6, Home (2). The title link is stretched over the card with `::after`; Live and Code
 * sit above it. The title link's own ring moves to the whole card.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-border p-2 transition-[border-color] hover:border-border-strong has-[a[data-card-link]:focus-visible]:shadow-focus">
      <div className="aspect-16/10 overflow-hidden rounded-md bg-surface">
        <Image
          src={project.cover}
          alt={project.coverAlt}
          sizes="(min-width: 768px) 34rem, 100vw"
          placeholder={project.cover.blurDataURL ? 'blur' : 'empty'}
          // Filter, not an overlay: an overlay token would dim in light but brighten in dark.
          className="size-full object-cover transition-[filter] group-hover:brightness-96"
        />
      </div>
      <div className="flex grow flex-col px-3 pt-5 pb-2">
        <h3 className="text-h3">
          <Link
            href={`/projects/${project.slug}`}
            data-card-link
            className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover:decoration-current after:absolute after:inset-0 after:rounded-lg focus-visible:shadow-none"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2">{project.summary}</p>
        <div className="mt-3">
          <StackList stack={project.stack} />
        </div>
        <div className="-ms-3 mt-auto flex gap-1 pt-4">
          {project.liveUrl ? (
            <ExternalLink
              href={project.liveUrl}
              aria-label={`Live site for ${project.title}`}
              className={actionLink}
            >
              Live
            </ExternalLink>
          ) : null}
          <ExternalLink
            href={project.repoUrl}
            aria-label={`Code for ${project.title}`}
            className={actionLink}
          >
            Code
          </ExternalLink>
        </div>
      </div>
    </article>
  )
}

import { ArrowLeftIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import type { Project } from '@/app/lib/definitions'
import ButtonLink from '@/app/ui/button-link'
import StackList from '@/app/ui/projects/stack-list'

type ProjectHeaderProps = { project: Project }

/** Spec §6, Project: back link, title, summary, then the actions and the stack. */
export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="max-w-narrow">
      <Link
        href="/#projects"
        className="-ms-2 inline-flex h-11 items-center gap-1.5 rounded-sm px-2 text-small font-medium text-muted transition-colors hover:text-text active:text-body"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        All projects
      </Link>
      <h1 className="mt-6 text-h2 wrap-break-word">{project.title}</h1>
      <p className="mt-5 text-lead wrap-break-word text-body">{project.summary}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {/* One primary per view: the live site when there is one, otherwise the code. */}
        {project.liveUrl ? (
          <ButtonLink href={project.liveUrl} variant="primary" external>
            Visit live site
          </ButtonLink>
        ) : null}
        <ButtonLink
          href={project.repoUrl}
          variant={project.liveUrl ? 'secondary' : 'primary'}
          external
        >
          View code
        </ButtonLink>
      </div>
      <div className="mt-6">
        <StackList stack={project.stack} />
      </div>
    </header>
  )
}

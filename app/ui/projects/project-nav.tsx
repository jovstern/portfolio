import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import Link from 'next/link'
import type { Project } from '@/app/lib/definitions'

type ProjectNavProps = { previous: Project | null; next: Project | null }

/** Compact previous and next links: a muted label above the title, not full cards. */
export default function ProjectNav({ previous, next }: ProjectNavProps) {
  const links = [
    previous ? { project: previous, label: 'Previous', isNext: false } : null,
    next ? { project: next, label: 'Next', isNext: true } : null,
  ].filter((link) => link !== null)

  if (links.length === 0) return null

  return (
    <nav aria-label="More projects" className="grid gap-4 lg:grid-cols-2 lg:gap-10">
      {links.map(({ project, label, isNext }) => (
        <Link
          key={label}
          href={`/projects/${project.slug}`}
          className={clsx(
            'group flex flex-col gap-1 rounded-lg border border-border px-5 py-4 transition-colors hover:border-border-strong active:bg-surface',
            isNext && 'lg:col-start-2 lg:items-end lg:text-end',
          )}
        >
          {/* The name reads "Previous project: <title>"; the spaces sit outside the spans. */}
          <span className="inline-flex items-center gap-1.5 text-small text-muted">
            {isNext ? null : <ArrowLeftIcon aria-hidden="true" className="size-4" />}
            {label} <span className="sr-only">project:</span>
            {isNext ? <ArrowRightIcon aria-hidden="true" className="size-4" /> : null}
          </span>{' '}
          <span className="text-h3 wrap-break-word text-text underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover:decoration-current">
            {project.title}
          </span>
        </Link>
      ))}
    </nav>
  )
}

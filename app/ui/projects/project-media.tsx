import Image from 'next/image'
import type { Project } from '@/app/lib/definitions'

type ProjectMediaProps = { project: Project }

/** The cover at its own aspect ratio, as wide as the page column. */
export default function ProjectMedia({ project }: ProjectMediaProps) {
  return (
    <div className="overflow-hidden rounded-md bg-surface">
      <Image
        src={project.cover}
        alt={project.coverAlt}
        sizes="(min-width: 1152px) 72rem, 100vw"
        placeholder={project.cover.blurDataURL ? 'blur' : 'empty'}
        // The largest element above the fold on wide screens, so it should not wait to load.
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full"
      />
    </div>
  )
}

import { EnvelopeIcon } from '@heroicons/react/20/solid'
import type { Site } from '@/app/lib/definitions'
import ButtonLink from '@/app/ui/button-link'
import Container from '@/app/ui/container'
import ExternalLink from '@/app/ui/external-link'
import Portrait from '@/app/ui/home/portrait'
import StatusPill from '@/app/ui/home/status-pill'
import { GitHubIcon } from '@/app/ui/icons'

const iconLink =
  'inline-flex size-11 items-center justify-center gap-1 rounded-sm text-muted transition-colors hover:bg-surface hover:text-text active:bg-border'

export default function Hero({ site }: { site: Site }) {
  return (
    <Container
      as="section"
      className="grid gap-16 py-section lg:grid-cols-12 lg:items-center lg:gap-10"
    >
      <div className="lg:col-span-7">
        {site.openToWork ? <StatusPill /> : null}
        <p className="mt-6 text-lead text-muted">{site.hero.greeting}</p>
        <h1 className="mt-3 text-display lg:text-display-hero">{site.hero.headline}</h1>
        <p className="mt-6 max-w-xl text-lead text-body">{site.hero.lead}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="#projects" variant="primary">
            View projects
          </ButtonLink>
          <ButtonLink href={site.links.linkedin} variant="secondary" external>
            LinkedIn / CV
          </ButtonLink>
        </div>
        <div className="-ms-0.5 mt-6 flex gap-1">
          <ExternalLink href={site.links.github} aria-label="GitHub" className={iconLink}>
            <GitHubIcon className="size-5" />
          </ExternalLink>
          <a href={`mailto:${site.email}`} aria-label={`Email ${site.name}`} className={iconLink}>
            <EnvelopeIcon aria-hidden="true" className="size-5" />
          </a>
        </div>
      </div>
      <div className="lg:col-span-5">
        <Portrait name={site.name} />
      </div>
    </Container>
  )
}

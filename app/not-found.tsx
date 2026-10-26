import type { Metadata } from 'next'
import { site } from '@/app/lib/site'
import ButtonLink from '@/app/ui/button-link'
import Container from '@/app/ui/container'

export const metadata: Metadata = { title: 'Page not found' }

/** The 404 for unknown URLs and for `notFound()`, inside the shell: a way back, nothing else. */
export default function NotFound() {
  return (
    <Container className="py-section">
      <div className="max-w-narrow">
        <p className="text-small font-medium text-muted">404</p>
        <h1 className="mt-3 text-h2">This page doesn&apos;t exist</h1>
        <p className="mt-5 text-lead text-body">{site.notFound}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="primary">
            Home
          </ButtonLink>
          <ButtonLink href="/#projects" variant="secondary">
            Projects
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}

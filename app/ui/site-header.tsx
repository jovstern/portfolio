import { EnvelopeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { site } from '@/app/lib/site'
import ButtonLink from '@/app/ui/button-link'
import Container from '@/app/ui/container'
import ExternalLink from '@/app/ui/external-link'
import { GitHubIcon, LinkedInIcon } from '@/app/ui/icons'

const navLinks = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#about', label: 'About' },
]

const iconLink =
  'inline-flex h-11 items-center gap-0.5 rounded-sm px-2.5 text-small text-muted transition-colors hover:text-text active:text-body'

// Row heights here (h-16, plus the h-11 nav row on phones) are what --header-height in
// globals.css mirrors for scroll-padding-top.
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <Container className="flex flex-wrap items-center">
        <div className="flex h-16 items-center">
          <Link
            href="/"
            className="-ms-2 inline-flex h-11 items-center rounded-sm px-2 text-h3 font-medium text-text transition-colors hover:text-body"
          >
            {site.name}
          </Link>
        </div>

        <nav aria-label="Main" className="order-last w-full sm:order-none sm:ms-6 sm:w-auto">
          <ul className="-ms-3 flex h-11 items-center sm:ms-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-sm px-3 text-small font-medium text-body transition-colors hover:text-text active:text-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <ExternalLink href={site.links.github} aria-label="GitHub" className={iconLink}>
            <GitHubIcon className="size-5" />
          </ExternalLink>
          <ExternalLink href={site.links.linkedin} aria-label="LinkedIn" className={iconLink}>
            <LinkedInIcon className="size-5" />
          </ExternalLink>
          <ButtonLink
            href={`mailto:${site.email}`}
            variant="primary"
            className="ms-1 max-sm:w-11 max-sm:px-0"
          >
            <EnvelopeIcon aria-hidden="true" className="size-5 sm:hidden" />
            <span className="max-sm:sr-only">Email me</span>
          </ButtonLink>
        </div>
      </Container>
    </header>
  )
}

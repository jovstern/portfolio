import { EnvelopeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { site } from '@/app/lib/site'
import ButtonLink from '@/app/ui/button-link'
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
    <header className="border-border bg-bg sticky top-0 z-40 border-b">
      <div className="max-w-page mx-auto flex flex-wrap items-center px-5 md:px-8 lg:px-10">
        <div className="flex h-16 items-center">
          <Link
            href="/"
            className="text-h3 text-text hover:text-body -ms-2 inline-flex h-11 items-center rounded-sm px-2 font-medium transition-colors"
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
                  className="text-small text-body hover:text-text active:text-muted inline-flex h-11 items-center rounded-sm px-3 font-medium transition-colors"
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
      </div>
    </header>
  )
}

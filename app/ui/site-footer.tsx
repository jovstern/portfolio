import { site } from '@/app/lib/site'
import Container from '@/app/ui/container'
import ExternalLink from '@/app/ui/external-link'
import { GitHubIcon, LinkedInIcon } from '@/app/ui/icons'

const socialLink =
  'inline-flex h-11 items-center gap-2 rounded-sm px-3 text-small font-medium text-body transition-colors hover:bg-surface hover:text-text active:bg-border'

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border">
      <Container className="py-section">
        <h2 className="text-h2">Let&apos;s talk</h2>
        <a
          href={`mailto:${site.email}`}
          className="mt-6 inline-flex min-h-11 items-center rounded-sm text-lead font-medium break-all text-text underline decoration-border-strong underline-offset-6 transition-colors hover:decoration-text active:text-body"
        >
          {site.email}
        </a>
        <ul className="-ms-3 mt-6 flex flex-wrap gap-2">
          <li>
            <ExternalLink href={site.links.linkedin} className={socialLink}>
              <LinkedInIcon className="size-5" />
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={site.links.github} className={socialLink}>
              <GitHubIcon className="size-5" />
              GitHub
            </ExternalLink>
          </li>
        </ul>
      </Container>
    </footer>
  )
}

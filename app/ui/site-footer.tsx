import { site } from '@/app/lib/site'
import ExternalLink from '@/app/ui/external-link'
import { GitHubIcon, LinkedInIcon } from '@/app/ui/icons'

const socialLink =
  'inline-flex h-11 items-center gap-2 rounded-sm px-3 text-small font-medium text-body transition-colors hover:bg-surface hover:text-text active:bg-border'

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-border border-t">
      <div className="max-w-page py-section mx-auto px-5 md:px-8 lg:px-10">
        <h2 className="text-h2">Let&apos;s talk</h2>
        <a
          href={`mailto:${site.email}`}
          className="text-lead text-text decoration-border-strong hover:decoration-text active:text-body mt-6 inline-flex min-h-11 items-center rounded-sm font-medium break-all underline underline-offset-6 transition-colors"
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
      </div>
    </footer>
  )
}

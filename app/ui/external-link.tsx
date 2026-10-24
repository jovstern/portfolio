import { ArrowUpRightIcon } from '@heroicons/react/16/solid'
import type { ComponentProps } from 'react'

const NEW_TAB = '(opens in a new tab)'

// Every off-site link opens in a new tab with the same rel, so those two are not props.
type ExternalLinkProps = Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> & {
  href: string
  /** For icon-only links; the new-tab notice is appended to it. */
  'aria-label'?: string
}

export default function ExternalLink({
  href,
  children,
  'aria-label': ariaLabel,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ? `${ariaLabel} ${NEW_TAB}` : undefined}
    >
      {children}
      {/* The notice and its space come before the arrow, so nothing visible follows it. The
          space stays a bare text node: accessible-name algorithms trim each element's text,
          so inside the span it would be lost. In a flex link it collapses; in prose it is the
          gap before the arrow. */}
      {ariaLabel ? null : (
        <>
          {' '}
          <span className="sr-only">{NEW_TAB}</span>
        </>
      )}
      <ArrowUpRightIcon aria-hidden="true" className="inline-block size-[1em] shrink-0" />
    </a>
  )
}

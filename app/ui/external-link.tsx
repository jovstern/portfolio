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
      {/* The notice and its space sit with the arrow in one nowrap span, so the arrow never
          wraps onto a line of its own and nothing visible follows it. In a flex link the
          leading space collapses; in prose it is the gap before the arrow. */}
      <span className="whitespace-nowrap">
        {ariaLabel ? null : (
          <>
            {' '}
            <span className="sr-only">{NEW_TAB}</span>
          </>
        )}
        {/* Inline now (not a flex item), so it is lowered by hand onto the label's centre. */}
        <ArrowUpRightIcon aria-hidden="true" className="inline-block size-[1em] align-[-0.125em]" />
      </span>
    </a>
  )
}

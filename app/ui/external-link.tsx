import { ArrowUpRightIcon } from '@heroicons/react/16/solid'

const NEW_TAB = '(opens in a new tab)'

type ExternalLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  /** For icon-only links; the new-tab notice is appended to it. */
  'aria-label'?: string
}

export default function ExternalLink({
  href,
  children,
  className,
  'aria-label': ariaLabel,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel ? `${ariaLabel} ${NEW_TAB}` : undefined}
    >
      {children}
      <ArrowUpRightIcon aria-hidden="true" className="inline-block size-[1em] shrink-0" />
      {/* The space sits outside the span so every accessible-name algorithm keeps it. */}
      {ariaLabel ? null : (
        <>
          {' '}
          <span className="sr-only">{NEW_TAB}</span>
        </>
      )}
    </a>
  )
}

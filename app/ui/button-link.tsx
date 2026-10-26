import clsx from 'clsx'
import Link from 'next/link'
import ExternalLink from '@/app/ui/external-link'

type ButtonLinkProps = {
  href: string
  variant: 'primary' | 'secondary'
  /** Opens in a new tab, with the visible ↗ and the screen-reader notice. */
  external?: boolean
  children: React.ReactNode
  className?: string
}

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary/85 active:bg-primary/75',
  secondary: 'bg-surface text-text hover:bg-border active:bg-border-strong',
}

export default function ButtonLink({
  href,
  variant,
  external = false,
  children,
  className,
}: ButtonLinkProps) {
  const classes = clsx(
    'inline-flex h-11 items-center justify-center gap-1 rounded-sm px-4 text-small font-medium transition-colors',
    variants[variant],
    className,
  )

  if (external) {
    return (
      <ExternalLink href={href} className={classes}>
        {children}
      </ExternalLink>
    )
  }

  // next/link only for routes inside the app; mailto: and the like stay plain anchors.
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  )
}

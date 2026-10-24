import clsx from 'clsx'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import ExternalLink from '@/app/ui/external-link'

const link =
  'rounded-sm font-medium text-accent underline decoration-1 underline-offset-4 transition-colors hover:text-accent-hover active:text-text'

function Anchor({ href = '', className, children, ...props }: ComponentProps<'a'>) {
  const classes = clsx(link, className)
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (/^https?:\/\//.test(href)) {
    return (
      <ExternalLink href={href} className={classes}>
        {children}
      </ExternalLink>
    )
  }
  // mailto: and the like stay plain anchors.
  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  )
}

const components = {
  h2: ({ className, ...props }) => (
    <h2 className={clsx('mt-12 text-h3 wrap-break-word first:mt-0', className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={clsx('mt-8 text-base wrap-break-word first:mt-0', className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={clsx('mt-4 wrap-break-word first:mt-0', className)} {...props} />
  ),
  a: Anchor,
  ul: ({ className, ...props }) => (
    <ul
      className={clsx('mt-4 list-disc space-y-2 ps-6 marker:text-muted first:mt-0', className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={clsx('mt-4 list-decimal space-y-2 ps-6 marker:text-muted first:mt-0', className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={clsx('ps-1 wrap-break-word', className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code
      className={clsx(
        'rounded-sm bg-surface px-1.5 py-0.5 font-mono text-[0.9em] wrap-break-word text-text',
        className,
      )}
      {...props}
    />
  ),
  // Focusable so a keyboard can scroll a long line; the inner code drops its inline chip.
  pre: ({ className, ...props }) => (
    <pre
      tabIndex={0}
      className={clsx(
        'mt-6 overflow-x-auto rounded-md bg-surface p-5 font-mono text-small text-text first:mt-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em]',
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={clsx(
        'mt-6 border-s-2 border-border-strong ps-5 wrap-break-word text-muted first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  // A wide table scrolls inside its own region, never the page.
  table: ({ className, ...props }) => (
    <div
      role="region"
      aria-label="Table"
      tabIndex={0}
      className="mt-6 overflow-x-auto rounded-sm first:mt-0"
    >
      <table className={clsx('w-full border-collapse text-small', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={clsx(
        'border-b border-border-strong py-2 pe-4 text-start align-bottom font-medium text-text',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td className={clsx('border-b border-border py-2 pe-4 align-top', className)} {...props} />
  ),
  // Markdown images (`![]()`) have no size, so they would shift the layout and skip AVIF/WebP.
  img: () => {
    throw new Error(
      'Markdown images are not supported. Use an imported image with <Image>; see docs/project-template.mdx.',
    )
  },
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}

import { render, screen } from '@testing-library/react'
import type { ComponentType } from 'react'
import { describe, expect, it } from 'vitest'
// Not a hook in practice: it returns a constant map, so a plain alias reads it once.
import { useMDXComponents as getMDXComponents } from '@/mdx-components'

const Anchor = getMDXComponents().a as ComponentType<React.ComponentProps<'a'>>

describe('MDX links', () => {
  it('keeps same-origin paths in the tab', () => {
    render(<Anchor href="/projects/portfolio">Portfolio</Anchor>)
    expect(screen.getByRole('link', { name: 'Portfolio' })).not.toHaveAttribute('target')
  })

  it('treats protocol-relative URLs as off-site', () => {
    render(<Anchor href="//example.com/page">Example</Anchor>)
    expect(screen.getByRole('link', { name: 'Example (opens in a new tab)' })).toHaveAttribute(
      'target',
      '_blank',
    )
  })

  it('passes anchor attributes through to off-site links', () => {
    render(
      <Anchor href="https://example.com" title="Example site">
        Example
      </Anchor>,
    )
    expect(screen.getByRole('link', { name: 'Example (opens in a new tab)' })).toHaveAttribute(
      'title',
      'Example site',
    )
  })
})

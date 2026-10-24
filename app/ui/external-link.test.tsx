import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExternalLink from './external-link'

describe('ExternalLink', () => {
  it('opens in a new tab and says so in its accessible name', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>)
    const link = screen.getByRole('link', { name: 'Example (opens in a new tab)' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('ends with the arrow, so no visible space trails it before punctuation', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>)
    const link = screen.getByRole('link')
    expect(link.lastChild?.nodeName.toLowerCase()).toBe('svg')
  })

  it('passes other anchor attributes through', () => {
    render(
      <ExternalLink href="https://example.com" title="Example site" hrefLang="en">
        Example
      </ExternalLink>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('title', 'Example site')
    expect(link).toHaveAttribute('hreflang', 'en')
  })
})

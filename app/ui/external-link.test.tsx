import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExternalLink from './external-link'
import { newTabName } from '@/app/ui/test-names'

describe('ExternalLink', () => {
  it('opens in a new tab and says so in its accessible name', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>)
    const link = screen.getByRole('link', { name: newTabName('Example') })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('keeps the arrow with its text and lets nothing visible follow it', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>)
    const link = screen.getByRole('link')
    // The gap, the notice and the arrow share one nowrap span, so the arrow never wraps alone.
    const glue = link.lastElementChild
    expect(glue).toHaveClass('whitespace-nowrap')
    expect(glue?.lastChild?.nodeName.toLowerCase()).toBe('svg')
    // The arrow is the last node, so no regular space trails it before punctuation.
    expect(link.textContent).toBe('Example (opens in a new tab)')
    expect(link.textContent).not.toMatch(/\s$/)
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

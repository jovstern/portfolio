import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { site } from '@/app/lib/site'
import SiteFooter from './site-footer'
import { newTabName } from '@/app/ui/test-names'

describe('SiteFooter', () => {
  it('is the contact landmark with a "Let\'s talk" heading', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('contentinfo')).toHaveAttribute('id', 'contact')
    expect(screen.getByRole('heading', { level: 2, name: "Let's talk" })).toBeInTheDocument()
  })

  it('links the email address as a mailto link', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    )
  })

  it('opens LinkedIn and GitHub in a new tab', () => {
    render(<SiteFooter />)
    const linkedin = screen.getByRole('link', { name: newTabName('LinkedIn') })
    const github = screen.getByRole('link', { name: newTabName('GitHub') })
    expect(linkedin).toHaveAttribute('href', site.links.linkedin)
    expect(github).toHaveAttribute('href', site.links.github)
    for (const link of [linkedin, github]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})

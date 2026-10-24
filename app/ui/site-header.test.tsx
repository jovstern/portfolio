import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { site } from '@/app/lib/site'
import SiteHeader from './site-header'

describe('SiteHeader', () => {
  it('links the wordmark home', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('link', { name: site.name })).toHaveAttribute('href', '/')
  })

  it('has Projects and About in the main navigation', () => {
    render(<SiteHeader />)
    const nav = within(screen.getByRole('navigation', { name: 'Main' }))
    expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects')
    expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
  })

  it('names the icon-only GitHub and LinkedIn links and opens them in a new tab', () => {
    render(<SiteHeader />)
    const github = screen.getByRole('link', { name: 'GitHub (opens in a new tab)' })
    const linkedin = screen.getByRole('link', { name: 'LinkedIn (opens in a new tab)' })
    expect(github).toHaveAttribute('href', site.links.github)
    expect(linkedin).toHaveAttribute('href', site.links.linkedin)
    for (const link of [github, linkedin]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('has an Email me link to the email address', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    )
  })
})

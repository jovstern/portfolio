import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './hero'
import { testSite } from './test-site'

describe('Hero', () => {
  it('has one h1 with the headline', () => {
    render(<Hero site={testSite} />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(testSite.hero.headline)
  })

  it('shows the status pill when open to work', () => {
    render(<Hero site={testSite} />)
    expect(screen.getByText('Open to new roles')).toBeInTheDocument()
  })

  it('hides the status pill when not open to work', () => {
    render(<Hero site={{ ...testSite, openToWork: false }} />)
    expect(screen.queryByText('Open to new roles')).not.toBeInTheDocument()
  })

  it('links "View projects" to the projects section', () => {
    render(<Hero site={testSite} />)
    expect(screen.getByRole('link', { name: 'View projects' })).toHaveAttribute('href', '#projects')
  })

  it('has an "Email me" link to the email address, in the same tab', () => {
    render(<Hero site={testSite} />)
    const link = screen.getByRole('link', { name: 'Email me' })
    expect(link).toHaveAttribute('href', `mailto:${testSite.email}`)
    expect(link).not.toHaveAttribute('target')
  })

  it('shows the portrait as a named image', () => {
    render(<Hero site={testSite} />)
    const portrait = screen.getByRole('img')
    expect(portrait).toHaveAccessibleName(expect.stringContaining(testSite.name))
  })
})

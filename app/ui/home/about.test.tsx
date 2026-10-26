import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import About from './about'
import { testSite } from './test-site'

describe('About', () => {
  it('is the #about section with an "About" h2', () => {
    render(<About site={testSite} />)
    const heading = screen.getByRole('heading', { level: 2, name: 'About' })
    expect(heading.closest('section')).toHaveAttribute('id', 'about')
  })

  it('shows every bio paragraph', () => {
    render(<About site={testSite} />)
    for (const paragraph of testSite.about.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectNav from './project-nav'
import { testProject } from './test-project'

const previous = testProject('alpha')
const next = testProject('beta')

describe('ProjectNav', () => {
  it('links to the previous and next projects by title', () => {
    render(<ProjectNav previous={previous} next={next} />)
    const nav = screen.getByRole('navigation', { name: 'More projects' })
    const previousLink = screen.getByRole('link', { name: `Previous project: ${previous.title}` })
    const nextLink = screen.getByRole('link', { name: `Next project: ${next.title}` })
    expect(nav).toContainElement(previousLink)
    expect(nav).toContainElement(nextLink)
    expect(previousLink).toHaveAttribute('href', `/projects/${previous.slug}`)
    expect(nextLink).toHaveAttribute('href', `/projects/${next.slug}`)
  })

  it('shows only the side that exists', () => {
    render(<ProjectNav previous={null} next={next} />)
    expect(screen.queryByRole('link', { name: /^Previous project:/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: `Next project: ${next.title}` })).toBeInTheDocument()
  })

  it('renders nothing when there is no other project', () => {
    const { container } = render(<ProjectNav previous={null} next={null} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })
})

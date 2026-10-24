import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { testSite } from '@/app/ui/home/test-site'
import ProjectGrid from './project-grid'
import { testProject } from './test-project'

describe('ProjectGrid', () => {
  it('shows the empty state with a GitHub link, and no list, when there are no projects', () => {
    render(<ProjectGrid projects={[]} site={testSite} />)
    expect(screen.getByText(testSite.projectsEmpty)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub (opens in a new tab)' })).toHaveAttribute(
      'href',
      testSite.links.github,
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('renders one list item per project, in the given order', () => {
    const projects = [testProject('gamma'), testProject('alpha'), testProject('beta')]
    render(<ProjectGrid projects={projects} site={testSite} />)
    const grid = screen.getByRole('list', { name: 'Projects' })
    // Only the grid's own items: each card holds its own stack list.
    const cards = within(grid)
      .getAllByRole('listitem')
      .filter((item) => item.parentElement === grid)
    expect(cards).toHaveLength(3)
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(projects.map((project) => project.title))
  })
})

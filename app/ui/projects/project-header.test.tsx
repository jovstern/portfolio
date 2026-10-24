import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectHeader from './project-header'
import { newTabName } from '@/app/ui/test-names'
import { testProject } from './test-project'

const project = testProject('alpha')

describe('ProjectHeader', () => {
  it('has the title as the h1 and shows the summary', () => {
    render(<ProjectHeader project={project} />)
    expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeInTheDocument()
    expect(screen.getByText(project.summary)).toBeInTheDocument()
  })

  it('makes "Visit live site" the primary action and code the secondary', () => {
    render(<ProjectHeader project={project} />)
    const live = screen.getByRole('link', { name: newTabName('Visit live site') })
    const code = screen.getByRole('link', { name: newTabName('View code') })
    expect(live).toHaveAttribute('href', project.liveUrl)
    expect(live).toHaveClass('bg-primary')
    expect(code).toHaveAttribute('href', project.repoUrl)
    expect(code).not.toHaveClass('bg-primary')
    expect(live.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('makes "View code" the primary action when there is no live site', () => {
    render(<ProjectHeader project={{ ...project, liveUrl: undefined }} />)
    expect(screen.queryByRole('link', { name: /^Visit live site/ })).not.toBeInTheDocument()
    const code = screen.getByRole('link', { name: newTabName('View code') })
    expect(code).toHaveAttribute('href', project.repoUrl)
    expect(code).toHaveClass('bg-primary')
  })

  it('links back to the projects on the home page', () => {
    render(<ProjectHeader project={project} />)
    const back = screen.getByRole('link', { name: 'All projects' })
    expect(back).toHaveAttribute('href', '/#projects')
  })

  it('shows the stack', () => {
    render(<ProjectHeader project={project} />)
    expect(screen.getByRole('list', { name: 'Tech stack' })).toHaveTextContent('TypeScript · React')
  })
})

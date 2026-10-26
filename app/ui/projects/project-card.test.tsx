import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectCard from './project-card'
import { testProject } from './test-project'

const project = testProject('alpha')

describe('ProjectCard', () => {
  it('makes the h3 title the link to the project page', () => {
    render(<ProjectCard project={project} />)
    const heading = screen.getByRole('heading', { level: 3, name: project.title })
    const link = screen.getByRole('link', { name: project.title })
    expect(heading).toContainElement(link)
    expect(link).toHaveAttribute('href', `/projects/${project.slug}`)
  })

  it('names the Live and Code links after the project, with the new-tab notice', () => {
    render(<ProjectCard project={project} />)
    const live = screen.getByRole('link', {
      name: `Live site for ${project.title} (opens in a new tab)`,
    })
    const code = screen.getByRole('link', {
      name: `Code for ${project.title} (opens in a new tab)`,
    })
    expect(live).toHaveAttribute('href', project.liveUrl)
    expect(live).toHaveTextContent('Live')
    expect(code).toHaveAttribute('href', project.repoUrl)
    expect(code).toHaveTextContent('Code')
  })

  it('shows only Code when the project has no live site', () => {
    render(<ProjectCard project={{ ...project, liveUrl: undefined }} />)
    expect(screen.queryByRole('link', { name: /^Live site for/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Code for/ })).toBeInTheDocument()
  })

  it('describes the cover with its alt text', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByRole('img', { name: project.coverAlt })).toBeInTheDocument()
  })

  it('shows the summary and the stack', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByText(project.summary)).toBeInTheDocument()
    const stack = screen.getByRole('list', { name: 'Tech stack' })
    expect(stack).toHaveTextContent('TypeScript · React')
  })

  it('labels a draft with "Draft", outside the title link', () => {
    render(<ProjectCard project={{ ...project, draft: true }} />)
    expect(screen.getByText('Draft')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: project.title })).not.toHaveTextContent('Draft')
    expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument()
  })

  it('shows no draft label on a published project', () => {
    render(<ProjectCard project={project} />)
    expect(screen.queryByText('Draft')).not.toBeInTheDocument()
  })
})

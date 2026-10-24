import { render, screen, within } from '@testing-library/react'
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

  it('shows each skill group as a heading followed by a list of its items', () => {
    render(<About site={testSite} />)
    for (const { group, items } of testSite.skills) {
      const heading = screen.getByRole('heading', { level: 3, name: group })
      const list = heading.nextElementSibling
      expect(list).toBeInstanceOf(HTMLUListElement)
      const listItems = within(list as HTMLElement).getAllByRole('listitem')
      expect(listItems.map((item) => item.textContent)).toEqual(items)
    }
  })
})

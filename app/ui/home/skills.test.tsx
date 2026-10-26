import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Skills from './skills'
import { testSite } from './test-site'

describe('Skills', () => {
  it('is the #skills section with a "Skills" h2', () => {
    render(<Skills site={testSite} />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Skills' })
    expect(heading.closest('section')).toHaveAttribute('id', 'skills')
    expect(screen.getByRole('region', { name: 'Skills' })).toBeInTheDocument()
  })

  it('shows each skill group as a heading followed by a list of its items', () => {
    render(<Skills site={testSite} />)
    for (const { group, items } of testSite.skills) {
      const heading = screen.getByRole('heading', { level: 3, name: group })
      const list = heading.nextElementSibling
      expect(list).toBeInstanceOf(HTMLUListElement)
      const listItems = within(list as HTMLElement).getAllByRole('listitem')
      expect(listItems.map((item) => item.textContent)).toEqual(items)
    }
  })
})

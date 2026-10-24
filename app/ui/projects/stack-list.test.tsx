import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StackList from './stack-list'

describe('StackList', () => {
  it('lists each item joined by " · ", with the separators hidden from screen readers', () => {
    render(<StackList stack={['Next.js', 'Zod', 'Vitest']} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('list')).toHaveTextContent('Next.js · Zod · Vitest')
    const separators = screen.getAllByText('·')
    expect(separators).toHaveLength(2)
    for (const separator of separators) {
      expect(separator).toHaveAttribute('aria-hidden', 'true')
    }
  })
})

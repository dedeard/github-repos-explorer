import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from './Header'

describe('Header Component', () => {
  it('renders heading and subheading correctly', () => {
    render(<Header />)

    // Check main heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('GitHub Repositories Explorer')

    // Check subheading text
    const subheading = screen.getByText('Search for GitHub users and explore their repositories')
    expect(subheading).toBeInTheDocument()
  })

  it('has the correct layout classes', () => {
    const { container } = render(<Header />)

    const header = container.querySelector('header')
    expect(header).toHaveClass('border-b', 'border-neutral-200', 'bg-neutral-100')

    const headerContainer = header?.querySelector('div')
    expect(headerContainer).toHaveClass('container', 'mx-auto')
  })
})

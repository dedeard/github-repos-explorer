import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Vite + React')
  })
})

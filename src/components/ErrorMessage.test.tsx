import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ErrorMessage from './ErrorMessage'

describe('ErrorMessage Component', () => {
  it('renders the error message correctly', () => {
    const testMessage = 'This is an error message'
    render(<ErrorMessage message={testMessage} />)

    // Check that the message is displayed
    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('has the correct accessibility role', () => {
    render(<ErrorMessage message="Test error" />)

    // Check that it has the correct role for accessibility
    const alertElement = screen.getByRole('alert')
    expect(alertElement).toBeInTheDocument()
  })

  it('renders with the correct styling classes', () => {
    render(<ErrorMessage message="Test error" />)

    // Get the container element
    const containerElement = screen.getByRole('alert')

    // Check that it has the expected classes
    expect(containerElement).toHaveClass('mb-6')
    expect(containerElement).toHaveClass('rounded')
    expect(containerElement).toHaveClass('border')
    expect(containerElement).toHaveClass('border-red-400')
    expect(containerElement).toHaveClass('bg-red-100')
    expect(containerElement).toHaveClass('px-4')
    expect(containerElement).toHaveClass('py-3')
    expect(containerElement).toHaveClass('text-red-700')
  })

  it('renders with a paragraph element', () => {
    render(<ErrorMessage message="Test error" />)

    // Check that the message is in a paragraph tag
    const paragraph = screen.getByText('Test error')
    expect(paragraph.tagName).toBe('P')
  })
})

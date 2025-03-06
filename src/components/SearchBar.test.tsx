/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useGithub } from '../context/GithubContext'
import SearchBar from './SearchBar'

// Mock the GithubContext hook
vi.mock('../context/GithubContext', () => ({
  useGithub: vi.fn(),
}))

describe('SearchBar Component', () => {
  const mockHandleSearch = vi.fn()
  const mockSetSearchQuery = vi.fn()

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Setup mock implementation
    ;(useGithub as any).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      handleSearch: mockHandleSearch,
      loading: false,
    })
  })

  it('renders search input and button', () => {
    render(<SearchBar />)

    expect(screen.getByLabelText('Search for GitHub users')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Search')
  })

  it('updates search query on input change', () => {
    render(<SearchBar />)

    const input = screen.getByLabelText('Search for GitHub users')
    fireEvent.change(input, { target: { value: 'test-user' } })

    expect(mockSetSearchQuery).toHaveBeenCalledWith('test-user')
  })

  it('triggers search on Enter key press', () => {
    render(<SearchBar />)

    const input = screen.getByLabelText('Search for GitHub users')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockHandleSearch).toHaveBeenCalled()
  })

  it('shows loading state when searching', () => {
    ;(useGithub as any).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      handleSearch: mockHandleSearch,
      loading: true,
    })

    render(<SearchBar />)

    expect(screen.getByText('Searching...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('focuses input on keyboard shortcut', () => {
    render(<SearchBar />)

    const input = screen.getByLabelText('Search for GitHub users')

    // Test '/' shortcut
    fireEvent.keyDown(window, { key: '/' })
    expect(document.activeElement).toBe(input)

    // Remove focus
    ;(document.activeElement as HTMLElement).blur()

    // Test 'Ctrl+P' shortcut
    fireEvent.keyDown(window, { key: 'p', ctrlKey: true })
    expect(document.activeElement).toBe(input)
  })

  it('displays keyboard shortcuts help text', () => {
    render(<SearchBar />)

    expect(screen.getByText('to focus search')).toBeInTheDocument()
    expect(screen.getByText('to search')).toBeInTheDocument()
  })
})

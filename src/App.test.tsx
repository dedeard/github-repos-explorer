import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { useGithub } from './context/GithubContext'
import { User } from './types/User'

// Mock the components
vi.mock('./components/Header', () => ({
  default: () => <div data-testid="mock-header">Header Component</div>,
}))

vi.mock('./components/SearchBar', () => ({
  default: () => <div data-testid="mock-search-bar">Search Bar Component</div>,
}))

vi.mock('./components/UserList', () => ({
  default: () => <div data-testid="mock-user-list">User List Component</div>,
}))

vi.mock('./components/ErrorMessage', () => ({
  default: ({ message }: { message: string }) => <div data-testid="mock-error-message">Error: {message}</div>,
}))

// Mock the GitHub context
vi.mock('./context/GithubContext', () => ({
  useGithub: vi.fn(),
}))

describe('App Component', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      login: 'testuser1',
      avatar_url: 'https://example.com/avatar1.png',
      html_url: 'https://github.com/testuser1',
    },
    {
      id: 2,
      login: 'testuser2',
      avatar_url: 'https://example.com/avatar2.png',
      html_url: 'https://github.com/testuser2',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the header and search bar', () => {
    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: '',
      users: [],
      loading: false,
      error: null,
      searchPerformed: false,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument()

    // UserList should not be rendered when there are no users
    expect(screen.queryByTestId('mock-user-list')).not.toBeInTheDocument()
  })

  it('displays error message when error is present', () => {
    const errorMessage = 'Something went wrong!'

    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: '',
      users: [],
      loading: false,
      error: errorMessage,
      searchPerformed: false,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    expect(screen.getByTestId('mock-error-message')).toBeInTheDocument()
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('renders user list when search is performed and users are found', () => {
    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: 'test',
      users: mockUsers,
      loading: false,
      error: null,
      searchPerformed: true,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    expect(screen.getByTestId('mock-user-list')).toBeInTheDocument()
    expect(screen.getByText('Showing users for "test"')).toBeInTheDocument()
  })

  it('does not render user list when loading', () => {
    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: 'test',
      users: mockUsers,
      loading: true,
      error: null,
      searchPerformed: true,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    expect(screen.queryByTestId('mock-user-list')).not.toBeInTheDocument()
  })

  it('does not render user list when search not performed', () => {
    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: '',
      users: mockUsers,
      loading: false,
      error: null,
      searchPerformed: false,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    expect(screen.queryByTestId('mock-user-list')).not.toBeInTheDocument()
  })

  it('does not render user list when no users found', () => {
    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: 'test',
      users: [],
      loading: false,
      error: null,
      searchPerformed: true,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    expect(screen.queryByTestId('mock-user-list')).not.toBeInTheDocument()
  })

  it('shows user list and heading when search performed with results', () => {
    vi.mocked(useGithub).mockReturnValue({
      executedSearchQuery: 'test',
      users: mockUsers,
      loading: false,
      error: null,
      searchPerformed: true,
      // Add other required context values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadUserRepositories: vi.fn(),
    })

    render(<App />)

    // Should see the heading with the search query
    expect(screen.getByText('Showing users for "test"')).toBeInTheDocument()

    // Should see the user list
    expect(screen.getByTestId('mock-user-list')).toBeInTheDocument()
  })
})

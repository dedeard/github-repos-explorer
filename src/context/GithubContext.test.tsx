import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { getUserRepositories, searchUsers } from '../api/github'
import { Repository } from '../types/Repository'
import { User } from '../types/User'
import { GithubProvider, useGithub } from './GithubContext'

// Mock the API functions
vi.mock('../api/github', () => ({
  searchUsers: vi.fn(),
  getUserRepositories: vi.fn(),
}))

// Mock data
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

const mockRepositories: Repository[] = [
  {
    id: 101,
    name: 'repo1',
    html_url: 'https://github.com/testuser1/repo1',
    description: 'Test repository 1',
    stargazers_count: 100,
  },
  {
    id: 102,
    name: 'repo2',
    html_url: 'https://github.com/testuser1/repo2',
    description: 'Test repository 2',
    stargazers_count: 50,
  },
]

// Test component that uses the context
const TestComponent = () => {
  const { searchQuery, setSearchQuery, users, loading, error, searchPerformed, handleSearch, executedSearchQuery, loadUserRepositories } =
    useGithub()

  return (
    <div>
      <div data-testid="search-performed">{searchPerformed.toString()}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="executed-query">{executedSearchQuery}</div>
      <div data-testid="users-count">{users.length}</div>
      {users.map((user) => (
        <div key={user.id} data-testid={`user-${user.id}`}>
          {user.login}
          <button data-testid={`load-repos-${user.id}`} onClick={() => loadUserRepositories(user.login)}>
            Load Repos
          </button>
          {user.loading && <span data-testid={`user-loading-${user.id}`}>Loading repos...</span>}
          {user.error && <span data-testid={`user-error-${user.id}`}>{user.error}</span>}
          {user.repositories && <div data-testid={`user-repos-${user.id}`}>{user.repositories.length} repositories</div>}
        </div>
      ))}
      <input data-testid="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button data-testid="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  )
}

describe('GithubContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw error if useGithub is used outside of GithubProvider', () => {
    // Suppress console.error for this test as we expect an error
    const originalConsoleError = console.error
    console.error = vi.fn()

    expect(() => {
      renderHook(() => useGithub())
    }).toThrow('useGithub must be used within a GithubProvider')

    console.error = originalConsoleError
  })

  it('should initialize with default values', () => {
    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    expect(screen.getByTestId('search-performed').textContent).toBe('false')
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('error').textContent).toBe('no-error')
    expect(screen.getByTestId('executed-query').textContent).toBe('')
    expect(screen.getByTestId('users-count').textContent).toBe('0')
  })

  it('should update search query when input changes', () => {
    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test-query' } })

    expect(input).toHaveValue('test-query')
  })

  it('should show error when searching with empty query', async () => {
    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    const searchButton = screen.getByTestId('search-button')
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Please enter a username to search')
    })
  })

  it('should search users and update state', async () => {
    // Mock the API function to return our mock data
    const mockSearchUsers = searchUsers as Mock
    mockSearchUsers.mockResolvedValue(mockUsers)

    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    const input = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'test-query' } })
    fireEvent.click(searchButton)

    // Should show loading state
    expect(screen.getByTestId('loading').textContent).toBe('true')

    await waitFor(() => {
      // Loading should complete
      expect(screen.getByTestId('loading').textContent).toBe('false')

      // Search should be marked as performed
      expect(screen.getByTestId('search-performed').textContent).toBe('true')

      // Executed query should be updated
      expect(screen.getByTestId('executed-query').textContent).toBe('test-query')

      // Users should be displayed
      expect(screen.getByTestId('users-count').textContent).toBe('2')
      expect(screen.getByTestId('user-1')).toBeInTheDocument()
      expect(screen.getByTestId('user-2')).toBeInTheDocument()
    })

    // API should have been called with the correct query
    expect(mockSearchUsers).toHaveBeenCalledWith('test-query')
  })

  it('should handle empty search results', async () => {
    // Mock the API function to return empty array
    const mockSearchUsers = searchUsers as Mock
    mockSearchUsers.mockResolvedValue([])

    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    const input = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'nonexistent-user' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('No users found matching your search')
      expect(screen.getByTestId('users-count').textContent).toBe('0')
    })
  })

  it('should handle API error when searching users', async () => {
    // Mock the API function to throw an error
    const mockSearchUsers = searchUsers as Mock
    mockSearchUsers.mockRejectedValue(new Error('API Error'))

    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    const input = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'test-query' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('API Error')
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
  })

  it('should load user repositories', async () => {
    // Mock both API functions
    const mockSearchUsers = searchUsers as Mock
    const mockGetUserRepositories = getUserRepositories as Mock

    mockSearchUsers.mockResolvedValue(mockUsers)
    mockGetUserRepositories.mockResolvedValue(mockRepositories)

    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    // First search for users
    const input = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'test-query' } })
    fireEvent.click(searchButton)

    // Wait for users to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('users-count').textContent).toBe('2')
    })

    // Now load repositories for the first user
    const loadReposButton = screen.getByTestId('load-repos-1')
    fireEvent.click(loadReposButton)

    // Should show loading state for this user
    expect(screen.getByTestId('user-loading-1')).toBeInTheDocument()

    await waitFor(() => {
      // Should show repositories count
      expect(screen.getByTestId('user-repos-1').textContent).toBe('2 repositories')
    })

    // API should have been called with the correct username
    expect(mockGetUserRepositories).toHaveBeenCalledWith('testuser1')
  })

  it('should handle error when loading repositories', async () => {
    // Mock the API functions
    const mockSearchUsers = searchUsers as Mock
    const mockGetUserRepositories = getUserRepositories as Mock

    mockSearchUsers.mockResolvedValue(mockUsers)
    mockGetUserRepositories.mockRejectedValue(new Error('Repo API Error'))

    render(
      <GithubProvider>
        <TestComponent />
      </GithubProvider>,
    )

    // First search for users
    const input = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'test-query' } })
    fireEvent.click(searchButton)

    // Wait for users to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('users-count').textContent).toBe('2')
    })

    // Now load repositories for the first user
    const loadReposButton = screen.getByTestId('load-repos-1')
    fireEvent.click(loadReposButton)

    await waitFor(() => {
      // Should show error message
      expect(screen.getByTestId('user-error-1').textContent).toBe('Repo API Error')
    })
  })
})

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { useGithub } from '../context/GithubContext'
import { Repository } from '../types/Repository'
import { User } from '../types/User'
import UserList from './UserList'

// Mock the GithubContext hook
vi.mock('../context/GithubContext', () => ({
  useGithub: vi.fn(),
}))

// Mock the RepositoryList component
vi.mock('../src/components/RepositoryList', () => ({
  default: ({ repositories }: { repositories: Repository[] }) => (
    <div data-testid="repository-list">
      {repositories.map((repo) => (
        <div key={repo.id} data-testid={`repo-${repo.id}`}>
          {repo.name}
        </div>
      ))}
    </div>
  ),
}))

describe('UserList Component', () => {
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

  const mockLoadUserRepositories = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementation for useGithub
    vi.mocked(useGithub).mockReturnValue({
      users: mockUsers,
      loadUserRepositories: mockLoadUserRepositories,
      // Add other required context values with default values
      searchQuery: '',
      setSearchQuery: vi.fn(),
      loading: false,
      error: null,
      searchPerformed: true,
      handleSearch: vi.fn(),
      executedSearchQuery: '',
    })
  })

  it('renders empty state when no users are present', () => {
    vi.mocked(useGithub).mockReturnValueOnce({
      ...vi.mocked(useGithub)(),
      users: [],
    })

    render(<UserList />)

    expect(screen.getByText('No GitHub users found. Try searching for users.')).toBeInTheDocument()
    expect(screen.queryByText('testuser1')).not.toBeInTheDocument()
  })

  it('renders a list of users', () => {
    render(<UserList />)

    expect(screen.getByText('testuser1')).toBeInTheDocument()
    expect(screen.getByText('testuser2')).toBeInTheDocument()
    expect(screen.getByText('User ID: 1')).toBeInTheDocument()
    expect(screen.getByText('User ID: 2')).toBeInTheDocument()

    // Check for avatar images
    const avatarImages = screen.getAllByRole('img')
    expect(avatarImages).toHaveLength(2)
    expect(avatarImages[0]).toHaveAttribute('src', 'https://example.com/avatar1.png')
    expect(avatarImages[1]).toHaveAttribute('src', 'https://example.com/avatar2.png')

    // Check for GitHub profile links
    const profileLinks = screen.getAllByText('GitHub Profile')
    expect(profileLinks).toHaveLength(2)
    expect(profileLinks[0].closest('a')).toHaveAttribute('href', 'https://github.com/testuser1')
    expect(profileLinks[1].closest('a')).toHaveAttribute('href', 'https://github.com/testuser2')
  })
})

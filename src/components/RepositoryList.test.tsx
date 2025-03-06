import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Repository } from '../types/Repository'
import RepositoryList from './RepositoryList'

describe('RepositoryList Component', () => {
  const mockRepositories: Repository[] = [
    {
      id: 1,
      name: 'test-repo',
      html_url: 'https://github.com/test/test-repo',
      description: 'Test repository description',
      stargazers_count: 10,
      topics: ['react', 'typescript', 'testing'],
    },
    {
      id: 2,
      name: 'another-repo',
      html_url: 'https://github.com/test/another-repo',
      description: 'Another test repository',
      stargazers_count: 5,
      topics: ['javascript'],
    },
  ]

  it('renders empty state when no repositories are provided', () => {
    render(<RepositoryList repositories={[]} />)
    expect(screen.getByText('This user has no public repositories.')).toBeInTheDocument()
  })

  it('renders repository list correctly', () => {
    render(<RepositoryList repositories={mockRepositories} />)

    // Check if repository names are displayed
    expect(screen.getByText('test-repo')).toBeInTheDocument()
    expect(screen.getByText('another-repo')).toBeInTheDocument()

    // Check if descriptions are displayed
    expect(screen.getByText('Test repository description')).toBeInTheDocument()
    expect(screen.getByText('Another test repository')).toBeInTheDocument()

    // Check if star counts are displayed
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders repository topics correctly', () => {
    render(<RepositoryList repositories={mockRepositories} />)

    // Check if topics are displayed
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('testing')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
  })

  it('renders repository links with correct URLs', () => {
    render(<RepositoryList repositories={mockRepositories} />)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://github.com/test/test-repo')
    expect(links[1]).toHaveAttribute('href', 'https://github.com/test/another-repo')
  })

  it('displays topic counter when there are more than 5 topics', () => {
    const repoWithManyTopics: Repository = {
      id: 3,
      name: 'many-topics-repo',
      html_url: 'https://github.com/test/many-topics-repo',
      description: 'Repository with many topics',
      stargazers_count: 1,
      topics: ['one', 'two', 'three', 'four', 'five', 'six', 'seven'],
    }

    render(<RepositoryList repositories={[repoWithManyTopics]} />)

    // Should show first 5 topics
    expect(screen.getByText('one')).toBeInTheDocument()
    expect(screen.getByText('two')).toBeInTheDocument()
    expect(screen.getByText('three')).toBeInTheDocument()
    expect(screen.getByText('four')).toBeInTheDocument()
    expect(screen.getByText('five')).toBeInTheDocument()

    // Should show counter for remaining topics
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })
})

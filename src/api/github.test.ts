/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Repository } from '..//types/Repository'
import { User } from '..//types/User'
import { getUserRepositories, searchUsers } from './github'

declare const global: any

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

describe('GitHub API', () => {
  // Setup global fetch mock
  const originalFetch = global.fetch
  let fetchMock: any

  beforeEach(() => {
    // Create a fresh mock for each test
    fetchMock = vi.fn()
    global.fetch = fetchMock

    // Also mock console.error to keep test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore original implementations
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  describe('searchUsers', () => {
    it('should fetch users successfully', async () => {
      // Mock successful response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockUsers }),
      })

      const result = await searchUsers('test')

      // Verify that fetch was called with the correct URL
      expect(fetchMock).toHaveBeenCalledWith('https://api.github.com/search/users?q=test&per_page=5')

      // Verify the result
      expect(result).toEqual(mockUsers)
      expect(result.length).toBe(2)
    })

    it('should handle API errors', async () => {
      // Mock failed response
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 403,
      })

      // Verify that the function throws an error
      await expect(searchUsers('test')).rejects.toThrow('GitHub API error: 403')
      expect(console.error).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      // Mock network failure
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      // Verify that the function rethrows the error
      await expect(searchUsers('test')).rejects.toThrow('Network error')
      expect(console.error).toHaveBeenCalled()
    })

    it('should handle empty results', async () => {
      // Mock empty response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      })

      const result = await searchUsers('nonexistentuser')

      expect(fetchMock).toHaveBeenCalled()
      expect(result).toEqual([])
      expect(result.length).toBe(0)
    })
  })

  describe('getUserRepositories', () => {
    it('should fetch repositories successfully', async () => {
      // Mock successful response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepositories,
      })

      const result = await getUserRepositories('testuser1')

      // Verify that fetch was called with the correct URL
      expect(fetchMock).toHaveBeenCalledWith('https://api.github.com/users/testuser1/repos?sort=updated&direction=desc')

      // Verify the result
      expect(result).toEqual(mockRepositories)
      expect(result.length).toBe(2)
      expect(result[0].name).toBe('repo1')
    })

    it('should handle API errors', async () => {
      // Mock failed response
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      // Verify that the function throws an error
      await expect(getUserRepositories('nonexistentuser')).rejects.toThrow('GitHub API error: 404')
      expect(console.error).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      // Mock network failure
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      // Verify that the function rethrows the error
      await expect(getUserRepositories('testuser1')).rejects.toThrow('Network error')
      expect(console.error).toHaveBeenCalled()
    })

    it('should handle empty repository list', async () => {
      // Mock empty response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const result = await getUserRepositories('newuser')

      expect(fetchMock).toHaveBeenCalled()
      expect(result).toEqual([])
      expect(result.length).toBe(0)
    })
  })
})

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getUserRepositories, searchUsers } from '../api/github'
import { User } from '../types/User'

interface GithubContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  users: User[]
  loading: boolean
  error: string | null
  searchPerformed: boolean
  handleSearch: VoidFunction
  executedSearchQuery: string
  loadUserRepositories: (username: string) => Promise<void>
}

const GithubContext = createContext<GithubContextType | undefined>(undefined)

export const GithubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [executedSearchQuery, setExecutedSearchQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a username to search')
      return
    }

    setLoading(true)
    setSearchPerformed(true)

    try {
      const fetchedUsers = await searchUsers(query)
      setUsers(fetchedUsers)
      if (fetchedUsers.length === 0) {
        setError('No users found matching your search')
      } else {
        setError(null)
      }
      setExecutedSearchQuery(query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching for users')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(() => {
    performSearch(searchQuery)
  }, [performSearch, searchQuery])

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const loadUserRepositories = useCallback(async (username: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.login === username) {
          return {
            ...user,
            loading: true,
            error: null,
          }
        }
        return user
      }),
    )

    try {
      const repos = await getUserRepositories(username)

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.login === username) {
            return {
              ...user,
              repositories: repos,
              active: true,
              loading: false,
            }
          }
          return {
            ...user,
            active: false,
          }
        }),
      )
    } catch (err) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.login === username) {
            return {
              ...user,
              loading: false,
              error: err instanceof Error ? err.message : 'An error occurred while fetching repositories',
            }
          }
          return user
        }),
      )
    }
  }, [])

  const contextValue = {
    searchQuery,
    setSearchQuery,
    users,
    loading,
    error,
    searchPerformed,
    handleSearch,
    executedSearchQuery,
    loadUserRepositories,
  }

  return <GithubContext.Provider value={contextValue}>{children}</GithubContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGithub = () => {
  const context = useContext(GithubContext)
  if (!context) {
    throw new Error('useGithub must be used within a GithubProvider')
  }
  return context
}

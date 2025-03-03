import React, { useEffect, useRef, useState } from 'react'
import { getUserRepositories, searchUsers } from './api/github'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'
import RepositoryList from './components/RepositoryList'
import SearchBar from './components/SearchBar'
import UserList from './components/UserList'
import { Repository } from './types/Repository'
import { User } from './types/User'

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input on initial load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a username to search')
      return
    }

    setLoading(true)
    setError(null)
    setSearchPerformed(true)
    setSelectedUser(null)
    setRepositories([])

    try {
      const fetchedUsers = await searchUsers(searchQuery)
      setUsers(fetchedUsers)
      if (fetchedUsers.length === 0) {
        setError('No users found matching your search')
      }
    } catch (err) {
      setError('An error occurred while searching for users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user)
    setLoading(true)
    setError(null)
    setRepositories([])

    try {
      const repos = await getUserRepositories(user.login)
      setRepositories(repos)
      if (repos.length === 0) {
        setError(`${user.login} has no public repositories`)
      }
    } catch (err) {
      setError('An error occurred while fetching repositories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Search on Enter key
    if (e.key === 'Enter' && !loading) {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl p-4">
        <h1 className="mt-6 mb-8 text-center text-3xl font-bold text-gray-800">GitHub Repositories Explorer</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            inputRef={searchInputRef}
            onKeyDown={handleKeyDown}
            loading={loading}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        {loading && <LoadingSpinner />}

        {!loading && searchPerformed && users.length > 0 && !selectedUser && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-700">Showing users for "{searchQuery}"</h2>
            <UserList users={users} onSelectUser={handleUserSelect} />
          </div>
        )}

        {selectedUser && !loading && (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700">Repositories for {selectedUser.login}</h2>
              <button onClick={() => setSelectedUser(null)} className="font-medium text-blue-500 hover:text-blue-700">
                Back to users
              </button>
            </div>
            <RepositoryList repositories={repositories} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App

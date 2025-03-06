import React from 'react'
import ErrorMessage from './components/ErrorMessage'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import UserList from './components/UserList'
import { useGithub } from './context/GithubContext'

const App: React.FC = () => {
  const { executedSearchQuery, users, loading, error, searchPerformed } = useGithub()

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="container mx-auto -mt-10 max-w-5xl p-4">
        <nav role="search">
          <SearchBar />
        </nav>

        {error && <ErrorMessage message={error} />}

        {!loading && searchPerformed && users.length > 0 && (
          <section className="mb-6" aria-label="Search Results">
            {!!executedSearchQuery && <h2 className="mb-4 text-lg font-medium text-gray-700">Showing users for "{executedSearchQuery}"</h2>}
            <UserList />
          </section>
        )}
      </main>
    </div>
  )
}

export default App

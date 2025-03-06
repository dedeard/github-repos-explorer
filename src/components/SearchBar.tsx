import React, { useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useGithub } from '../context/GithubContext'

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, handleSearch, loading } = useGithub()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'p' && e.ctrlKey)) && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch()
    }
  }

  const handleClick = () => {
    if (searchQuery.trim() === '') {
      inputRef.current?.focus()
    } else {
      handleSearch()
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="relative flex w-full">
        <FiSearch className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter GitHub username"
          className="flex-grow rounded border border-neutral-200 bg-white px-3 py-4 pl-10 transition-all ease-in-out outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          aria-label="Search for GitHub users"
        />
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">/</span>
          <span>or</span>
          <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">Ctrl+P</span>
          <span>to focus search</span>
        </div>
        <div>
          <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">Enter</span>
          <span className="ml-1">to search</span>
        </div>
      </div>

      <div className="mx-auto flex w-full md:w-1/3">
        <button
          onClick={handleClick}
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center rounded bg-blue-600 px-6 py-3 text-white transition duration-200 hover:bg-blue-700 disabled:cursor-default disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Searching...
            </>
          ) : (
            <>
              <FiSearch className="mr-2 h-5 w-5" />
              Search
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SearchBar

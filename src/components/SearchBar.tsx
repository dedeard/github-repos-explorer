import React from 'react'
import { SearchIcon } from './Icons'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onKeyDown: (e: React.KeyboardEvent) => void
  loading: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, handleSearch, inputRef, onKeyDown, loading }) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <input
        type="text"
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Enter username"
        className="flex-grow rounded border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        aria-label="Search for GitHub users"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="flex items-center justify-center rounded bg-blue-500 px-6 py-3 text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SearchIcon className="mr-2 h-5 w-5" />
        Search
      </button>
    </div>
  )
}

export default SearchBar

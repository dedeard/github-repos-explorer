import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiExternalLink, FiGithub } from 'react-icons/fi'
import { useGithub } from '../context/GithubContext'
import { User } from '../types/User'
import RepositoryList from './RepositoryList'

const UserList: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { users, loadUserRepositories } = useGithub()

  const userItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeIndex !== null && userItemsRef.current[activeIndex]) {
      userItemsRef.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [activeIndex])

  useEffect(() => {
    userItemsRef.current = userItemsRef.current.slice(0, users.length)
  }, [users.length])

  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) {
        return
      }

      if (e.key === 'Escape') {
        if (expandedIndex !== null) {
          e.preventDefault()
          setExpandedIndex(null)
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prevIndex) => (prevIndex === null || prevIndex >= users.length - 1 ? 0 : prevIndex + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prevIndex) => (prevIndex === null || prevIndex <= 0 ? users.length - 1 : prevIndex - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIndex !== null) {
          toggleUser(activeIndex, users[activeIndex])
        } else if (users.length > 0) {
          setActiveIndex(0)
        }
      }
    }

    window.addEventListener('keydown', handleKeypress)
    return () => {
      window.removeEventListener('keydown', handleKeypress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, expandedIndex, activeIndex])

  const toggleUser = async (index: number, user: User) => {
    setActiveIndex(index)
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else {
      setExpandedIndex(index)

      if (!user.repositories) {
        await loadUserRepositories(user.login)
      }
    }
  }

  const renderKeyboardHelp = () => (
    <div className="mb-2 flex justify-between text-xs text-gray-500">
      <div>
        <span className="mr-1 inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">↑</span>
        <span className="mr-1 inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">↓</span>
        <span className="mr-3">Navigate</span>

        <span className="mr-1 inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">Enter</span>
        <span className="mr-3">Toggle user</span>
      </div>
      <div>
        <span className="mr-1 inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">Esc</span>
        <span>Close expanded panel</span>
      </div>
    </div>
  )

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-8 text-gray-500">
        <FiGithub className="mb-4 h-12 w-12 text-gray-400" />
        <p>No GitHub users found. Try searching for users.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {renderKeyboardHelp()}

      <div
        ref={containerRef}
        tabIndex={0}
        className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-neutral-200 shadow-sm outline-none"
      >
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <FiGithub className="mb-2 h-8 w-8 text-gray-400" />
            <p>No GitHub users found.</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user.login}
              ref={(el) => {
                userItemsRef.current[index] = el
              }}
            >
              <div
                onClick={() => toggleUser(index, user)}
                className={clsx(
                  'flex items-center p-4 transition-colors hover:bg-gray-100',
                  index === activeIndex && '!bg-blue-50',
                  expandedIndex === index && 'border-b border-gray-200',
                )}
              >
                <div className="flex min-w-0 flex-1 items-center">
                  <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="mr-3 h-10 w-10 rounded-full border border-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="truncate font-medium text-gray-900">{user.login}</h3>
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Open ${user.login}'s GitHub profile`}
                      >
                        GitHub Profile <FiExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-500">User ID: {user.id}</p>
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleUser(index, user)
                    }}
                    className={clsx(
                      'rounded-full p-1',
                      expandedIndex === index ? 'bg-gray-200' : 'bg-gray-100',
                      'transition-colors hover:bg-gray-200',
                    )}
                    aria-expanded={expandedIndex === index}
                    aria-label={expandedIndex === index ? 'Collapse details' : 'Expand details'}
                  >
                    {expandedIndex === index ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="animate-fadeIn bg-gray-50 p-4">
                  {user.loading && (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {user.error && (
                    <div className="rounded-md bg-red-50 p-4 text-red-700">
                      <p className="font-medium">Error loading repositories</p>
                      <p className="text-sm">{user.error}</p>
                    </div>
                  )}

                  {user.repositories && (
                    <>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Repositories ({user.repositories.length})</h4>
                        <a
                          href={`${user.html_url}?tab=repositories`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                          aria-label={`View all repositories for ${user.login} on GitHub`}
                        >
                          View All on GitHub <FiExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <RepositoryList repositories={user.repositories} />
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserList

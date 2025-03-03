// components/RepositoryList.tsx
import React, { useState } from 'react'
import { Repository } from '../types/Repository'
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from './Icons'

interface RepositoryListProps {
  repositories: Repository[]
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  const [expandedRepoId, setExpandedRepoId] = useState<number | null>(null)

  const toggleRepository = (repoId: number) => {
    if (expandedRepoId === repoId) {
      setExpandedRepoId(null)
    } else {
      setExpandedRepoId(repoId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, repoId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleRepository(repoId)
    }
  }

  return (
    <div className="space-y-2">
      {repositories.map((repo) => (
        <div key={repo.id} className="overflow-hidden rounded-lg border border-gray-200">
          <div
            onClick={() => toggleRepository(repo.id)}
            onKeyDown={(e) => handleKeyDown(e, repo.id)}
            tabIndex={0}
            role="button"
            aria-expanded={expandedRepoId === repo.id}
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800">{repo.name}</span>
              <div className="ml-3 flex items-center text-gray-600">
                <span className="mr-1">{repo.stargazers_count}</span>
                <StarIcon className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            {expandedRepoId === repo.id ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedRepoId === repo.id && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              {repo.description && <p className="mb-3 text-gray-600">{repo.description}</p>}
              <div className="mb-3 flex flex-wrap gap-2">
                {repo.topics?.map((topic) => (
                  <span key={topic} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {topic}
                  </span>
                ))}
              </div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                View on GitHub
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default RepositoryList

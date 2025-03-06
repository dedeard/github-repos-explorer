import React from 'react'
import { FiGithub, FiStar } from 'react-icons/fi'
import { Repository } from '../types/Repository'

interface RepositoryListProps {
  repositories: Repository[]
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  if (repositories.length === 0) {
    return <div className="py-6 text-center text-gray-500">This user has no public repositories.</div>
  }

  return (
    <ul className="space-y-3" role="list" aria-label="User repositories">
      {repositories.map((repo) => (
        <li key={repo.id} className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-medium text-gray-900">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 hover:underline"
                >
                  <FiGithub className="h-4 w-4" /> {repo.name}
                </a>
              </h3>

              {repo.description && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{repo.description}</p>}

              {repo.topics && repo.topics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 5 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      +{repo.topics.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="ml-4 flex-shrink-0">
              <div className="flex items-center text-sm text-gray-500">
                <FiStar className="mr-1.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default RepositoryList

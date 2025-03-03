import React, { useState } from 'react'
import { User } from '../types/User'
import { ChevronDownIcon, ChevronUpIcon } from './Icons'

interface UserListProps {
  users: User[]
  onSelectUser: (user: User) => void
}

const UserList: React.FC<UserListProps> = ({ users, onSelectUser }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleUser = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else {
      setExpandedIndex(index)
      onSelectUser(users[index])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleUser(index)
    }
  }

  return (
    <ul className="divide-y divide-gray-200">
      {users.map((user, index) => (
        <li key={user.id} className="py-2">
          <div
            onClick={() => toggleUser(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            role="button"
            aria-expanded={expandedIndex === index}
            className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <div className="flex items-center">
              <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="mr-3 h-10 w-10 rounded-full" />
              <span className="font-medium">{user.login}</span>
            </div>
            {expandedIndex === index ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default UserList

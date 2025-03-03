import { Repository } from '../types/Repository'
import { User } from '../types/User'

const BASE_URL = 'https://api.github.com'

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search/users?q=${query}&per_page=5`)

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}

export const getUserRepositories = async (username: string): Promise<Repository[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&direction=desc`)

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching repositories:', error)
    throw error
  }
}

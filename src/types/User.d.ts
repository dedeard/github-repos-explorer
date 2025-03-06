import { Repository } from './Repository'

export interface User {
  id: number
  login: string
  avatar_url: string
  html_url: string
  repositories?: Repository[]
  active?: boolean
  error?: string | null
  loading?: boolean
}

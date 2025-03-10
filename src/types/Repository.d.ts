export interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  topics?: string[]
}

// Types pour l'intégration GitHub

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  private: boolean
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  created_at: string
  pushed_at: string
  size: number
  open_issues_count: number
  watchers_count: number
  owner: {
    login: string
    id: number
    avatar_url: string
    type: string
  }
}

export type GitHubUser = {
  login: string
  id: number
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export type GitHubFile = {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string | null
  git_url: string | null
  download_url: string | null
  type: 'file' | 'dir' | 'symlink' | 'submodule'
  content?: string
  encoding?: string
  _links?: {
    self: string
    git: string
    html: string
  }
}

export type GitHubContent = GitHubFile[]

export type GitHubSearchResult = {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}

export type GitHubAuthState = {
  isAuthenticated: boolean
  token: string
  username: string
  userInfo: GitHubUser | null
}

export type CodeAnalysisResult = {
  id: string
  exigenceId: string
  exigenceTitre: string
  exigenceType: string
  exigenceDescription: string | null
  codeRequirement: string
  matchPercentage: number
  matched: boolean
  filePath: string
  lineNumber?: number
  codeSnippet?: string
}

export type MatchingStats = {
  high: number  // > 80%
  medium: number // 50-80%
  low: number   // < 50%
  total: number
}

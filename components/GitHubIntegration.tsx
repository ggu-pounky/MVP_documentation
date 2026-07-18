'use client'

import { useState, useEffect } from 'react'
import type { GitHubRepo, GitHubUser } from '@/types/github'

type GitHubIntegrationProps = {
  onRepoSelect: (repo: GitHubRepo) => void
  onAuthChange: (isAuthenticated: boolean, token: string, username: string) => void
  selectedRepo?: GitHubRepo | null
  initialToken?: string
  initialUsername?: string
}

export default function GitHubIntegration({
  onRepoSelect,
  onAuthChange,
  selectedRepo,
  initialToken = '',
  initialUsername = ''
}: GitHubIntegrationProps) {
  const [githubToken, setGithubToken] = useState(initialToken)
  const [githubUsername, setGithubUsername] = useState(initialUsername)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [repoError, setRepoError] = useState<string | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'stars' | 'forks'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (initialToken && initialUsername) {
      setGithubToken(initialToken)
      setGithubUsername(initialUsername)
      verifyAuthentication(initialToken, initialUsername)
    }
  }, [initialToken, initialUsername])

  const verifyAuthentication = async (token: string, username: string) => {
    setLoadingAuth(true)
    setAuthError(null)
    
    try {
      const response = await fetch(`https://api.github.com/user`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (response.ok) {
        const userData: GitHubUser = await response.json()
        if (userData.login === username) {
          setIsAuthenticated(true)
          setUserInfo(userData)
          onAuthChange(true, token, username)
          await fetchRepositories(token, username)
        } else {
          setAuthError('Nom d\'utilisateur ne correspond pas au token')
          onAuthChange(false, '', '')
        }
      } else {
        setAuthError('Token invalide ou expire')
        onAuthChange(false, '', '')
      }
    } catch (error) {
      setAuthError('Erreur de connexion a GitHub')
      onAuthChange(false, '', '')
      console.error('GitHub auth error:', error)
    } finally {
      setLoadingAuth(false)
    }
  }

  const handleGitHubLogin = async () => {
    if (!githubToken || !githubUsername) {
      setAuthError('Veuillez entrer votre token et votre nom d\'utilisateur GitHub')
      return
    }

    await verifyAuthentication(githubToken, githubUsername)
    
    if (isAuthenticated) {
      localStorage.setItem('githubToken', githubToken)
      localStorage.setItem('githubUsername', githubUsername)
    }
  }

  const fetchRepositories = async (token: string, username: string) => {
    setLoadingRepos(true)
    setRepoError(null)
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (response.ok) {
        const reposData: GitHubRepo[] = await response.json()
        setRepos(reposData)
      } else {
        setRepoError('Impossible de recuperer les repositories')
      }
    } catch (error) {
      setRepoError('Erreur reseau lors de la recuperation des repositories')
      console.error('Fetch repos error:', error)
    } finally {
      setLoadingRepos(false)
    }
  }

  const handleGitHubLogout = () => {
    localStorage.removeItem('githubToken')
    localStorage.removeItem('githubUsername')
    setGithubToken('')
    setGithubUsername('')
    setIsAuthenticated(false)
    setUserInfo(null)
    setRepos([])
    onAuthChange(false, '', '')
  }

  const handleSelectRepo = (repo: GitHubRepo) => {
    onRepoSelect(repo)
  }

  // Filtrer et trier les repositories
  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      case 'updated':
        return sortDirection === 'asc' 
          ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      case 'stars':
        return sortDirection === 'asc' 
          ? a.stargazers_count - b.stargazers_count 
          : b.stargazers_count - a.stargazers_count
      case 'forks':
        return sortDirection === 'asc' 
          ? a.forks_count - b.forks_count 
          : b.forks_count - a.forks_count
      default:
        return 0
    }
  })

  const toggleSortDirection = (field: 'name' | 'updated' | 'stars' | 'forks') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: 'name' | 'updated' | 'stars' | 'forks') => {
    if (sortBy !== field) return '[<->]'
    return sortDirection === 'asc' ? '[^]' : '[v]'
  }

  return (
    <div className="space-y-6">
      {/* Section Connexion */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Connexion a GitHub</h2>
        </div>
        
        <div className="space-y-4">
          {!isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token GitHub (Personal Access Token)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Necessite les permissions: repo (read), user (read)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d&apos;utilisateur GitHub
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="votre-username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleGitHubLogin}
                  className="btn btn-primary w-full"
                  disabled={!githubToken || !githubUsername || loadingAuth}
                >
                  {loadingAuth ? (
                    <>
                      <span className="animate-spin">[*]</span> Connexion...
                    </>
                  ) : (
                    'Se connecter a GitHub'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                {userInfo?.avatar_url && (
                  <img 
                    src={userInfo.avatar_url} 
                    alt={userInfo.login}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-green-800">
                    Connecte en tant que {userInfo?.name || githubUsername}
                  </div>
                  <div className="text-sm text-green-600">@{githubUsername}</div>
                </div>
              </div>
              <button
                onClick={handleGitHubLogout}
                className="btn btn-secondary btn-sm"
              >
                Deconnexion
              </button>
            </div>
          )}
          
          {authError && (
            <div className="text-red-600 text-sm">{authError}</div>
          )}
        </div>
      </div>

      {/* Section Liste des Repositories */}
      {isAuthenticated && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-800">Vos Repositories ({repos.length})</h2>
          </div>
          
          <div className="space-y-4">
            {/* Barre de recherche et tri */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un repository..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSortDirection('name')}
                  className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                >
                  Nom {getSortIcon('name')}
                </button>
                <button
                  onClick={() => toggleSortDirection('updated')}
                  className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                >
                  Mis a jour {getSortIcon('updated')}
                </button>
                <button
                  onClick={() => toggleSortDirection('stars')}
                  className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                >
                  Etoiles {getSortIcon('stars')}
                </button>
              </div>
            </div>

            {loadingRepos ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="animate-spin">[*]</span>
                  <span>Chargement des repositories...</span>
                </div>
              </div>
            ) : repoError ? (
              <div className="text-red-600 text-center py-4">{repoError}</div>
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Aucun repository trouve.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedRepos.map(repo => (
                  <div
                    key={repo.id}
                    onClick={() => handleSelectRepo(repo)}
                    className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-md transition-all ${
                      selectedRepo?.id === repo.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-800 flex items-center gap-2">
                          {repo.name}
                          {repo.private && (
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">Prive</span>
                          )}
                        </div>
                        {repo.description && (
                          <div className="text-sm text-gray-600 mt-1">{repo.description}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-3">
                        {repo.language && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {repo.language}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">* {repo.stargazers_count}</span>
                        <span className="text-xs text-gray-500">F {repo.forks_count}</span>
                      </div>
                      
                      {selectedRepo?.id === repo.id && (
                        <span className="text-green-600">[OK] Selectionne</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export type { GitHubRepo, GitHubUser }

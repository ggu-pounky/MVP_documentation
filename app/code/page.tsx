'use client'

import { useState, useEffect } from 'react'
import GitHubIntegration from '@/components/GitHubIntegration'
import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import type { GitHubRepo, CodeAnalysisResult } from '@/types/github'

type CodeFile = {
  path: string
  content: string
}

export default function CodePage() {
  // États pour les données locales
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [loadingLocal, setLoadingLocal] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // États pour GitHub
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [githubToken, setGithubToken] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)

  // États pour l'analyse
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysisResult[]>([])
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Charger les données locales (exigences et features)
  const loadLocalData = () => {
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    const savedToken = localStorage.getItem('githubToken')
    const savedUsername = localStorage.getItem('githubUsername')
    
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    if (savedToken) setGithubToken(savedToken)
    if (savedUsername) setGithubUsername(savedUsername)
    
    setLoadingLocal(false)
  }

  useEffect(() => {
    loadLocalData()
    const handleStorageChange = () => loadLocalData()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Gestion de l'authentification GitHub
  const handleAuthChange = (authenticated: boolean, token: string, username: string) => {
    setIsAuthenticated(authenticated)
    setGithubToken(token)
    setGithubUsername(username)
    if (authenticated) {
      showNotification(`Connecté en tant que ${username}`)
    }
  }

  // Sélection d'un repository
  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo)
    setAnalysisResults([])
    setAnalysisError(null)
    showNotification(`Repository sélectionné: ${repo.name}`)
  }

  // Analyse du code
  const handleAnalyzeCode = async () => {
    if (!selectedRepo || !githubToken) {
      showNotification('Veuillez sélectionner un repository', 'error')
      return
    }

    setLoadingAnalysis(true)
    setAnalysisError(null)

    try {
      // Récupérer la structure du repository
      const contentsResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/contents`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      )

      if (!contentsResponse.ok) {
        throw new Error('Impossible de récupérer le contenu du repository')
      }

      const contents = await contentsResponse.json()
      
      // Filtrer uniquement les fichiers (pas les dossiers)
      const files = contents.filter((item: any) => item.type === 'file')
      
      // Récupérer le contenu des fichiers de code (extensions courantes)
      const codeFiles = files.filter((file: any) => 
        ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb'].some(ext => file.name.endsWith(ext))
      )

      // Lire le contenu de chaque fichier de code
      const fileContents: CodeFile[] = []
      
      for (const file of codeFiles.slice(0, 20)) { // Limiter à 20 fichiers
        try {
          const fileResponse = await fetch(file.download_url || `https://api.github.com/repos/${selectedRepo.full_name}/contents/${file.path}`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          })
          
          if (fileResponse.ok) {
            const fileData = await fileResponse.json()
            if (fileData.content) {
              // Décoder le contenu base64
              const content = Buffer.from(fileData.content, 'base64').toString('utf-8')
              fileContents.push({ path: file.path, content })
            }
          }
        } catch (error) {
          console.error(`Erreur lors de la lecture du fichier ${file.path}:`, error)
        }
      }

      // Analyser le code et faire le matching avec les exigences
      const results = performCodeAnalysis(fileContents, exigences)
      setAnalysisResults(results)
      setLoadingAnalysis(false)
      
      showNotification(`Analyse terminée: ${results.length} correspondances trouvées`)
      
    } catch (error) {
      setAnalysisError('Erreur lors de l\'analyse du code')
      setLoadingAnalysis(false)
      showNotification('Erreur d\'analyse du code', 'error')
      console.error('Analysis error:', error)
    }
  }

  // Fonction d'analyse du code et matching avec les exigences
  const performCodeAnalysis = (files: CodeFile[], exigences: Exigence[]): CodeAnalysisResult[] => {
    const results: CodeAnalysisResult[] = []
    
    // Pour chaque exigence, essayer de trouver des correspondances dans le code
    exigences.forEach(exigence => {
      const exigenceText = `${exigence.titre} ${exigence.description || ''}`.toLowerCase()
      
      // Analyser chaque fichier
      files.forEach(file => {
        const content = file.content.toLowerCase()
        
        // Calculer le score de matching
        const matchScore = calculateMatchScore(exigence, content, file.path)
        
        if (matchScore > 0) {
          // Extraire un snippet de code pertinent
          const codeSnippet = extractRelevantCodeSnippet(file.content, exigence, file.path)
          
          // Générer une description de l'exigence IA
          const iaRequirement = generateIARequirement(exigence, file.content, file.path)
          
          results.push({
            id: `${exigence.id}-${file.path}`,
            exigenceId: exigence.id,
            exigenceTitre: exigence.titre,
            exigenceType: exigence.type,
            exigenceDescription: exigence.description,
            codeRequirement: iaRequirement,
            matchPercentage: Math.round(matchScore * 100),
            matched: matchScore >= 0.8,
            filePath: file.path,
            codeSnippet: codeSnippet
          })
        }
      })
    })
    
    // Trier par pourcentage décroissant
    results.sort((a, b) => b.matchPercentage - a.matchPercentage)
    
    return results
  }

  // Calculer le score de matching entre une exigence et du code
  const calculateMatchScore = (exigence: Exigence, codeContent: string, filePath: string): number => {
    let score = 0
    const exigenceText = `${exigence.titre} ${exigence.description || ''}`.toLowerCase()
    const exigenceWords = exigenceText.split(/\s+/).filter(word => word.length > 3)
    
    // Score basé sur les mots clés
    exigenceWords.forEach(word => {
      if (codeContent.includes(word)) {
        score += 1
      }
    })
    
    // Bonus pour les mots importants (verbes d'action)
    const actionWords = ['créer', 'ajouter', 'supprimer', 'mettre', 'à', 'jour', 'valider', 'calculer', 'afficher', 'gérer', 'stocker', 'vérifier', 'authentifier', 'autoriser', 'charger', 'sauvegarder', 'exporter', 'importer']
    exigenceWords.forEach(word => {
      if (actionWords.some(action => word.includes(action)) && codeContent.includes(word)) {
        score += 0.5
      }
    })
    
    // Normaliser le score par rapport au nombre de mots
    const maxPossibleScore = exigenceWords.length + (exigenceWords.length * 0.5)
    const normalizedScore = Math.min(score / maxPossibleScore, 1)
    
    // Ajouter un bonus si le type d'exigence correspond au contenu
    if (exigence.type === 'Fonctionnelle') {
      if (codeContent.includes('function') || codeContent.includes('def ') || codeContent.includes('class ') || codeContent.includes('method')) {
        score += 0.2
      }
    } else if (exigence.type === 'Technique') {
      if (codeContent.includes('api') || codeContent.includes('database') || codeContent.includes('server') || codeContent.includes('endpoint') || codeContent.includes('route')) {
        score += 0.2
      }
    } else if (exigence.type === 'Non fonctionnelle') {
      if (codeContent.includes('performance') || codeContent.includes('security') || codeContent.includes('scalability') || codeContent.includes('cache')) {
        score += 0.2
      }
    }
    
    // Bonus si le fichier semble correspondre au type
    if (filePath.includes('test') || filePath.includes('spec')) {
      score += 0.1
    }
    
    return Math.min(normalizedScore + 0.2, 1)
  }

  // Extraire un snippet de code pertinent
  const extractRelevantCodeSnippet = (content: string, exigence: Exigence, filePath: string): string => {
    const lines = content.split('\n')
    const exigenceText = `${exigence.titre} ${exigence.description || ''}`.toLowerCase()
    
    // Trouver les lignes qui contiennent des mots clés de l'exigence
    const relevantLines = lines.filter(line => 
      line.toLowerCase().split(/\s+/).some(word => 
        word.length > 3 && exigenceText.includes(word)
      )
    )
    
    if (relevantLines.length > 0) {
      // Retourner jusqu'à 3 lignes pertinentes
      return relevantLines.slice(0, 3).join('\n')
    }
    
    // Sinon, retourner les premières lignes du fichier
    return lines.slice(0, 5).join('\n')
  }

  // Générer une description IA de l'exigence trouvée dans le code
  const generateIARequirement = (exigence: Exigence, codeContent: string, filePath: string): string => {
    const lines = codeContent.split('\n')
    const exigenceText = `${exigence.titre} ${exigence.description || ''}`.toLowerCase()
    
    // Trouver les lignes pertinentes
    const relevantLines = lines.filter(line => 
      line.toLowerCase().split(/\s+/).some(word => 
        word.length > 3 && exigenceText.includes(word)
      )
    )
    
    if (relevantLines.length > 0) {
      const sampleLine = relevantLines[0].trim()
      return `Implémentation: ${sampleLine.substring(0, 80)}...`
    }
    
    // Analyser le contenu pour trouver des patterns
    if (codeContent.includes('function') || codeContent.includes('def ')) {
      return `Fonction implémentée dans ${filePath} pour ${exigence.titre}`
    }
    
    if (codeContent.includes('class ')) {
      return `Classe implémentée dans ${filePath} pour ${exigence.titre}`
    }
    
    if (codeContent.includes('api') || codeContent.includes('endpoint')) {
      return `Endpoint API implémenté dans ${filePath} pour ${exigence.titre}`
    }
    
    return `Code lié à: ${exigence.titre} dans ${filePath}`
  }

  // Déterminer la classe CSS en fonction du pourcentage
  const getPercentageClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800'
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  // Filtrer les résultats par plage de pourcentage
  const getFilteredResults = (minPercent: number, maxPercent: number) => {
    return analysisResults.filter(result => result.matchPercentage >= minPercent && result.matchPercentage <= maxPercent)
  }

  if (loadingLocal) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="card">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="animate-spin">🌐</span>
            <span>Chargement des données locales...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Section Connexion GitHub et Sélection du Repository */}
      <GitHubIntegration
        onRepoSelect={handleRepoSelect}
        onAuthChange={handleAuthChange}
        selectedRepo={selectedRepo}
        initialToken={githubToken}
        initialUsername={githubUsername}
      />

      {/* Section Analyse du Code */}
      {selectedRepo && isAuthenticated && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-800">Analyse du Code et Matching des Exigences</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Informations sur le repository sélectionné */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="font-medium text-blue-800">{selectedRepo.name}</div>
                  <div className="text-sm text-blue-600">{selectedRepo.full_name}</div>
                  {selectedRepo.description && (
                    <div className="text-xs text-gray-500 mt-1">{selectedRepo.description}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {selectedRepo.language && (
                  <span className="px-2 py-1 bg-gray-200 rounded text-xs">{selectedRepo.language}</span>
                )}
                <span className="px-2 py-1 bg-gray-200 rounded text-xs">⭐ {selectedRepo.stargazers_count}</span>
                <span className="px-2 py-1 bg-gray-200 rounded text-xs">🍴 {selectedRepo.forks_count}</span>
              </div>
            </div>

            {/* Bouton d'analyse */}
            <div className="flex gap-4 items-center">
              <button
                onClick={handleAnalyzeCode}
                className="btn btn-primary"
                disabled={loadingAnalysis || exigences.length === 0}
              >
                {loadingAnalysis ? (
                  <>
                    <span className="animate-spin">🌐</span> Analyse en cours...
                  </>
                ) : (
                  `Analyser le code (${exigences.length} exigences à vérifier)`
                )}
              </button>
              
              {exigences.length === 0 && (
                <span className="text-red-500 text-sm">
                  ⚠️ Aucune exigence disponible. Veuillez d'abord ajouter des exigences.
                </span>
              )}
              
              {analysisError && (
                <span className="text-red-500 text-sm">{analysisError}</span>
              )}
            </div>

            {/* Statistiques */}
            {analysisResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-800">{getFilteredResults(80, 100).length}</div>
                  <div className="text-sm text-green-600">Exigences > 80%</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-800">{getFilteredResults(50, 79).length}</div>
                  <div className="text-sm text-yellow-600">Exigences 50-80%</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-800">{getFilteredResults(0, 49).length}</div>
                  <div className="text-sm text-red-600">Exigences < 50%</div>
                </div>
              </div>
            )}

            {/* Tableau des résultats */}
            {analysisResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left p-3">Exigences Application</th>
                      <th className="text-left p-3">Exigences IA (Code)</th>
                      <th className="text-left p-3">% Match</th>
                      <th className="text-left p-3">Validé</th>
                      <th className="text-left p-3">Fichier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResults.map((result) => (
                      <tr
                        key={result.id}
                        className={result.matchPercentage >= 80 ? 'bg-green-50' : 
                                    result.matchPercentage >= 50 ? 'bg-yellow-50' : 'bg-red-50'}
                      >
                        <td className="p-3">
                          <div className="font-medium text-gray-800">{result.exigenceTitre}</div>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                            result.exigenceType === 'Fonctionnelle' ? 'bg-blue-100 text-blue-800' :
                            result.exigenceType === 'Technique' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {result.exigenceType}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-gray-600">{result.codeRequirement}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPercentageClass(result.matchPercentage)}`}>
                            {result.matchPercentage}%
                          </span>
                        </td>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={result.matched}
                            onChange={() => {}}
                            className="w-4 h-4"
                            disabled={result.matchPercentage < 80}
                          />
                        </td>
                        <td className="p-3">
                          <div className="text-xs text-gray-500 font-mono">{result.filePath}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !loadingAnalysis && (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune analyse effectuée. Cliquez sur "Analyser le code" pour commencer.</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Section Exigences locales (pour référence) */}
      {exigences.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-800">Exigences de l'Application ({exigences.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exigences.map(exigence => (
                <div key={exigence.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exigence.type === 'Fonctionnelle' ? 'bg-blue-100 text-blue-800' :
                      exigence.type === 'Technique' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exigence.type}
                    </span>
                  </div>
                  <div className="font-medium text-gray-800 mt-2">{exigence.titre}</div>
                  {exigence.description && (
                    <div className="text-sm text-gray-600 mt-1">{exigence.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Statut: {exigence.statut}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

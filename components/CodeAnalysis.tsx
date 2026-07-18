'use client'

import { useState } from 'react'
import type { Exigence } from '@/types/exigence'
import type { CodeAnalysisResult } from '@/types/github'

type CodeFile = {
  path: string
  content: string
}

type CodeAnalysisProps = {
  exigences: Exigence[]
  onAnalysisComplete: (results: CodeAnalysisResult[]) => void
  isAnalyzing: boolean
  onAnalyze: () => void
}

export default function CodeAnalysis({
  exigences,
  onAnalysisComplete,
  isAnalyzing,
  onAnalyze
}: CodeAnalysisProps) {
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysisResult[]>([])
  const [selectedResult, setSelectedResult] = useState<CodeAnalysisResult | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  // Analyser le code et faire le matching avec les exigences
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
          
          // Generer une description de l'exigence IA
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
    
    // Trier par pourcentage decroissant
    results.sort((a, b) => b.matchPercentage - a.matchPercentage)
    
    return results
  }

  // Calculer le score de matching entre une exigence et du code
  const calculateMatchScore = (exigence: Exigence, codeContent: string, filePath: string): number => {
    let score = 0
    const exigenceText = `${exigence.titre} ${exigence.description || ''}`.toLowerCase()
    const exigenceWords = exigenceText.split(/\s+/).filter(word => word.length > 3)
    
    // Score base sur les mots cles
    exigenceWords.forEach(word => {
      if (codeContent.includes(word)) {
        score += 1
      }
    })
    
    // Bonus pour les mots importants (verbes d'action)
    const actionWords = ['creer', 'ajouter', 'supprimer', 'mettre', 'a', 'jour', 'valider', 'calculer', 'afficher', 'gerer', 'stocker', 'verifier', 'authentifier', 'autoriser', 'charger', 'sauvegarder', 'exporter', 'importer']
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
    
    // Trouver les lignes qui contiennent des mots cles de l'exigence
    const relevantLines = lines.filter(line => 
      line.toLowerCase().split(/\s+/).some(word => 
        word.length > 3 && exigenceText.includes(word)
      )
    )
    
    if (relevantLines.length > 0) {
      // Retourner jusqu'a 3 lignes pertinentes
      return relevantLines.slice(0, 3).join('\n')
    }
    
    // Sinon, retourner les premieres lignes du fichier
    return lines.slice(0, 5).join('\n')
  }

  // Generer une description IA de l'exigence trouvee dans le code
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
      return `Implementation: ${sampleLine.substring(0, 80)}...`
    }
    
    // Analyser le contenu pour trouver des patterns
    if (codeContent.includes('function') || codeContent.includes('def ')) {
      return `Fonction implementee dans ${filePath} pour ${exigence.titre}`
    }
    
    if (codeContent.includes('class ')) {
      return `Classe implementee dans ${filePath} pour ${exigence.titre}`
    }
    
    if (codeContent.includes('api') || codeContent.includes('endpoint')) {
      return `Endpoint API implemente dans ${filePath} pour ${exigence.titre}`
    }
    
    return `Code lie a: ${exigence.titre} dans ${filePath}`
  }

  // Filtrer les resultats
  const filteredResults = analysisResults.filter(result => {
    const matchesSearch = result.exigenceTitre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.codeRequirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.filePath.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'high' && result.matchPercentage >= 80) ||
      (filterType === 'medium' && result.matchPercentage >= 50 && result.matchPercentage < 80) ||
      (filterType === 'low' && result.matchPercentage < 50)
    
    return matchesSearch && matchesFilter
  })

  // Statistiques
  const stats = {
    high: analysisResults.filter(r => r.matchPercentage >= 80).length,
    medium: analysisResults.filter(r => r.matchPercentage >= 50 && r.matchPercentage < 80).length,
    low: analysisResults.filter(r => r.matchPercentage < 50).length,
    total: analysisResults.length
  }

  // Determiner la classe CSS en fonction du pourcentage
  const getPercentageClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800'
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  // Determiner la classe pour la ligne du tableau
  const getRowClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 hover:bg-green-100'
    if (percentage >= 50) return 'bg-yellow-50 hover:bg-yellow-100'
    return 'bg-red-50 hover:bg-red-100'
  }

  // Determiner la classe pour le badge de type
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Fonctionnelle':
        return 'bg-blue-100 text-blue-800'
      case 'Technique':
        return 'bg-purple-100 text-purple-800'
      case 'Non fonctionnelle':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Bouton d'analyse */}
      <div className="flex gap-4 items-center">
        <button
          onClick={onAnalyze}
          className="btn btn-primary"
          disabled={isAnalyzing || exigences.length === 0}
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin">[*]</span> Analyse en cours...
            </>
          ) : (
            `Analyser le code (${exigences.length} exigences)`
          )}
        </button>
        
        {exigences.length === 0 && (
          <span className="text-red-500 text-sm">
            [!] Aucune exigence disponible. Veuillez d&apos;abord ajouter des exigences.
          </span>
        )}
      </div>

      {/* Statistiques */}
      {analysisResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800">{stats.high}</div>
            <div className="text-sm text-green-600">Exigences &gt; 80%</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-800">{stats.medium}</div>
            <div className="text-sm text-yellow-600">Exigences 50-80%</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-800">{stats.low}</div>
            <div className="text-sm text-red-600">Exigences &lt; 50%</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
        </div>
      )}

      {/* Filtres */}
      {analysisResults.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les resultats..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les resultats</option>
              <option value="high">&gt; 80%</option>
              <option value="medium">50-80%</option>
              <option value="low">&lt; 50%</option>
            </select>
          </div>
        </div>
      )}

      {/* Tableau des resultats */}
      {analysisResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left p-3">Exigence (App)</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Exigence (IA - Code)</th>
                <th className="text-left p-3">% Match</th>
                <th className="text-left p-3">Valide</th>
                <th className="text-left p-3">Fichier</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr
                  key={result.id}
                  className={getRowClass(result.matchPercentage)}
                >
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{result.exigenceTitre}</div>
                    {result.exigenceDescription && (
                      <div className="text-xs text-gray-500 mt-1">{result.exigenceDescription}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeClass(result.exigenceType)}`}>
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
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="btn btn-secondary btn-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isAnalyzing && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune analyse effectuee. Cliquez sur &quot;Analyser le code&quot; pour commencer.</p>
          </div>
        )
      )}

      {/* Modal de details */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Details du Matching</h3>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  [X]
                </button>
              </div>

              <div className="space-y-4">
                {/* Exigence Application */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Exigence Application</h4>
                  <div className="text-gray-800">{selectedResult.exigenceTitre}</div>
                  {selectedResult.exigenceDescription && (
                    <div className="text-sm text-gray-600 mt-2">{selectedResult.exigenceDescription}</div>
                  )}
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeClass(selectedResult.exigenceType)}`}>
                    {selectedResult.exigenceType}
                  </span>
                </div>

                {/* Exigence IA */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Exigence IA (Code)</h4>
                  <div className="text-gray-800">{selectedResult.codeRequirement}</div>
                </div>

                {/* Matching */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Score de Matching</h4>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-lg text-2xl font-bold ${getPercentageClass(selectedResult.matchPercentage)}`}>
                      {selectedResult.matchPercentage}%
                    </span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Statut: {selectedResult.matched ? '[OK] Valide' : '[KO] Non valide'}</div>
                      <div className="text-sm text-gray-600">Fichier: {selectedResult.filePath}</div>
                    </div>
                  </div>
                </div>

                {/* Extrait de code */}
                {selectedResult.codeSnippet && (
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Extrait de code</h4>
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      {selectedResult.codeSnippet}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="btn btn-secondary"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'

type CodeFunction = {
  id: string
  name: string
  description: string
  file: string
  line: number
  codeSnippet?: string
}

type MatchResult = {
  type: 'intuitive' | 'possible' | 'none'
  codeFunction: CodeFunction
  matchedExigence?: Exigence
  confidence: number
  isValidated: boolean
}

type ManualMatch = {
  codeFunction: CodeFunction
  selectedExigenceId: string | ''
  isValidated: boolean
}

export default function CodePage() {
  const [githubRepo, setGithubRepo] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [manualMatches, setManualMatches] = useState<ManualMatch[]>([])
  const [analysisDone, setAnalysisDone] = useState(false)
  const [foundFunctions, setFoundFunctions] = useState<CodeFunction[]>([])

  // Charger les exigences et features depuis localStorage
  useEffect(() => {
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    
    if (savedExigences) {
      setExigences(JSON.parse(savedExigences))
    }
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
    }
  }, [])

  // Extraire le owner et repo du champ githubRepo
  const getOwnerAndRepo = () => {
    const parts = githubRepo.split('/')
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] }
    }
    return { owner: '', repo: '' }
  }

  // Appel à l'API GitHub pour récupérer le contenu du dépôt
  const fetchGitHubContents = async (owner: string, repo: string, path: string = '', token?: string) => {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (token) {
      headers['Authorization'] = `token ${token}`
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    
    try {
      const response = await fetch(url, { headers })
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        if (response.status === 403) {
          throw new Error('Limite de requêtes API dépassée ou token invalide')
        }
        throw new Error(`Erreur API GitHub: ${response.status}`)
      }
      
      return await response.json()
    } catch (err) {
      console.error('Erreur fetch:', err)
      throw err
    }
  }

  // Extraire les fonctions d'un fichier TypeScript/JavaScript
  const extractFunctionsFromCode = (code: string, filePath: string): CodeFunction[] => {
    const functions: CodeFunction[] = []
    const lines = code.split('\n')
    
    // Expressions régulières pour détecter les fonctions
    const functionRegex = /(?:function|const|class|async function|export function|export const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?:[(\[]|:)/g
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
    const arrowFunctionRegex = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\(/g
    
    // Parcourir chaque ligne
    lines.forEach((line, index) => {
      const lineNum = index + 1
      
      // Chercher les fonctions normales
      let match
      while ((match = functionRegex.exec(line)) !== null) {
        const functionName = match[1]
        if (functionName && !['if', 'for', 'while', 'switch', 'return'].includes(functionName)) {
          // Extraire la description des commentaires au-dessus
          const description = extractDescriptionFromComments(lines, index)
          
          functions.push({
            id: `${filePath}-${lineNum}-${functionName}`,
            name: functionName,
            description: description || `Fonction ${functionName} dans ${filePath}`,
            file: filePath,
            line: lineNum,
            codeSnippet: line.trim(),
          })
        }
      }
      
      // Chercher les classes
      while ((match = classRegex.exec(line)) !== null) {
        const className = match[1]
        if (className) {
          const description = extractDescriptionFromComments(lines, index)
          
          functions.push({
            id: `${filePath}-${lineNum}-${className}`,
            name: className,
            description: description || `Classe ${className} dans ${filePath}`,
            file: filePath,
            line: lineNum,
            codeSnippet: line.trim(),
          })
        }
      }
      
      // Chercher les arrow functions
      while ((match = arrowFunctionRegex.exec(line)) !== null) {
        const constName = match[1]
        if (constName) {
          const description = extractDescriptionFromComments(lines, index)
          
          functions.push({
            id: `${filePath}-${lineNum}-${constName}`,
            name: constName,
            description: description || `Constante ${constName} dans ${filePath}`,
            file: filePath,
            line: lineNum,
            codeSnippet: line.trim(),
          })
        }
      }
    })
    
    return functions
  }

  // Extraire la description des commentaires au-dessus d'une ligne
  const extractDescriptionFromComments = (lines: string[], lineIndex: number): string | null => {
    // Remonter de 3 lignes maximum pour chercher des commentaires
    const startLine = Math.max(0, lineIndex - 3)
    const endLine = lineIndex
    
    for (let i = startLine; i < endLine; i++) {
      const line = lines[i].trim()
      
      // Commentaires // ou /* */
      if (line.startsWith('//')) {
        return line.substring(2).trim()
      }
      if (line.startsWith('*') || line.startsWith('/*')) {
        // Extraire le contenu entre /* et */
        const commentContent = line.replace(/\/\*|\*\/|\*/g, '').trim()
        if (commentContent) {
          return commentContent
        }
      }
      // JSDoc
      if (line.startsWith('/**')) {
        // Lire jusqu'à */
        let j = i
        let docString = ''
        while (j < lines.length && !lines[j].includes('*/')) {
          docString += lines[j].replace(/\/\*\*|\*\/|\*/g, '').trim() + ' '
          j++
        }
        if (docString.trim()) {
          return docString.trim()
        }
      }
    }
    
    return null
  }

  // Analyser le code depuis GitHub
  const analyzeCode = async () => {
    if (!githubRepo) {
      setError('Veuillez entrer un nom de dépôt GitHub (ex: owner/repo)')
      return
    }

    const { owner, repo } = getOwnerAndRepo()
    if (!owner || !repo) {
      setError('Format invalide. Utilisez: owner/repo')
      return
    }

    setIsLoading(true)
    setError(null)
    setAnalysisDone(false)
    setFoundFunctions([])
    setMatchResults([])
    setManualMatches([])

    try {
      // Récupérer la liste des fichiers à la racine
      const rootContents = await fetchGitHubContents(owner, repo, '', githubToken || undefined)
      
      if (!rootContents || !Array.isArray(rootContents)) {
        throw new Error('Dépôt non trouvé ou inaccessible')
      }

      // Filtrer les fichiers TypeScript/JavaScript
      const codeFiles = rootContents.filter((item: any) => 
        item.type === 'file' && 
        (item.name.endsWith('.ts') || 
         item.name.endsWith('.tsx') || 
         item.name.endsWith('.js') || 
         item.name.endsWith('.jsx'))
      )

      // Lire le contenu de chaque fichier
      const allFunctions: CodeFunction[] = []
      
      for (const file of codeFiles) {
        try {
          const fileContents = await fetchGitHubContents(owner, repo, file.path, githubToken || undefined)
          if (fileContents && typeof fileContents === 'object' && 'content' in fileContents) {
            // Décoder le contenu base64
            const content = Buffer.from(fileContents.content, 'base64').toString('utf-8')
            const functions = extractFunctionsFromCode(content, file.path)
            allFunctions.push(...functions)
          }
        } catch (err) {
          console.warn(`Impossible de lire ${file.path}:`, err)
          // Ignorer les fichiers trop gros ou inaccessibles
        }
      }

      setFoundFunctions(allFunctions)

      // Classer les fonctions selon leur correspondance avec les exigences
      const newMatchResults: MatchResult[] = []
      const newManualMatches: ManualMatch[] = []

      allFunctions.forEach((func) => {
        const bestMatch = findBestMatch(func, exigences)
        
        if (bestMatch) {
          const confidence = calculateConfidence(func, bestMatch)
          const type = confidence > 80 ? 'intuitive' : 'possible'
          
          newMatchResults.push({
            type,
            codeFunction: func,
            matchedExigence: bestMatch,
            confidence,
            isValidated: false,
          })
        } else {
          newManualMatches.push({
            codeFunction: func,
            selectedExigenceId: '',
            isValidated: false,
          })
        }
      })

      setMatchResults(newMatchResults)
      setManualMatches(newManualMatches)
      setAnalysisDone(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse du code')
      console.error('Erreur:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Trouver la meilleure correspondance entre une fonction et les exigences
  const findBestMatch = (func: CodeFunction, exigences: Exigence[]): Exigence | null => {
    if (exigences.length === 0) return null

    const funcText = `${func.name} ${func.description}`.toLowerCase()
    
    let bestMatch: Exigence | null = null
    let bestScore = 0

    exigences.forEach((exigence) => {
      const exigenceText = `${exigence.titre} ${exigence.description}`.toLowerCase()
      
      // Calculer un score de similarité
      const commonWords = funcText.split(' ').filter(word => 
        exigenceText.includes(word) && word.length > 3
      ).length
      
      if (commonWords > bestScore) {
        bestScore = commonWords
        bestMatch = exigence
      }
    })

    return bestScore >= 2 ? bestMatch : null
  }

  // Calculer le pourcentage de confiance
  const calculateConfidence = (func: CodeFunction, exigence: Exigence): number => {
    const funcText = `${func.name} ${func.description}`.toLowerCase()
    const exigenceText = `${exigence.titre} ${exigence.description}`.toLowerCase()
    
    const funcWords = funcText.split(' ').filter(w => w.length > 3)
    const exigenceWords = exigenceText.split(' ').filter(w => w.length > 3)
    
    const commonWords = funcWords.filter(word => exigenceWords.includes(word)).length
    const totalWords = Math.max(funcWords.length, exigenceWords.length)
    
    const confidence = Math.round((commonWords / totalWords) * 100)
    return Math.min(confidence, 100)
  }

  // Gérer la validation d'un rapprochement
  const toggleValidation = (index: number, type: 'match' | 'manual') => {
    if (type === 'match') {
      setMatchResults((prev) => {
        const newResults = [...prev]
        newResults[index].isValidated = !newResults[index].isValidated
        return newResults
      })
    } else {
      setManualMatches((prev) => {
        const newMatches = [...prev]
        newMatches[index].isValidated = !newMatches[index].isValidated
        return newMatches
      })
    }
  }

  // Gérer la sélection d'une exigence pour un match manuel
  const handleExigenceSelection = (index: number, exigenceId: string) => {
    setManualMatches((prev) => {
      const newMatches = [...prev]
      newMatches[index].selectedExigenceId = exigenceId
      return newMatches
    })
  }

  // Sauvegarder les associations validées
  const saveAssociations = () => {
    const validatedMatches = matchResults.filter((m) => m.isValidated)
    const validatedManualMatches = manualMatches.filter((m) => m.isValidated && m.selectedExigenceId)

    const associations = {
      date: new Date().toISOString(),
      repo: githubRepo,
      validatedMatches,
      validatedManualMatches,
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('codeAssociations', JSON.stringify(associations))

    alert(`Associations sauvegardées : ${validatedMatches.length + validatedManualMatches.length}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Analyse du Code Source</h1>

      {/* Formulaire de connexion GitHub */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Connexion à GitHub</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom du dépôt * (format: owner/repo)
            </label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="ex: mistralai/mistral-src"
              className="w-full max-w-md p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Token GitHub (optionnel, pour les dépôts privés)
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Token personnel GitHub"
              className="w-full max-w-md p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={analyzeCode}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Analyse en cours...' : 'Analyser le code'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Résultats de l'analyse */}
      {analysisDone && (
        <div className="space-y-8">
          {/* Info sur les fonctions trouvées */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-center">
              <strong>{foundFunctions.length}</strong> fonctions/classes trouvées dans le code source.
              {matchResults.length > 0 && (
                <span> <strong>{matchResults.length}</strong> ont été associées automatiquement.</span>
              )}
            </p>
          </div>

          {/* Section 1: Rapprochement intuitif */}
          {matchResults.filter((m) => m.type === 'intuitive').length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🟢</span>
                Rapprochement intuitif
              </h2>
              <p className="text-gray-600 mb-4">
                Les fonctions dont le nom ou la description correspondent clairement à une exigence existante.
              </p>

              <div className="space-y-4">
                {matchResults
                  .filter((m) => m.type === 'intuitive')
                  .map((match, index) => {
                    const matchIndex = matchResults.findIndex(
                      (m) => m.codeFunction.id === match.codeFunction.id && m.type === 'intuitive'
                    )
                    return (
                      <div
                        key={match.codeFunction.id}
                        className="bg-white p-4 rounded border-l-4 border-green-500"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={match.isValidated}
                            onChange={() => toggleValidation(matchIndex, 'match')}
                            className="mt-1 w-5 h-5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-green-700">
                              {match.codeFunction.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {match.codeFunction.file}:{match.codeFunction.line}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {match.codeFunction.description}
                            </div>
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium">
                                ↔️ {match.matchedExigence?.titre || 'Exigence correspondante'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Confiance: {match.confidence}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Section 2: Rapprochement possible */}
          {matchResults.filter((m) => m.type === 'possible').length > 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🟡</span>
                Rapprochement possible
              </h2>
              <p className="text-gray-600 mb-4">
                Les fonctions qui pourraient correspondre à une exigence, mais avec moins de certitude.
              </p>

              <div className="space-y-4">
                {matchResults
                  .filter((m) => m.type === 'possible')
                  .map((match, index) => {
                    const matchIndex = matchResults.findIndex(
                      (m) => m.codeFunction.id === match.codeFunction.id && m.type === 'possible'
                    )
                    return (
                      <div
                        key={match.codeFunction.id}
                        className="bg-white p-4 rounded border-l-4 border-yellow-500"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={match.isValidated}
                            onChange={() => toggleValidation(matchIndex, 'match')}
                            className="mt-1 w-5 h-5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-yellow-700">
                              {match.codeFunction.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {match.codeFunction.file}:{match.codeFunction.line}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {match.codeFunction.description}
                            </div>
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium">
                                ↔️ {match.matchedExigence?.titre || 'Exigence correspondante'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Confiance: {match.confidence}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Section 3: Aucun rapprochement */}
          {manualMatches.length > 0 && (
            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                Aucun rapprochement trouvé
              </h2>
              <p className="text-gray-600 mb-4">
                Les fonctions pour lesquelles aucun rapprochement automatique n'a été trouvé.
                Associez-les manuellement aux exigences existantes.
              </p>

              <div className="space-y-4">
                {manualMatches.map((manualMatch, index) => (
                  <div
                    key={manualMatch.codeFunction.id}
                    className="bg-white p-4 rounded border-l-4 border-red-500"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={manualMatch.isValidated}
                        onChange={() => toggleValidation(index, 'manual')}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-red-700">
                          {manualMatch.codeFunction.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {manualMatch.codeFunction.file}:{manualMatch.codeFunction.line}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {manualMatch.codeFunction.description}
                        </div>
                        {exigences.length > 0 && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium mb-1">
                              Associer à une exigence :
                            </label>
                            <select
                              value={manualMatch.selectedExigenceId}
                              onChange={(e) => handleExigenceSelection(index, e.target.value)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">-- Sélectionnez une exigence --</option>
                              {exigences.map((exigence) => (
                                <option key={exigence.id} value={exigence.id}>
                                  {exigence.titre}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {exigences.length === 0 && (
                          <div className="mt-3 text-sm text-gray-500">
                            Aucune exigence disponible. Veuillez d'abord créer des exigences.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton de sauvegarde */}
          {(matchResults.length > 0 || manualMatches.length > 0) && (
            <div className="flex justify-end">
              <button
                onClick={saveAssociations}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Sauvegarder les associations
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message si aucune analyse effectuée */}
      {!analysisDone && !isLoading && (
        <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
          Entrez un nom de dépôt GitHub et cliquez sur "Analyser le code" pour commencer.
        </div>
      )}
    </div>
  )
}

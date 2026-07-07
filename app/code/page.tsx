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
}

type MatchResult = {
  type: 'intuitive' | 'possible' | 'none'
  codeFunction: CodeFunction
  matchedExigence?: Exigence
  confidence: number // % de fiabilité (0-100)
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

  // Simuler l'analyse du code GitHub
  const analyzeCode = async () => {
    if (!githubRepo) {
      setError('Veuillez entrer un nom de dépôt GitHub (ex: owner/repo)')
      return
    }

    setIsLoading(true)
    setError(null)
    setAnalysisDone(false)

    try {
      // Simulation d'un appel à l'API GitHub (à remplacer par un vrai appel)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Générer des fonctions de code simulées
      const simulatedFunctions: CodeFunction[] = [
        {
          id: '1',
          name: 'selectRoom',
          description: 'Permet à l\'utilisateur de sélectionner une chambre disponible',
          file: 'src/components/RoomSelection.tsx',
          line: 42,
        },
        {
          id: '2',
          name: 'addToCart',
          description: 'Ajoute une chambre au panier de réservation',
          file: 'src/services/CartService.ts',
          line: 15,
        },
        {
          id: '3',
          name: 'confirmBooking',
          description: 'Confirme la réservation et envoie un email de confirmation',
          file: 'src/services/BookingService.ts',
          line: 28,
        },
        {
          id: '4',
          name: 'validateUserInput',
          description: 'Valide les entrées utilisateur avant soumission',
          file: 'src/utils/validation.ts',
          line: 89,
        },
        {
          id: '5',
          name: 'calculatePrice',
          description: 'Calcule le prix total en fonction des options sélectionnées',
          file: 'src/services/PricingService.ts',
          line: 33,
        },
      ]

      // Classer les fonctions selon leur correspondance avec les exigences
      const newMatchResults: MatchResult[] = []
      const newManualMatches: ManualMatch[] = []

      simulatedFunctions.forEach((func) => {
        // Trouver la meilleure correspondance avec les exigences
        const bestMatch = findBestMatch(func, exigences)
        
        if (bestMatch) {
          // Rapprochement intuitif ou possible
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
          // Aucun rapprochement
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
      setError('Erreur lors de l\'analyse du code. Vérifiez le nom du dépôt.')
      console.error('Erreur:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Trouver la meilleure correspondance entre une fonction et les exigences
  const findBestMatch = (func: CodeFunction, exigences: Exigence[]): Exigence | null => {
    if (exigences.length === 0) return null

    // Comparer le nom et la description de la fonction avec les exigences
    const funcText = `${func.name} ${func.description}`.toLowerCase()
    
    let bestMatch: Exigence | null = null
    let bestScore = 0

    exigences.forEach((exigence) => {
      const exigenceText = `${exigence.titre} ${exigence.description}`.toLowerCase()
      
      // Calculer un score de similarité simple
      const commonWords = funcText.split(' ').filter(word => 
        exigenceText.includes(word) && word.length > 3
      ).length
      
      if (commonWords > bestScore) {
        bestScore = commonWords
        bestMatch = exigence
      }
    })

    // Seuil minimum pour considérer un match
    return bestScore >= 2 ? bestMatch : null
  }

  // Calculer le pourcentage de confiance
  const calculateConfidence = (func: CodeFunction, exigence: Exigence): number => {
    const funcText = `${func.name} ${func.description}`.toLowerCase()
    const exigenceText = `${exigence.titre} ${exigence.description}`.toLowerCase()
    
    // Compter les mots communs
    const funcWords = funcText.split(' ').filter(w => w.length > 3)
    const exigenceWords = exigenceText.split(' ').filter(w => w.length > 3)
    
    const commonWords = funcWords.filter(word => exigenceWords.includes(word)).length
    const totalWords = Math.max(funcWords.length, exigenceWords.length)
    
    // Calculer un pourcentage (arrondi)
    const confidence = Math.round((commonWords / totalWords) * 100)
    return Math.min(confidence, 100) // Max 100%
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

    // Ici, on pourrait sauvegarder dans localStorage ou envoyer à une API
    console.log('Associations validées:', {
      validatedMatches,
      validatedManualMatches,
    })

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
          {/* Section 1: Rapprochement intuitif */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              Rapprochement intuitif
            </h2>
            <p className="text-gray-600 mb-4">
              Les fonctions dont le nom ou la description correspondent clairement à une exigence existante.
            </p>

            {matchResults.filter((m) => m.type === 'intuitive').length > 0 ? (
              <div className="space-y-4">
                {matchResults
                  .filter((m) => m.type === 'intuitive')
                  .map((match, index) => (
                    <div
                      key={match.codeFunction.id}
                      className="bg-white p-4 rounded border-l-4 border-green-500"
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={match.isValidated}
                          onChange={() => toggleValidation(index, 'match')}
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
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun rapprochement intuitif trouvé.</p>
            )}
          </div>

          {/* Section 2: Rapprochement possible */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🟡</span>
              Rapprochement possible
            </h2>
            <p className="text-gray-600 mb-4">
              Les fonctions qui pourraient correspondre à une exigence, mais avec moins de certitude.
            </p>

            {matchResults.filter((m) => m.type === 'possible').length > 0 ? (
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
            ) : (
              <p className="text-gray-500">Aucun rapprochement possible trouvé.</p>
            )}
          </div>

          {/* Section 3: Aucun rapprochement */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              Aucun rapprochement trouvé
            </h2>
            <p className="text-gray-600 mb-4">
              Les fonctions pour lesquelles aucun rapprochement automatique n'a été trouvé.
            </p>

            {manualMatches.length > 0 ? (
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune fonction sans rapprochement.</p>
            )}
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <button
              onClick={saveAssociations}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Sauvegarder les associations
            </button>
          </div>
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

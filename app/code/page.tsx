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
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [codeFunctions, setCodeFunctions] = useState<CodeFunction[]>([])
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [manualMatches, setManualMatches] = useState<ManualMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<string>('')

  const loadData = () => {
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const handleAddCodeFunction = () => {
    const newFunction: CodeFunction = {
      id: generateId(),
      name: 'newFunction',
      description: 'Description de la nouvelle fonction',
      file: 'src/file.ts',
      line: 1,
      codeSnippet: 'function newFunction() { }',
    }
    setCodeFunctions([...codeFunctions, newFunction])
    showNotification('Fonction ajoutée avec succès !')
  }

  const handleMatchCode = () => {
    // Logique de matching simplifiée
    const newMatchResults: MatchResult[] = codeFunctions.map((func) => {
      const randomExigence = exigences[Math.floor(Math.random() * exigences.length)]
      return {
        type: Math.random() > 0.5 ? 'intuitive' : 'possible',
        codeFunction: func,
        matchedExigence: randomExigence,
        confidence: Math.random(),
        isValidated: false,
      }
    })
    setMatchResults(newMatchResults)
    showNotification(`Matching effectué : ${newMatchResults.length} correspondances trouvées`)
  }

  const handleValidateMatch = (index: number) => {
    const updatedMatches = [...matchResults]
    updatedMatches[index].isValidated = true
    setMatchResults(updatedMatches)
    showNotification('Correspondance validée !')
  }

  const handleManualMatch = (codeFunction: CodeFunction, exigenceId: string) => {
    const existingMatchIndex = manualMatches.findIndex(
      (m) => m.codeFunction.id === codeFunction.id
    )
    if (existingMatchIndex >= 0) {
      const updatedMatches = [...manualMatches]
      updatedMatches[existingMatchIndex] = {
        codeFunction,
        selectedExigenceId: exigenceId,
        isValidated: false,
      }
      setManualMatches(updatedMatches)
    } else {
      setManualMatches([
        ...manualMatches,
        {
          codeFunction,
          selectedExigenceId: exigenceId,
          isValidated: false,
        },
      ])
    }
    showNotification('Correspondance manuelle ajoutée !')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="neumorphic-card px-6 py-4">
          <div className="flex items-center gap-2 text-neumorphic">
            <span className="animate-spin">🌀</span>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">💻 Analyse du Code</h1>
        <p className="text-neumorphic-muted">Associez vos fonctions de code aux exigences</p>
      </div>

      {notification && (
        <div
          className={`neumorphic-card p-4 notification-slide-in ${
            notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Fonctions de Code */}
        <div className="neumorphic-card p-6">
          <h2 className="text-lg font-semibold text-neumorphic mb-4">Fonctions de Code</h2>
          <button
            onClick={handleAddCodeFunction}
            className="neumorphic-button px-4 py-2 mb-4"
          >
            ➕ Ajouter une fonction
          </button>
          <div className="space-y-3">
            {codeFunctions.length === 0 ? (
              <p className="text-neumorphic-muted text-center py-4">
                Aucune fonction de code enregistrée
              </p>
            ) : (
              codeFunctions.map((func) => (
                <div key={func.id} className="neumorphic-card p-3">
                  <div className="font-medium text-neumorphic">{func.name}</div>
                  <div className="text-sm text-neumorphic-muted">{func.file}:{func.line}</div>
                  <div className="text-sm text-neumorphic-muted mt-1">{func.description}</div>
                  {func.codeSnippet && (
                    <pre className="mt-2 p-2 bg-neumorphic-dark rounded text-xs overflow-x-auto">
                      {func.codeSnippet}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section Matching */}
        <div className="neumorphic-card p-6">
          <h2 className="text-lg font-semibold text-neumorphic mb-4">Matching Code ↔ Exigences</h2>
          <button
            onClick={handleMatchCode}
            className="neumorphic-button px-4 py-2 mb-4 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300"
          >
            🔍 Lancer le Matching
          </button>
          <div className="space-y-3">
            {matchResults.length === 0 ? (
              <p className="text-neumorphic-muted text-center py-4">
                Aucun matching effectué
              </p>
            ) : (
              matchResults.map((result, index) => (
                <div key={index} className="neumorphic-card p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-neumorphic">{result.codeFunction.name}</div>
                      <div className="text-sm text-neumorphic-muted">
                        Match: {result.matchedExigence?.titre || 'Aucune'}
                      </div>
                      <div className="text-sm text-neumorphic-muted">
                        Type: {result.type} | Confiance: {(result.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    {!result.isValidated && (
                      <button
                        onClick={() => handleValidateMatch(index)}
                        className="neumorphic-button px-3 py-1 text-xs bg-green-500/20 hover:bg-green-500/40 text-green-300"
                      >
                        ✅ Valider
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section Correspondances Manuelles */}
      {manualMatches.length > 0 && (
        <div className="neumorphic-card p-6">
          <h2 className="text-lg font-semibold text-neumorphic mb-4">
            Correspondances Manuelles ({manualMatches.length})
          </h2>
          <div className="space-y-3">
            {manualMatches.map((match, index) => (
              <div key={index} className="neumorphic-card p-3">
                <div className="font-medium text-neumorphic">{match.codeFunction.name}</div>
                <div className="text-sm text-neumorphic-muted">
                  → {exigences.find((e) => e.id === match.selectedExigenceId)?.titre || 'Exigence inconnue'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

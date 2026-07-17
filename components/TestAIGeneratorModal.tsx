'use client'

import { useState, useEffect } from 'react'
import type { Exigence } from '@/types/exigence'
import type { Test } from '@/types/test'

type TestAIGeneratorModalProps = {
  exigence: Exigence | null
  onClose: () => void
  onGenerate: (tests: Test[]) => void
}

// Générer un ID unique
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Suggestions de Tests prédéfinies
const getAISuggestions = (exigenceTitre: string, exigenceId: string): Test[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string; type: 'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite'; priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique' }[]> = {
    'Sélection de chambre disponible': [
      {
        titre: 'Test de sélection valide',
        description: 'Vérifier que l\'utilisateur peut sélectionner une chambre disponible.',
        type: 'Unitaire',
        priorite: 'Elevee',
      },
      {
        titre: 'Test de sélection invalide',
        description: 'Vérifier que l\'utilisateur ne peut pas sélectionner une chambre non disponible.',
        type: 'Unitaire',
        priorite: 'Moyenne',
      },
      {
        titre: 'Test d\'affichage des chambres',
        description: 'Vérifier que toutes les chambres disponibles sont affichées correctement.',
        type: 'Integration',
        priorite: 'Moyenne',
      },
    ],
  }

  const suggestions = suggestionsMap[exigenceTitre] || [
    {
      titre: 'Test fonctionnel principal',
      description: `Test fonctionnel principal pour l'exigence: ${exigenceTitre}`,
      type: 'Unitaire',
      priorite: 'Moyenne',
    },
    {
      titre: 'Test d\'intégration',
      description: 'Vérifier que cette exigence s\'intègre correctement avec les autres composants.',
      type: 'Integration',
      priorite: 'Moyenne',
    },
    {
      titre: 'Test de performance',
      description: 'Vérifier que cette exigence a de bonnes performances.',
      type: 'Performance',
      priorite: 'Faible',
    },
    {
      titre: 'Test de sécurité',
      description: 'Vérifier que cette exigence est sécurisée.',
      type: 'Securite',
      priorite: 'Elevee',
    },
  ]

  return suggestions.map((suggestion) => ({
    id: generateId(),
    titre: suggestion.titre,
    description: suggestion.description,
    type: suggestion.type,
    statut: 'A faire' as const,
    exigenceId,
    isTNR: false,
    isAutomatisable: suggestion.type !== 'E2E',
    priorite: suggestion.priorite,
    created_at: now,
    updated_at: now,
  }))
}

const getTypeDisplay = (type: string): string => {
  switch (type) {
    case 'Securite':
      return 'Sécurité'
    case 'Integration':
      return 'Intégration'
    case 'E2E':
      return 'E2E'
    case 'Performance':
      return 'Performance'
    default:
      return type
  }
}

const getPrioriteDisplay = (priorite: string): string => {
  switch (priorite) {
    case 'Elevee':
      return 'Élevée'
    default:
      return priorite
  }
}

export default function TestAIGeneratorModal({ exigence, onClose, onGenerate }: TestAIGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Test[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsOpen(!!exigence)
    if (exigence) {
      setLoading(true)
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(exigence.titre, exigence.id)
        setSuggestions(generatedSuggestions)
        setSelectedSuggestions(new Array(generatedSuggestions.length).fill(true))
        setLoading(false)
      }, 1000)
    }
  }, [exigence])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleGenerate = () => {
    const selectedTests = suggestions.filter((_, index) => selectedSuggestions[index])
    onGenerate(selectedTests)
    handleClose()
  }

  const toggleSuggestion = (index: number) => {
    const updated = [...selectedSuggestions]
    updated[index] = !updated[index]
    setSelectedSuggestions(updated)
  }

  if (!isOpen || !exigence) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🤖 Génération IA de Tests</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-muted">
              Exigence: <span className="text-gray-800 font-medium">{exigence.titre}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="animate-spin">🌀</span>
                <span>Génération en cours...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted mb-4">
                L&apos;IA a généré {suggestions.length} suggestions de Tests pour cette Exigence.
                Sélectionnez celles que vous souhaitez ajouter.
              </p>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 border border-gray-200 rounded-lg ${selectedSuggestions[index] ? 'border-l-4 border-primary' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSuggestions[index]}
                        onChange={() => toggleSuggestion(index)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">{suggestion.titre}</div>
                          <div className="flex gap-1">
                            <span className="env-badge">
                              {getTypeDisplay(suggestion.type)}
                            </span>
                            <span className={`env-badge ${
                              suggestion.priorite === 'Critique' ? 'bg-error-light text-error' :
                              suggestion.priorite === 'Elevee' ? 'bg-warning-light text-warning' :
                              suggestion.priorite === 'Moyenne' ? 'bg-gray-200 text-gray-600' :
                              'bg-success-light text-success'
                            }`}>
                              {getPrioriteDisplay(suggestion.priorite)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted mt-1">{suggestion.description}</div>
                        <div className="text-xs text-muted mt-1">
                          {suggestion.isAutomatisable ? '✅ Automatisable' : '❌ Manuel'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary"
                >
                  ✅ Générer les Tests sélectionnés
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

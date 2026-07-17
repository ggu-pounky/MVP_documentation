'use client'

import { useState, useEffect } from 'react'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'

type ExigenceAIGeneratorModalProps = {
  feature: Feature | null
  onClose: () => void
  onGenerate: (exigences: Exigence[]) => void
}

// Générer un ID unique
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Suggestions d'Exigences prédéfinies
const getAISuggestions = (featureTitre: string, featureId: string): Exigence[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string; type: 'Fonctionnelle' | 'Non fonctionnelle' | 'Technique' }[]> = {
    'Réservation d\'une chambre': [
      {
        titre: 'Sélection de chambre disponible',
        description: 'L\'utilisateur doit pouvoir sélectionner une chambre parmi celles disponibles.',
        type: 'Fonctionnelle',
      },
      {
        titre: 'Confirmation de réservation',
        description: 'L\'utilisateur doit recevoir une confirmation par email après réservation.',
        type: 'Fonctionnelle',
      },
      {
        titre: 'Validation des données',
        description: 'Le système doit valider les données saisies par l\'utilisateur.',
        type: 'Non fonctionnelle',
      },
      {
        titre: 'Sécurité des transactions',
        description: 'Les transactions doivent être sécurisées et chiffrées.',
        type: 'Technique',
      },
    ],
  }

  const suggestions = suggestionsMap[featureTitre] || [
    {
      titre: 'Fonctionnalité principale',
      description: `Fonctionnalité principale pour la feature: ${featureTitre}`,
      type: 'Fonctionnelle',
    },
    {
      titre: 'Validation des entrées',
      description: 'Le système doit valider les entrées utilisateur.',
      type: 'Non fonctionnelle',
    },
    {
      titre: 'Performance',
      description: 'La feature doit avoir de bonnes performances.',
      type: 'Technique',
    },
    {
      titre: 'Sécurité',
      description: 'La feature doit être sécurisée.',
      type: 'Technique',
    },
  ]

  return suggestions.map((suggestion) => ({
    id: generateId(),
    titre: suggestion.titre,
    description: suggestion.description,
    type: suggestion.type,
    statut: 'A faire' as const,
    featureId,
    created_at: now,
    updated_at: now,
  }))
}

const getTypeDisplay = (type: string): string => {
  switch (type) {
    case 'Fonctionnelle':
      return 'Fonctionnelle'
    case 'Non fonctionnelle':
      return 'Non fonctionnelle'
    case 'Technique':
      return 'Technique'
    default:
      return type
  }
}

export default function ExigenceAIGeneratorModal({ feature, onClose, onGenerate }: ExigenceAIGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Exigence[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsOpen(!!feature)
    if (feature) {
      setLoading(true)
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(feature.titre, feature.id)
        setSuggestions(generatedSuggestions)
        setSelectedSuggestions(new Array(generatedSuggestions.length).fill(true))
        setLoading(false)
      }, 1000)
    }
  }, [feature])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleGenerate = () => {
    const selectedExigences = suggestions.filter((_, index) => selectedSuggestions[index])
    onGenerate(selectedExigences)
    handleClose()
  }

  const toggleSuggestion = (index: number) => {
    const updated = [...selectedSuggestions]
    updated[index] = !updated[index]
    setSelectedSuggestions(updated)
  }

  if (!isOpen || !feature) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🤖 Génération IA d&apos;Exigences</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-muted">
              Feature: <span className="text-gray-800 font-medium">{feature.titre}</span>
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
                L&apos;IA a généré {suggestions.length} suggestions d&apos;Exigences pour cette Feature.
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
                          <span className="env-badge">
                            {getTypeDisplay(suggestion.type)}
                          </span>
                        </div>
                        <div className="text-sm text-muted mt-1">{suggestion.description}</div>
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
                  ✅ Générer les Exigences sélectionnées
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

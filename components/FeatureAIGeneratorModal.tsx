'use client'

import { useState, useEffect } from 'react'
import type { Besoin } from '@/types/besoin'
import type { Feature } from '@/types/feature'

type FeatureAIGeneratorModalProps = {
  besoin: Besoin | null
  onClose: () => void
  onGenerate: (features: Feature[]) => void
}

// Générer un ID unique
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Suggestions de Features prédéfinies
const getAISuggestions = (besoinTitre: string, besoinId: string): Feature[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string; priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique' }[]> = {
    'Automatiser la gestion des réservations pour un hôtel en ligne': [
      {
        titre: 'Réservation d\'une chambre',
        description: 'Permettre à un client de sélectionner une chambre et de confirmer une réservation.',
        priorite: 'Elevee',
      },
      {
        titre: 'Modification d\'une réservation',
        description: 'Permettre à un client de modifier les dates ou le type de chambre.',
        priorite: 'Elevee',
      },
      {
        titre: 'Annulation d\'une réservation',
        description: 'Permettre à un client d\'annuler une réservation avec remboursement si applicable.',
        priorite: 'Elevee',
      },
      {
        titre: 'Calendrier des disponibilités',
        description: 'Afficher un calendrier interactif pour visualiser les disponibilités.',
        priorite: 'Moyenne',
      },
      {
        titre: 'Notifications de disponibilité',
        description: 'Envoyer des notifications aux gestionnaires pour les chambres disponibles.',
        priorite: 'Faible',
      },
    ],
  }

  const suggestions = suggestionsMap[besoinTitre] || [
    {
      titre: 'Implémentation principale',
      description: `Implémentation principale pour le besoin: ${besoinTitre}`,
      priorite: 'Moyenne',
    },
    {
      titre: 'Gestion des données',
      description: 'Gestion des données liées à ce besoin.',
      priorite: 'Moyenne',
    },
    {
      titre: 'Interface utilisateur',
      description: 'Développement de l\'interface utilisateur pour ce besoin.',
      priorite: 'Elevee',
    },
    {
      titre: 'Intégration et tests',
      description: 'Intégration et tests de cette fonctionnalité.',
      priorite: 'Faible',
    },
  ]

  return suggestions.map((suggestion) => ({
    id: generateId(),
    titre: suggestion.titre,
    description: suggestion.description,
    priorite: suggestion.priorite,
    statut: 'A faire' as const,
    besoinId,
    epicId: null,
    created_at: now,
    updated_at: now,
  }))
}

export default function FeatureAIGeneratorModal({ besoin, onClose, onGenerate }: FeatureAIGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Feature[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsOpen(!!besoin)
    if (besoin) {
      setLoading(true)
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(besoin.titre, besoin.id)
        setSuggestions(generatedSuggestions)
        setSelectedSuggestions(new Array(generatedSuggestions.length).fill(true))
        setLoading(false)
      }, 1000)
    }
  }, [besoin])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleGenerate = () => {
    const selectedFeatures = suggestions.filter((_, index) => selectedSuggestions[index])
    onGenerate(selectedFeatures)
    handleClose()
  }

  const toggleSuggestion = (index: number) => {
    const updated = [...selectedSuggestions]
    updated[index] = !updated[index]
    setSelectedSuggestions(updated)
  }

  const getPrioriteDisplay = (priorite: string): string => {
    switch (priorite) {
      case 'Elevee':
        return 'Élevée'
      default:
        return priorite
    }
  }

  if (!isOpen || !besoin) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🤖 Génération IA de Features</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-muted">
              Besoin: <span className="text-gray-800 font-medium">{besoin.titre}</span>
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
                L&apos;IA a généré {suggestions.length} suggestions de Features pour ce besoin.
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
                          <span className={`env-badge ${
                            suggestion.priorite === 'Elevee' ? 'bg-warning-light text-warning' :
                            suggestion.priorite === 'Critique' ? 'bg-error-light text-error' :
                            suggestion.priorite === 'Moyenne' ? 'bg-gray-200 text-gray-600' :
                            'bg-success-light text-success'
                          }`}>
                            {getPrioriteDisplay(suggestion.priorite)}
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
                  ✅ Générer les Features sélectionnées
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

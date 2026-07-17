'use client'

import { useState, useEffect } from 'react'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'

type EpicAIGeneratorModalProps = {
  besoin: Besoin | null
  onClose: () => void
  onGenerate: (epics: Epic[]) => void
}

// Générer un ID unique
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Suggestions d'EPICS prédéfinies par type de besoin
const getAISuggestions = (besoinTitre: string, besoinId: string): Epic[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string }[]> = {
    'Automatiser la gestion des réservations pour un hôtel en ligne': [
      {
        titre: 'Gestion des réservations clients',
        description: 'Permettre aux clients de réserver, modifier ou annuler une chambre.',
      },
      {
        titre: 'Gestion des disponibilités',
        description: 'Permettre aux gestionnaires de suivre et mettre à jour les disponibilités.',
      },
      {
        titre: 'Paiement et facturation',
        description: 'Intégrer un système de paiement sécurisé et générer des factures automatiques.',
      },
      {
        titre: 'Gestion des clients',
        description: 'Gérer les informations clients et leur historique de réservations.',
      },
    ],
  }

  const suggestions = suggestionsMap[besoinTitre] || [
    {
      titre: 'Implémentation principale',
      description: `Implémentation principale pour le besoin: ${besoinTitre}`,
    },
    {
      titre: 'Gestion des données',
      description: 'Gestion des données liées à ce besoin.',
    },
    {
      titre: 'Interface utilisateur',
      description: 'Développement de l\'interface utilisateur pour ce besoin.',
    },
    {
      titre: 'Intégration et tests',
      description: 'Intégration et tests de cette fonctionnalité.',
    },
  ]

  return suggestions.map((suggestion) => ({
    id: generateId(),
    titre: suggestion.titre,
    description: suggestion.description,
    statut: 'A faire' as const,
    besoinId,
    created_at: now,
    updated_at: now,
  }))
}

export default function EpicAIGeneratorModal({ besoin, onClose, onGenerate }: EpicAIGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Epic[]>([])
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
    const selectedEpics = suggestions.filter((_, index) => selectedSuggestions[index])
    onGenerate(selectedEpics)
    handleClose()
  }

  const toggleSuggestion = (index: number) => {
    const updated = [...selectedSuggestions]
    updated[index] = !updated[index]
    setSelectedSuggestions(updated)
  }

  if (!isOpen || !besoin) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🤖 Génération IA d&apos;EPICS</h2>
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
                L&apos;IA a généré {suggestions.length} suggestions d&apos;EPICS pour ce besoin.
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
                        <div className="font-medium text-gray-800">{suggestion.titre}</div>
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
                  ✅ Générer les EPICS sélectionnées
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

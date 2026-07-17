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

// Suggestions d'EPICS prédéfinies par type de besoin (simulation de l'IA)
const getAISuggestions = (besoinTitre: string, besoinId: string): Epic[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string }[]> = {
    // Exemples de suggestions pour des besoins courants
    'Gestion des utilisateurs': [
      {
        titre: 'Authentification et sécurité',
        description: 'Gérer l\'authentification des utilisateurs et la sécurité des comptes.',
      },
      {
        titre: 'Gestion des profils',
        description: 'Permettre aux utilisateurs de gérer leurs informations personnelles et préférences.',
      },
      {
        titre: 'Gestion des rôles et permissions',
        description: 'Définir et gérer les rôles des utilisateurs ainsi que leurs permissions d\'accès.',
      },
      {
        titre: 'Communication et notifications',
        description: 'Gérer les notifications et les communications entre utilisateurs.',
      },
    ],
    'Gestion des produits': [
      {
        titre: 'Catalogue et inventaire',
        description: 'Gérer le catalogue des produits et leur inventaire.',
      },
      {
        titre: 'Prix et promotions',
        description: 'Définir les prix des produits et gérer les promotions.',
      },
      {
        titre: 'Catégorisation et filtrage',
        description: 'Organiser les produits en catégories et permettre leur filtrage.',
      },
      {
        titre: 'Avis et évaluations',
        description: 'Permettre aux utilisateurs de laisser des avis et évaluations sur les produits.',
      },
    ],
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
    // Ajoutez d'autres types de besoins ici
  }

  // Trouver une correspondance ou utiliser des suggestions génériques
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

  // Convertir en EPICS avec toutes les propriétés requises
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
      // Simuler un délai de génération IA
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
      <div className="neumorphic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neumorphic">🤖 Génération IA d&apos;EPICS</h2>
            <button
              onClick={handleClose}
              className="neumorphic-button p-2 hover:bg-red-500/20"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-neumorphic-muted">
              Besoin: <span className="text-neumorphic font-medium">{besoin.titre}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-neumorphic">
                <span className="animate-spin">🌀</span>
                <span>Génération en cours...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-neumorphic-muted mb-4">
                L&apos;IA a généré {suggestions.length} suggestions d&apos;EPICS pour ce besoin.
                Sélectionnez celles que vous souhaitez ajouter.
              </p>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`neumorphic-card p-4 ${selectedSuggestions[index] ? 'border-l-4 border-green-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSuggestions[index]}
                        onChange={() => toggleSuggestion(index)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-neumorphic">{suggestion.titre}</div>
                        <div className="text-sm text-neumorphic-muted mt-1">{suggestion.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerate}
                  className="neumorphic-button px-6 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-300"
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

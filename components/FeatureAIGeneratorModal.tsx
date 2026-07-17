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

// Suggestions de Features prédéfinies par type de besoin (simulation de l'IA)
const getAISuggestions = (besoinTitre: string, besoinId: string): Feature[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string; priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique' }[]> = {
    // Exemples de suggestions pour des besoins courants
    'Gestion des utilisateurs': [
      {
        titre: 'Authentification',
        description: 'Permettre aux utilisateurs de se connecter avec un email et un mot de passe.',
        priorite: 'Elevee',
      },
      {
        titre: 'Inscription',
        description: 'Permettre aux nouveaux utilisateurs de créer un compte.',
        priorite: 'Elevee',
      },
      {
        titre: 'Réinitialisation du mot de passe',
        description: 'Permettre aux utilisateurs de réinitialiser leur mot de passe en cas d\'oubli.',
        priorite: 'Moyenne',
      },
      {
        titre: 'Gestion des profils',
        description: 'Permettre aux utilisateurs de modifier leurs informations personnelles.',
        priorite: 'Moyenne',
      },
      {
        titre: 'Rôles et permissions',
        description: 'Gérer les rôles des utilisateurs et leurs permissions d\'accès.',
        priorite: 'Elevee',
      },
    ],
    'Gestion des produits': [
      {
        titre: 'Création de produit',
        description: 'Permettre aux administrateurs de créer de nouveaux produits.',
        priorite: 'Elevee',
      },
      {
        titre: 'Modification de produit',
        description: 'Permettre aux administrateurs de modifier les informations d\'un produit.',
        priorite: 'Moyenne',
      },
      {
        titre: 'Suppression de produit',
        description: 'Permettre aux administrateurs de supprimer un produit.',
        priorite: 'Faible',
      },
      {
        titre: 'Recherche de produits',
        description: 'Permettre aux utilisateurs de rechercher des produits par nom ou catégorie.',
        priorite: 'Moyenne',
      },
    ],
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
    // Ajoutez d'autres types de besoins ici
  }

  // Trouver une correspondance ou utiliser des suggestions génériques
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

  // Convertir en Features avec toutes les propriétés requises
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
    const selectedFeatures = suggestions.filter((_, index) => selectedSuggestions[index])
    onGenerate(selectedFeatures)
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
            <h2 className="text-xl font-bold text-neumorphic">🤖 Génération IA de Features</h2>
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
                L&apos;IA a généré {suggestions.length} suggestions de Features pour ce besoin.
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
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-neumorphic">{suggestion.titre}</div>
                          <span className={`px-2 py-1 rounded-full text-xs ${suggestion.priorite === 'Elevee' ? 'bg-orange-500/20 text-orange-300' : suggestion.priorite === 'Critique' ? 'bg-red-500/20 text-red-300' : suggestion.priorite === 'Moyenne' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                            {suggestion.priorite === 'Elevee' ? 'Élevée' : suggestion.priorite}
                          </span>
                        </div>
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

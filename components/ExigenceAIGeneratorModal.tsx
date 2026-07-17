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

// Suggestions d'Exigences prédéfinies par type de Feature (simulation de l'IA)
const getAISuggestions = (featureTitre: string, featureId: string): Exigence[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string; type: 'Fonctionnelle' | 'Non fonctionnelle' | 'Technique' }[]> = {
    // Exemples de suggestions pour des Features courantes
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
    'Authentification': [
      {
        titre: 'Connexion sécurisée',
        description: 'Les utilisateurs doivent pouvoir se connecter de manière sécurisée.',
        type: 'Fonctionnelle',
      },
      {
        titre: 'Protection contre les attaques',
        description: 'Le système doit être protégé contre les attaques par force brute.',
        type: 'Technique',
      },
      {
        titre: 'Gestion des sessions',
        description: 'Les sessions utilisateurs doivent être gérées correctement.',
        type: 'Technique',
      },
    ],
    'Paiement et facturation': [
      {
        titre: 'Paiement en ligne',
        description: 'Les utilisateurs doivent pouvoir payer en ligne de manière sécurisée.',
        type: 'Fonctionnelle',
      },
      {
        titre: 'Génération de factures',
        description: 'Le système doit générer automatiquement des factures après chaque paiement.',
        type: 'Fonctionnelle',
      },
      {
        titre: 'Conformité PCI DSS',
        description: 'Le système doit être conforme aux normes PCI DSS pour les paiements.',
        type: 'Non fonctionnelle',
      },
    ],
    // Ajoutez d'autres types de Features ici
  }

  // Trouver une correspondance ou utiliser des suggestions génériques
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

  // Convertir en Exigences avec toutes les propriétés requises
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

export default function ExigenceAIGeneratorModal({ feature, onClose, onGenerate }: ExigenceAIGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Exigence[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsOpen(!!feature)
    if (feature) {
      setLoading(true)
      // Simuler un délai de génération IA
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
      <div className="neumorphic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neumorphic">🤖 Génération IA d&apos;Exigences</h2>
            <button
              onClick={handleClose}
              className="neumorphic-button p-2 hover:bg-red-500/20"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-neumorphic-muted">
              Feature: <span className="text-neumorphic font-medium">{feature.titre}</span>
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
                L&apos;IA a généré {suggestions.length} suggestions d&apos;Exigences pour cette Feature.
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
                          <span className={`px-2 py-1 rounded-full text-xs ${suggestion.type === 'Fonctionnelle' ? 'bg-blue-500/20 text-blue-300' : suggestion.type === 'Non fonctionnelle' ? 'bg-purple-500/20 text-purple-300' : 'bg-orange-500/20 text-orange-300'}`}>
                            {suggestion.type}
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

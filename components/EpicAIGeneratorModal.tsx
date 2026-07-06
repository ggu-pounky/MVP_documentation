'use client'

import { useState, useEffect } from 'react'
import type { Besoin } from '@/types/besoin'

type EpicAIGeneratorModalProps = {
  besoin: Besoin | null
  onClose: () => void
  onGenerate: (epics: { titre: string; description: string }[]) => void
}

// Suggestions d'EPICS prédfinies par type de besoin (simulation de l'IA)
const getAISuggestions = (besoinTitre: string): { titre: string; description: string }[] => {
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
    'Gestion des commandes': [
      {
        titre: 'Passage et suivi de commande',
        description: 'Permettre aux utilisateurs de passer des commandes et suivre leur état.',
      },
      {
        titre: 'Gestion des paniers',
        description: 'Gérer les paniers d\'achat des utilisateurs.',
      },
      {
        titre: 'Paiements et facturation',
        description: 'Intégrer les systèmes de paiement et générer des factures.',
      },
      {
        titre: 'Retours et remboursements',
        description: 'Gérer les retours de produits et les remboursements.',
      },
    ],
    'Tableau de bord': [
      {
        titre: 'Analyse et reporting',
        description: 'Fournir des outils d\'analyse et des rapports pour le suivi des performances.',
      },
      {
        titre: 'Personnalisation de l\'interface',
        description: 'Permettre aux utilisateurs de personnaliser leur tableau de bord.',
      },
      {
        titre: 'Alertes et notifications',
        description: 'Configurer et afficher des alertes et notifications importantes.',
      },
    ],
    'Gestion des paiements': [
      {
        titre: 'Intégration des passerelles de paiement',
        description: 'Intégrer différentes passerelles de paiement (Stripe, PayPal, etc.).',
      },
      {
        titre: 'Gestion des abonnements',
        description: 'Permettre la gestion des abonnements récurrents.',
      },
      {
        titre: 'Facturation et historique',
        description: 'Générer des factures et conserver un historique des transactions.',
      },
    ],
  }

  // Si le besoin n'est pas dans la liste, générer des suggestions génériques
  const defaultSuggestions = [
    {
      titre: 'Fonctionnalités principales',
      description: `Regrouper les fonctionnalités principales liées à ${besoinTitre}.`,
    },
    {
      titre: 'Gestion avancée',
      description: `Ajouter des fonctionnalités avancées pour ${besoinTitre}.`,
    },
    {
      titre: 'Intégrations',
      description: `Intégrer des services externes liés à ${besoinTitre}.`,
    },
    {
      titre: 'Optimisation',
      description: `Optimiser les performances et l\'expérience utilisateur pour ${besoinTitre}.`,
    },
  ]

  // Trouver le besoin le plus proche dans la map (pour gérer les variations de titre)
  const findBestMatch = (title: string): string => {
    const lowerTitle = title.toLowerCase()
    for (const key in suggestionsMap) {
      if (lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)) {
        return key
      }
    }
    return ''
  }

  const matchedKey = findBestMatch(besoinTitre)
  return matchedKey ? suggestionsMap[matchedKey] : defaultSuggestions
}

export default function EpicAIGeneratorModal({ besoin, onClose, onGenerate }: EpicAIGeneratorModalProps) {
  const [selectedEpics, setSelectedEpics] = useState<number[]>([])
  const [suggestions, setSuggestions] = useState<{ titre: string; description: string }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Générer les suggestions au chargement de la modale
  useEffect(() => {
    if (besoin) {
      setIsGenerating(true)
      // Simulation d'un appel à l'API Mistral (remplacer par un vrai appel si disponible)
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(besoin.titre)
        setSuggestions(generatedSuggestions)
        setIsGenerating(false)
      }, 500) // Délai pour simuler le chargement
    }
  }, [besoin])

  // Gérer la sélection/désélection d'une suggestion
  const toggleEpicSelection = (index: number) => {
    setSelectedEpics((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Valider et générer les EPICS sélectionnées
  const handleGenerate = () => {
    const selected = suggestions.filter((_, index) => selectedEpics.includes(index))
    onGenerate(selected)
    onClose()
  }

  if (!besoin) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Génération IA d'EPICS</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Besoin sélectionné : <strong>{besoin.titre}</strong>
            </p>
            {besoin.description && (
              <p className="text-sm text-gray-500 mt-1">{besoin.description}</p>
            )}
          </div>

          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Génération en cours...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune suggestion générée.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Sélectionnez les EPICS que vous souhaitez générer :
              </p>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => toggleEpicSelection(index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedEpics.includes(index) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEpics.includes(index)}
                        onChange={() => toggleEpicSelection(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{suggestion.titre}</h3>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={selectedEpics.length === 0}
                  className={`px-4 py-2 rounded ${
                    selectedEpics.length === 0
                      ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Valider ({selectedEpics.length} sélectionné(s))
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

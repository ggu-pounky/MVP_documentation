'use client'

import { useState, useEffect } from 'react'
import type { Besoin } from '@/types/besoin'

type FeatureAIGeneratorModalProps = {
  besoin: Besoin | null
  onClose: () => void
  onGenerate: (features: { titre: string; description: string }[]) => void
}

// Suggestions de Features prédfinies par type de besoin (simulation de l'IA)
const getAISuggestions = (besoinTitre: string): { titre: string; description: string }[] => {
  const suggestionsMap: Record<string, { titre: string; description: string }[]> = {
    // Exemples de suggestions pour des besoins courants
    'Gestion des utilisateurs': [
      {
        titre: 'Authentification',
        description: 'Permettre aux utilisateurs de se connecter avec un email et un mot de passe.',
      },
      {
        titre: 'Inscription',
        description: 'Permettre aux nouveaux utilisateurs de créer un compte.',
      },
      {
        titre: 'Réinitialisation du mot de passe',
        description: 'Permettre aux utilisateurs de réinitialiser leur mot de passe en cas d\'oubli.',
      },
      {
        titre: 'Gestion des profils',
        description: 'Permettre aux utilisateurs de modifier leurs informations personnelles.',
      },
      {
        titre: 'Rôles et permissions',
        description: 'Gérer les rôles des utilisateurs et leurs permissions d\'accès.',
      },
    ],
    'Gestion des produits': [
      {
        titre: 'Création de produit',
        description: 'Permettre aux administrateurs de créer de nouveaux produits.',
      },
      {
        titre: 'Modification de produit',
        description: 'Permettre aux administrateurs de modifier les informations d\'un produit.',
      },
      {
        titre: 'Suppression de produit',
        description: 'Permettre aux administrateurs de supprimer un produit.',
      },
      {
        titre: 'Recherche de produits',
        description: 'Permettre aux utilisateurs de rechercher des produits par nom ou catégorie.',
      },
      {
        titre: 'Filtrage des produits',
        description: 'Permettre aux utilisateurs de filtrer les produits par prix, catégorie, etc.',
      },
    ],
    'Gestion des commandes': [
      {
        titre: 'Passage de commande',
        description: 'Permettre aux utilisateurs de passer une commande.',
      },
      {
        titre: 'Suivi de commande',
        description: 'Permettre aux utilisateurs de suivre l\'état de leur commande.',
      },
      {
        titre: 'Annulation de commande',
        description: 'Permettre aux utilisateurs d\'annuler une commande.',
      },
      {
        titre: 'Historique des commandes',
        description: 'Permettre aux utilisateurs de consulter leur historique de commandes.',
      },
      {
        titre: 'Gestion des retours',
        description: 'Permettre aux utilisateurs de demander un retour de produit.',
      },
    ],
    'Tableau de bord': [
      {
        titre: 'Statistiques globales',
        description: 'Afficher les statistiques globales de l\'application.',
      },
      {
        titre: 'Analyse des ventes',
        description: 'Afficher une analyse détaillée des ventes.',
      },
      {
        titre: 'Suivi des performances',
        description: 'Suivre les performances des différentes fonctionnalités.',
      },
      {
        titre: 'Alertes et notifications',
        description: 'Afficher les alertes et notifications importantes.',
      },
      {
        titre: 'Personnalisation du tableau de bord',
        description: 'Permettre aux utilisateurs de personnaliser leur tableau de bord.',
      },
    ],
    'Gestion des paiements': [
      {
        titre: 'Intégration de Stripe',
        description: 'Intégrer le système de paiement Stripe pour les transactions.',
      },
      {
        titre: 'Intégration de PayPal',
        description: 'Intégrer le système de paiement PayPal pour les transactions.',
      },
      {
        titre: 'Gestion des abonnements',
        description: 'Permettre aux utilisateurs de souscrire à des abonnements.',
      },
      {
        titre: 'Historique des paiements',
        description: 'Permettre aux utilisateurs de consulter leur historique de paiements.',
      },
      {
        titre: 'Remboursements',
        description: 'Permettre aux administrateurs de traiter les remboursements.',
      },
    ],
  }

  // Si le besoin n'est pas dans la liste, générer des suggestions génériques
  const defaultSuggestions = [
    {
      titre: 'Création',
      description: `Permettre de créer des éléments liés à ${besoinTitre}.`,
    },
    {
      titre: 'Modification',
      description: `Permettre de modifier des éléments liés à ${besoinTitre}.`,
    },
    {
      titre: 'Suppression',
      description: `Permettre de supprimer des éléments liés à ${besoinTitre}.`,
    },
    {
      titre: 'Liste',
      description: `Afficher une liste des éléments liés à ${besoinTitre}.`,
    },
    {
      titre: 'Recherche',
      description: `Permettre de rechercher des éléments liés à ${besoinTitre}.`,
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

export default function FeatureAIGeneratorModal({ besoin, onClose, onGenerate }: FeatureAIGeneratorModalProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([])
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
  const toggleFeatureSelection = (index: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Valider et générer les Features sélectionnées
  const handleGenerate = () => {
    const selected = suggestions.filter((_, index) => selectedFeatures.includes(index))
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
            <h2 className="text-xl font-bold">Génération IA de Features</h2>
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
                Sélectionnez les Features que vous souhaitez générer :
              </p>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => toggleFeatureSelection(index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFeatures.includes(index) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(index)}
                        onChange={() => toggleFeatureSelection(index)}
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
                  disabled={selectedFeatures.length === 0}
                  className={`px-4 py-2 rounded ${
                    selectedFeatures.length === 0
                      ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Valider ({selectedFeatures.length} sélectionné(s))
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

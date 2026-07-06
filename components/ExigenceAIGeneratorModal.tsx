'use client'

import { useState, useEffect } from 'react'

type FeatureInfo = {
  id: string
  besoinTitre: string
  titre: string
  description?: string
}

type ExigenceAIGeneratorModalProps = {
  feature: FeatureInfo | null
  onClose: () => void
  onGenerate: (exigences: { titre: string; description: string }[]) => void
}

// Suggestions d'exigences prédéfinies par type de feature (simulation de l'IA)
const getAISuggestions = (featureTitre: string): { titre: string; description: string }[] => {
  const suggestionsMap: Record<string, { titre: string; description: string }[]> = {
    // Exemples de suggestions pour des features courantes
    'Authentification': [
      {
        titre: 'Vérification de l\'email',
        description: 'L\'email doit être au format valide.',
      },
      {
        titre: 'Mot de passe sécurisé',
        description: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
      },
      {
        titre: 'Protection contre les attaques par force brute',
        description: 'Limiter le nombre de tentatives de connexion échouées avant de bloquer le compte.',
      },
      {
        titre: 'Session sécurisée',
        description: 'Utiliser des cookies sécurisés avec le drapeau HttpOnly et Secure.',
      },
      {
        titre: 'Double authentification',
        description: 'Permettre aux utilisateurs d\'activer la double authentification via SMS ou application.',
      },
    ],
    'Inscription': [
      {
        titre: 'Validation des données',
        description: 'Vérifier que toutes les données saisies sont valides avant la création du compte.',
      },
      {
        titre: 'Email unique',
        description: 'Vérifier que l\'email n\'est pas déjà utilisé par un autre utilisateur.',
      },
      {
        titre: 'Confirmation de l\'email',
        description: 'Envoyer un email de confirmation avec un lien de validation.',
      },
      {
        titre: 'Protection des données personnelles',
        description: 'Chiffrer les données personnelles des utilisateurs dans la base de données.',
      },
      {
        titre: 'Acceptation des conditions générales',
        description: 'L\'utilisateur doit accepter les conditions générales pour créer un compte.',
      },
    ],
    'Recherche de produits': [
      {
        titre: 'Recherche par mot-clé',
        description: 'Permettre la recherche de produits par mot-clé dans le titre ou la description.',
      },
      {
        titre: 'Filtrage par catégorie',
        description: 'Permettre de filtrer les résultats par catégorie de produit.',
      },
      {
        titre: 'Tri par pertinence',
        description: 'Trier les résultats par pertinence par rapport à la recherche.',
      },
      {
        titre: 'Pagination des résultats',
        description: 'Afficher les résultats par pages de 10, 20 ou 50 produits.',
      },
      {
        titre: 'Recherche avancée',
        description: 'Permettre une recherche avancée avec plusieurs critères (prix, disponibilité, etc.).',
      },
    ],
    'Passage de commande': [
      {
        titre: 'Validation du panier',
        description: 'Vérifier que le panier n\'est pas vide avant de passer commande.',
      },
      {
        titre: 'Calcul automatique du total',
        description: 'Calculer automatiquement le total de la commande en incluant les taxes et frais de livraison.',
      },
      {
        titre: 'Confirmation de la commande',
        description: 'Afficher un récapitulatif de la commande avant validation définitive.',
      },
      {
        titre: 'Gestion des stocks',
        description: 'Vérifier la disponibilité des produits avant de valider la commande.',
      },
      {
        titre: 'Notification de confirmation',
        description: 'Envoyer un email de confirmation avec les détails de la commande.',
      },
    ],
    'Paiement': [
      {
        titre: 'Sécurité des transactions',
        description: 'Utiliser un protocole SSL/TLS pour sécuriser les transactions de paiement.',
      },
      {
        titre: 'Validation de la carte',
        description: 'Vérifier que les informations de la carte de crédit sont valides.',
      },
      {
        titre: 'Gestion des erreurs de paiement',
        description: 'Afficher des messages clairs en cas d\'échec de paiement.',
      },
      {
        titre: 'Confirmation de paiement',
        description: 'Envoyer une confirmation de paiement par email.',
      },
      {
        titre: 'Intégration avec les passerelles de paiement',
        description: 'Intégrer avec des services comme Stripe, PayPal, etc.',
      },
    ],
  }

  // Si la feature n'est pas dans la liste, générer des suggestions génériques
  const defaultSuggestions = [
    {
      titre: 'Fonctionnalité de base',
      description: `Assurer que la fonctionnalité de base de ${featureTitre} est opérationnelle.`,
    },
    {
      titre: 'Validation des entrées',
      description: `Valider toutes les entrées utilisateur pour ${featureTitre}.`,
    },
    {
      titre: 'Gestion des erreurs',
      description: `Afficher des messages d\'erreur clairs pour ${featureTitre}.`,
    },
    {
      titre: 'Performance',
      description: `Garantir que ${featureTitre} répond aux exigences de performance.`,
    },
    {
      titre: 'Sécurité',
      description: `Protéger ${featureTitre} contre les vulnérabilités de sécurité courantes.`,
    },
  ]

  // Trouver la feature la plus proche dans la map (pour gérer les variations de titre)
  const findBestMatch = (title: string): string => {
    const lowerTitle = title.toLowerCase()
    for (const key in suggestionsMap) {
      if (lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)) {
        return key
      }
    }
    return ''
  }

  const matchedKey = findBestMatch(featureTitre)
  return matchedKey ? suggestionsMap[matchedKey] : defaultSuggestions
}

export default function ExigenceAIGeneratorModal({ feature, onClose, onGenerate }: ExigenceAIGeneratorModalProps) {
  const [selectedExigences, setSelectedExigences] = useState<number[]>([])
  const [suggestions, setSuggestions] = useState<{ titre: string; description: string }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Générer les suggestions au chargement de la modale
  useEffect(() => {
    if (feature) {
      setIsGenerating(true)
      // Simulation d'un appel à l'API Mistral (remplacer par un vrai appel si disponible)
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(feature.titre)
        setSuggestions(generatedSuggestions)
        setIsGenerating(false)
      }, 500) // Délai pour simuler le chargement
    }
  }, [feature])

  // Gérer la sélection/désélection d'une suggestion
  const toggleExigenceSelection = (index: number) => {
    setSelectedExigences((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Valider et générer les exigences sélectionnées
  const handleGenerate = () => {
    const selected = suggestions.filter((_, index) => selectedExigences.includes(index))
    onGenerate(selected)
    onClose()
  }

  if (!feature) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Génération IA d'Exigences</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Feature sélectionnée : <strong>{feature.titre}</strong>
            </p>
            {feature.description && (
              <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
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
                Sélectionnez les exigences que vous souhaitez générer :
              </p>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => toggleExigenceSelection(index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedExigences.includes(index) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedExigences.includes(index)}
                        onChange={() => toggleExigenceSelection(index)}
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
                  disabled={selectedExigences.length === 0}
                  className={`px-4 py-2 rounded ${
                    selectedExigences.length === 0
                      ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Valider ({selectedExigences.length} sélectionné(s))
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

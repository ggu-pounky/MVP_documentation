'use client'

import { useState, useEffect } from 'react'

type BesoinAIGeneratorModalProps = {
  onClose: () => void
  onGenerate: (besoins: { titre: string; description: string }[]) => void
}

// Suggestions de besoins prédéfinies (simulation de l'IA)
const getAISuggestions = (): { titre: string; description: string }[] => {
  return [
    {
      titre: 'Automatiser la gestion des réservations pour un hôtel en ligne',
      description: 'Permettre aux clients de réserver, modifier ou annuler une chambre, et aux gestionnaires de suivre les disponibilités en temps réel.',
    },
    {
      titre: 'Créer une plateforme de e-commerce pour des produits artisanaux',
      description: 'Permettre aux artisans de vendre leurs produits en ligne avec gestion des stocks, paiements sécurisés et suivi des commandes.',
    },
    {
      titre: 'Développer un système de gestion de projets collaboratifs',
      description: 'Permettre aux équipes de collaborer sur des projets avec gestion des tâches, des échéances et des ressources partagées.',
    },
    {
      titre: 'Concevoir une application de suivi de santé et bien-être',
      description: 'Permettre aux utilisateurs de suivre leur activité physique, leur alimentation et leur santé mentale avec des conseils personnalisés.',
    },
    {
      titre: 'Mettre en place un système de gestion des utilisateurs et authentification',
      description: 'Gérer l\'inscription, la connexion, les profils utilisateurs et les permissions d\'accès pour une application sécurisée.',
    },
    {
      titre: 'Développer un tableau de bord analytique pour le suivi des performances',
      description: 'Fournir des outils de visualisation et d\'analyse des données pour aider les utilisateurs à prendre des décisions éclairées.',
    },
    {
      titre: 'Créer un système de gestion de contenu (CMS) pour un site web',
      description: 'Permettre aux administrateurs de créer, modifier et publier du contenu sur un site web sans compétences techniques.',
    },
    {
      titre: 'Intégrer un système de paiement en ligne sécurisé',
      description: 'Permettre aux utilisateurs d\'effectuer des paiements en ligne de manière sécurisée avec plusieurs options de paiement.',
    },
  ]
}

export default function BesoinAIGeneratorModal({ onClose, onGenerate }: BesoinAIGeneratorModalProps) {
  const [selectedBesoins, setSelectedBesoins] = useState<number[]>([])
  const [suggestions, setSuggestions] = useState<{ titre: string; description: string }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Générer les suggestions au chargement de la modale
  useEffect(() => {
    setIsGenerating(true)
    // Simulation d'un appel à l'API Mistral
    setTimeout(() => {
      const generatedSuggestions = getAISuggestions()
      setSuggestions(generatedSuggestions)
      setIsGenerating(false)
    }, 500)
  }, [])

  // Gérer la sélection/désélection d'une suggestion
  const toggleBesoinSelection = (index: number) => {
    setSelectedBesoins((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Valider et générer les besoins sélectionnés
  const handleGenerate = () => {
    const selected = suggestions.filter((_, index) => selectedBesoins.includes(index))
    onGenerate(selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Génération IA de Besoins</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Sélectionnez les besoins que vous souhaitez générer :
            </p>
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
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => toggleBesoinSelection(index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBesoins.includes(index) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedBesoins.includes(index)}
                        onChange={() => toggleBesoinSelection(index)}
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
                  disabled={selectedBesoins.length === 0}
                  className={`px-4 py-2 rounded ${
                    selectedBesoins.length === 0
                      ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Valider ({selectedBesoins.length} sélectionné(s))
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

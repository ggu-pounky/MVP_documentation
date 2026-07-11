'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type ExigenceInfo = {
  id: string
  titre: string
  featureTitre: string
  besoinTitre: string
  description?: string
}

type TestAIGeneratorModalProps = {
  exigence: ExigenceInfo | null
  onClose: () => void
  onGenerate: (tests: { titre: string; description: string }[]) => void
}

// Suggestions de tests prédéfinies par type d'exigence (simulation de l'IA)
const getAISuggestions = (exigenceTitre: string): { titre: string; description: string }[] => {
  const suggestionsMap: Record<string, { titre: string; description: string }[]> = {
    // Exemples de suggestions pour des exigences courantes
    'Vérification de l\'email': [
      {
        titre: 'Test email valide',
        description: 'Vérifier que le système accepte un email au format valide (ex: test@example.com).',
      },
      {
        titre: 'Test email invalide',
        description: 'Vérifier que le système rejette un email au format invalide (ex: test@example).',
      },
      {
        titre: 'Test email vide',
        description: 'Vérifier que le système affiche une erreur si l\'email est vide.',
      },
      {
        titre: 'Test email avec espaces',
        description: 'Vérifier que le système rejette un email avec des espaces.',
      },
      {
        titre: 'Test email trop long',
        description: 'Vérifier que le système gère correctement un email dépassant la limite de caractères.',
      },
    ],
    'Mot de passe sécurisé': [
      {
        titre: 'Test mot de passe valide',
        description: 'Vérifier que le système accepte un mot de passe avec 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
      },
      {
        titre: 'Test mot de passe trop court',
        description: 'Vérifier que le système rejette un mot de passe avec moins de 8 caractères.',
      },
      {
        titre: 'Test mot de passe sans majuscule',
        description: 'Vérifier que le système rejette un mot de passe sans majuscule.',
      },
      {
        titre: 'Test mot de passe sans chiffre',
        description: 'Vérifier que le système rejette un mot de passe sans chiffre.',
      },
      {
        titre: 'Test mot de passe sans caractère spécial',
        description: 'Vérifier que le système rejette un mot de passe sans caractère spécial.',
      },
    ],
    'Recherche de produits': [
      {
        titre: 'Test recherche exacte',
        description: 'Vérifier que la recherche retourne le produit exact correspondant au mot-clé.',
      },
      {
        titre: 'Test recherche partielle',
        description: 'Vérifier que la recherche retourne les produits contenant partiellement le mot-clé.',
      },
      {
        titre: 'Test recherche sans résultat',
        description: 'Vérifier que le système affiche un message approprié lorsqu\'aucun produit n\'est trouvé.',
      },
      {
        titre: 'Test recherche avec filtre catégorie',
        description: 'Vérifier que le filtrage par catégorie fonctionne correctement avec la recherche.',
      },
      {
        titre: 'Test recherche avec caractères spéciaux',
        description: 'Vérifier que la recherche gère correctement les caractères spéciaux.',
      },
    ],
    'Passage de commande': [
      {
        titre: 'Test commande avec panier valide',
        description: 'Vérifier que la commande est validée avec un panier contenant des produits.',
      },
      {
        titre: 'Test commande avec panier vide',
        description: 'Vérifier que le système empêche le passage de commande avec un panier vide.',
      },
      {
        titre: 'Test calcul du total',
        description: 'Vérifier que le total de la commande est calculé correctement (produits + taxes + frais).',
      },
      {
        titre: 'Test confirmation de commande',
        description: 'Vérifier que l\'email de confirmation est envoyé après validation de la commande.',
      },
      {
        titre: 'Test stock insuffisant',
        description: 'Vérifier que le système empêche la commande si un produit n\'a pas assez de stock.',
      },
    ],
    'Paiement': [
      {
        titre: 'Test paiement réussi',
        description: 'Vérifier que le paiement est validé avec des informations de carte valides.',
      },
      {
        titre: 'Test paiement échoué',
        description: 'Vérifier que le système affiche une erreur avec des informations de carte invalides.',
      },
      {
        titre: 'Test paiement avec montant incorrect',
        description: 'Vérifier que le système rejette un paiement si le montant ne correspond pas au total.',
      },
      {
        titre: 'Test confirmation de paiement',
        description: 'Vérifier que l\'email de confirmation de paiement est envoyé.',
      },
      {
        titre: 'Test remboursement',
        description: 'Vérifier que le remboursement fonctionne correctement.',
      },
    ],
  }

  // Si l'exigence n'est pas dans la liste, générer des suggestions génériques
  const defaultSuggestions = [
    {
      titre: 'Test fonctionnalité de base',
      description: `Vérifier que la fonctionnalité de base de l'exigence "${exigenceTitre}" fonctionne correctement.`,
    },
    {
      titre: 'Test cas nominal',
      description: `Vérifier le comportement normal pour l'exigence "${exigenceTitre}".`,
    },
    {
      titre: 'Test cas limite',
      description: `Vérifier les cas limites pour l'exigence "${exigenceTitre}".`,
    },
    {
      titre: 'Test erreur',
      description: `Vérifier que les erreurs sont gérées correctement pour l'exigence "${exigenceTitre}".`,
    },
    {
      titre: 'Test performance',
      description: `Vérifier que les performances sont acceptables pour l'exigence "${exigenceTitre}".`,
    },
  ]

  // Trouver l'exigence la plus proche dans la map (pour gérer les variations de titre)
  const findBestMatch = (title: string): string => {
    const lowerTitle = title.toLowerCase()
    for (const key in suggestionsMap) {
      if (lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)) {
        return key
      }
    }
    return ''
  }

  const matchedKey = findBestMatch(exigenceTitre)
  return matchedKey ? suggestionsMap[matchedKey] : defaultSuggestions
}

export default function TestAIGeneratorModal({ exigence, onClose, onGenerate }: TestAIGeneratorModalProps) {
  const [selectedTests, setSelectedTests] = useState<number[]>([])
  const [suggestions, setSuggestions] = useState<{ titre: string; description: string }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Générer les suggestions au chargement de la modale
  useEffect(() => {
    if (exigence) {
      setIsGenerating(true)
      // Simulation d'un appel à l'API Mistral (remplacer par un vrai appel si disponible)
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(exigence.titre)
        setSuggestions(generatedSuggestions)
        setIsGenerating(false)
      }, 500) // Délai pour simuler le chargement
    }
  }, [exigence])

  // Gérer la sélection/désélection d'une suggestion
  const toggleTestSelection = useCallback((index: number) => {
    setSelectedTests((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }, [])

  // Valider et générer les tests sélectionnés
  const handleGenerate = () => {
    const selected = suggestions.filter((_, index) => selectedTests.includes(index))
    onGenerate(selected)
    onClose()
  }

  // Empêcher la propagation des clics vers le fond
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  // Gérer le clic sur le checkbox uniquement
  const handleCheckboxChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    toggleTestSelection(index)
  }

  // Gérer le clic sur la ligne (sélection par clic sur la ligne)
  const handleRowClick = (index: number, e: React.MouseEvent) => {
    // Ne pas déclencher si le clic vient du checkbox ou de ses enfants
    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
      return
    }
    toggleTestSelection(index)
  }

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!exigence) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleModalClick}
    >
      <div
        ref={modalRef}
        className="neumorphic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neumorphic">Génération IA de Tests</h2>
            <button
              onClick={onClose}
              className="text-neumorphic-muted hover:text-neumorphic text-2xl"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-neumorphic-muted">
              Exigence sélectionnée : <strong className="text-neumorphic">{exigence.titre}</strong>
            </p>
            {exigence.description && (
              <p className="text-sm text-neumorphic-muted mt-1">{exigence.description}</p>
            )}
            <p className="text-sm text-neumorphic-muted mt-1">
              Feature : {exigence.featureTitre} | Besoin : {exigence.besoinTitre}
            </p>
          </div>

          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-neumorphic">Génération en cours...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-8 text-neumorphic-muted">
              <p>Aucune suggestion générée.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-neumorphic-muted">
                Sélectionnez les tests que vous souhaitez générer :
              </p>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={(e) => handleRowClick(index, e)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTests.includes(index)
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-neumorphic-border hover:border-neumorphic-highlight'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(index)}
                        onChange={(e) => handleCheckboxChange(index, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-neumorphic">{suggestion.titre}</h3>
                        <p className="text-sm text-neumorphic-muted mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onClose}
                  type="button"
                  className="px-4 py-2 bg-neumorphic-bg-light text-neumorphic-muted rounded hover:bg-neumorphic-border transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={selectedTests.length === 0}
                  className={`px-4 py-2 rounded transition-colors ${
                    selectedTests.length === 0
                      ? 'bg-blue-900/30 text-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  type="button"
                >
                  Valider ({selectedTests.length} sélectionné(s))
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

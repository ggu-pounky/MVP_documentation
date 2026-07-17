'use client'

import { useState, useEffect } from 'react'
import type { Exigence } from '@/types/exigence'
import type { Test } from '@/types/test'

type TestAIGeneratorModalProps = {
  exigence: Exigence | null
  onClose: () => void
  onGenerate: (tests: Test[]) => void
}

// Générer un ID unique
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Suggestions de Tests prédéfinies par type d'Exigence (simulation de l'IA)
const getAISuggestions = (exigenceTitre: string, exigenceId: string): Test[] => {
  const now = new Date().toISOString()
  
  const suggestionsMap: Record<string, { titre: string; description: string; type: 'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite'; priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique' }[]> = {
    // Exemples de suggestions pour des Exigences courantes
    'Sélection de chambre disponible': [
      {
        titre: 'Test de sélection valide',
        description: 'Vérifier que l\'utilisateur peut sélectionner une chambre disponible.',
        type: 'Unitaire',
        priorite: 'Elevee',
      },
      {
        titre: 'Test de sélection invalide',
        description: 'Vérifier que l\'utilisateur ne peut pas sélectionner une chambre non disponible.',
        type: 'Unitaire',
        priorite: 'Moyenne',
      },
      {
        titre: 'Test d\'affichage des chambres',
        description: 'Vérifier que toutes les chambres disponibles sont affichées correctement.',
        type: 'Integration',
        priorite: 'Moyenne',
      },
    ],
    'Confirmation de réservation': [
      {
        titre: 'Test d\'envoi d\'email',
        description: 'Vérifier que l\'email de confirmation est envoyé après réservation.',
        type: 'Integration',
        priorite: 'Elevee',
      },
      {
        titre: 'Test de contenu de l\'email',
        description: 'Vérifier que l\'email contient toutes les informations nécessaires.',
        type: 'Unitaire',
        priorite: 'Moyenne',
      },
    ],
    'Paiement en ligne': [
      {
        titre: 'Test de paiement réussi',
        description: 'Vérifier que le paiement est traité correctement.',
        type: 'E2E',
        priorite: 'Critique',
      },
      {
        titre: 'Test de paiement échoué',
        description: 'Vérifier que le système gère correctement les échecs de paiement.',
        type: 'E2E',
        priorite: 'Elevee',
      },
      {
        titre: 'Test de sécurité du paiement',
        description: 'Vérifier que les informations de paiement sont sécurisées.',
        type: 'Securite',
        priorite: 'Critique',
      },
    ],
    // Ajoutez d'autres types d'Exigences ici
  }

  // Trouver une correspondance ou utiliser des suggestions génériques
  const suggestions = suggestionsMap[exigenceTitre] || [
    {
      titre: 'Test fonctionnel principal',
      description: `Test fonctionnel principal pour l'exigence: ${exigenceTitre}`,
      type: 'Unitaire',
      priorite: 'Moyenne',
    },
    {
      titre: 'Test d\'intégration',
      description: 'Vérifier que cette exigence s\'intègre correctement avec les autres composants.',
      type: 'Integration',
      priorite: 'Moyenne',
    },
    {
      titre: 'Test de performance',
      description: 'Vérifier que cette exigence a de bonnes performances.',
      type: 'Performance',
      priorite: 'Faible',
    },
    {
      titre: 'Test de sécurité',
      description: 'Vérifier que cette exigence est sécurisée.',
      type: 'Securite',
      priorite: 'Elevee',
    },
  ]

  // Convertir en Tests avec toutes les propriétés requises
  return suggestions.map((suggestion) => ({
    id: generateId(),
    titre: suggestion.titre,
    description: suggestion.description,
    type: suggestion.type,
    statut: 'A faire' as const,
    exigenceId,
    isTNR: false,
    isAutomatisable: suggestion.type !== 'E2E',
    priorite: suggestion.priorite,
    created_at: now,
    updated_at: now,
  }))
}

export default function TestAIGeneratorModal({ exigence, onClose, onGenerate }: TestAIGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Test[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsOpen(!!exigence)
    if (exigence) {
      setLoading(true)
      // Simuler un délai de génération IA
      setTimeout(() => {
        const generatedSuggestions = getAISuggestions(exigence.titre, exigence.id)
        setSuggestions(generatedSuggestions)
        setSelectedSuggestions(new Array(generatedSuggestions.length).fill(true))
        setLoading(false)
      }, 1000)
    }
  }, [exigence])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleGenerate = () => {
    const selectedTests = suggestions.filter((_, index) => selectedSuggestions[index])
    onGenerate(selectedTests)
    handleClose()
  }

  const toggleSuggestion = (index: number) => {
    const updated = [...selectedSuggestions]
    updated[index] = !updated[index]
    setSelectedSuggestions(updated)
  }

  if (!isOpen || !exigence) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="neumorphic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neumorphic">🤖 Génération IA de Tests</h2>
            <button
              onClick={handleClose}
              className="neumorphic-button p-2 hover:bg-red-500/20"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-neumorphic-muted">
              Exigence: <span className="text-neumorphic font-medium">{exigence.titre}</span>
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
                L&apos;IA a généré {suggestions.length} suggestions de Tests pour cette Exigence.
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
                          <div className="flex gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${suggestion.type === 'Securite' ? 'bg-red-500/20 text-red-300' : suggestion.type === 'Integration' ? 'bg-indigo-500/20 text-indigo-300' : suggestion.type === 'E2E' ? 'bg-pink-500/20 text-pink-300' : suggestion.type === 'Performance' ? 'bg-teal-500/20 text-teal-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                              {suggestion.type === 'Securite' ? 'Sécurité' : suggestion.type === 'Integration' ? 'Intégration' : suggestion.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${suggestion.priorite === 'Critique' ? 'bg-red-500/20 text-red-300' : suggestion.priorite === 'Elevee' ? 'bg-orange-500/20 text-orange-300' : suggestion.priorite === 'Moyenne' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                              {suggestion.priorite === 'Elevee' ? 'Élevée' : suggestion.priorite}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-neumorphic-muted mt-1">{suggestion.description}</div>
                        <div className="text-xs text-neumorphic-muted mt-1">
                          {suggestion.isAutomatisable ? '✅ Automatisable' : '❌ Manuel'}
                        </div>
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
                  ✅ Générer les Tests sélectionnés
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

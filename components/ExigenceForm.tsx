'use client'

import { useState, useEffect } from 'react'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import { statutsExigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'

type FeatureInfo = {
  id: string
  besoinTitre: string
  titre: string
  description?: string
}

type ExigenceFormProps = {
  exigence?: Exigence | null
  features: FeatureInfo[]
  onSubmit: (data: ExigenceFormData) => Promise<void>
  onCancel: () => void
  onGenerateAI?: (feature: FeatureInfo) => void  // Pour la génération IA (création)
  onImproveAI?: (exigence: Exigence) => void  // Pour l'amélioration IA (modification)
}

// Fonction pour générer une description IREB
const generateIREBDescription = (titre: string, featureTitre?: string): string => {
  const context = featureTitre ? `pour ${featureTitre.toLowerCase()}` : ''
  return `User Story: En tant qu'utilisateur, je veux ${titre.toLowerCase()} ${context}, afin de répondre à mes besoins.
Critères d'acceptation:
1. Le système doit permettre de ${titre.toLowerCase()}.
2. Les données doivent être validées avant toute opération.
3. Une confirmation visuelle doit être affichée après chaque action.
4. Les erreurs doivent être gérées et affichées clairement.`
}

export default function ExigenceForm({ exigence, features, onSubmit, onCancel, onGenerateAI, onImproveAI }: ExigenceFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'>('À faire')
  const [featureId, setFeatureId] = useState('')

  useEffect(() => {
    if (exigence) {
      setTitre(exigence.titre)
      setDescription(exigence.description || '')
      setStatut(exigence.statut)
      setFeatureId(exigence.featureId)
    } else {
      setTitre('')
      setDescription('')
      setStatut('À faire')
      setFeatureId('')
    }
  }, [exigence])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!featureId) {
      alert('Veuillez sélectionner une Feature')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      statut,
      featureId,
    })
  }

  // Trouver la feature sélectionnée
  const selectedFeature = features.find((f) => f.id === featureId)

  // Gérer le clic sur "Amélioration IA"
  const handleImproveAI = () => {
    if (exigence && onImproveAI) {
      onImproveAI(exigence)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Feature *</label>
        <select
          value={featureId}
          onChange={(e) => setFeatureId(e.target.value)}
          required
          className="w-full p-2 border rounded"
          disabled={!!exigence}
        >
          <option value="">-- Sélectionnez une Feature --</option>
          {features.map((feature) => (
            <option key={feature.id} value={feature.id}>
              {feature.besoinTitre} - {feature.titre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Titre *</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé')}
          className="w-full p-2 border rounded"
        >
          {statutsExigence.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {exigence ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton Générer par IA (visible uniquement en mode création) */}
        {onGenerateAI && !exigence && selectedFeature && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedFeature)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Générer par IA
          </button>
        )}
        {/* Bouton Amélioration IA (visible uniquement en mode modification) */}
        {onImproveAI && exigence && (
          <button
            type="button"
            onClick={handleImproveAI}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Amélioration IA
          </button>
        )}
      </div>
    </form>
  )
}

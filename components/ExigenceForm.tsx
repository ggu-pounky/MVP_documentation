'use client'

import { useState, useEffect } from 'react'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import { statutsExigence, typesExigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'

type ExigenceFormProps = {
  exigence?: Exigence | null
  features: Feature[]
  onSubmit: (data: ExigenceFormData) => Promise<void>
  onCancel: () => void
  onGenerateAI?: (feature: Feature) => void
  onImproveAI?: (exigence: Exigence) => void
}

export default function ExigenceForm({ exigence, features, onSubmit, onCancel, onGenerateAI, onImproveAI }: ExigenceFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide'>('A faire')
  const [featureId, setFeatureId] = useState('')
  const [type, setType] = useState<'Fonctionnelle' | 'Non fonctionnelle' | 'Technique'>('Fonctionnelle')

  useEffect(() => {
    if (exigence) {
      setTitre(exigence.titre)
      setDescription(exigence.description || '')
      setStatut(exigence.statut)
      setFeatureId(exigence.featureId)
      setType(exigence.type)
    } else {
      setTitre('')
      setDescription('')
      setStatut('A faire')
      setFeatureId('')
      setType('Fonctionnelle')
    }
  }, [exigence])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!featureId) {
      alert('Veuillez sélectionner une feature')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      statut,
      featureId,
      type,
    })
  }

  const selectedFeature = features.find((f) => f.id === featureId)

  const handleImproveAI = () => {
    if (exigence && onImproveAI) {
      onImproveAI(exigence)
    }
  }

  const getStatutDisplay = (statut: string): string => {
    switch (statut) {
      case 'A faire':
        return 'À faire'
      case 'En cours':
        return 'En cours'
      case 'Termine':
        return 'Terminé'
      case 'Annule':
        return 'Annulé'
      case 'Valide':
        return 'Validé'
      default:
        return statut
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Feature *</label>
        <select
          value={featureId}
          onChange={(e) => setFeatureId(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          disabled={!!exigence}
        >
          <option value="">-- Sélectionnez une Feature --</option>
          {features.map((feature) => (
            <option key={feature.id} value={feature.id}>
              {feature.titre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Titre *</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          placeholder="Entrez le titre de l'exigence"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="neumorphic-input w-full p-3 rounded-lg"
          rows={4}
          placeholder="Décrivez l'exigence (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'Fonctionnelle' | 'Non fonctionnelle' | 'Technique')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {typesExigence.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {statutsExigence.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="neumorphic-button px-6 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-300 font-medium"
        >
          {exigence ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted font-medium"
        >
          Annuler
        </button>
        {onGenerateAI && !exigence && selectedFeature && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedFeature)}
            className="neumorphic-button px-6 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-medium"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && exigence && (
          <button
            type="button"
            onClick={handleImproveAI}
            className="neumorphic-button px-6 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-medium"
          >
            Amélioration IA
          </button>
        )}
      </div>
    </form>
  )
}

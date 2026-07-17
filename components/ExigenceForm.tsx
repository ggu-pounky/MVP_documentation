'use client'

import { useState, useEffect } from 'react'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import { statutsExigence, typesExigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import { getStatutDisplay, getTypeDisplay } from '@/utils/statutDisplay'

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-field">
        <label htmlFor="featureId">Feature *</label>
        <select
          id="featureId"
          value={featureId}
          onChange={(e) => setFeatureId(e.target.value)}
          required
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

      <div className="form-field">
        <label htmlFor="titre">Titre *</label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          placeholder="Entrez le titre de l'exigence"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'exigence (optionnel)"
          rows={4}
        />
      </div>

      <div className="form-field">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'Fonctionnelle' | 'Non fonctionnelle' | 'Technique')}
        >
          {typesExigence.map((t) => (
            <option key={t} value={t}>
              {getTypeDisplay(t)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="statut">Statut</label>
        <select
          id="statut"
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide')}
        >
          {statutsExigence.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary">
          {exigence ? 'Modifier' : 'Créer'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
        {onGenerateAI && !exigence && selectedFeature && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedFeature)}
            className="btn btn-primary"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && exigence && (
          <button
            type="button"
            onClick={handleImproveAI}
            className="btn btn-secondary"
          >
            Amélioration IA
          </button>
        )}
      </div>
    </form>
  )
}

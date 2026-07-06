'use client'

import { useState, useEffect } from 'react'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import { statutsExigence } from '@/types/exigence'

type ExigenceFormProps = {
  exigence?: Exigence | null
  features: { id: string; besoinTitre: string; titre: string }[]
  onSubmit: (data: ExigenceFormData) => Promise<void>
  onCancel: () => void
}

export default function ExigenceForm({ exigence, features, onSubmit, onCancel }: ExigenceFormProps) {
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Feature *</label>
        <select
          value={featureId}
          onChange={(e) => setFeatureId(e.target.value)}
          required
          className="w-full p-2 border rounded"
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
      </div>
    </form>
  )
}

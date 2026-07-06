'use client'

import { useState, useEffect } from 'react'
import type { Feature, FeatureFormData } from '@/types/feature'
import { priorites, statutsFeature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'

type FeatureFormProps = {
  feature?: Feature | null
  besoins: Besoin[]  // Changé pour recevoir directement les objets Besoin
  onSubmit: (data: FeatureFormData) => Promise<void>
  onCancel: () => void
  onGenerateAI?: (besoin: Besoin) => void
}

export default function FeatureForm({ feature, besoins, onSubmit, onCancel, onGenerateAI }: FeatureFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [priorite, setPriorite] = useState<'Faible' | 'Moyenne' | 'Élevée' | 'Critique'>('Moyenne')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé'>('À faire')
  const [besoinId, setBesoinId] = useState('')

  useEffect(() => {
    if (feature) {
      setTitre(feature.titre)
      setDescription(feature.description || '')
      setPriorite(feature.priorite)
      setStatut(feature.statut)
      setBesoinId(feature.besoinId)
    } else {
      setTitre('')
      setDescription('')
      setPriorite('Moyenne')
      setStatut('À faire')
      setBesoinId('')
    }
  }, [feature])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!besoinId) {
      alert('Veuillez sélectionner un besoin')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      priorite,
      statut,
      besoinId,
    })
  }

  // Trouver le besoin sélectionné pour la génération IA
  const selectedBesoin = besoins.find((b) => b.id === besoinId)

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Besoin *</label>
        <select
          value={besoinId}
          onChange={(e) => setBesoinId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Sélectionnez un besoin --</option>
          {besoins.map((besoin) => (
            <option key={besoin.id} value={besoin.id}>
              {besoin.titre}
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
        <label className="block text-sm font-medium mb-1">Priorité</label>
        <select
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | 'Élevée' | 'Critique')}
          className="w-full p-2 border rounded"
        >
          {priorites.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé')}
          className="w-full p-2 border rounded"
        >
          {statutsFeature.map((s) => (
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
          {feature ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton Générer par IA (visible si on crée une nouvelle feature et qu'un besoin est sélectionné) */}
        {onGenerateAI && !feature && selectedBesoin && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedBesoin)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Générer par IA
          </button>
        )}
      </div>
    </form>
  )
}

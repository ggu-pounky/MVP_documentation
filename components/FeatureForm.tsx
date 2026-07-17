'use client'

import { useState, useEffect } from 'react'
import type { Feature, FeatureFormData } from '@/types/feature'
import { priorites, statutsFeature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'

type FeatureFormProps = {
  feature?: Feature | null
  besoins: Besoin[]
  epics?: Epic[]
  onSubmit: (data: FeatureFormData) => Promise<void>
  onCancel: () => void
  onGenerateAI?: (besoin: Besoin) => void
  onImproveAI?: (feature: Feature) => void
}

export default function FeatureForm({ feature, besoins, epics = [], onSubmit, onCancel, onGenerateAI, onImproveAI }: FeatureFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [priorite, setPriorite] = useState<'Faible' | 'Moyenne' | 'Elevee' | 'Critique'>('Moyenne')
  const [statut, setStatut] = useState<'A faire' | 'En cours' | 'Termine' | 'Annule'>('A faire')
  const [besoinId, setBesoinId] = useState('')
  const [epicId, setEpicId] = useState<string | null>(null)

  useEffect(() => {
    if (feature) {
      setTitre(feature.titre)
      setDescription(feature.description || '')
      setPriorite(feature.priorite)
      setStatut(feature.statut)
      setBesoinId(feature.besoinId)
      setEpicId(feature.epicId || null)
    } else {
      setTitre('')
      setDescription('')
      setPriorite('Moyenne')
      setStatut('A faire')
      setBesoinId('')
      setEpicId(null)
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
      epicId,
    })
  }

  const epicsForSelectedBesoin = besoinId ? epics.filter((e) => e.besoinId === besoinId) : []
  const selectedBesoin = besoins.find((b) => b.id === besoinId)

  const handleImproveAI = () => {
    if (feature && onImproveAI) {
      onImproveAI(feature)
    }
  }

  const getPrioriteDisplay = (priorite: string): string => {
    switch (priorite) {
      case 'Elevee':
        return 'Élevée'
      default:
        return priorite
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
      default:
        return statut
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Besoin *</label>
        <select
          value={besoinId}
          onChange={(e) => setBesoinId(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          disabled={!!feature}
        >
          <option value="">-- Sélectionnez un besoin --</option>
          {besoins.map((besoin) => (
            <option key={besoin.id} value={besoin.id}>
              {besoin.titre}
            </option>
          ))}
        </select>
      </div>

      {epicsForSelectedBesoin.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neumorphic-muted">EPIC</label>
          <select
            value={epicId || ''}
            onChange={(e) => setEpicId(e.target.value || null)}
            className="neumorphic-input w-full p-3 rounded-lg"
          >
            <option value="">-- Aucune EPIC --</option>
            {epicsForSelectedBesoin.map((epic) => (
              <option key={epic.id} value={epic.id}>
                {epic.titre}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Titre *</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          placeholder="Entrez le titre de la Feature"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="neumorphic-input w-full p-3 rounded-lg"
          rows={4}
          placeholder="Décrivez la Feature (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Priorité</label>
        <select
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | 'Elevee' | 'Critique')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {priorites.map((p) => (
            <option key={p} value={p}>
              {getPrioriteDisplay(p)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {statutsFeature.map((s) => (
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
          {feature ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted font-medium"
        >
          Annuler
        </button>
        {onGenerateAI && !feature && selectedBesoin && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedBesoin)}
            className="neumorphic-button px-6 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-medium"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && feature && (
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

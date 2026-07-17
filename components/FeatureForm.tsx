'use client'

import { useState, useEffect } from 'react'
import type { Feature, FeatureFormData } from '@/types/feature'
import { priorites, statutsFeature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'
import { getStatutDisplay, getPrioriteDisplay } from '@/utils/statutDisplay'

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-field">
        <label htmlFor="besoinId">Besoin *</label>
        <select
          id="besoinId"
          value={besoinId}
          onChange={(e) => setBesoinId(e.target.value)}
          required
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
        <div className="form-field">
          <label htmlFor="epicId">EPIC</label>
          <select
            id="epicId"
            value={epicId || ''}
            onChange={(e) => setEpicId(e.target.value || null)}
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

      <div className="form-field">
        <label htmlFor="titre">Titre *</label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          placeholder="Entrez le titre de la Feature"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez la Feature (optionnel)"
          rows={4}
        />
      </div>

      <div className="form-field">
        <label htmlFor="priorite">Priorité</label>
        <select
          id="priorite"
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | 'Elevee' | 'Critique')}
        >
          {priorites.map((p) => (
            <option key={p} value={p}>
              {getPrioriteDisplay(p)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="statut">Statut</label>
        <select
          id="statut"
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule')}
        >
          {statutsFeature.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary">
          {feature ? 'Modifier' : 'Créer'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
        {onGenerateAI && !feature && selectedBesoin && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedBesoin)}
            className="btn btn-primary"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && feature && (
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

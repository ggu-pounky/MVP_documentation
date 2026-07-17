'use client'

import { useState, useEffect } from 'react'
import type { Epic, EpicFormData } from '@/types/epic'
import { statutsEpic } from '@/types/epic'
import type { Besoin } from '@/types/besoin'
import { getStatutDisplay } from '@/utils/statutDisplay'

type EpicFormProps = {
  epic?: Epic | null
  besoins: Besoin[]
  onSubmit: (data: EpicFormData) => Promise<void>
  onCancel: () => void
  onGenerateAI?: (besoin: Besoin) => void
  onImproveAI?: (epic: Epic) => void
}

export default function EpicForm({ epic, besoins, onSubmit, onCancel, onGenerateAI, onImproveAI }: EpicFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'A faire' | 'En cours' | 'Termine' | 'Annule'>('A faire')
  const [besoinId, setBesoinId] = useState('')

  useEffect(() => {
    if (epic) {
      setTitre(epic.titre)
      setDescription(epic.description || '')
      setStatut(epic.statut)
      setBesoinId(epic.besoinId)
    } else {
      setTitre('')
      setDescription('')
      setStatut('A faire')
      setBesoinId('')
    }
  }, [epic])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!besoinId) {
      alert('Veuillez sélectionner un besoin')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      statut,
      besoinId,
    })
  }

  const selectedBesoin = besoins.find((b) => b.id === besoinId)

  const handleImproveAI = () => {
    if (epic && onImproveAI) {
      onImproveAI(epic)
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
          disabled={!!epic}
        >
          <option value="">-- Sélectionnez un besoin --</option>
          {besoins.map((besoin) => (
            <option key={besoin.id} value={besoin.id}>
              {besoin.titre}
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
          placeholder="Entrez le titre de l'EPIC"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'EPIC (optionnel)"
          rows={4}
        />
      </div>

      <div className="form-field">
        <label htmlFor="statut">Statut</label>
        <select
          id="statut"
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule')}
        >
          {statutsEpic.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary">
          {epic ? 'Modifier' : 'Créer'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
        {onGenerateAI && !epic && selectedBesoin && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedBesoin)}
            className="btn btn-primary"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && epic && (
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

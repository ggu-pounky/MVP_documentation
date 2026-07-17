'use client'

import { useState, useEffect } from 'react'
import type { Epic, EpicFormData } from '@/types/epic'
import { statutsEpic } from '@/types/epic'
import type { Besoin } from '@/types/besoin'

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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Titre *</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          placeholder="Entrez le titre de l'EPIC"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="neumorphic-input w-full p-3 rounded-lg"
          rows={4}
          placeholder="Décrivez l'EPIC (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {statutsEpic.map((s) => (
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
          {epic ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted font-medium"
        >
          Annuler
        </button>
        {onGenerateAI && !epic && selectedBesoin && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedBesoin)}
            className="neumorphic-button px-6 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-medium"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && epic && (
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

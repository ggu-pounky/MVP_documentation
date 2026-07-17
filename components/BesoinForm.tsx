'use client'

import { useState, useEffect } from 'react'
import type { Besoin, BesoinFormData } from '@/types/besoin'
import { statutsBesoin } from '@/types/besoin'

type BesoinFormProps = {
  besoin?: Besoin | null
  onSubmit: (data: BesoinFormData) => Promise<void>
  onCancel: () => void
}

export default function BesoinForm({ besoin, onSubmit, onCancel }: BesoinFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'A faire' | 'En cours' | 'Termine' | 'Annule'>('A faire')

  useEffect(() => {
    if (besoin) {
      setTitre(besoin.titre)
      setDescription(besoin.description || '')
      setStatut(besoin.statut)
    } else {
      setTitre('')
      setDescription('')
      setStatut('A faire')
    }
  }, [besoin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      titre,
      description: description || null,
      statut,
    })
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
        <label className="block text-sm font-medium text-neumorphic-muted">Titre *</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          placeholder="Entrez le titre du besoin"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="neumorphic-input w-full p-3 rounded-lg"
          rows={4}
          placeholder="Décrivez le besoin (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {statutsBesoin.map((s) => (
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
          {besoin ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

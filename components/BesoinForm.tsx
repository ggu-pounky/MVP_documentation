'use client'

import { useState, useEffect } from 'react'
import type { Besoin, BesoinFormData } from '@/types/besoin'
import { statutsBesoin } from '@/types/besoin'
import { getStatutDisplay } from '@/utils/statutDisplay'

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-field">
        <label htmlFor="titre">Titre *</label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          placeholder="Entrez le titre du besoin"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le besoin (optionnel)"
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
          {statutsBesoin.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary">
          {besoin ? 'Modifier' : 'Créer'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
      </div>
    </form>
  )
}

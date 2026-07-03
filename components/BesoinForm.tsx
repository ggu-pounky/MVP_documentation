'use client'

import { useState, useEffect } from 'react'

type Besoin = {
  id: string
  titre: string
  description: string | null
  statut: string
  created_at: string
  updated_at: string
}

type BesoinFormProps = {
  besoin?: Besoin | null
  onSubmit: (data: { titre: string; description: string | null; statut: string; id?: string }) => Promise<void>
  onCancel: () => void
}

export default function BesoinForm({ besoin, onSubmit, onCancel }: BesoinFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState('À faire')

  useEffect(() => {
    if (besoin) {
      setTitre(besoin.titre)
      setDescription(besoin.description || '')
      setStatut(besoin.statut)
    } else {
      setTitre('')
      setDescription('')
      setStatut('À faire')
    }
  }, [besoin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      id: besoin?.id,
      titre,
      description: description || null,
      statut,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
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
          onChange={(e) => setStatut(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {besoin ? 'Modifier' : 'Créer'}
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

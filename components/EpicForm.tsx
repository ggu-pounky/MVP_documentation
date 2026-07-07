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
  onGenerateAI?: (besoin: Besoin) => void  // Pour la génération IA (création)
  onImproveAI?: (epic: Epic) => void  // Pour l'amélioration IA (modification)
}

// Fonction pour générer une description IREB
const generateIREBDescription = (titre: string): string => {
  return `User Story: En tant qu'utilisateur, je veux ${titre.toLowerCase()}, afin de répondre à mes besoins.
Critères d'acceptation:
1. Le système doit permettre de gérer ${titre.toLowerCase()}.
2. Les données doivent être validées avant toute opération.
3. Une confirmation visuelle doit être affichée après chaque action.
4. Les erreurs doivent être gérées et affichées clairement.`
}

export default function EpicForm({ epic, besoins, onSubmit, onCancel, onGenerateAI, onImproveAI }: EpicFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé'>('À faire')
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
      setStatut('À faire')
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

  // Trouver le besoin sélectionné pour la génération IA
  const selectedBesoin = besoins.find((b) => b.id === besoinId)

  // Gérer le clic sur "Amélioration IA"
  const handleImproveAI = () => {
    if (epic && onImproveAI) {
      onImproveAI(epic)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Besoin *</label>
        <select
          value={besoinId}
          onChange={(e) => setBesoinId(e.target.value)}
          required
          className="w-full p-2 border rounded"
          disabled={!!epic} // Désactiver si on modifie une EPIC existante
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
        <label className="block text-sm font-medium mb-1">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé')}
          className="w-full p-2 border rounded"
        >
          {statutsEpic.map((s) => (
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
          {epic ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton Générer par IA (visible uniquement en mode création) */}
        {onGenerateAI && !epic && selectedBesoin && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedBesoin)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Générer par IA
          </button>
        )}
        {/* Bouton Amélioration IA (visible uniquement en mode modification) */}
        {onImproveAI && epic && (
          <button
            type="button"
            onClick={handleImproveAI}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Amélioration IA
          </button>
        )}
      </div>
    </form>
  )
}

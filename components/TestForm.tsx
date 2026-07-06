'use client'

import { useState, useEffect } from 'react'
import type { Test, TestFormData } from '@/types/test'
import { prioritesTest, statutsTest } from '@/types/test'

type TestFormProps = {
  test?: Test | null
  exigences: { id: string; titre: string; featureTitre: string; besoinTitre: string }[]
  onSubmit: (data: TestFormData) => Promise<void>
  onCancel: () => void
}

export default function TestForm({ test, exigences, onSubmit, onCancel }: TestFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [exigenceId, setExigenceId] = useState('')
  const [isTNR, setIsTNR] = useState(false)
  const [isAutomatisable, setIsAutomatisable] = useState(false)
  const [priorite, setPriorite] = useState<'Faible' | 'Moyenne' | 'Élevée' | 'Critique'>('Moyenne')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'>('À faire')

  useEffect(() => {
    if (test) {
      setTitre(test.titre)
      setDescription(test.description || '')
      setExigenceId(test.exigenceId)
      setIsTNR(test.isTNR)
      setIsAutomatisable(test.isAutomatisable)
      setPriorite(test.priorite)
      setStatut(test.statut)
    } else {
      setTitre('')
      setDescription('')
      setExigenceId('')
      setIsTNR(false)
      setIsAutomatisable(false)
      setPriorite('Moyenne')
      setStatut('À faire')
    }
  }, [test])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exigenceId) {
      alert('Veuillez sélectionner une exigence')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      exigenceId,
      isTNR,
      isAutomatisable,
      priorite,
      statut,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Exigence *</label>
        <select
          value={exigenceId}
          onChange={(e) => setExigenceId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Sélectionnez une exigence --</option>
          {exigences.map((exigence) => (
            <option key={exigence.id} value={exigence.id}>
              {exigence.besoinTitre} → {exigence.featureTitre} → {exigence.titre}
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
          {prioritesTest.map((p) => (
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
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé')}
          className="w-full p-2 border rounded"
        >
          {statutsTest.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTNR}
            onChange={(e) => setIsTNR(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">TNR possible</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAutomatisable}
            onChange={(e) => setIsAutomatisable(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">À automatiser</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {test ? 'Modifier' : 'Créer'}
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

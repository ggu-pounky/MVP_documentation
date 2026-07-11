'use client'

import { useState, useEffect } from 'react'
import type { Test, TestFormData } from '@/types/test'
import { prioritesTest, statutsTest } from '@/types/test'

type ExigenceInfo = {
  id: string
  titre: string
  featureTitre: string
  besoinTitre: string
  description?: string
}

type TestFormProps = {
  test?: Test | null
  exigences: ExigenceInfo[]
  onSubmit: (data: TestFormData) => Promise<void>
  onCancel: () => void
  onGenerateAI?: (exigence: ExigenceInfo) => void
  onImproveAI?: (test: Test) => void
}

export default function TestForm({ test, exigences, onSubmit, onCancel, onGenerateAI, onImproveAI }: TestFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [exigenceId, setExigenceId] = useState('')
  const [isTNR, setIsTNR] = useState(false)
  const [isAutomatisable, setIsAutomatisable] = useState(false)
  const [priorite, setPriorite] = useState<'Faible' | 'Moyenne' | '\u00c9lev\u00e9e' | 'Critique'>('Moyenne')
  const [statut, setStatut] = useState<'\u00c0 faire' | 'En cours' | 'Termin\u00e9' | 'Annul\u00e9' | 'Valid\u00e9'>('\u00c0 faire')

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
      setStatut('\u00c0 faire')
    }
  }, [test])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exigenceId) {
      alert('Veuillez s\u00e9lectionner une exigence')
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

  // Trouver l'exigence s\u00e9lectionn\u00e9e pour la g\u00e9n\u00e9ration IA
  const selectedExigence = exigences.find((e) => e.id === exigenceId)

  // G\u00e9rer le clic sur "Am\u00e9lioration IA"
  const handleImproveAI = () => {
    if (test && onImproveAI) {
      onImproveAI(test)
    }
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
          disabled={!!test}
        >
          <option value="">-- S\u00e9lectionnez une exigence --</option>
          {exigences.map((exigence) => (
            <option key={exigence.id} value={exigence.id}>
              {exigence.besoinTitre} \u2192 {exigence.featureTitre} \u2192 {exigence.titre}
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
        <label className="block text-sm font-medium mb-1">Priorit\u00e9</label>
        <select
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | '\u00c9lev\u00e9e' | 'Critique')}
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
          onChange={(e) => setStatut(e.target.value as '\u00c0 faire' | 'En cours' | 'Termin\u00e9' | 'Annul\u00e9' | 'Valid\u00e9')}
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
          <span className="text-sm font-medium">\u00c0 automatiser</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {test ? 'Modifier' : 'Cr\u00e9er'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton G\u00e9n\u00e9rer par IA (visible si on cr\u00e9e un nouveau test et qu'une exigence est s\u00e9lectionn\u00e9e) */}
        {onGenerateAI && !test && selectedExigence && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedExigence)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            G\u00e9n\u00e9rer par IA
          </button>
        )}
        {/* Bouton Am\u00e9lioration IA (visible si on modifie un test) */}
        {onImproveAI && test && (
          <button
            type="button"
            onClick={handleImproveAI}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Am\u00e9lioration IA
          </button>
        )}
      </div>
    </form>
  )
}

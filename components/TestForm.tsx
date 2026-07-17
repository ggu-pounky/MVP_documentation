'use client'

import { useState, useEffect } from 'react'
import type { Test, TestFormData } from '@/types/test'
import { prioritesTest, statutsTest, typesTest } from '@/types/test'

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
  const [priorite, setPriorite] = useState<'Faible' | 'Moyenne' | 'Elevee' | 'Critique'>('Moyenne')
  const [statut, setStatut] = useState<'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide'>('A faire')
  const [type, setType] = useState<'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite'>('Unitaire')

  useEffect(() => {
    if (test) {
      setTitre(test.titre)
      setDescription(test.description || '')
      setExigenceId(test.exigenceId)
      setIsTNR(test.isTNR)
      setIsAutomatisable(test.isAutomatisable)
      setPriorite(test.priorite)
      setStatut(test.statut)
      setType(test.type)
    } else {
      setTitre('')
      setDescription('')
      setExigenceId('')
      setIsTNR(false)
      setIsAutomatisable(false)
      setPriorite('Moyenne')
      setStatut('A faire')
      setType('Unitaire')
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
      type,
    })
  }

  const selectedExigence = exigences.find((e) => e.id === exigenceId)

  const handleImproveAI = () => {
    if (test && onImproveAI) {
      onImproveAI(test)
    }
  }

  const getTypeDisplay = (type: string): string => {
    switch (type) {
      case 'Securite':
        return 'Sécurité'
      case 'Integration':
        return 'Intégration'
      case 'E2E':
        return 'E2E'
      default:
        return type
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
      case 'Valide':
        return 'Validé'
      default:
        return statut
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

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Exigence *</label>
        <select
          value={exigenceId}
          onChange={(e) => setExigenceId(e.target.value)}
          required
          className="neumorphic-input w-full p-3 rounded-lg"
          disabled={!!test}
        >
          <option value="">-- Sélectionnez une Exigence --</option>
          {exigences.map((exigence) => (
            <option key={exigence.id} value={exigence.id}>
              {exigence.besoinTitre} &gt; {exigence.featureTitre} &gt; {exigence.titre}
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
          placeholder="Entrez le titre du test"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="neumorphic-input w-full p-3 rounded-lg"
          rows={4}
          placeholder="Décrivez le test (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {typesTest.map((t) => (
            <option key={t} value={t}>
              {getTypeDisplay(t)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neumorphic-muted">Priorité</label>
        <select
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | 'Elevee' | 'Critique')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {prioritesTest.map((p) => (
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
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide')}
          className="neumorphic-input w-full p-3 rounded-lg"
        >
          {statutsTest.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isTNR}
              onChange={(e) => setIsTNR(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-neumorphic-muted">Test de Non-Régression (TNR)</span>
          </label>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAutomatisable}
              onChange={(e) => setIsAutomatisable(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-neumorphic-muted">Automatisable</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="neumorphic-button px-6 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-300 font-medium"
        >
          {test ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted font-medium"
        >
          Annuler
        </button>
        {onGenerateAI && !test && selectedExigence && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedExigence)}
            className="neumorphic-button px-6 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-medium"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && test && (
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

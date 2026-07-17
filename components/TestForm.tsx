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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-field">
        <label htmlFor="exigenceId">Exigence *</label>
        <select
          id="exigenceId"
          value={exigenceId}
          onChange={(e) => setExigenceId(e.target.value)}
          required
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

      <div className="form-field">
        <label htmlFor="titre">Titre *</label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          placeholder="Entrez le titre du test"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le test (optionnel)"
          rows={4}
        />
      </div>

      <div className="form-field">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite')}
        >
          {typesTest.map((t) => (
            <option key={t} value={t}>
              {getTypeDisplay(t)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="priorite">Priorité</label>
        <select
          id="priorite"
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | 'Elevee' | 'Critique')}
        >
          {prioritesTest.map((p) => (
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
          onChange={(e) => setStatut(e.target.value as 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide')}
        >
          {statutsTest.map((s) => (
            <option key={s} value={s}>
              {getStatutDisplay(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="form-field">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isTNR}
              onChange={(e) => setIsTNR(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">Test de Non-Régression (TNR)</span>
          </label>
        </div>
        <div className="form-field">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAutomatisable}
              onChange={(e) => setIsAutomatisable(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">Automatisable</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary">
          {test ? 'Modifier' : 'Créer'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
        {onGenerateAI && !test && selectedExigence && (
          <button
            type="button"
            onClick={() => onGenerateAI(selectedExigence)}
            className="btn btn-primary"
          >
            Générer par IA
          </button>
        )}
        {onImproveAI && test && (
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

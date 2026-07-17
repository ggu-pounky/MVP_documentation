'use client'

import type { Test } from '@/types/test'
import type { Exigence } from '@/types/exigence'
import { getStatutDisplay, getTypeDisplay, getPrioriteDisplay } from '@/utils/statutDisplay'

type TestListProps = {
  tests: Test[]
  exigences: Exigence[]
  onEdit: (test: Test) => void
  onDelete: (id: string) => void
}

export default function TestList({ tests, exigences, onEdit, onDelete }: TestListProps) {
  const getExigenceTitre = (exigenceId: string) => {
    const exigence = exigences.find((e) => e.id === exigenceId)
    return exigence ? exigence.titre : 'Inconnu'
  }

  if (tests.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">Aucun Test enregistré pour le moment.</p>
        <p className="mt-2 text-sm text-muted">
          Sélectionnez une Exigence et utilisez le bouton "Ajouter un Test" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Exigence</th>
            <th>Titre</th>
            <th>Type</th>
            <th>Priorité</th>
            <th>Statut</th>
            <th>TNR</th>
            <th>Auto</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id} className="hover:bg-gray-50">
              <td className="p-4">{getExigenceTitre(test.exigenceId)}</td>
              <td className="p-4 font-medium text-gray-800">{test.titre}</td>
              <td className="p-4">
                <span className="env-badge">
                  {getTypeDisplay(test.type)}
                </span>
              </td>
              <td className="p-4">
                <span className={`env-badge ${
                  test.priorite === 'Critique' ? 'bg-error-light text-error' :
                  test.priorite === 'Elevee' ? 'bg-warning-light text-warning' :
                  test.priorite === 'Moyenne' ? 'bg-gray-200 text-gray-600' :
                  'bg-success-light text-success'
                }`}>
                  {getPrioriteDisplay(test.priorite)}
                </span>
              </td>
              <td className="p-4">
                <span className={`status-badge in-table ${
                  test.statut === 'Termine' || test.statut === 'Valide' ? 'ready' :
                  test.statut === 'En cours' ? 'processing' :
                  test.statut === 'Annule' ? 'error' :
                  'canceled'
                }`}>
                  {getStatutDisplay(test.statut)}
                </span>
              </td>
              <td className="p-4 text-center">
                {test.isTNR ? '✅' : '❌'}
              </td>
              <td className="p-4 text-center">
                {test.isAutomatisable ? '✅' : '❌'}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(test)}
                    className="btn btn-secondary btn-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(test.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

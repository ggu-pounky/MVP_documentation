'use client'

import type { Test } from '@/types/test'
import type { Exigence } from '@/types/exigence'
import { getStatutDisplay, getStatutColor, getTypeColor } from '@/utils/statutDisplay'

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
      <div className="neumorphic-card p-6 text-center">
        <p className="text-neumorphic-muted">Aucun Test enregistré pour le moment.</p>
        <p className="mt-2 text-sm text-neumorphic-muted">
          Sélectionnez une Exigence et utilisez le bouton "Ajouter un Test" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-neumorphic">
        <thead className="bg-neumorphic-dark">
          <tr>
            <th className="p-3 text-left text-neumorphic-muted">Exigence</th>
            <th className="p-3 text-left text-neumorphic-muted">Titre</th>
            <th className="p-3 text-left text-neumorphic-muted">Type</th>
            <th className="p-3 text-left text-neumorphic-muted">Statut</th>
            <th className="p-3 text-left text-neumorphic-muted">TNR</th>
            <th className="p-3 text-left text-neumorphic-muted">Auto</th>
            <th className="p-3 text-left text-neumorphic-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id} className="border-t border-neumorphic-border">
              <td className="p-3">{getExigenceTitre(test.exigenceId)}</td>
              <td className="p-3">{test.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(test.type)}`}>
                  {test.type === 'Securite' ? 'Sécurité' : test.type === 'Integration' ? 'Intégration' : test.type}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(test.statut)}`}>
                  {getStatutDisplay(test.statut)}
                </span>
              </td>
              <td className="p-3 text-center">
                {test.isTNR ? '✅' : '❌'}
              </td>
              <td className="p-3 text-center">
                {test.isAutomatisable ? '✅' : '❌'}
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(test)}
                    className="neumorphic-button px-3 py-1 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(test.id)}
                    className="neumorphic-button px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/40"
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

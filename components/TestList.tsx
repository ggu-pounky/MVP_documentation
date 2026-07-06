'use client'

import type { Test } from '@/types/test'

type TestListProps = {
  tests: Test[]
  exigences: { id: string; titre: string; featureTitre: string; besoinTitre: string }[]
  onEdit: (test: Test) => void
  onDelete: (id: string) => void
}

export default function TestList({ tests, exigences, onEdit, onDelete }: TestListProps) {
  const getExigenceInfo = (exigenceId: string) => {
    const exigence = exigences.find((e) => e.id === exigenceId)
    return exigence ? `${exigence.besoinTitre} → ${exigence.featureTitre} → ${exigence.titre}` : 'Inconnu'
  }

  const getPrioriteColor = (priorite: string): string => {
    switch (priorite) {
      case 'Critique':
        return 'bg-red-100 text-red-800'
      case 'Élevée':
        return 'bg-orange-100 text-orange-800'
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800'
      case 'Faible':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutColor = (statut: string): string => {
    switch (statut) {
      case 'Validé':
        return 'bg-green-100 text-green-800'
      case 'Terminé':
        return 'bg-blue-100 text-blue-800'
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800'
      case 'Annulé':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (tests.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        <p>Aucun test enregistré pour le moment.</p>
        <p className="mt-2 text-sm">Sélectionnez une exigence et utilisez le bouton "Ajouter un Test" pour commencer.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <h2 className="p-4 text-lg font-semibold border-b">Liste des Tests ({tests.length})</h2>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Exigence (Besoin → Feature → Titre)</th>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Priorité</th>
            <th className="p-3 text-left">TNR</th>
            <th className="p-3 text-left">Automatisable</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id} className="border-t">
              <td className="p-3 max-w-xs truncate">{getExigenceInfo(test.exigenceId)}</td>
              <td className="p-3">{test.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getPrioriteColor(test.priorite)}`}>
                  {test.priorite}
                </span>
              </td>
              <td className="p-3 text-center">
                {test.isTNR ? '✅' : '❌'}
              </td>
              <td className="p-3 text-center">
                {test.isAutomatisable ? '✅' : '❌'}
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(test.statut)}`}>
                  {test.statut}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(test)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(test.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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

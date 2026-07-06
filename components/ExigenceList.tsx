'use client'

import type { Exigence } from '@/types/exigence'

type ExigenceListProps = {
  exigences: Exigence[]
  features: { id: string; besoinTitre: string; titre: string }[]
  onEdit: (exigence: Exigence) => void
  onDelete: (id: string) => void
}

export default function ExigenceList({ exigences, features, onEdit, onDelete }: ExigenceListProps) {
  const getFeatureInfo = (featureId: string) => {
    const feature = features.find((f) => f.id === featureId)
    return feature ? `${feature.besoinTitre} - ${feature.titre}` : 'Inconnu'
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

  if (exigences.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        <p>Aucune exigence enregistrée pour le moment.</p>
        <p className="mt-2 text-sm">Sélectionnez une Feature et utilisez le bouton "Ajouter une Exigence" pour commencer.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <h2 className="p-4 text-lg font-semibold border-b">Liste des Exigences ({exigences.length})</h2>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Feature (Besoin - Titre)</th>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exigences.map((exigence) => (
            <tr key={exigence.id} className="border-t">
              <td className="p-3">{getFeatureInfo(exigence.featureId)}</td>
              <td className="p-3">{exigence.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(exigence.statut)}`}>
                  {exigence.statut}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(exigence)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(exigence.id)}
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

'use client'

import type { Epic } from '@/types/epic'
import type { Besoin } from '@/types/besoin'

type EpicListProps = {
  epics: Epic[]
  besoins: Besoin[]
  onEdit: (epic: Epic) => void
  onDelete: (id: string) => void
}

export default function EpicList({ epics, besoins, onEdit, onDelete }: EpicListProps) {
  const getBesoinTitre = (besoinId: string) => {
    const besoin = besoins.find((b) => b.id === besoinId)
    return besoin ? besoin.titre : 'Inconnu'
  }

  const getStatutColor = (statut: string): string => {
    switch (statut) {
      case 'Terminé':
        return 'bg-green-100 text-green-800'
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800'
      case 'Annulé':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (epics.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        <p>Aucune EPIC enregistrée pour le moment.</p>
        <p className="mt-2 text-sm">Sélectionnez un besoin et utilisez le bouton "Ajouter une EPIC" pour commencer.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <h2 className="p-4 text-lg font-semibold border-b">Liste des EPICS ({epics.length})</h2>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Besoin</th>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {epics.map((epic) => (
            <tr key={epic.id} className="border-t">
              <td className="p-3">{getBesoinTitre(epic.besoinId)}</td>
              <td className="p-3">{epic.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(epic.statut)}`}>
                  {epic.statut}
                </span>
              </td>
              <td className="p-3">{epic.description || '-'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(epic)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(epic.id)}
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

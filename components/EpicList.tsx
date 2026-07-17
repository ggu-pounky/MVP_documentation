'use client'

import type { Epic } from '@/types/epic'
import type { Besoin } from '@/types/besoin'
import { getStatutDisplay } from '@/utils/statutDisplay'

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

  if (epics.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">Aucune EPIC enregistrée pour le moment.</p>
        <p className="mt-2 text-sm text-muted">
          Sélectionnez un besoin et utilisez le bouton "Ajouter une EPIC" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Besoin</th>
            <th>Titre</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {epics.map((epic) => (
            <tr key={epic.id} className="hover:bg-gray-50">
              <td className="p-4">{getBesoinTitre(epic.besoinId)}</td>
              <td className="p-4 font-medium text-gray-800">{epic.titre}</td>
              <td className="p-4">
                <span className={`status-badge in-table ${
                  epic.statut === 'Termine' ? 'ready' :
                  epic.statut === 'En cours' ? 'processing' :
                  epic.statut === 'Annule' ? 'error' :
                  'canceled'
                }`}>
                  {getStatutDisplay(epic.statut)}
                </span>
              </td>
              <td className="p-4 text-gray-600 text-sm">{epic.description || '-'}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(epic)}
                    className="btn btn-secondary btn-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(epic.id)}
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

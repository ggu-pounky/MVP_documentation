'use client'

import type { Besoin } from '@/types/besoin'
import { getStatutDisplay } from '@/utils/statutDisplay'

type BesoinListProps = {
  besoins: Besoin[]
  onEdit: (besoin: Besoin) => void
  onDelete: (id: string) => void
}

export default function BesoinList({ besoins, onEdit, onDelete }: BesoinListProps) {
  if (besoins.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">Aucun besoin enregistré pour le moment.</p>
        <p className="mt-2 text-sm text-muted">
          Utilisez le bouton "Ajouter un besoin" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {besoins.map((besoin) => (
            <tr key={besoin.id} className="hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-800">{besoin.titre}</td>
              <td className="p-4">
                <span className={`status-badge in-table ${
                  besoin.statut === 'Termine' ? 'ready' :
                  besoin.statut === 'En cours' ? 'processing' :
                  besoin.statut === 'Annule' ? 'error' :
                  'canceled'
                }`}>
                  {getStatutDisplay(besoin.statut)}
                </span>
              </td>
              <td className="p-4 text-gray-600 text-sm">{besoin.description || '-'}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(besoin)}
                    className="btn btn-secondary btn-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(besoin.id)}
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

'use client'

import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import { getStatutDisplay, getTypeDisplay } from '@/utils/statutDisplay'

type ExigenceListProps = {
  exigences: Exigence[]
  features: Feature[]
  onEdit: (exigence: Exigence) => void
  onDelete: (id: string) => void
}

export default function ExigenceList({ exigences, features, onEdit, onDelete }: ExigenceListProps) {
  const getFeatureTitre = (featureId: string) => {
    const feature = features.find((f) => f.id === featureId)
    return feature ? feature.titre : 'Inconnu'
  }

  if (exigences.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">Aucune Exigence enregistrée pour le moment.</p>
        <p className="mt-2 text-sm text-muted">
          Sélectionnez une Feature et utilisez le bouton "Ajouter une Exigence" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Titre</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exigences.map((exigence) => (
            <tr key={exigence.id} className="hover:bg-gray-50">
              <td className="p-4">{getFeatureTitre(exigence.featureId)}</td>
              <td className="p-4 font-medium text-gray-800">{exigence.titre}</td>
              <td className="p-4">
                <span className="env-badge">
                  {getTypeDisplay(exigence.type)}
                </span>
              </td>
              <td className="p-4">
                <span className={`status-badge in-table ${
                  exigence.statut === 'Termine' || exigence.statut === 'Valide' ? 'ready' :
                  exigence.statut === 'En cours' ? 'processing' :
                  exigence.statut === 'Annule' ? 'error' :
                  'canceled'
                }`}>
                  {getStatutDisplay(exigence.statut)}
                </span>
              </td>
              <td className="p-4 text-gray-600 text-sm">{exigence.description || '-'}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(exigence)}
                    className="btn btn-secondary btn-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(exigence.id)}
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

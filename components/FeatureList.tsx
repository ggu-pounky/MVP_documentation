'use client'

import type { Feature } from '@/types/feature'
import type { Epic } from '@/types/epic'
import { getStatutDisplay, getPrioriteDisplay } from '@/utils/statutDisplay'

type FeatureListProps = {
  features: Feature[]
  epics: Epic[]
  onEdit: (feature: Feature) => void
  onDelete: (id: string) => void
}

export default function FeatureList({ features, epics, onEdit, onDelete }: FeatureListProps) {
  const getEpicTitre = (epicId: string | null) => {
    if (!epicId) return 'Aucune'
    const epic = epics.find((e) => e.id === epicId)
    return epic ? epic.titre : 'Inconnu'
  }

  if (features.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">Aucune Feature enregistrée pour le moment.</p>
        <p className="mt-2 text-sm text-muted">
          Sélectionnez une EPIC et utilisez le bouton "Ajouter une Feature" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>EPIC</th>
            <th>Titre</th>
            <th>Priorité</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-50">
              <td className="p-4">{getEpicTitre(feature.epicId)}</td>
              <td className="p-4 font-medium text-gray-800">{feature.titre}</td>
              <td className="p-4">
                <span className={`env-badge ${
                  feature.priorite === 'Critique' ? 'bg-error-light text-error' :
                  feature.priorite === 'Elevee' ? 'bg-warning-light text-warning' :
                  feature.priorite === 'Moyenne' ? 'bg-gray-200 text-gray-600' :
                  'bg-success-light text-success'
                }`}>
                  {getPrioriteDisplay(feature.priorite)}
                </span>
              </td>
              <td className="p-4">
                <span className={`status-badge in-table ${
                  feature.statut === 'Termine' ? 'ready' :
                  feature.statut === 'En cours' ? 'processing' :
                  feature.statut === 'Annule' ? 'error' :
                  'canceled'
                }`}>
                  {getStatutDisplay(feature.statut)}
                </span>
              </td>
              <td className="p-4 text-gray-600 text-sm">{feature.description || '-'}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(feature)}
                    className="btn btn-secondary btn-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(feature.id)}
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

'use client'

import type { Feature } from '@/types/feature'
import type { Epic } from '@/types/epic'
import { getStatutDisplay, getStatutColor, getPrioriteColor } from '@/utils/statutDisplay'

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
      <div className="neumorphic-card p-6 text-center">
        <p className="text-neumorphic-muted">Aucune Feature enregistrée pour le moment.</p>
        <p className="mt-2 text-sm text-neumorphic-muted">
          Sélectionnez une EPIC et utilisez le bouton "Ajouter une Feature" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-neumorphic">
        <thead className="bg-neumorphic-dark">
          <tr>
            <th className="p-3 text-left text-neumorphic-muted">EPIC</th>
            <th className="p-3 text-left text-neumorphic-muted">Titre</th>
            <th className="p-3 text-left text-neumorphic-muted">Priorité</th>
            <th className="p-3 text-left text-neumorphic-muted">Statut</th>
            <th className="p-3 text-left text-neumorphic-muted">Description</th>
            <th className="p-3 text-left text-neumorphic-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className="border-t border-neumorphic-border">
              <td className="p-3">{getEpicTitre(feature.epicId)}</td>
              <td className="p-3">{feature.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getPrioriteColor(feature.priorite)}`}>
                  {feature.priorite === 'Elevee' ? 'Élevée' : feature.priorite}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(feature.statut)}`}>
                  {getStatutDisplay(feature.statut)}
                </span>
              </td>
              <td className="p-3">{feature.description || '-'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(feature)}
                    className="neumorphic-button px-3 py-1 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(feature.id)}
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

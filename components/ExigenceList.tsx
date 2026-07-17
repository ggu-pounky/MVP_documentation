'use client'

import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import { getStatutDisplay, getStatutColor, getTypeColor } from '@/utils/statutDisplay'

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
      <div className="neumorphic-card p-6 text-center">
        <p className="text-neumorphic-muted">Aucune Exigence enregistrée pour le moment.</p>
        <p className="mt-2 text-sm text-neumorphic-muted">
          Sélectionnez une Feature et utilisez le bouton "Ajouter une Exigence" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-neumorphic">
        <thead className="bg-neumorphic-dark">
          <tr>
            <th className="p-3 text-left text-neumorphic-muted">Feature</th>
            <th className="p-3 text-left text-neumorphic-muted">Titre</th>
            <th className="p-3 text-left text-neumorphic-muted">Type</th>
            <th className="p-3 text-left text-neumorphic-muted">Statut</th>
            <th className="p-3 text-left text-neumorphic-muted">Description</th>
            <th className="p-3 text-left text-neumorphic-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exigences.map((exigence) => (
            <tr key={exigence.id} className="border-t border-neumorphic-border">
              <td className="p-3">{getFeatureTitre(exigence.featureId)}</td>
              <td className="p-3">{exigence.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(exigence.type)}`}>
                  {exigence.type}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(exigence.statut)}`}>
                  {getStatutDisplay(exigence.statut)}
                </span>
              </td>
              <td className="p-3">{exigence.description || '-'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(exigence)}
                    className="neumorphic-button px-3 py-1 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(exigence.id)}
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

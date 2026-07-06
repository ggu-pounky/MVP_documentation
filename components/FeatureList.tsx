'use client'

import type { Feature } from '@/types/feature'

type FeatureListProps = {
  features: Feature[]
  besoins: { id: string; titre: string }[]
  onEdit: (feature: Feature) => void
  onDelete: (id: string) => void
}

export default function FeatureList({ features, besoins, onEdit, onDelete }: FeatureListProps) {
  const getBesoinTitre = (besoinId: string) => {
    const besoin = besoins.find((b) => b.id === besoinId)
    return besoin ? besoin.titre : 'Inconnu'
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
      case 'Terminé':
        return 'bg-green-100 text-green-800'
      case 'En cours':
        return 'bg-blue-100 text-blue-800'
      case 'Annulé':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (features.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        <p>Aucune Feature enregistrée pour le moment.</p>
        <p className="mt-2 text-sm">Sélectionnez un besoin et utilisez le bouton "Ajouter une Feature" pour commencer.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <h2 className="p-4 text-lg font-semibold border-b">Liste des Features ({features.length})</h2>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nom du Besoin</th>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Priorité</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className="border-t">
              <td className="p-3">{getBesoinTitre(feature.besoinId)}</td>
              <td className="p-3">{feature.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getPrioriteColor(feature.priorite)}`}>
                  {feature.priorite}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(feature.statut)}`}>
                  {feature.statut}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(feature)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(feature.id)}
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

'use client'

import type { Besoin } from '@/types/besoin'

type BesoinListProps = {
  besoins: Besoin[]
  onEdit: (besoin: Besoin) => void
  onDelete: (id: string) => void
}

export default function BesoinList({ besoins, onEdit, onDelete }: BesoinListProps) {
  const getStatutColor = (statut: string): string => {
    switch (statut) {
      case 'Termine':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'Annule':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatutDisplay = (statut: string): string => {
    switch (statut) {
      case 'A faire':
        return 'À faire'
      case 'En cours':
        return 'En cours'
      case 'Termine':
        return 'Terminé'
      case 'Annule':
        return 'Annulé'
      default:
        return statut
    }
  }

  if (besoins.length === 0) {
    return (
      <div className="neumorphic-card p-6 text-center">
        <p className="text-neumorphic-muted">Aucun besoin enregistré pour le moment.</p>
        <p className="mt-2 text-sm text-neumorphic-muted">
          Utilisez le bouton "Ajouter un besoin" pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-neumorphic">
        <thead className="bg-neumorphic-dark">
          <tr>
            <th className="p-3 text-left text-neumorphic-muted">Titre</th>
            <th className="p-3 text-left text-neumorphic-muted">Statut</th>
            <th className="p-3 text-left text-neumorphic-muted">Description</th>
            <th className="p-3 text-left text-neumorphic-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {besoins.map((besoin) => (
            <tr key={besoin.id} className="border-t border-neumorphic-border">
              <td className="p-3">{besoin.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(besoin.statut)}`}>
                  {getStatutDisplay(besoin.statut)}
                </span>
              </td>
              <td className="p-3">{besoin.description || '-'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(besoin)}
                    className="neumorphic-button px-3 py-1 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(besoin.id)}
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

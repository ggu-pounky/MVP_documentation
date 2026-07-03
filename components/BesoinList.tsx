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

  if (besoins.length === 0) {
    return <div className="text-gray-500">Aucun besoin trouvé.</div>
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {besoins.map((besoin) => (
            <tr key={besoin.id} className="border-t">
              <td className="p-3">{besoin.titre}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(besoin.statut)}`}>
                  {besoin.statut}
                </span>
              </td>
              <td className="p-3">{besoin.description || '-'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(besoin)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(besoin.id)}
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

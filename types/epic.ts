import type { Besoin } from './besoin'

export type Epic = {
  id: string
  titre: string
  description: string | null
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé'
  besoinId: string  // Référence au besoin parent
  created_at: string
  updated_at: string
}

export type EpicFormData = {
  titre: string
  description: string | null
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé'
  besoinId: string
}

// Statuts disponibles pour le sélecteur
export const statutsEpic = ['À faire', 'En cours', 'Terminé', 'Annulé'] as const

import type { Besoin } from './besoin'

export type Epic = {
  id: string
  titre: string
  description: string | null
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule'
  besoinId: string
  created_at: string
  updated_at: string
}

export type EpicFormData = {
  titre: string
  description: string | null
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule'
  besoinId: string
}

// Statuts disponibles pour le sélecteur
export const statutsEpic = ['A faire', 'En cours', 'Termine', 'Annule'] as const

import type { Exigence } from './exigence'

export type Test = {
  id: string
  titre: string
  description: string | null
  exigenceId: string  // Référence à l'exigence associée
  isTNR: boolean      // Case à cocher : TNR possible
  isAutomatisable: boolean  // Case à cocher : À automatiser
  priorite: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'
  created_at: string
  updated_at: string
}

export type TestFormData = {
  titre: string
  description: string | null
  exigenceId: string
  isTNR: boolean
  isAutomatisable: boolean
  priorite: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'
}

// Priorités disponibles
export const prioritesTest = ['Faible', 'Moyenne', 'Élevée', 'Critique'] as const

// Statuts disponibles
export const statutsTest = ['À faire', 'En cours', 'Terminé', 'Annulé', 'Validé'] as const

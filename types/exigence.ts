import type { Feature } from './feature'

export type Exigence = {
  id: string
  titre: string
  description: string | null
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'
  featureId: string  // Référence à la Feature parente
  created_at: string
  updated_at: string
}

export type ExigenceFormData = {
  titre: string
  description: string | null
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'
  featureId: string
}

// Statuts disponibles pour le sélecteur
export const statutsExigence = ['À faire', 'En cours', 'Terminé', 'Annulé', 'Validé'] as const

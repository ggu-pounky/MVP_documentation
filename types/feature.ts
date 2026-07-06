import type { Besoin } from './besoin'

export type Feature = {
  id: string
  titre: string
  description: string | null
  priorite: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé'
  besoinId: string  // Référence au besoin parent
  epicId: string | null  // Référence à l'EPIC parente (nullable pour rétrocompatibilité)
  created_at: string
  updated_at: string
}

export type FeatureFormData = {
  titre: string
  description: string | null
  priorite: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'
  statut: 'À faire' | 'En cours' | 'Terminé' | 'Annulé'
  besoinId: string
  epicId?: string | null
}

// Priorités disponibles pour le sélecteur
export const priorites = ['Faible', 'Moyenne', 'Élevée', 'Critique'] as const

// Statuts disponibles pour le sélecteur
export const statutsFeature = ['À faire', 'En cours', 'Terminé', 'Annulé'] as const

import type { Feature } from './feature'

export type Exigence = {
  id: string
  titre: string
  description: string | null
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide'
  type: 'Fonctionnelle' | 'Non fonctionnelle' | 'Technique'
  featureId: string
  created_at: string
  updated_at: string
}

export type ExigenceFormData = {
  titre: string
  description: string | null
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide'
  featureId: string
  type: 'Fonctionnelle' | 'Non fonctionnelle' | 'Technique'
}

// Statuts disponibles pour le sélecteur
export const statutsExigence = ['A faire', 'En cours', 'Termine', 'Annule', 'Valide'] as const

// Types disponibles pour le sélecteur
export const typesExigence = ['Fonctionnelle', 'Non fonctionnelle', 'Technique'] as const

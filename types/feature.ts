import type { Besoin } from './besoin'

export type Feature = {
  id: string
  titre: string
  description: string | null
  priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique'
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule'
  besoinId: string
  epicId: string | null
  created_at: string
  updated_at: string
}

export type FeatureFormData = {
  titre: string
  description: string | null
  priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique'
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule'
  besoinId: string
  epicId?: string | null
}

// Priorités disponibles pour le sélecteur
export const priorites = ['Faible', 'Moyenne', 'Elevee', 'Critique'] as const

// Statuts disponibles pour le sélecteur
export const statutsFeature = ['A faire', 'En cours', 'Termine', 'Annule'] as const

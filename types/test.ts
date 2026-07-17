import type { Exigence } from './exigence'

export type Test = {
  id: string
  titre: string
  description: string | null
  exigenceId: string
  isTNR: boolean
  isAutomatisable: boolean
  priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique'
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide'
  type: 'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite'
  created_at: string
  updated_at: string
}

export type TestFormData = {
  titre: string
  description: string | null
  exigenceId: string
  isTNR: boolean
  isAutomatisable: boolean
  priorite: 'Faible' | 'Moyenne' | 'Elevee' | 'Critique'
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule' | 'Valide'
  type: 'Unitaire' | 'Integration' | 'E2E' | 'Performance' | 'Securite'
}

// Priorités disponibles
export const prioritesTest = ['Faible', 'Moyenne', 'Elevee', 'Critique'] as const

// Statuts disponibles
export const statutsTest = ['A faire', 'En cours', 'Termine', 'Annule', 'Valide'] as const

// Types disponibles
export const typesTest = ['Unitaire', 'Integration', 'E2E', 'Performance', 'Securite'] as const

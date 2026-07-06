import type { Besoin } from './besoin'
import type { Feature } from './feature'
import type { Exigence } from './exigence'

// Structure du PRD (inspiré d'Amazon)
export type PRD = {
  id: string
  titre: string
  description: string
  objectifs: string[]
  publicCible: string
  hypotheses: string[]
  metriquesSucces: string[]
  besoins: {
    besoin: Besoin
    features: {
      feature: Feature
      exigences: Exigence[]
    }[]
  }[]
  created_at: string
  updated_at: string
}

// Données modifiables par l'utilisateur (hors besoins/features/exigences)
export type PRDEditableData = {
  titre: string
  description: string
  objectifs: string[]
  publicCible: string
  hypotheses: string[]
  metriquesSucces: string[]
}

export type Besoin = {
  id: string
  titre: string
  description: string | null
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule'
  created_at: string
  updated_at: string
}

export type BesoinFormData = {
  titre: string
  description: string | null
  statut: 'A faire' | 'En cours' | 'Termine' | 'Annule'
  id?: string
}

// Statuts disponibles pour le sélecteur
export const statutsBesoin = ['A faire', 'En cours', 'Termine', 'Annule'] as const

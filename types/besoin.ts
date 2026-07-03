export type Besoin = {
  id: string
  titre: string
  description: string | null
  statut: string
  created_at: string
  updated_at: string
}

export type BesoinFormData = {
  titre: string
  description: string | null
  statut: string
  id?: string
}

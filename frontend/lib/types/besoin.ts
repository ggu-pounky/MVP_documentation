// Types pour les besoins (Besoin)
export interface Besoin {
  id: string;  // String pour correspondre au frontend (le backend utilise des integers)
  titre: string;
  description: string | null;
  statut: string;
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string
}

// Statuts possibles pour un besoin
export const STATUTS = [
  "À faire",
  "En cours",
  "Terminé",
  "Annulé",
] as const;

// Type pour les statuts
export type Statut = typeof STATUTS[number];

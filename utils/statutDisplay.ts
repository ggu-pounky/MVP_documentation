// Fonction utilitaire pour afficher les statuts avec les bons caractères

export const getStatutDisplay = (statut: string): string => {
  switch (statut) {
    case 'A faire':
      return 'À faire'
    case 'En cours':
      return 'En cours'
    case 'Termine':
      return 'Terminé'
    case 'Annule':
      return 'Annulé'
    case 'Valide':
      return 'Validé'
    default:
      return statut
  }
}

export const getPrioriteDisplay = (priorite: string): string => {
  switch (priorite) {
    case 'Elevee':
      return 'Élevée'
    default:
      return priorite
  }
}

export const getTypeDisplay = (type: string): string => {
  switch (type) {
    case 'Fonctionnelle':
      return 'Fonctionnelle'
    case 'Non fonctionnelle':
      return 'Non fonctionnelle'
    case 'Technique':
      return 'Technique'
    case 'Unitaire':
      return 'Unitaire'
    case 'Integration':
      return 'Intégration'
    case 'E2E':
      return 'E2E'
    case 'Performance':
      return 'Performance'
    case 'Securite':
      return 'Sécurité'
    default:
      return type
  }
}

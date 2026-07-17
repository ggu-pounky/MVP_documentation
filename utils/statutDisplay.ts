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
    case 'Elevee':
      return 'Élevée'
    case 'Securite':
      return 'Sécurité'
    case 'Integration':
      return 'Intégration'
    default:
      return statut
  }
}

// Fonction utilitaire pour obtenir la couleur du statut
export const getStatutColor = (statut: string): string => {
  switch (statut) {
    case 'Termine':
    case 'Valide':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'En cours':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'Annule':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

// Fonction utilitaire pour obtenir la couleur du type
export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'Fonctionnelle':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'Non fonctionnelle':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'Technique':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'Unitaire':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
    case 'Integration':
    case 'Intégration':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'E2E':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    case 'Performance':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    case 'Securite':
    case 'Sécurité':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

// Fonction utilitaire pour obtenir la couleur de la priorité
export const getPrioriteColor = (priorite: string): string => {
  switch (priorite) {
    case 'Critique':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'Elevee':
    case 'Élevée':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'Moyenne':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'Faible':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

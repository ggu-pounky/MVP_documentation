// Fonctions de migration pour les données existantes avec les anciens statuts

export const migrateStatut = (oldStatut: string): string => {
  const statutMap: Record<string, string> = {
    // Ancien format avec caractères spéciaux
    'À faire': 'A faire',
    'En cours': 'En cours',
    'Terminé': 'Termine',
    'Annulé': 'Annule',
    'Validé': 'Valide',
    'Élevée': 'Elevee',
    'Sécurité': 'Securite',
    'Intégration': 'Integration',
  }
  return statutMap[oldStatut] || oldStatut
}

export const migratePriorite = (oldPriorite: string): string => {
  const prioriteMap: Record<string, string> = {
    // Ancien format avec caractères spéciaux
    'Faible': 'Faible',
    'Moyenne': 'Moyenne',
    'Élevée': 'Elevee',
    'Critique': 'Critique',
  }
  return prioriteMap[oldPriorite] || oldPriorite
}

export const migrateType = (oldType: string): string => {
  const typeMap: Record<string, string> = {
    // Ancien format avec caractères spéciaux
    'Fonctionnelle': 'Fonctionnelle',
    'Non fonctionnelle': 'Non fonctionnelle',
    'Technique': 'Technique',
    'Unitaire': 'Unitaire',
    'Intégration': 'Integration',
    'E2E': 'E2E',
    'Performance': 'Performance',
    'Sécurité': 'Securite',
  }
  return typeMap[oldType] || oldType
}

// Fonction pour migrer un objet complet
export const migrateBesoin = (besoin: any) => {
  return {
    ...besoin,
    statut: migrateStatut(besoin.statut),
  }
}

export const migrateEpic = (epic: any) => {
  return {
    ...epic,
    statut: migrateStatut(epic.statut),
  }
}

export const migrateFeature = (feature: any) => {
  return {
    ...feature,
    statut: migrateStatut(feature.statut),
    priorite: migratePriorite(feature.priorite),
  }
}

export const migrateExigence = (exigence: any) => {
  return {
    ...exigence,
    statut: migrateStatut(exigence.statut),
    type: migrateType(exigence.type),
  }
}

export const migrateTest = (test: any) => {
  return {
    ...test,
    statut: migrateStatut(test.statut),
    priorite: migratePriorite(test.priorite),
    type: migrateType(test.type),
  }
}

// Fonction pour migrer toutes les données du localStorage
export const migrateAllLocalStorageData = () => {
  const keys = ['besoins', 'epics', 'features', 'exigences', 'tests']
  
  keys.forEach((key) => {
    const data = localStorage.getItem(key)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          let migratedData
          switch (key) {
            case 'besoins':
              migratedData = parsed.map(migrateBesoin)
              break
            case 'epics':
              migratedData = parsed.map(migrateEpic)
              break
            case 'features':
              migratedData = parsed.map(migrateFeature)
              break
            case 'exigences':
              migratedData = parsed.map(migrateExigence)
              break
            case 'tests':
              migratedData = parsed.map(migrateTest)
              break
            default:
              migratedData = parsed
          }
          localStorage.setItem(key, JSON.stringify(migratedData))
        }
      } catch (error) {
        console.error(`Erreur de migration pour ${key}:`, error)
      }
    }
  })
}

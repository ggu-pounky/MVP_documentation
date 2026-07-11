/**
 * Script pour charger des données factices dans localStorage
 * Ce script peut être exécuté dans la console du navigateur
 * ou utilisé pour tester manuellement l'application.
 */

// Données factices complètes
const mockData = {
  besoins: [
    {
      id: 'besoin-test-001',
      titre: 'Gestion des utilisateurs',
      description: 'Permettre la création, modification et suppression des utilisateurs du système',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'besoin-test-002',
      titre: 'Gestion des produits',
      description: 'Permettre la gestion complète du catalogue produits avec catégories',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  epics: [
    {
      id: 'epic-test-001',
      titre: 'Épic - Authentification',
      description: 'Toutes les fonctionnalités liées à l\'authentification des utilisateurs',
      besoinId: 'besoin-test-001',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'epic-test-002',
      titre: 'Épic - Catalogue',
      description: 'Gestion du catalogue produits et catégories',
      besoinId: 'besoin-test-002',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  features: [
    {
      id: 'feature-test-001',
      titre: 'Inscription utilisateur',
      description: 'Permettre à un nouvel utilisateur de créer un compte avec email et mot de passe',
      priorite: 'Élevée',
      statut: 'Terminé',
      besoinId: 'besoin-test-001',
      epicId: 'epic-test-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'feature-test-002',
      titre: 'Connexion utilisateur',
      description: 'Permettre à un utilisateur existant de se connecter avec ses identifiants',
      priorite: 'Élevée',
      statut: 'Terminé',
      besoinId: 'besoin-test-001',
      epicId: 'epic-test-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'feature-test-003',
      titre: 'Ajouter produit',
      description: 'Permettre à un administrateur d\'ajouter un nouveau produit au catalogue',
      priorite: 'Moyenne',
      statut: 'En cours',
      besoinId: 'besoin-test-002',
      epicId: 'epic-test-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'feature-test-004',
      titre: 'Modifier produit',
      description: 'Permettre de modifier les informations d\'un produit existant',
      priorite: 'Moyenne',
      statut: 'À faire',
      besoinId: 'besoin-test-002',
      epicId: 'epic-test-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  exigences: [
    {
      id: 'exigence-test-001',
      titre: 'Validation format email',
      description: 'Le système doit valider que l\'email est au format valide (ex: user@example.com)',
      statut: 'Terminé',
      featureId: 'feature-test-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'exigence-test-002',
      titre: 'Validation complexité mot de passe',
      description: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
      statut: 'Terminé',
      featureId: 'feature-test-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'exigence-test-003',
      titre: 'Affichage message erreur connexion',
      description: 'Afficher un message d\'erreur clair lorsque la connexion échoue',
      statut: 'En cours',
      featureId: 'feature-test-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'exigence-test-004',
      titre: 'Vérification droits administrateur',
      description: 'Vérifier que seul un administrateur peut ajouter un produit',
      statut: 'À faire',
      featureId: 'feature-test-003',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'exigence-test-005',
      titre: 'Validation champs produit',
      description: 'Tous les champs obligatoires du produit doivent être validés',
      statut: 'À faire',
      featureId: 'feature-test-003',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  tests: [
    {
      id: 'test-001',
      titre: 'Test email valide',
      description: 'Vérifier que le système accepte un email au format user@example.com',
      exigenceId: 'exigence-test-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'Terminé',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-002',
      titre: 'Test email invalide',
      description: 'Vérifier que le système rejette un email au format invalide (ex: user@example)',
      exigenceId: 'exigence-test-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'Terminé',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-003',
      titre: 'Test mot de passe valide',
      description: 'Vérifier que le système accepte un mot de passe valide (ex: Password123)',
      exigenceId: 'exigence-test-002',
      isTNR: false,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-004',
      titre: 'Test mot de passe trop court',
      description: 'Vérifier que le système rejette un mot de passe avec moins de 8 caractères',
      exigenceId: 'exigence-test-002',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Moyenne',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-005',
      titre: 'Test affichage erreur connexion',
      description: 'Vérifier que le message d\'erreur s\'affiche correctement',
      exigenceId: 'exigence-test-003',
      isTNR: false,
      isAutomatisable: false,
      priorite: 'Faible',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// Fonction pour charger les données
function loadTestData() {
  console.log('🔄 Chargement des données de test...');
  
  // Sauvegarder les données existantes au cas où
  const existingData = {
    besoins: localStorage.getItem('besoins'),
    epics: localStorage.getItem('epics'),
    features: localStorage.getItem('features'),
    exigences: localStorage.getItem('exigences'),
    tests: localStorage.getItem('tests'),
  };
  
  // Sauvegarder les nouvelles données
  localStorage.setItem('besoins', JSON.stringify(mockData.besoins));
  localStorage.setItem('epics', JSON.stringify(mockData.epics));
  localStorage.setItem('features', JSON.stringify(mockData.features));
  localStorage.setItem('exigences', JSON.stringify(mockData.exigences));
  localStorage.setItem('tests', JSON.stringify(mockData.tests));
  
  console.log('✅ Données de test chargées avec succès !');
  console.log('\n📊 Données chargées:');
  console.log(`   - ${mockData.besoins.length} besoins`);
  console.log(`   - ${mockData.epics.length} EPICS`);
  console.log(`   - ${mockData.features.length} features`);
  console.log(`   - ${mockData.exigences.length} exigences`);
  console.log(`   - ${mockData.tests.length} tests`);
  
  // Déclencher un événement pour notifier les composants React
  window.dispatchEvent(new Event('storage'));
  
  return {
    success: true,
    message: 'Données de test chargées',
    data: mockData,
  };
}

// Fonction pour effacer les données de test
function clearTestData() {
  console.log('🗑️ Suppression des données de test...');
  localStorage.removeItem('besoins');
  localStorage.removeItem('epics');
  localStorage.removeItem('features');
  localStorage.removeItem('exigences');
  localStorage.removeItem('tests');
  console.log('✅ Données de test supprimées');
  window.dispatchEvent(new Event('storage'));
}

// Fonction pour vérifier la matrice Exigence-Tests
function checkExigenceTestsMatrix() {
  const exigences = JSON.parse(localStorage.getItem('exigences') || '[]');
  const tests = JSON.parse(localStorage.getItem('tests') || '[]');
  
  console.log('\n📋 Vérification Matrice Exigence-Tests:');
  console.log(`   - ${exigences.length} exigences`);
  console.log(`   - ${tests.length} tests`);
  
  // Calculer la couverture
  const exigencesWithTests = exigences.filter((e) => 
    tests.some((t) => t.exigenceId === e.id)
  );
  const coverage = Math.round((exigencesWithTests.length / exigences.length) * 100);
  
  console.log(`   - Couverture: ${coverage}% (${exigencesWithTests.length}/${exigences.length} exigences couvertes)`);
  
  // Afficher les associations
  console.log('\n🔗 Associations:');
  exigences.forEach((exigence) => {
    const relatedTests = tests.filter((t) => t.exigenceId === exigence.id);
    console.log(`   - ${exigence.titre}: ${relatedTests.length} test(s)`);
    relatedTests.forEach((test) => {
      console.log(`     • ${test.titre}`);
    });
  });
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  window.loadTestData = loadTestData;
  window.clearTestData = clearTestData;
  window.checkExigenceTestsMatrix = checkExigenceTestsMatrix;
}

// Si exécuté avec Node.js, afficher les instructions
if (typeof window === 'undefined') {
  console.log('='.repeat(60));
  console.log('Script de données de test pour MVP Documentation');
  console.log('='.repeat(60));
  console.log('\n📝 Instructions:');
  console.log('   1. Ouvrez votre navigateur');
  console.log('   2. Allez sur l\'application (ex: http://localhost:3000)');
  console.log('   3. Ouvrez la console du navigateur (F12 ou Ctrl+Shift+I)');
  console.log('   4. Copiez-collez et exécutez une de ces commandes:');
  console.log('\n   🔄 Pour charger les données de test:');
  console.log('      loadTestData()');
  console.log('\n   🗑️ Pour supprimer les données de test:');
  console.log('      clearTestData()');
  console.log('\n   📋 Pour vérifier la matrice Exigence-Tests:');
  console.log('      checkExigenceTestsMatrix()');
  console.log('\n' + '='.repeat(60));
}

// Exporter pour utilisation comme module
module.exports = { loadTestData, clearTestData, checkExigenceTestsMatrix, mockData };

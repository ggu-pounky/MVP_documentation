/**
 * Test complet IHM pour MVP Documentation
 * Ce script teste toutes les fonctionnalités principales
 */
const { test, expect } = require('@playwright/test');

// Données de test complètes
const mockData = {
  besoins: [
    {
      id: 'zap-test-besoin-001',
      titre: 'Gestion des utilisateurs',
      description: 'Permettre la création, modification et suppression des utilisateurs',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'zap-test-besoin-002',
      titre: 'Gestion des produits',
      description: 'Permettre la gestion complète du catalogue produits',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  epics: [
    {
      id: 'zap-test-epic-001',
      titre: 'Épic Authentification',
      description: 'Toutes les fonctionnalités liées à l\'authentification',
      besoinId: 'zap-test-besoin-001',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  features: [
    {
      id: 'zap-test-feature-001',
      titre: 'Inscription utilisateur',
      description: 'Permettre à un nouvel utilisateur de créer un compte',
      priorite: 'Élevée',
      statut: 'Terminé',
      besoinId: 'zap-test-besoin-001',
      epicId: 'zap-test-epic-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'zap-test-feature-002',
      titre: 'Connexion utilisateur',
      description: 'Permettre à un utilisateur de se connecter',
      priorite: 'Élevée',
      statut: 'Terminé',
      besoinId: 'zap-test-besoin-001',
      epicId: 'zap-test-epic-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  exigences: [
    {
      id: 'zap-test-exigence-001',
      titre: 'Validation email',
      description: 'L\'email doit être au format valide',
      statut: 'Terminé',
      featureId: 'zap-test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'zap-test-exigence-002',
      titre: 'Validation mot de passe',
      description: 'Le mot de passe doit contenir 8 caractères minimum',
      statut: 'Terminé',
      featureId: 'zap-test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'zap-test-exigence-003',
      titre: 'Affichage erreur connexion',
      description: 'Afficher un message d\'erreur en cas d\'échec de connexion',
      statut: 'En cours',
      featureId: 'zap-test-feature-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  tests: [
    {
      id: 'zap-test-test-001',
      titre: 'Test email valide',
      description: 'Vérifier que le système accepte un email valide',
      exigenceId: 'zap-test-exigence-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'Terminé',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'zap-test-test-002',
      titre: 'Test email invalide',
      description: 'Vérifier que le système rejette un email invalide',
      exigenceId: 'zap-test-exigence-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'Terminé',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'zap-test-test-003',
      titre: 'Test mot de passe valide',
      description: 'Vérifier que le système accepte un mot de passe valide',
      exigenceId: 'zap-test-exigence-002',
      isTNR: false,
      isAutomatisable: true,
      priorite: 'Moyenne',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// Fonction pour charger les données dans localStorage
async function loadTestData(page) {
  await page.evaluate((data) => {
    localStorage.setItem('besoins', JSON.stringify(data.besoins));
    localStorage.setItem('epics', JSON.stringify(data.epics));
    localStorage.setItem('features', JSON.stringify(data.features));
    localStorage.setItem('exigences', JSON.stringify(data.exigences));
    localStorage.setItem('tests', JSON.stringify(data.tests));
    window.dispatchEvent(new Event('storage'));
  }, mockData);
  
  // Attendre que les données soient chargées
  await page.waitForTimeout(500);
}

test.describe('MVP Documentation - Tests IHM complets', () => {
  test.beforeEach(async ({ page }) => {
    await loadTestData(page);
  });

  // Test 1: Page d'accueil (Besoins)
  test('Page Besoins - Chargement et affichage', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le titre
    await expect(page.locator('h1')).toContainText(/Gestion des Besoins|Besoins/);
    
    // Vérifier que les besoins sont affichés
    const besoinRows = page.locator('tbody tr');
    await expect(besoinRows).toHaveCount(2); // 2 besoins dans mockData
    
    // Vérifier le bouton Ajouter
    const addButton = page.locator('button:has-text("Ajouter")');
    await expect(addButton).toBeVisible();
  });

  // Test 2: Sidebar
  test('Sidebar - Navigation et modules', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que le sidebar existe
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    
    // Vérifier les modules
    const modules = page.locator('aside div:has(> div:contains("Module"))');
    await expect(modules).toHaveCount(4); // Module Exigence, Code, Test, Maintenance
    
    // Vérifier les liens
    const links = page.locator('aside a, aside button');
    await expect(links).toHaveCountGreaterThan(5);
    
    // Vérifier le numéro de version
    const version = page.locator('aside:has-text("Version")');
    await expect(version).toBeVisible();
  });

  // Test 3: Page Features
  test('Page Features - Fonctionnalités de base', async ({ page }) => {
    await page.goto('/features');
    
    // Vérifier le titre
    await expect(page.locator('h1')).toContainText('Gestion des Features');
    
    // Vérifier que les features sont affichées
    const featureRows = page.locator('tbody tr');
    await expect(featureRows).toHaveCount(2); // 2 features dans mockData
    
    // Vérifier le bouton Ajouter
    const addButton = page.locator('button:has-text("Ajouter une Feature")');
    await expect(addButton).toBeVisible();
  });

  // Test 4: Page Exigences
  test('Page Exigences - Fonctionnalités de base', async ({ page }) => {
    await page.goto('/exigences');
    
    // Vérifier le titre
    await expect(page.locator('h1')).toContainText('Gestion des Exigences');
    
    // Vérifier que les exigences sont affichées
    const exigenceRows = page.locator('tbody tr');
    await expect(exigenceRows).toHaveCount(3); // 3 exigences dans mockData
  });

  // Test 5: Page Tests
  test('Page Tests - Fonctionnalités de base', async ({ page }) => {
    await page.goto('/tests');
    
    // Vérifier le titre
    await expect(page.locator('h1')).toContainText('Gestion des Tests');
    
    // Vérifier que les tests sont affichés
    const testRows = page.locator('tbody tr');
    await expect(testRows).toHaveCount(3); // 3 tests dans mockData
    
    // Vérifier le bouton Ajouter
    const addButton = page.locator('button:has-text("Ajouter un Test")');
    await expect(addButton).toBeVisible();
  });

  // Test 6: Matrice Exigence-Tests (TEST PRINCIPAL)
  test('Matrice Exigence-Tests - Fonctionnalités complètes', async ({ page }) => {
    await page.goto('/matrices');
    
    // Sélectionner la matrice Exigence-Tests
    const select = page.locator('select');
    await select.selectOption('exigence-tests');
    
    // Attendre que la matrice s'affiche
    await page.waitForSelector('h3:has-text("Couverture des Exigences")');
    
    // Vérifier la métrique de couverture (2/3 exigences couvertes = 66%)
    const percentage = page.locator('.text-4xl.font-bold');
    await expect(percentage).toContainText('66%');
    
    // Vérifier le tableau
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Vérifier les en-têtes (1 exigence + 3 tests = 4 colonnes)
    const headers = page.locator('thead th');
    await expect(headers).toHaveCountGreaterThan(1);
    
    // Vérifier les pastilles vertes (2 tests associés à 2 exigences)
    const greenPills = page.locator('span.bg-green-500');
    await expect(greenPills).toHaveCountGreaterThan(0);
    
    // Vérifier les pastilles rouges (1 exigence sans test)
    const redPills = page.locator('span.bg-red-500');
    await expect(redPills).toHaveCountGreaterThan(0);
    
    // Vérifier la légende
    await expect(page.locator('text=Test associé à l\'exigence')).toBeVisible();
    await expect(page.locator('text=Aucun test associé')).toBeVisible();
    
    // Vérifier le détail des associations
    await expect(page.locator('h3:has-text("Détail des associations")')).toBeVisible();
    
    // Vérifier que les exigences sont listées
    const exigenceDetails = page.locator('.border.border-neumorphic-border.rounded-lg.p-4');
    await expect(exigenceDetails).toHaveCount(3); // 3 exigences
  });

  // Test 7: Navigation depuis la matrice
  test('Matrice - Navigation vers les détails', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Cliquer sur un lien d'exigence
    const exigenceLinks = page.locator('a[href*="/exigences#"]');
    await expect(exigenceLinks).toHaveCountGreaterThan(0);
    
    // Sauvegarder l'URL actuelle
    const currentUrl = page.url();
    
    // Cliquer sur le premier lien
    await exigenceLinks.first().click();
    
    // Vérifier qu'on arrive sur la page des exigences
    await expect(page).toHaveURL(/exigences/);
    
    // Revenir à la matrice
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Cliquer sur un lien de test
    const testLinks = page.locator('a[href*="/tests#"]');
    await expect(testLinks).toHaveCountGreaterThan(0);
    
    // Cliquer sur le premier lien
    await testLinks.first().click();
    
    // Vérifier qu'on arrive sur la page des tests
    await expect(page).toHaveURL(/tests/);
  });

  // Test 8: Formulaire de création de test
  test('Page Tests - Formulaire de création', async ({ page }) => {
    await page.goto('/tests');
    
    // Cliquer sur "Ajouter un Test"
    const addButton = page.locator('button:has-text("Ajouter un Test")');
    await addButton.click();
    
    // Vérifier que le formulaire s'affiche
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Vérifier le sélecteur d'exigence
    const exigenceSelect = page.locator('select[name="exigenceId"]');
    await expect(exigenceSelect).toBeVisible();
    
    // Sélectionner une exigence
    await exigenceSelect.selectOption('zap-test-exigence-001');
    
    // Vérifier que le bouton "Générer par IA" apparaît
    const aiButton = page.locator('button:has-text("Générer par IA")');
    await expect(aiButton).toBeVisible();
    
    // Remplir le formulaire
    await page.fill('input[name="titre"]', 'Nouveau test automatisé');
    await page.fill('textarea[name="description"]', 'Description du test automatisé');
    
    // Sélectionner priorité et statut
    await page.selectOption('select[name="priorite"]', 'Élevée');
    await page.selectOption('select[name="statut"]', 'À faire');
    
    // Cocher les checkboxes
    await page.check('input[type="checkbox"]:has-text("TNR possible")');
    await page.check('input[type="checkbox"]:has-text("À automatiser")');
    
    // Annuler (pour ne pas modifier les données)
    const cancelButton = page.locator('button:has-text("Annuler")');
    await cancelButton.click();
    
    // Vérifier que le formulaire disparaît
    await expect(form).not.toBeVisible();
  });

  // Test 9: Thème Neumorphic
  test('Thème Neumorphic - Styles appliqués', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que le body a un fond sombre
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // Le fond ne doit pas être blanc
    expect(bodyBg).not.toContain('rgb(255, 255, 255)');
    expect(bodyBg).not.toContain('white');
    
    // Vérifier que le sidebar existe et a le bon style
    const sidebar = page.locator('aside.neumorphic-sidebar');
    await expect(sidebar).toBeVisible();
    
    // Vérifier que les cartes neumorphic existent
    const neumorphicCards = page.locator('.neumorphic-card');
    await expect(neumorphicCards).toHaveCountGreaterThan(0);
  });

  // Test 10: Modale IA (si on arrive à l'ouvrir)
  test('Modale IA - Ouverture et fonctionnement', async ({ page }) => {
    await page.goto('/tests');
    
    // Cliquer sur "Ajouter un Test"
    const addButton = page.locator('button:has-text("Ajouter un Test")');
    await addButton.click();
    
    // Sélectionner une exigence
    const exigenceSelect = page.locator('select[name="exigenceId"]');
    await exigenceSelect.selectOption('zap-test-exigence-001');
    
    // Cliquer sur "Générer par IA"
    const aiButton = page.locator('button:has-text("Générer par IA")');
    await aiButton.click();
    
    // Attendre que la modale s'ouvre
    await page.waitForTimeout(1000);
    
    // Vérifier que la modale est visible
    const modal = page.locator('.fixed.inset-0');
    await expect(modal).toBeVisible();
    
    // Vérifier le titre de la modale
    await expect(page.locator('h2:has-text("Génération IA")')).toBeVisible();
    
    // Attendre que les suggestions soient générées
    await page.waitForTimeout(1000);
    
    // Vérifier que des suggestions sont affichées
    const suggestions = page.locator('.p-4.border.rounded-lg.cursor-pointer');
    await expect(suggestions).toHaveCountGreaterThan(0);
    
    // Fermer la modale avec le bouton ×
    const closeButton = page.locator('button:has-text("×")');
    await closeButton.click();
    
    // Vérifier que la modale disparaît
    await expect(modal).not.toBeVisible();
  });
});

test.describe('Tests de régression', () => {
  test.beforeEach(async ({ page }) => {
    await loadTestData(page);
  });

  test('Aucune erreur console sur la page d\'accueil', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Filtrer les erreurs
    const errors = consoleMessages.filter(msg => 
      msg.includes('Error') || msg.includes('error') || msg.includes('Failed')
    );
    
    expect(errors).toHaveLength(0);
  });

  test('Aucune erreur console sur la matrice', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    await page.waitForTimeout(2000);
    
    // Filtrer les erreurs
    const errors = consoleMessages.filter(msg => 
      msg.includes('Error') || msg.includes('error') || msg.includes('Failed')
    );
    
    expect(errors).toHaveLength(0);
  });
});

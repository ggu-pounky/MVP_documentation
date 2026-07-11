/**
 * Tests Playwright pour la matrice Exigence-Tests
 */
const { test, expect } = require('@playwright/test');

// Données de test
const mockData = {
  besoins: [
    {
      id: 'test-besoin-001',
      titre: 'Test Besoin 1',
      description: 'Description test besoin 1',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  epics: [
    {
      id: 'test-epic-001',
      titre: 'Test Epic 1',
      description: 'Description test epic 1',
      besoinId: 'test-besoin-001',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  features: [
    {
      id: 'test-feature-001',
      titre: 'Test Feature 1',
      description: 'Description test feature 1',
      priorite: 'Élevée',
      statut: 'À faire',
      besoinId: 'test-besoin-001',
      epicId: 'test-epic-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  exigences: [
    {
      id: 'test-exigence-001',
      titre: 'Test Exigence 1',
      description: 'Description test exigence 1',
      statut: 'À faire',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-exigence-002',
      titre: 'Test Exigence 2',
      description: 'Description test exigence 2',
      statut: 'À faire',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  tests: [
    {
      id: 'test-test-001',
      titre: 'Test Test 1',
      description: 'Description test 1',
      exigenceId: 'test-exigence-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

test.describe('Matrice Exigence-Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Charger les données de test dans localStorage
    await page.evaluate((data) => {
      localStorage.setItem('besoins', JSON.stringify(data.besoins));
      localStorage.setItem('epics', JSON.stringify(data.epics));
      localStorage.setItem('features', JSON.stringify(data.features));
      localStorage.setItem('exigences', JSON.stringify(data.exigences));
      localStorage.setItem('tests', JSON.stringify(data.tests));
    }, mockData);
  });

  test('Page Matrices charge correctement', async ({ page }) => {
    await page.goto('/matrices');
    await expect(page).toHaveTitle(/MVP Documentation/);
    await expect(page.locator('h1')).toContainText('Documentation Matrices');
  });

  test('Sélecteur de matrice fonctionne', async ({ page }) => {
    await page.goto('/matrices');
    
    // Vérifier que le sélecteur existe
    const select = page.locator('select');
    await expect(select).toBeVisible();
    
    // Sélectionner "Matrice Exigence - Tests"
    await select.selectOption('exigence-tests');
    
    // Attendre que la matrice s'affiche
    await expect(page.locator('h3')).toContainText('Couverture des Exigences par les Tests');
  });

  test('Matrice Exigence-Tests affiche la métrique de couverture', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Vérifier que la métrique de couverture s'affiche
    const percentage = page.locator('.text-4xl.font-bold');
    await expect(percentage).toBeVisible();
    
    // Avec nos données: 1/2 exigences couvertes = 50%
    await expect(percentage).toContainText('50%');
  });

  test('Matrice affiche le tableau avec pastilles', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Vérifier que le tableau existe
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Vérifier les en-têtes
    await expect(page.locator('th')).toContainText('Exigence');
    
    // Vérifier qu'il y a des pastilles vertes et rouges
    const greenPills = page.locator('span.bg-green-500');
    const redPills = page.locator('span.bg-red-500');
    
    await expect(greenPills).toHaveCount(1); // 1 test associé
    await expect(redPills).toHaveCount(1); // 1 exigence sans test
  });

  test('Légende de la matrice est affichée', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Vérifier la légende
    await expect(page.locator('text=Test associé à l\'exigence')).toBeVisible();
    await expect(page.locator('text=Aucun test associé')).toBeVisible();
  });

  test('Détail des associations est affiché', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Vérifier la section de détail
    await expect(page.locator('h3')).toContainText('Détail des associations');
    
    // Vérifier que les exigences sont listées
    await expect(page.locator('h4')).toHaveCount(2); // 2 exigences
  });
});

test.describe('Navigation depuis la matrice', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate((data) => {
      localStorage.setItem('besoins', JSON.stringify(data.besoins));
      localStorage.setItem('epics', JSON.stringify(data.epics));
      localStorage.setItem('features', JSON.stringify(data.features));
      localStorage.setItem('exigences', JSON.stringify(data.exigences));
      localStorage.setItem('tests', JSON.stringify(data.tests));
    }, mockData);
  });

  test('Liens vers les exigences fonctionnent', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Cliquer sur un lien d'exigence
    const exigenceLinks = page.locator('a[href*="/exigences#"]');
    await expect(exigenceLinks).toHaveCount(2);
    
    // Cliquer sur le premier lien
    await exigenceLinks.first().click();
    
    // Vérifier qu'on arrive sur la page des exigences
    await expect(page).toHaveURL(/exigences/);
  });

  test('Liens vers les tests fonctionnent', async ({ page }) => {
    await page.goto('/matrices');
    await page.selectOption('select', 'exigence-tests');
    
    // Cliquer sur un lien de test
    const testLinks = page.locator('a[href*="/tests#"]');
    await expect(testLinks).toHaveCount(1); // 1 test dans le détail
    
    // Cliquer sur le lien
    await testLinks.first().click();
    
    // Vérifier qu'on arrive sur la page des tests
    await expect(page).toHaveURL(/tests/);
  });
});

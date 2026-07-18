/**
 * Tests pour la page CODE - Integration GitHub et Analyse de Code
 * Tests de non-regression pour les nouvelles fonctionnalites
 */
const { test, expect } = require('@playwright/test');

// Donnees de test pour la page CODE
const mockCodeData = {
  besoins: [
    {
      id: 'test-besoin-001',
      titre: 'Gestion des utilisateurs',
      description: 'Permettre la creation, modification et suppression des utilisateurs',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  features: [
    {
      id: 'test-feature-001',
      titre: 'Gestion utilisateurs',
      description: 'Feature pour gerer les utilisateurs',
      priorite: 'Elevee',
      statut: 'Termine',
      besoinId: 'test-besoin-001',
      epicId: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  exigences: [
    {
      id: 'test-exigence-001',
      titre: 'Creer utilisateur',
      description: 'Permettre de creer un nouvel utilisateur',
      statut: 'Termine',
      type: 'Fonctionnelle',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-exigence-002',
      titre: 'Modifier utilisateur',
      description: 'Permettre de modifier un utilisateur existant',
      statut: 'Termine',
      type: 'Fonctionnelle',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-exigence-003',
      titre: 'Supprimer utilisateur',
      description: 'Permettre de supprimer un utilisateur',
      statut: 'Termine',
      type: 'Fonctionnelle',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-exigence-004',
      titre: 'API utilisateurs',
      description: 'Endpoint API pour gerer les utilisateurs',
      statut: 'Termine',
      type: 'Technique',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// Fonction pour charger les donnees dans localStorage
async function loadCodeTestData(page) {
  await page.evaluate((data) => {
    localStorage.setItem('besoins', JSON.stringify(data.besoins));
    localStorage.setItem('features', JSON.stringify(data.features));
    localStorage.setItem('exigences', JSON.stringify(data.exigences));
    window.dispatchEvent(new Event('storage'));
  }, mockCodeData);
  
  // Attendre que les donnees soient chargees
  await page.waitForTimeout(500);
}

// Fonction pour nettoyer le localStorage
async function clearGitHubData(page) {
  await page.evaluate(() => {
    localStorage.removeItem('githubToken');
    localStorage.removeItem('githubUsername');
  });
}

test.describe('Page CODE - Integration GitHub et Analyse de Code', () => {
  test.beforeEach(async ({ page }) => {
    await loadCodeTestData(page);
    await clearGitHubData(page);
  });

  // Test 1: Chargement de la page CODE
  test('Page CODE - Chargement initial', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier le titre
    await expect(page.locator('h2:has-text("Connexion a GitHub")')).toBeVisible();
    
    // Verifier que la section GitHub est presente
    const githubSection = page.locator('text=Connexion a GitHub');
    await expect(githubSection).toBeVisible();
    
    // Verifier les champs de saisie
    const tokenInput = page.locator('input[type="password"]');
    await expect(tokenInput).toBeVisible();
    
    const usernameInput = page.locator('input[type="text"]').first();
    await expect(usernameInput).toBeVisible();
    
    // Verifier le bouton de connexion
    const connectButton = page.locator('button:has-text("Se connecter a GitHub")');
    await expect(connectButton).toBeVisible();
    
    // Verifier que la section Exigences est presente
    await expect(page.locator('h2:has-text("Exigences de l\'Application")')).toBeVisible();
    
    // Verifier que les exigences sont affichees
    const exigenceCards = page.locator('.p-3.border.border-gray-200.rounded-lg');
    await expect(exigenceCards).toHaveCount(4); // 4 exigences dans mockCodeData
  });

  // Test 2: Affichage des exigences locales
  test('Page CODE - Affichage des exigences de l\'application', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier que la section Exigences est presente
    const exigencesSection = page.locator('h2:has-text("Exigences de l\'Application")');
    await expect(exigencesSection).toBeVisible();
    
    // Verifier le nombre d'exigences
    const exigenceCards = page.locator('.p-3.border.border-gray-200.rounded-lg');
    await expect(exigenceCards).toHaveCount(4);
    
    // Verifier les types d'exigences
    const fonctionnelleBadge = page.locator('text=Fonctionnelle');
    await expect(fonctionnelleBadge).toHaveCount(3);
    
    const techniqueBadge = page.locator('text=Technique');
    await expect(techniqueBadge).toHaveCount(1);
    
    // Verifier les titres des exigences
    await expect(page.locator('text=Creer utilisateur')).toBeVisible();
    await expect(page.locator('text=Modifier utilisateur')).toBeVisible();
    await expect(page.locator('text=Supprimer utilisateur')).toBeVisible();
    await expect(page.locator('text=API utilisateurs')).toBeVisible();
  });

  // Test 3: Validation du formulaire de connexion GitHub
  test('Page CODE - Validation du formulaire de connexion', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier que le bouton est desactive sans token
    const connectButton = page.locator('button:has-text("Se connecter a GitHub")');
    await expect(connectButton).toBeDisabled();
    
    // Remplir uniquement le token
    const tokenInput = page.locator('input[type="password"]');
    await tokenInput.fill('ghp_test_token');
    
    // Verifier que le bouton est toujours desactive
    await expect(connectButton).toBeDisabled();
    
    // Remplir le username
    const usernameInput = page.locator('input[type="text"]').first();
    await usernameInput.fill('testuser');
    
    // Verifier que le bouton est active
    await expect(connectButton).toBeEnabled();
  });

  // Test 4: Message d'erreur pour token invalide
  test('Page CODE - Message d\'erreur pour token invalide', async ({ page }) => {
    await page.goto('/code');
    
    // Remplir avec un token invalide
    const tokenInput = page.locator('input[type="password"]');
    await tokenInput.fill('invalid_token');
    
    const usernameInput = page.locator('input[type="text"]').first();
    await usernameInput.fill('testuser');
    
    // Cliquer sur le bouton de connexion
    const connectButton = page.locator('button:has-text("Se connecter a GitHub")');
    await connectButton.click();
    
    // Attendre le message d'erreur
    await page.waitForTimeout(2000);
    
    // Verifier que le message d'erreur est affiche
    const errorMessage = page.locator('text=Token invalide ou expire');
    await expect(errorMessage).toBeVisible();
  });

  // Test 5: Affichage de la section Repositories apres connexion
  test('Page CODE - Section Repositories non visible sans connexion', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier que la section Repositories n'est pas visible
    const reposSection = page.locator('h2:has-text("Vos Repositories")');
    await expect(reposSection).not.toBeVisible();
  });

  // Test 6: Bouton d'analyse desactive sans repository selectionne
  test('Page CODE - Bouton analyse desactive sans repository', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier que le bouton Analyser n'est pas visible
    const analyzeButton = page.locator('button:has-text("Analyser le code")');
    await expect(analyzeButton).not.toBeVisible();
  });

  // Test 7: Affichage correct avec exigences chargees
  test('Page CODE - Bouton analyse affiche le nombre d\'exigences', async ({ page }) => {
    await page.goto('/code');
    
    // Simuler la selection d'un repository en modifiant l'etat
    await page.evaluate(() => {
      // Simuler un repository selectionne
      const mockRepo = {
        id: 12345,
        name: 'test-repo',
        full_name: 'testuser/test-repo',
        private: false,
        html_url: 'https://github.com/testuser/test-repo',
        description: 'Test repository',
        language: 'JavaScript',
        stargazers_count: 10,
        forks_count: 2,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        pushed_at: new Date().toISOString(),
        size: 1000,
        open_issues_count: 0,
        watchers_count: 0,
        owner: {
          login: 'testuser',
          id: 123,
          avatar_url: 'https://github.com/avatar.png',
          type: 'User'
        }
      };
      
      // Sauvegarder le token et username
      localStorage.setItem('githubToken', 'ghp_test_token');
      localStorage.setItem('githubUsername', 'testuser');
      
      // Simuler l'authentification
      window.isAuthenticated = true;
      window.selectedRepo = mockRepo;
    });
    
    // Recharger la page
    await page.reload();
    
    // Attendre que la page se charge
    await page.waitForTimeout(1000);
    
    // Verifier que le bouton Analyser est visible
    const analyzeButton = page.locator('button:has-text(/Analyser le code.*4 exigences/)');
    await expect(analyzeButton).toBeVisible();
    
    // Verifier que le bouton est active (car il y a des exigences)
    await expect(analyzeButton).toBeEnabled();
  });

  // Test 8: Message d'avertissement sans exigences
  test('Page CODE - Message d\'avertissement sans exigences', async ({ page }) => {
    // Charger des donnees sans exigences
    await page.evaluate(() => {
      localStorage.setItem('besoins', JSON.stringify([]));
      localStorage.setItem('features', JSON.stringify([]));
      localStorage.setItem('exigences', JSON.stringify([]));
      window.dispatchEvent(new Event('storage'));
    });
    
    await page.goto('/code');
    
    // Simuler la selection d'un repository
    await page.evaluate(() => {
      localStorage.setItem('githubToken', 'ghp_test_token');
      localStorage.setItem('githubUsername', 'testuser');
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verifier que le message d'avertissement est affiche
    const warningMessage = page.locator('text=Aucune exigence disponible');
    await expect(warningMessage).toBeVisible();
    
    // Verifier que le bouton Analyser est desactive
    const analyzeButton = page.locator('button:has-text("Analyser le code")');
    await expect(analyzeButton).toBeDisabled();
  });

  // Test 9: Statistiques de matching (simulation)
  test('Page CODE - Affichage des statistiques de matching', async ({ page }) => {
    await page.goto('/code');
    
    // Simuler des resultats d'analyse
    await page.evaluate(() => {
      localStorage.setItem('githubToken', 'ghp_test_token');
      localStorage.setItem('githubUsername', 'testuser');
      
      // Sauvegarder des resultats fictifs
      localStorage.setItem('codeAnalysisResults', JSON.stringify([
        { id: '1', exigenceTitre: 'Test 1', matchPercentage: 95, matched: true },
        { id: '2', exigenceTitre: 'Test 2', matchPercentage: 75, matched: false },
        { id: '3', exigenceTitre: 'Test 3', matchPercentage: 45, matched: false },
      ]));
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Note: Ce test verifie que la page se charge correctement
    // Les statistiques seront verifiees dans des tests plus avancés
    await expect(page.locator('h2:has-text("Connexion a GitHub")')).toBeVisible();
  });

  // Test 10: Navigation depuis le sidebar
  test('Page CODE - Navigation depuis le sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien CODE dans le sidebar
    const codeLink = page.locator('a[href="/code"]');
    await codeLink.click();
    
    // Verifier qu'on arrive sur la page CODE
    await expect(page).toHaveURL(/code/);
    
    // Verifier que la page CODE est chargee
    await expect(page.locator('h2:has-text("Connexion a GitHub")')).toBeVisible();
  });
});

test.describe('Page CODE - Tests de regression visuelle', () => {
  test.beforeEach(async ({ page }) => {
    await loadCodeTestData(page);
    await clearGitHubData(page);
  });

  // Test 11: Verifier la structure de la page
  test('Page CODE - Structure de la page', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier les sections principales
    const sections = page.locator('.card');
    await expect(sections).toHaveCountGreaterThanOrEqual(1);
    
    // Verifier les cartes d'exigences
    const exigenceCards = page.locator('.p-3.border.border-gray-200.rounded-lg');
    await expect(exigenceCards).toHaveCount(4);
    
    // Verifier les badges de type
    const badges = page.locator('.text-xs.px-2.py-1.rounded-full');
    await expect(badges).toHaveCountGreaterThanOrEqual(4);
  });

  // Test 12: Verifier les styles des cartes
  test('Page CODE - Styles des cartes d\'exigences', async ({ page }) => {
    await page.goto('/code');
    
    // Verifier les couleurs des badges
    const blueBadge = page.locator('.bg-blue-100.text-blue-800');
    await expect(blueBadge).toHaveCount(3); // 3 exigences Fonctionnelles
    
    const purpleBadge = page.locator('.bg-purple-100.text-purple-800');
    await expect(purpleBadge).toHaveCount(1); // 1 exigence Technique
  });

  // Test 13: Verifier le responsive design
  test('Page CODE - Responsive design mobile', async ({ page }) => {
    // Redimensionner la fenetre en mode mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/code');
    
    // Verifier que la page s'adapte
    const githubSection = page.locator('h2:has-text("Connexion a GitHub")');
    await expect(githubSection).toBeVisible();
    
    // Verifier que les exigences sont toujours visibles
    const exigenceCards = page.locator('.p-3.border.border-gray-200.rounded-lg');
    await expect(exigenceCards).toHaveCount(4);
  });
});

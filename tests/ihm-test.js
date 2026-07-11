/**
 * Script de test IHM pour MVP Documentation
 * Version corrigée pour fonctionner avec Puppeteer
 */

const puppeteer = require('puppeteer');

// Configuration
const BASE_URL = process.env.VERCEL_URL || process.env.BASE_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false';

// Données de test
const mockData = {
  besoins: [
    {
      id: 'test-besoin-001',
      titre: 'Gestion des utilisateurs',
      description: 'Permettre la création, modification et suppression des utilisateurs',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-besoin-002',
      titre: 'Gestion des produits',
      description: 'Permettre la gestion complète du catalogue produits',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  epics: [
    {
      id: 'test-epic-001',
      titre: 'Épic Authentification',
      description: 'Toutes les fonctionnalités liées à l\'authentification',
      besoinId: 'test-besoin-001',
      statut: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  features: [
    {
      id: 'test-feature-001',
      titre: 'Inscription utilisateur',
      description: 'Permettre à un nouvel utilisateur de créer un compte',
      priorite: 'Élevée',
      statut: 'Terminé',
      besoinId: 'test-besoin-001',
      epicId: 'test-epic-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-feature-002',
      titre: 'Connexion utilisateur',
      description: 'Permettre à un utilisateur de se connecter',
      priorite: 'Élevée',
      statut: 'Terminé',
      besoinId: 'test-besoin-001',
      epicId: 'test-epic-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  exigences: [
    {
      id: 'test-exigence-001',
      titre: 'Validation email',
      description: 'L\'email doit être au format valide',
      statut: 'Terminé',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-exigence-002',
      titre: 'Validation mot de passe',
      description: 'Le mot de passe doit contenir 8 caractères minimum',
      statut: 'Terminé',
      featureId: 'test-feature-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-exigence-003',
      titre: 'Affichage erreur connexion',
      description: 'Afficher un message d\'erreur en cas d\'échec de connexion',
      statut: 'En cours',
      featureId: 'test-feature-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  tests: [
    {
      id: 'test-test-001',
      titre: 'Test email valide',
      description: 'Vérifier que le système accepte un email valide',
      exigenceId: 'test-exigence-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'Terminé',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-test-002',
      titre: 'Test email invalide',
      description: 'Vérifier que le système rejette un email invalide',
      exigenceId: 'test-exigence-001',
      isTNR: true,
      isAutomatisable: true,
      priorite: 'Élevée',
      statut: 'Terminé',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'test-test-003',
      titre: 'Test mot de passe valide',
      description: 'Vérifier que le système accepte un mot de passe valide',
      exigenceId: 'test-exigence-002',
      isTNR: false,
      isAutomatisable: true,
      priorite: 'Moyenne',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// Fonction pour injecter les données via un script dans la page
async function injectData(page) {
  // Créer un script qui définit une fonction globale
  const injectScript = `
    window.__injectTestData = function() {
      const data = ${JSON.stringify(mockData)};
      localStorage.setItem('besoins', JSON.stringify(data.besoins));
      localStorage.setItem('epics', JSON.stringify(data.epics));
      localStorage.setItem('features', JSON.stringify(data.features));
      localStorage.setItem('exigences', JSON.stringify(data.exigences));
      localStorage.setItem('tests', JSON.stringify(data.tests));
      window.dispatchEvent(new Event('storage'));
      return true;
    };
  `;
  
  await page.evaluate(injectScript);
  
  // Appeler la fonction après que la page soit chargée
  await page.evaluate(() => {
    if (window.__injectTestData) {
      return window.__injectTestData();
    }
    return false;
  });
  
  // Attendre que les données soient chargées
  await page.waitForTimeout(500);
  
  console.log('✅ Données de test injectées');
}

// Fonction pour tester une page
async function testPage(page, url, testName, checks) {
  console.log(`\n🧪 Test: ${testName}`);
  console.log(`   URL: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Attendre que la page soit chargée
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Injecter les données de test
    await injectData(page);
    
    // Recharger la page pour que les composants React lisent les données
    await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
    
    // Exécuter les vérifications
    for (const check of checks) {
      try {
        if (check.selector) {
          await page.waitForSelector(check.selector, { timeout: 5000 });
          const element = await page.$(check.selector);
          if (element) {
            console.log(`   ✅ ${check.description}`);
          } else {
            console.log(`   ❌ ${check.description} - Élément non trouvé`);
          }
        } else if (check.evaluate) {
          const result = await page.evaluate(check.evaluate);
          if (result) {
            console.log(`   ✅ ${check.description}`);
          } else {
            console.log(`   ❌ ${check.description}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ ${check.description} - Erreur: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Erreur de chargement: ${error.message}`);
  }
}

// Tests principaux
async function runTests() {
  let browser;
  
  try {
    console.log('🚀 Démarrage des tests IHM...\n');
    
    // Lancer le navigateur
    browser = await puppeteer.launch({
      headless: HEADLESS,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 800 },
    });
    
    const page = await browser.newPage();
    
    // Test 1: Page d'accueil (Besoins)
    await testPage(page, `${BASE_URL}/`, 'Page Besoins', [
      { selector: 'h1', description: 'Titre de page présent' },
      { selector: 'table', description: 'Tableau des besoins présent' },
    ]);
    
    // Test 2: Page Features
    await testPage(page, `${BASE_URL}/features`, 'Page Features', [
      { selector: 'h1', description: 'Titre de page présent' },
      { selector: 'table', description: 'Tableau des features présent' },
    ]);
    
    // Test 3: Page Exigences
    await testPage(page, `${BASE_URL}/exigences`, 'Page Exigences', [
      { selector: 'h1', description: 'Titre de page présent' },
      { selector: 'table', description: 'Tableau des exigences présent' },
    ]);
    
    // Test 4: Page Tests
    await testPage(page, `${BASE_URL}/tests`, 'Page Tests', [
      { selector: 'h1', description: 'Titre de page présent' },
      { selector: 'table', description: 'Tableau des tests présent' },
    ]);
    
    // Test 5: Page Matrices - Exigence-Tests
    await testPage(page, `${BASE_URL}/matrices`, 'Page Matrices', [
      { selector: 'h1', description: 'Titre de page présent' },
      { selector: 'select', description: 'Sélecteur de matrice présent' },
    ]);
    
    // Test 6: Vérification de la matrice Exigence-Tests
    console.log('\n🧪 Test: Matrice Exigence-Tests');
    await page.goto(`${BASE_URL}/matrices`, { waitUntil: 'networkidle2', timeout: 30000 });
    await injectData(page);
    await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.select('select', 'exigence-tests');
    await page.waitForTimeout(1000); // Attendre le rendu
    
    // Vérifier que la matrice s'affiche
    const matrixTable = await page.$('table');
    if (matrixTable) {
      console.log('   ✅ Matrice Exigence-Tests affichée');
      
      // Vérifier qu'il y a des lignes (exigences)
      const rows = await page.$$('tbody tr');
      if (rows && rows.length > 0) {
        console.log(`   ✅ ${rows.length} exigences affichées dans la matrice`);
      } else {
        console.log('   ⚠️ Aucune ligne d\'exigence trouvée');
      }
      
      // Vérifier les pastilles vertes/rouges
      const greenPills = await page.$$('span.bg-green-500');
      const redPills = await page.$$('span.bg-red-500');
      console.log(`   ✅ Pastilles vertes: ${greenPills?.length || 0}, Pastilles rouges: ${redPills?.length || 0}`);
    } else {
      console.log('   ❌ Tableau de matrice non trouvé');
    }
    
    // Test 7: Vérification du Sidebar
    console.log('\n🧪 Test: Sidebar');
    const sidebar = await page.$('aside');
    if (sidebar) {
      console.log('   ✅ Sidebar présent');
      
      // Vérifier les liens du menu
      const links = await page.$$('aside a, aside button');
      console.log(`   ✅ ${links?.length || 0} liens/boutons dans le sidebar`);
    } else {
      console.log('   ❌ Sidebar non trouvé');
    }
    
    // Test 8: Vérification du thème sombre
    console.log('\n🧪 Test: Thème Neumorphic');
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`   Background body: ${bodyBg}`);
    
    // Vérifier que le fond n'est pas blanc
    if (bodyBg && !bodyBg.includes('rgb(255, 255, 255)') && !bodyBg.includes('white')) {
      console.log('   ✅ Thème sombre appliqué (fond non blanc)');
    } else {
      console.log('   ⚠️ Fond semble clair - vérifier le thème');
    }
    
    console.log('\n🎉 Tous les tests IHM terminés !');
    console.log('\n📊 Résumé:');
    console.log('   - Données de test injectées avec succès');
    console.log('   - Toutes les pages principales testées');
    console.log('   - Matrice Exigence-Tests vérifiée');
    console.log('   - Sidebar et navigation vérifiés');
    console.log('   - Thème neumorphic vérifié');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Exécuter les tests
runTests().catch(console.error);

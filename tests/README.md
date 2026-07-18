# Tests de Non-Régression

Ce dossier contient tous les tests automatisés pour l'application MVP Documentation.

## Structure

```
tests/
├── playwright/                    # Tests Playwright (E2E)
│   ├── full-ihm-test.spec.js     # Tests complets de l'IHM
│   ├── matrices.spec.js          # Tests pour les matrices
│   └── code-analysis.spec.js     # Tests pour la page CODE (nouveau)
├── run-regression-tests.js       # Script pour exécuter tous les tests
└── README.md                     # Ce fichier
```

## Prérequis

- Node.js 18+ 
- npm ou yarn
- Playwright installé (`npm install -D @playwright/test`)

## Installation

```bash
# Installer les dépendances
npm install

# Installer les navigateurs Playwright
npx playwright install
```

## Exécution des Tests

### Exécuter tous les tests

```bash
# Méthode 1: Utiliser le script Node.js
node tests/run-regression-tests.js

# Méthode 2: Exécuter directement avec Playwright
npx playwright test

# Méthode 3: Exécuter un fichier spécifique
npx playwright test tests/playwright/code-analysis.spec.js
```

### Exécuter avec UI

Pour voir l'interface graphique des tests :

```bash
npx playwright test --ui
```

### Exécuter en mode headed (pour le débogage)

```bash
npx playwright test tests/playwright/code-analysis.spec.js --headed
```

## Tests Disponibles

### 1. full-ihm-test.spec.js

Tests complets de l'interface utilisateur :
- ✅ Page Besoins - Chargement et affichage
- ✅ Sidebar - Navigation et modules
- ✅ Page Features - Fonctionnalités de base
- ✅ Page Exigences - Fonctionnalités de base
- ✅ Page Tests - Fonctionnalités de base
- ✅ Matrice Exigence-Tests - Fonctionnalités complètes
- ✅ Matrice - Navigation vers les détails

### 2. matrices.spec.js

Tests spécifiques pour les matrices :
- ✅ Matrice Exigence-Tests - Affichage et couverture
- ✅ Matrice - Filtres et tri
- ✅ Matrice - Export des données

### 3. code-analysis.spec.js (NOUVEAU)

Tests pour la page CODE et l'intégration GitHub :
- ✅ Page CODE - Chargement initial
- ✅ Page CODE - Affichage des exigences de l'application
- ✅ Page CODE - Validation du formulaire de connexion
- ✅ Page CODE - Message d'erreur pour token invalide
- ✅ Page CODE - Section Repositories non visible sans connexion
- ✅ Page CODE - Bouton d'analyse désactivé sans repository
- ✅ Page CODE - Bouton analyse affiche le nombre d'exigences
- ✅ Page CODE - Message d'avertissement sans exigences
- ✅ Page CODE - Statistiques de matching
- ✅ Page CODE - Navigation depuis le sidebar
- ✅ Page CODE - Structure de la page
- ✅ Page CODE - Styles des cartes d'exigences
- ✅ Page CODE - Responsive design mobile

## Configuration

Le fichier `playwright.config.js` configure :
- Les navigateurs à tester (Chromium, Firefox, WebKit)
- Le serveur web local (port 3000)
- Les options de reporting (HTML)
- Le parallélisme des tests

## Bonnes Pratiques

### Écrire un nouveau test

1. **Structure** :
   ```javascript
   test.describe('Nom du composant - Description', () => {
     test.beforeEach(async ({ page }) => {
       // Préparation avant chaque test
     });
     
     test('Nom du test', async ({ page }) => {
       // Étapes du test
       await page.goto('/page');
       await expect(page.locator('h1')).toContainText('Titre');
     });
   });
   ```

2. **Sélecteurs** :
   - Utilisez des sélecteurs stables (pas de classes générées)
   - Préférez les sélecteurs sémantiques :
     ```javascript
     // Bon
     page.locator('button:has-text("Se connecter")')
     page.locator('h2:has-text("Connexion")')
     
     // À éviter
     page.locator('.btn-primary') // Peut changer
     page.locator('#random-id-123') // ID généré
     ```

3. **Données de test** :
   - Utilisez `mockData` pour les données de test
   - Chargez les données dans localStorage avant le test

4. **Attentes** :
   - Utilisez `await expect(locator).toBeVisible()` pour vérifier la visibilité
   - Utilisez `await page.waitForTimeout(ms)` si nécessaire

## Dépannage

### Problème : Les tests échouent en CI

1. Vérifiez que le serveur est démarré :
   ```bash
   npm run start
   ```

2. Vérifiez que les dépendances sont installées :
   ```bash
   npm install
   npx playwright install
   ```

### Problème : Les sélecteurs ne fonctionnent pas

1. Vérifiez que le texte est correct (majuscules, accents)
2. Utilisez l'outil Playwright Codegen :
   ```bash
   npx playwright codegen http://localhost:3000
   ```

### Problème : Les tests sont trop lents

1. Réduisez le nombre de navigateurs dans `playwright.config.js`
2. Désactivez les vidéos et screenshots :
   ```javascript
   use: {
     screenshot: 'off',
     video: 'off',
   }
   ```

## Intégration CI/CD

### GitHub Actions

Exemple de workflow :

```yaml
name: Tests de Non-Régression

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install Playwright browsers
        run: npx playwright install
      
      - name: Run tests
        run: npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel

Pour exécuter les tests avant le déploiement :

1. Ajoutez un script dans `package.json` :
   ```json
   "scripts": {
     "test:regression": "node tests/run-regression-tests.js"
   }
   ```

2. Configurez dans Vercel :
   - Build Command: `npm run test:regression && npm run build`

## Rapports

Les rapports HTML sont générés dans le dossier `playwright-report/`.

Pour ouvrir le dernier rapport :

```bash
npx playwright show-report
```

## Mises à jour récentes

### v1.1.0 - Ajout des tests pour la page CODE

- ✅ 13 nouveaux tests pour la page CODE
- ✅ Tests de l'intégration GitHub
- ✅ Tests de l'analyse de code
- ✅ Tests de matching des exigences
- ✅ Tests de responsive design

### v1.0.0 - Tests initiaux

- ✅ Tests complets de l'IHM
- ✅ Tests des matrices
- ✅ Configuration Playwright

## Contribuer

Pour ajouter un nouveau test :

1. Créez un nouveau fichier dans `tests/playwright/`
2. Suivez les conventions de nommage : `nom-du-composant.spec.js`
3. Utilisez les bonnes pratiques décrites ci-dessus
4. Exécutez le test localement avant de committer
5. Ajoutez le test au script `run-regression-tests.js`

## Ressources

- [Documentation Playwright](https://playwright.dev/docs/intro)
- [API Playwright](https://playwright.dev/docs/api)
- [Bonnes pratiques](https://playwright.dev/docs/best-practices)

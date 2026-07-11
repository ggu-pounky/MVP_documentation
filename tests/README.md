# Tests IHM pour MVP Documentation

Ce dossier contient des scripts pour tester manuellement l'application avec des données factices.

## 📁 Fichiers disponibles

### 1. `load-test-data.js` - Script principal de test

Ce script permet de charger des données factices dans le localStorage pour tester l'application.

## 🚀 Comment utiliser

### Méthode 1: Directement dans la console du navigateur

1. **Ouvrez votre navigateur** et allez sur l'application (ex: `http://localhost:3000` ou votre URL Vercel)
2. **Ouvrez la console du navigateur** :
   - Chrome/Edge: `F12` ou `Ctrl+Shift+I` → onglet "Console"
   - Firefox: `F12` ou `Ctrl+Shift+K` → onglet "Console"
   - Safari: `Cmd+Option+I` → onglet "Console"
3. **Copiez-collez et exécutez** une des commandes suivantes :

```javascript
// Charger les données de test
loadTestData()

// Supprimer les données de test
clearTestData()

// Vérifier la matrice Exigence-Tests
checkExigenceTestsMatrix()
```

### Méthode 2: Importer le script dans votre page HTML

Ajoutez ce script à votre page pour avoir les fonctions disponibles :

```html
<script src="/tests/load-test-data.js"></script>
```

Puis appelez les fonctions depuis la console ou via des boutons.

## 📊 Données de test incluses

Le script `load-test-data.js` charge les données suivantes :

- **2 Besoins** :
  - Gestion des utilisateurs
  - Gestion des produits

- **2 EPICS** :
  - Épic - Authentification (lié à Gestion des utilisateurs)
  - Épic - Catalogue (lié à Gestion des produits)

- **4 Features** :
  - Inscription utilisateur
  - Connexion utilisateur
  - Ajouter produit
  - Modifier produit

- **5 Exigences** :
  - Validation format email
  - Validation complexité mot de passe
  - Affichage message erreur connexion
  - Vérification droits administrateur
  - Validation champs produit

- **5 Tests** :
  - Test email valide (lié à Validation format email)
  - Test email invalide (lié à Validation format email)
  - Test mot de passe valide (lié à Validation complexité mot de passe)
  - Test mot de passe trop court (lié à Validation complexité mot de passe)
  - Test affichage erreur connexion (lié à Affichage message erreur connexion)

## 🎯 Ce que vous pouvez tester

### Après avoir chargé les données avec `loadTestData()` :

1. **Navigation dans le menu** :
   - Vérifiez que tous les liens du sidebar fonctionnent
   - Vérifiez que les modules sont correctement séparés

2. **Page Besoins** :
   - Vérifiez que 2 besoins s'affichent
   - Testez l'ajout/modification/suppression

3. **Page Features** :
   - Vérifiez que 4 features s'affichent
   - Testez le bouton "Générer par IA"
   - Testez le bouton "Amélioration IA"

4. **Page Exigences** :
   - Vérifiez que 5 exigences s'affichent
   - Vérifiez les liens vers les features

5. **Page Tests** :
   - Vérifiez que 5 tests s'affichent
   - Testez le bouton "Générer par IA" (devrait proposer des tests basés sur l'exigence sélectionnée)
   - Testez le bouton "Amélioration IA"

6. **Page Matrices** :
   - Sélectionnez "Matrice Exigence - Tests"
   - Vérifiez que la matrice s'affiche avec :
     - **Métrique de couverture** : Devrait afficher ~60% (3/5 exigences couvertes)
     - **Tableau** : 5 lignes (exigences) × 5 colonnes (tests)
     - **Pastilles vertes** (✓) : Pour les associations existantes
     - **Pastilles rouges** (✗) : Pour les exigences sans tests
   - Vérifiez que les liens vers les exigences et tests fonctionnent

7. **Modales IA** :
   - Ouvrez la page Tests
   - Cliquez sur "Ajouter un Test"
   - Sélectionnez une exigence
   - Cliquez sur "Générer par IA"
   - Vérifiez que :
     - La modale s'ouvre correctement
     - Les suggestions sont visibles
     - Vous pouvez cocher/décocher les cases
     - Le bouton "Valider" fonctionne
     - Le bouton "Annuler" fonctionne
     - La touche `Escape` ferme la modale

## 🐛 Dépannage

### Si les données ne s'affichent pas :

1. **Vérifiez que localStorage est disponible** :
   ```javascript
   console.log(localStorage.getItem('besoins'));
   ```

2. **Rechargez la page** après avoir chargé les données

3. **Vérifiez la console** pour les erreurs

4. **Essayez de vider le cache** du navigateur

### Si les modales ne fonctionnent pas :

1. Vérifiez que vous avez bien sélectionné une exigence avant de cliquer sur "Générer par IA"
2. Essayez avec différents navigateurs (Chrome, Firefox, Edge)
3. Vérifiez qu'il n'y a pas d'erreurs JavaScript dans la console

## 📝 Notes

- Ces scripts sont conçus pour le **développement et les tests manuels**
- Les données sont stockées dans **localStorage** et persistent entre les rechargements de page
- Pour effacer toutes les données, utilisez `clearTestData()` ou videz manuellement le localStorage
- Les données sont générées avec des IDs uniques pour éviter les conflits

## 🔧 Pour les développeurs

Vous pouvez étendre ces scripts en :
- Ajoutant plus de données de test
- Créant des tests automatisés avec Puppeteer ou Playwright
- Ajoutant des validations supplémentaires

Voir `ihm-test.js` pour un exemple de test automatisé (nécessite Puppeteer).

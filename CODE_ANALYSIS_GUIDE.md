# Guide d'Utilisation de l'Analyse de Code GitHub

## Introduction

L'écran **CODE** de l'application permet maintenant de :
1. Se connecter à GitHub avec vos identifiants
2. Sélectionner un repository parmi vos projets GitHub
3. Analyser le code du repository et faire le matching avec les exigences de l'application
4. Visualiser les résultats sous forme de tableau avec coloration selon le pourcentage de matching

## Prérequis

### 1. Token GitHub
Pour utiliser cette fonctionnalité, vous avez besoin d'un **Personal Access Token (PAT)** GitHub avec les permissions suivantes :
- `repo` (accès en lecture aux repositories)
- `user` (accès en lecture au profil utilisateur)

#### Comment créer un token GitHub :
1. Allez sur [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Cliquez sur "Generate new token" (classic)
3. Donnez un nom à votre token (ex: "MVP Documentation App")
4. Sélectionnez les permissions :
   - ✅ `repo` (full control of private repositories - ou au minimum read-only)
   - ✅ `user` (read:user)
5. Cliquez sur "Generate token"
6. **Copiez immédiatement le token** (il ne sera plus visible après)

### 2. Exigences dans l'application
Assurez-vous d'avoir ajouté des exigences dans l'application (via l'écran **Exigences** ou **Features**) avant d'analyser le code. Sans exigences, l'analyse ne pourra pas faire de matching.

## Utilisation

### Étape 1 : Connexion à GitHub

1. Accédez à l'écran **CODE** dans le menu latéral
2. Dans la section "Connexion à GitHub" :
   - Entrez votre **Token GitHub** (le PAT que vous avez créé)
   - Entrez votre **Nom d'utilisateur GitHub**
   - Cliquez sur "Se connecter à GitHub"

3. Si la connexion réussit, vous verrez un message de confirmation et vos informations utilisateur s'afficheront.

### Étape 2 : Sélection du Repository

1. Après la connexion, la section "Vos Repositories" apparaîtra
2. Vous pouvez :
   - Rechercher un repository spécifique avec la barre de recherche
   - Trier les repositories par nom, date de mise à jour, nombre d'étoiles ou de forks
3. Cliquez sur le repository que vous souhaitez analyser
4. Le repository sélectionné sera mis en évidence

### Étape 3 : Analyse du Code

1. Cliquez sur le bouton "Analyser le code"
2. L'application va :
   - Récupérer la liste des fichiers du repository
   - Lire le contenu des fichiers de code (limité aux fichiers avec extensions courantes : .js, .ts, .py, .java, etc.)
   - Analyser chaque fichier pour trouver des correspondances avec vos exigences
   - Calculer un score de matching pour chaque correspondance

3. Une fois l'analyse terminée, les résultats s'afficheront sous forme de tableau

### Étape 4 : Visualisation des Résultats

Le tableau affiche :
- **Exigences Application** : Le titre et le type de l'exigence de votre application
- **Exigences IA (Code)** : Ce que l'IA a compris à partir du code
- **% Match** : Le pourcentage de correspondance (coloré en vert, jaune ou rouge)
- **Validé** : Une case à cocher (automatiquement cochée si ≥ 80%)
- **Fichier** : Le chemin du fichier où la correspondance a été trouvée

#### Colorisation des résultats :
- 🟢 **Vert** : Exigences avec matching ≥ 80% (bonnes correspondances)
- 🟡 **Jaune** : Exigences avec matching entre 50% et 80% (correspondances partielles)
- 🔴 **Rouge** : Exigences avec matching < 50% (faibles correspondances)

#### Statistiques :
En haut du tableau, vous verrez des cartes avec :
- Le nombre d'exigences avec matching > 80%
- Le nombre d'exigences avec matching entre 50-80%
- Le nombre d'exigences avec matching < 50%
- Le total des correspondances trouvées

## Fonctionnalités Avancées

### Filtres
- **Recherche** : Filtrez les résultats par texte dans le titre de l'exigence, la description IA ou le chemin du fichier
- **Filtre par pourcentage** : Affichez uniquement les résultats d'une plage spécifique (tous, >80%, 50-80%, <50%)

### Tri
- **Par nom** : Triez les repositories par ordre alphabétique
- **Par date** : Triez par date de dernière mise à jour
- **Par étoiles** : Triez par nombre d'étoiles (popularité)
- **Par forks** : Triez par nombre de forks

## Comment ça marche ? (Algorithme de Matching)

L'algorithme de matching fonctionne comme suit :

1. **Extraction des mots clés** : Pour chaque exigence, on extrait les mots de plus de 3 caractères du titre et de la description

2. **Recherche dans le code** : Pour chaque fichier de code, on recherche ces mots clés

3. **Calcul du score** :
   - +1 point pour chaque mot clé trouvé
   - +0.5 point pour les verbes d'action (créer, ajouter, supprimer, etc.)
   - +0.2 point si le type d'exigence correspond au contenu du fichier (ex: exigence technique avec du code API)
   - +0.1 point si le fichier est un test ou une spécification

4. **Normalisation** : Le score est normalisé entre 0 et 1, puis converti en pourcentage

5. **Seuil de validation** : Une exigence est considérée comme validée si le score est ≥ 80%

## Limitations

1. **Nombre de fichiers** : L'analyse est limitée aux 20 premiers fichiers de code pour éviter trop de requêtes à l'API GitHub
2. **Taille des fichiers** : Les très gros fichiers peuvent ne pas être complètement analysés
3. **Extensions supportées** : Seuls les fichiers avec extensions courantes sont analysés (.js, .ts, .py, .java, .cpp, .c, .go, .rs, .php, .rb)
4. **Rate limiting GitHub** : L'API GitHub a des limites de requêtes (60 requêtes/heure pour les comptes gratuits)

## Dépannage

### Problème : "Token invalide ou expiré"
- Vérifiez que votre token est correct
- Vérifiez que votre token a les permissions nécessaires (repo, user)
- Les tokens expirent après 30 jours par défaut (sauf si vous avez coché "No expiration")

### Problème : "Impossible de récupérer les repositories"
- Vérifiez votre connexion internet
- Vérifiez que votre token a bien la permission `repo`
- Essayez de vous déconnecter et reconnecter

### Problème : "Aucune exigence trouvée"
- Assurez-vous d'avoir ajouté des exigences dans l'application
- Les exigences sont sauvegardées dans le localStorage du navigateur
- Essayez de rafraîchir la page ou de vérifier dans l'écran **Exigences**

### Problème : "Aucun repository trouvé"
- Vérifiez que vous avez des repositories sur votre compte GitHub
- Si vous utilisez un compte organisation, assurez-vous que votre token a accès à ces repositories

## Sécurité

⚠️ **Important** :
- Votre token GitHub est sauvegardé dans le localStorage de votre navigateur
- Ne partagez pas votre navigateur ou votre session avec des personnes non autorisées
- Pour plus de sécurité, vous pouvez vous déconnecter après utilisation
- Les tokens peuvent être révoqués à tout moment depuis les paramètres GitHub

## Exemple d'Utilisation

### Scénario : Vérification de l'implémentation d'une feature

1. Vous avez une feature "Gestion des utilisateurs" avec les exigences :
   - "Créer un utilisateur"
   - "Modifier un utilisateur"
   - "Supprimer un utilisateur"

2. Vous connectez votre repository GitHub contenant le code backend

3. Vous lancez l'analyse

4. L'application trouve :
   - Dans `userController.js` : une fonction `createUser` → matching à 95% avec "Créer un utilisateur"
   - Dans `userController.js` : une fonction `updateUser` → matching à 90% avec "Modifier un utilisateur"
   - Dans `userController.js` : une fonction `deleteUser` → matching à 85% avec "Supprimer un utilisateur"

5. Vous voyez que toutes vos exigences sont implémentées avec un bon score de matching

## Personnalisation

Vous pouvez personnaliser l'algorithme de matching en modifiant le fichier `/app/code/page.tsx` :
- Ajouter des mots clés spécifiques à votre domaine
- Ajuster les poids des différents critères
- Modifier les seuils de validation

## Support

Pour toute question ou problème, veuillez consulter :
- La documentation principale de l'application
- Les paramètres de votre compte GitHub
- L'API GitHub : https://docs.github.com/en/rest

---

*Ce guide est spécifique à la fonctionnalité d'analyse de code de l'application MVP Documentation.*

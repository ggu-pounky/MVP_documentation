# 📌 Application de Gestion des Besoins

Une application web **modulaire** avec une **IHM CRUD** pour gérer les besoins, incluant un **menu latéral**, un **tableau de bord**, et des **opérations CRUD complètes**.

---

## 🏗️ Architecture

```
MVP_documentation/
├── backend/               # Backend Python (FastAPI)
│   ├── main.py            # Endpoints CRUD pour /besoins
│   ├── models.py          # Modèles Pydantic
│   ├── database.py        # Base de données en mémoire
│   └── requirements.txt    # Dépendances
│
├── frontend/              # Frontend Next.js
│   ├── app/               # Pages Next.js
│   │   ├── besoins/       # Pages CRUD des besoins
│   │   │   ├── page.tsx   # Liste des besoins
│   │   │   ├── new/       # Création d'un besoin
│   │   │   └── [id]/      # Détails/Édition d'un besoin
│   │   └── layout.tsx     # Layout avec sidebar
│   │
│   ├── components/        # Composants React
│   │   ├── BesoinTable/   # Tableau des besoins
│   │   ├── BesoinForm/    # Formulaire de création/édition
│   │   ├── Sidebar/       # Menu latéral
│   │   └── ui/            # Composants UI réutilisables
│   │
│   └── lib/               # Logique et types
│       ├── api/           # Appels API au backend
│       └── types/         # Types TypeScript
│
└── README.md              # Documentation
```

---

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Python](https://www.python.org/) (v3.10 ou supérieur)
- [Git](https://git-scm.com/)

---

### 1️⃣ Backend (FastAPI)

#### Installation

1. Accède au dossier `backend` :
   ```bash
   cd backend
   ```

2. Installe les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

3. Lance le serveur :
   ```bash
   uvicorn main:app --reload
   ```
   > Le backend sera disponible à l'adresse : [http://localhost:8000](http://localhost:8000)

#### Endpoints Disponibles

| Méthode | Endpoint          | Description                     |
|---------|-------------------|---------------------------------|
| GET     | `/besoins`        | Liste tous les besoins          |
| POST    | `/besoins`        | Crée un nouveau besoin          |
| GET     | `/besoins/{id}`   | Récupère un besoin spécifique    |
| PUT     | `/besoins/{id}`   | Met à jour un besoin            |
| DELETE  | `/besoins/{id}`   | Supprime un besoin              |

---

### 2️⃣ Frontend (Next.js)

#### Installation

1. Accède au dossier `frontend` :
   ```bash
   cd frontend
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

3. Lance le serveur de développement :
   ```bash
   npm run dev
   ```
   > Le frontend sera disponible à l'adresse : [http://localhost:3000](http://localhost:3000)

---

## 📊 Données de Test

Le backend est **pré-rempli avec 5 besoins de test** :

| ID | Titre | Statut | Description |
|----|-------|--------|-------------|
| 1 | Améliorer l'interface utilisateur | En cours | Rendre l'interface plus intuitive et moderne. |
| 2 | Ajouter une API de paiement | À faire | Intégrer Stripe pour les transactions. |
| 3 | Optimiser les performances | Terminé | Réduire le temps de chargement des pages. |
| 4 | Corriger les bugs critiques | À faire | Résoudre les problèmes signalés par les utilisateurs. |
| 5 | Mettre à jour la documentation | En cours | Documenter les nouvelles fonctionnalités. |

---

## 🎯 Fonctionnalités

### ✅ Frontend

- **Tableau des besoins** :
  - Affichage des besoins sous forme de tableau (ID, Titre, Statut, Date de création, Actions).
  - **Recherche** par titre ou statut.
  - **Tri** par titre, statut, ou date de création (ascendant/descendant).
  - **Pagination** (10 besoins par page).

- **Formulaire de création/édition** :
  - Champs : Titre (obligatoire), Description, Statut.
  - Validation des champs.
  - Messages de confirmation.

- **Actions** :
  - **Éditer** un besoin (ouvre le formulaire pré-rempli).
  - **Supprimer** un besoin (avec confirmation).
  - **Voir les détails** d'un besoin.

- **Menu latéral** :
  - Navigation entre les pages (Liste des besoins, Nouveau besoin, Accueil).

### ✅ Backend

- **API RESTful** avec FastAPI.
- **Base de données en mémoire** (pas besoin de base de données externe).
- **Validation des données** avec Pydantic.
- **Gestion des erreurs** (404, 500, etc.).
- **CORS activé** pour permettre les requêtes depuis le frontend.

---

## 🛠️ Technologies Utilisées

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | Next.js 14 + TypeScript |
| **UI** | Tailwind CSS (intégré via Next.js) |
| **Backend** | FastAPI + Python 3.11 |
| **Base de données** | En mémoire (Python) |
| **Gestion d'état** | React Hooks (useState, useEffect) |

---

## 📂 Structure des Données

### Besoin

```typescript
{
  id: string; // UUID
  titre: string; // Obligatoire
  description: string | null;
  statut: "À faire" | "En cours" | "Terminé" | "Annulé";
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

---

## 🔧 Configuration

### Variables d'Environnement

#### Backend

Aucune variable d'environnement n'est requise pour le backend en mode développement (base de données en mémoire).

#### Frontend

Le frontend utilise l'URL du backend par défaut (`http://localhost:8000`).
Pour modifier cette URL (ex: en production), modifie le fichier :

```typescript
// frontend/lib/api/besoins.ts
const API_BASE_URL = "http://ton-backend-url:8000";
```

---

## 🎨 Design

- **Interface professionnelle** avec Tailwind CSS.
- **Responsive** (adapté aux mobiles et tablettes).
- **Couleurs** :
  - Bleu pour les actions principales.
  - Vert pour les statuts "Terminé".
  - Jaune pour les statuts "En cours".
  - Gris pour les statuts "À faire".

---

## 🚀 Déploiement

### Backend

Pour déployer le backend, tu peux utiliser :
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [AWS EC2](https://aws.amazon.com/ec2/)
- [Docker](https://www.docker.com/)

#### Exemple avec Docker

1. Crée un `Dockerfile` dans `backend/` :
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. Construis et lance le conteneur :
   ```bash
   docker build -t besoins-backend .
   docker run -p 8000:8000 besoins-backend
   ```

### Frontend

Pour déployer le frontend, utilise :
- [Vercel](https://vercel.com/) (recommandé pour Next.js)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

#### Déploiement sur Vercel

1. Pousse ton code sur GitHub.
2. Importe le projet sur Vercel.
3. Vercel détectera automatiquement que c'est un projet Next.js et le déployera.

---

## 🤝 Contribution

1. Fork le projet.
2. Crée une branche (`git checkout -b feature/ma-fonctionnalite`).
3. Commite tes modifications (`git commit -m "Ajout de ma fonctionnalité"`).
4. Pousse vers la branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvre une Pull Request.

---

## 📜 Licence

Ce projet est sous licence **MIT**. Tu es libre de l'utiliser, le modifier et le distribuer.

---

## 🙌 Remerciements

- [FastAPI](https://fastapi.tiangolo.com/) pour le backend.
- [Next.js](https://nextjs.org/) pour le frontend.
- [Tailwind CSS](https://tailwindcss.com/) pour le design.

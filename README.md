# 📁 Application de Gestion des Besoins

Une application web **ultra simple** avec une **IHM CRUD** pour gérer les besoins. **Toutes les données sont gérées en mémoire** (pas de base de données externe).

---

## 🏗️ Architecture

```
MVP_documentation/
├── backend/
│   ├── main.py          # Backend FastAPI avec données en mémoire
│   └── requirements.txt # Dépendances Python
│
├── frontend/
│   ├── app/
│   │   └── page.tsx     # Page principale
│   ├── components/
│   │   ├── BesoinForm.tsx # Formulaire de création/modification
│   │   └── BesoinList.tsx # Liste des besoins
│   ├── package.json     # Dépendances Node.js
│   ├── tsconfig.json    # Configuration TypeScript
│   └── ...
│
├── .gitignore           # Fichiers à ignorer
└── README.md            # Documentation
```

---

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Python](https://www.python.org/) (v3.10 ou supérieur)

---

### 1️⃣ Backend (FastAPI)

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

## 📊 Structure des Données

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

## 🛠️ Technologies Utilisées

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | Next.js 14 + TypeScript |
| **UI** | Tailwind CSS |
| **Backend** | FastAPI + Python |
| **Base de données** | **En mémoire** (Python) |
| **Gestion d'état** | React Hooks (useState, useEffect) |

---

## 🎨 Fonctionnalités

### ✅ Frontend
- **Liste des besoins** sous forme de tableau
- **Formulaire** pour créer/modifier un besoin
- **Actions** : Modifier, Supprimer
- **Statuts colorés** (À faire, En cours, Terminé, Annulé)

### ✅ Backend
- **API RESTful** avec FastAPI
- **Données en mémoire** (pas de base de données externe)
- **Validation des données** avec Pydantic
- **CORS activé** pour les requêtes depuis le frontend

---

## 📝 Configuration

### Backend
Aucune configuration nécessaire. Les données sont gérées en mémoire.

### Frontend
Le frontend utilise par défaut l'URL du backend : `http://localhost:8000`.

Pour modifier cette URL (ex: en production), modifie directement dans le code :
```typescript
// frontend/app/page.tsx
const API_URL = 'http://ton-backend-url:8000/besoins'
```

---

## 📦 Déploiement

### Backend
Utilise n'importe quel service de déploiement Python :
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Docker](https://www.docker.com/)

### Frontend
Utilise n'importe quel service de déploiement Next.js :
- [Vercel](https://vercel.com/) (recommandé)
- [Netlify](https://www.netlify.com/)

---

## 📜 Licence

Ce projet est sous licence **MIT**. Tu es libre de l'utiliser, le modifier et le distribuer.

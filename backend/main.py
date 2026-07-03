from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID
from typing import List
from .models import Besoin, BesoinCreate, BesoinUpdate
from .database import (
    get_all_besoins,
    get_besoin_by_id,
    create_besoin,
    update_besoin,
    delete_besoin,
    init_db
)

# Initialisation de la base de données
init_db()

# Création de l'application FastAPI
app = FastAPI(
    title="API de Gestion des Besoins",
    description="API CRUD pour gérer les besoins",
    version="1.0.0"
)

# Configuration CORS (pour permettre les requêtes depuis le frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines (à restreindre en production)
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, PUT, DELETE)
    allow_headers=["*"],
)


# Endpoint : Lister tous les besoins
@app.get("/besoins", response_model=List[Besoin])
def list_besoins():
    """Retourne la liste de tous les besoins."""
    return get_all_besoins()


# Endpoint : Créer un nouveau besoin
@app.post("/besoins", response_model=Besoin, status_code=status.HTTP_201_CREATED)
def create_new_besoin(besoin: BesoinCreate):
    """Crée un nouveau besoin."""
    new_besoin = Besoin(**besoin.model_dump())
    created_besoin = create_besoin(new_besoin)
    return created_besoin


# Endpoint : Récupérer un besoin par ID
@app.get("/besoins/{besoin_id}", response_model=Besoin)
def get_besoin(besoin_id: UUID):
    """Retourne un besoin spécifique."""
    besoin = get_besoin_by_id(besoin_id)
    if besoin is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Besoin avec l'ID {besoin_id} non trouvé."
        )
    return besoin


# Endpoint : Mettre à jour un besoin
@app.put("/besoins/{besoin_id}", response_model=Besoin)
def update_existing_besoin(besoin_id: UUID, updated_besoin: BesoinUpdate):
    """Met à jour un besoin existant."""
    existing_besoin = get_besoin_by_id(besoin_id)
    if existing_besoin is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Besoin avec l'ID {besoin_id} non trouvé."
        )
    
    # Fusionne les données existantes avec les mises à jour
    updated_data = existing_besoin.model_dump()
    updated_data.update(updated_besoin.model_dump(exclude_unset=True))
    updated_besoin_obj = Besoin(**updated_data)
    
    result = update_besoin(besoin_id, updated_besoin_obj)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Échec de la mise à jour du besoin."
        )
    return result


# Endpoint : Supprimer un besoin
@app.delete("/besoins/{besoin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_besoin(besoin_id: UUID):
    """Supprime un besoin."""
    if not delete_besoin(besoin_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Besoin avec l'ID {besoin_id} non trouvé."
        )
    return None


# Point d'entrée pour exécuter l'application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

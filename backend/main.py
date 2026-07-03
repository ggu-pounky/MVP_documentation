from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèle Besoin
class Besoin(BaseModel):
    id: str
    titre: str
    description: Optional[str] = None
    statut: str = "À faire"
    created_at: str
    updated_at: str

class BesoinCreate(BaseModel):
    titre: str
    description: Optional[str] = None
    statut: str = "À faire"

class BesoinUpdate(BaseModel):
    titre: Optional[str] = None
    description: Optional[str] = None
    statut: Optional[str] = None

# Données en mémoire
besoins_db = []

# Données initiales
def init_data():
    besoins = [
        {"id": str(uuid.uuid4()), "titre": "Améliorer l'interface utilisateur", "description": "Rendre l'interface plus intuitive et moderne.", "statut": "En cours", "created_at": datetime.now().isoformat(), "updated_at": datetime.now().isoformat()},
        {"id": str(uuid.uuid4()), "titre": "Ajouter une API de paiement", "description": "Intégrer Stripe pour les transactions.", "statut": "À faire", "created_at": datetime.now().isoformat(), "updated_at": datetime.now().isoformat()},
        {"id": str(uuid.uuid4()), "titre": "Optimiser les performances", "description": "Réduire le temps de chargement des pages.", "statut": "Terminé", "created_at": datetime.now().isoformat(), "updated_at": datetime.now().isoformat()},
    ]
    return besoins

besoins_db = init_data()

# Endpoints
@app.get("/besoins", response_model=List[Besoin])
def get_besoins():
    return besoins_db

@app.get("/besoins/{besoin_id}", response_model=Besoin)
def get_besoin(besoin_id: str):
    for besoin in besoins_db:
        if besoin["id"] == besoin_id:
            return besoin
    raise HTTPException(status_code=404, detail="Besoin non trouvé")

@app.post("/besoins", response_model=Besoin)
def create_besoin(besoin: BesoinCreate):
    now = datetime.now().isoformat()
    new_besoin = {
        "id": str(uuid.uuid4()),
        "titre": besoin.titre,
        "description": besoin.description,
        "statut": besoin.statut,
        "created_at": now,
        "updated_at": now,
    }
    besoins_db.append(new_besoin)
    return new_besoin

@app.put("/besoins/{besoin_id}", response_model=Besoin)
def update_besoin(besoin_id: str, besoin: BesoinUpdate):
    for i, b in enumerate(besoins_db):
        if b["id"] == besoin_id:
            updated_besoin = b.copy()
            if besoin.titre is not None:
                updated_besoin["titre"] = besoin.titre
            if besoin.description is not None:
                updated_besoin["description"] = besoin.description
            if besoin.statut is not None:
                updated_besoin["statut"] = besoin.statut
            updated_besoin["updated_at"] = datetime.now().isoformat()
            besoins_db[i] = updated_besoin
            return updated_besoin
    raise HTTPException(status_code=404, detail="Besoin non trouvé")

@app.delete("/besoins/{besoin_id}")
def delete_besoin(besoin_id: str):
    for i, b in enumerate(besoins_db):
        if b["id"] == besoin_id:
            besoins_db.pop(i)
            return {"message": "Besoin supprimé"}
    raise HTTPException(status_code=404, detail="Besoin non trouvé")

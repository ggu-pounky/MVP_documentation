from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import engine, get_db

# Création des tables dans la base de données
models.Base.metadata.create_all(bind=engine)

# Initialisation de l'application FastAPI
app = FastAPI(
    title="API de Gestion des Besoins",
    description="API pour gérer les besoins (CRUD)",
    version="1.0.0",
)

# Configuration CORS (pour permettre les requêtes depuis ton frontend Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En développement, autorise toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, PUT, DELETE)
    allow_headers=["*"],
)


# Endpoint pour récupérer tous les besoins
@app.get("/besoins/", response_model=List[schemas.BesoinResponse])
def read_besoins(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    besoins = crud.get_besoins(db, skip=skip, limit=limit)
    return besoins


# Endpoint pour récupérer un besoin par son ID
@app.get("/besoins/{besoin_id}", response_model=schemas.BesoinResponse)
def read_besoin(besoin_id: int, db: Session = Depends(get_db)):
    db_besoin = crud.get_besoin(db, besoin_id=besoin_id)
    if db_besoin is None:
        raise HTTPException(status_code=404, detail="Besoin non trouvé")
    return db_besoin


# Endpoint pour créer un nouveau besoin
@app.post("/besoins/", response_model=schemas.BesoinResponse)
def create_besoin(besoin: schemas.BesoinCreate, db: Session = Depends(get_db)):
    return crud.create_besoin(db=db, besoin=besoin)


# Endpoint pour mettre à jour un besoin
@app.put("/besoins/{besoin_id}", response_model=schemas.BesoinResponse)
def update_besoin(besoin_id: int, besoin: schemas.BesoinUpdate, db: Session = Depends(get_db)):
    db_besoin = crud.update_besoin(db, besoin_id=besoin_id, besoin=besoin)
    if db_besoin is None:
        raise HTTPException(status_code=404, detail="Besoin non trouvé")
    return db_besoin


# Endpoint pour supprimer un besoin
@app.delete("/besoins/{besoin_id}", response_model=schemas.BesoinResponse)
def delete_besoin(besoin_id: int, db: Session = Depends(get_db)):
    db_besoin = crud.delete_besoin(db, besoin_id=besoin_id)
    if db_besoin is None:
        raise HTTPException(status_code=404, detail="Besoin non trouvé")
    return db_besoin


# Endpoint racine pour vérifier que l'API fonctionne
@app.get("/")
def read_root():
    return {"message": "API de Gestion des Besoins - Fonctionnelle !"}

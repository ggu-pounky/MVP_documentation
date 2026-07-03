from sqlalchemy.orm import Session
from . import models, schemas


def get_besoin(db: Session, besoin_id: int):
    """Récupère un besoin par son ID."""
    return db.query(models.Besoin).filter(models.Besoin.id == besoin_id).first()


def get_besoins(db: Session, skip: int = 0, limit: int = 100):
    """Récupère tous les besoins (avec pagination)."""
    return db.query(models.Besoin).offset(skip).limit(limit).all()


def create_besoin(db: Session, besoin: schemas.BesoinCreate):
    """Crée un nouveau besoin."""
    db_besoin = models.Besoin(
        titre=besoin.titre,
        description=besoin.description,
        statut=besoin.statut,
    )
    db.add(db_besoin)
    db.commit()
    db.refresh(db_besoin)
    return db_besoin


def update_besoin(db: Session, besoin_id: int, besoin: schemas.BesoinUpdate):
    """Met à jour un besoin existant."""
    db_besoin = db.query(models.Besoin).filter(models.Besoin.id == besoin_id).first()
    if db_besoin:
        if besoin.titre is not None:
            db_besoin.titre = besoin.titre
        if besoin.description is not None:
            db_besoin.description = besoin.description
        if besoin.statut is not None:
            db_besoin.statut = besoin.statut
        db.commit()
        db.refresh(db_besoin)
    return db_besoin


def delete_besoin(db: Session, besoin_id: int):
    """Supprime un besoin."""
    db_besoin = db.query(models.Besoin).filter(models.Besoin.id == besoin_id).first()
    if db_besoin:
        db.delete(db_besoin)
        db.commit()
    return db_besoin

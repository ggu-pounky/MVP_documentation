from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BesoinBase(BaseModel):
    """Schéma de base pour un besoin."""
    titre: str
    description: Optional[str] = None
    statut: str = "À faire"


class BesoinCreate(BesoinBase):
    """Schéma pour la création d'un besoin."""
    pass


class BesoinUpdate(BaseModel):
    """Schéma pour la mise à jour d'un besoin."""
    titre: Optional[str] = None
    description: Optional[str] = None
    statut: Optional[str] = None


class BesoinResponse(BesoinBase):
    """Schéma pour la réponse API (inclut id et timestamps)."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pour Pydantic v2 (remplace `orm_mode`)

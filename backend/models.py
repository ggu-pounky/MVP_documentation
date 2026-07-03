from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4


class BesoinBase(BaseModel):
    """Modèle de base pour un besoin."""
    titre: str = Field(..., min_length=1, max_length=200, description="Titre du besoin")
    description: Optional[str] = Field(None, description="Description détaillée du besoin")
    statut: str = Field(default="À faire", description="Statut du besoin")


class BesoinCreate(BesoinBase):
    """Modèle pour la création d'un besoin."""
    pass


class BesoinUpdate(BesoinBase):
    """Modèle pour la mise à jour d'un besoin."""
    pass


class Besoin(BesoinBase):
    """Modèle complet d'un besoin avec ID et dates."""
    id: UUID = Field(default_factory=uuid4, description="Identifiant unique du besoin")
    created_at: datetime = Field(default_factory=datetime.now, description="Date de création")
    updated_at: datetime = Field(default_factory=datetime.now, description="Date de mise à jour")

    class Config:
        from_attributes = True  # Pour la compatibilité avec Pydantic v2

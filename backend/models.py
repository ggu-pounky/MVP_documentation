from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class Besoin(Base):
    """Modèle SQLAlchemy pour les besoins (Besoins)."""
    __tablename__ = "besoins"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    statut = Column(String(50), nullable=False, default="À faire")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

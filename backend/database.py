from typing import Dict, List
from uuid import UUID
from datetime import datetime
from .models import Besoin


# Base de données simulée en mémoire
besoins_db: Dict[UUID, Besoin] = {}


def get_all_besoins() -> List[Besoin]:
    """Retourne tous les besoins."""
    return list(besoins_db.values())


def get_besoin_by_id(besoin_id: UUID) -> Besoin | None:
    """Retourne un besoin par son ID."""
    return besoins_db.get(besoin_id)


def create_besoin(besoin: Besoin) -> Besoin:
    """Crée un nouveau besoin."""
    besoins_db[besoin.id] = besoin
    return besoin


def update_besoin(besoin_id: UUID, updated_besoin: Besoin) -> Besoin | None:
    """Met à jour un besoin existant."""
    if besoin_id not in besoins_db:
        return None
    updated_besoin.id = besoin_id
    updated_besoin.updated_at = datetime.now()
    besoins_db[besoin_id] = updated_besoin
    return updated_besoin


def delete_besoin(besoin_id: UUID) -> bool:
    """Supprime un besoin."""
    if besoin_id in besoins_db:
        del besoins_db[besoin_id]
        return True
    return False


def init_db() -> None:
    """Initialise la base de données avec des données de test."""
    global besoins_db
    besoins_db = {}
    
    # Ajout de données de test
    test_besoins = [
        Besoin(
            id=UUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
            titre="Améliorer l'interface utilisateur",
            description="Rendre l'interface plus intuitive et moderne.",
            statut="En cours",
            created_at=datetime(2024, 1, 15, 10, 0, 0),
            updated_at=datetime(2024, 1, 15, 10, 0, 0)
        ),
        Besoin(
            id=UUID("b1ffc99a-8d1b-4f8c-9a7e-7cc8cd471b22"),
            titre="Ajouter une API de paiement",
            description="Intégrer Stripe pour les transactions.",
            statut="À faire",
            created_at=datetime(2024, 1, 16, 14, 30, 0),
            updated_at=datetime(2024, 1, 16, 14, 30, 0)
        ),
        Besoin(
            id=UUID("c2ddc88b-7e2a-4d9d-8b6f-8dd9ce562c33"),
            titre="Optimiser les performances",
            description="Réduire le temps de chargement des pages.",
            statut="Terminé",
            created_at=datetime(2024, 1, 10, 9, 15, 0),
            updated_at=datetime(2024, 1, 12, 11, 45, 0)
        ),
        Besoin(
            id=UUID("d3eec77c-6f39-4c8e-9b5f-9ee0de653d44"),
            titre="Corriger les bugs critiques",
            description="Résoudre les problèmes signalés par les utilisateurs.",
            statut="À faire",
            created_at=datetime(2024, 1, 18, 16, 20, 0),
            updated_at=datetime(2024, 1, 18, 16, 20, 0)
        ),
        Besoin(
            id=UUID("e4ffd66d-5g48-4b7f-8c5g-0ff1ee744e55"),
            titre="Mettre à jour la documentation",
            description="Documenter les nouvelles fonctionnalités.",
            statut="En cours",
            created_at=datetime(2024, 1, 20, 11, 0, 0),
            updated_at=datetime(2024, 1, 20, 11, 0, 0)
        ),
    ]
    
    for besoin in test_besoins:
        besoins_db[besoin.id] = besoin

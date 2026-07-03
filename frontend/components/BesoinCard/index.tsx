"use client";

import { Besoin } from "@/lib/types/besoin";
import { Button } from "../ui/Button";

interface BesoinCardProps {
  besoin: Besoin;
  onEdit: () => void;
  onDelete: () => void;
}

export const BesoinCard = ({ besoin, onEdit, onDelete }: BesoinCardProps) => {
  // Fonction pour obtenir la classe du badge en fonction du statut
  const getBadgeClass = (statut: string) => {
    switch (statut) {
      case "À faire":
        return "badge-todo";
      case "En cours":
        return "badge-in-progress";
      case "Terminé":
        return "badge-done";
      case "Annulé":
        return "badge-cancelled";
      default:
        return "badge-todo";
    }
  };

  return (
    <div className="besoin-card">
      <div className="card-title">{besoin.titre}</div>
      <div className="card-meta">
        <span className={`badge ${getBadgeClass(besoin.statut)}`}>
          {besoin.statut}
        </span>
        <span>{new Date(besoin.created_at).toLocaleDateString("fr-FR")}</span>
      </div>
      <div className="card-actions">
        <Button variant="outline" size="sm" onClick={onEdit} className="edit-button">
          ✏️
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete} className="delete-button">
          🗑️
        </Button>
      </div>
    </div>
  );
};

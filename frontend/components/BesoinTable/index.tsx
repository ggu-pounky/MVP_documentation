"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Besoin } from "@/lib/types/besoin";
import { BesoinCard } from "../BesoinCard";

interface BesoinTableProps {
  besoins: Besoin[];
  onDelete: (id: string) => void;
}

export const BesoinTable = ({ besoins, onDelete }: BesoinTableProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Besoin;
    direction: "ascending" | "descending";
  } | null>(null);

  // Filtrer les besoins
  const filteredBesoins = besoins.filter(
    (besoin) =>
      besoin.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      besoin.statut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trier les besoins
  const sortedBesoins = [...filteredBesoins];
  if (sortConfig) {
    sortedBesoins.sort((a, b) => {
      if (a[sortConfig.key]! < b[sortConfig.key]!) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key]! > b[sortConfig.key]!) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const requestSort = (key: keyof Besoin) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Besoin) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  const handleDelete = (id: string, titre: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le besoin "${titre}" ?`)) {
      onDelete(id);
    }
  };

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
    <div className="besoins-container">
      {/* Barre de recherche */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un besoin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tableau pour desktop */}
      <table className="besoins-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("id")}>
              ID {getSortIndicator("id")}
            </th>
            <th onClick={() => requestSort("titre")}>
              Titre {getSortIndicator("titre")}
            </th>
            <th onClick={() => requestSort("statut")}>
              Statut {getSortIndicator("statut")}
            </th>
            <th onClick={() => requestSort("created_at")}>
              Date de création {getSortIndicator("created_at")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedBesoins.length > 0 ? (
            sortedBesoins.map((besoin) => (
              <tr key={besoin.id}>
                <td>{besoin.id.slice(0, 8)}...</td>
                <td>{besoin.titre}</td>
                <td>
                  <span className={`badge ${getBadgeClass(besoin.statut)}`}>
                    {besoin.statut}
                  </span>
                </td>
                <td>{new Date(besoin.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/besoins/${besoin.id}/edit`)}
                    className="edit-button"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(besoin.id, besoin.titre)}
                    className="delete-button"
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Aucun besoin trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Cartes pour mobile */}
      <div className="besoins-cards">
        {sortedBesoins.length > 0 ? (
          sortedBesoins.map((besoin) => (
            <BesoinCard
              key={besoin.id}
              besoin={besoin}
              onEdit={() => router.push(`/besoins/${besoin.id}/edit`)}
              onDelete={() => handleDelete(besoin.id, besoin.titre)}
            />
          ))
        ) : (
          <p className="text-center py-4">Aucun besoin trouvé.</p>
        )}
      </div>
    </div>
  );
};

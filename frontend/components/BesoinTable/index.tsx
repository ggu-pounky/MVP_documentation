"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Besoin } from "@/lib/types/besoin";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination
  const totalPages = Math.ceil(sortedBesoins.length / itemsPerPage);
  const paginatedBesoins = sortedBesoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par titre ou statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-64"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Button onClick={() => router.push("/besoins/new")}>
          + Nouveau Besoin
        </Button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("id")}
              >
                ID {getSortIndicator("id")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("titre")}
              >
                Titre {getSortIndicator("titre")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("statut")}
              >
                Statut {getSortIndicator("statut")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("created_at")}
              >
                Date de création {getSortIndicator("created_at")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedBesoins.length > 0 ? (
              paginatedBesoins.map((besoin) => (
                <tr key={besoin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {besoin.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {besoin.titre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        besoin.statut === "Terminé"
                          ? "bg-green-100 text-green-800"
                          : besoin.statut === "En cours"
                          ? "bg-yellow-100 text-yellow-800"
                          : besoin.statut === "À faire"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {besoin.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(besoin.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/besoins/${besoin.id}/edit`)}
                    >
                      Éditer
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(besoin.id, besoin.titre)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun besoin trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

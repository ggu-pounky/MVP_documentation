"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchBesoinById, deleteBesoin } from "@/lib/api/besoins";
import { Button } from "@/components/ui/Button";
import { Besoin } from "@/lib/types/besoin";

export default function BesoinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [besoin, setBesoin] = useState<Besoin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBesoin = async () => {
      try {
        setLoading(true);
        const data = await fetchBesoinById(params.id as string);
        setBesoin(data);
      } catch (err) {
        setError("Échec de la récupération du besoin");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBesoin();
  }, [params.id]);

  const handleDelete = async () => {
    if (besoin && confirm(`Êtes-vous sûr de vouloir supprimer le besoin "${besoin.titre}" ?`)) {
      try {
        await deleteBesoin(besoin.id);
        router.push("/besoins");
      } catch (err) {
        setError("Échec de la suppression du besoin");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
        <button
          onClick={() => router.push("/besoins")}
          className="ml-4 bg-red-500 text-white px-2 py-1 rounded text-sm"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (!besoin) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Besoin non trouvé.
      </div>
    );
  }

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
    <div className="content">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]">{besoin.titre}</h1>
          <p className="text-gray-600">
            Créé le {new Date(besoin.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/besoins/${besoin.id}/edit`)}>Éditer</Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="form-container">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2C3E50]">Description</h2>
            <p className="text-gray-700 mt-2">{besoin.description || "Aucune description"}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#2C3E50]">Statut</h2>
            <span className={`badge ${getBadgeClass(besoin.statut)} mt-2 inline-block`}>
              {besoin.statut}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#2C3E50]">Date de mise à jour</h2>
            <p className="text-gray-700 mt-2">
              {new Date(besoin.updated_at).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="pt-4">
            <Button variant="secondary" onClick={() => router.push("/besoins")}>
              Retour à la liste
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

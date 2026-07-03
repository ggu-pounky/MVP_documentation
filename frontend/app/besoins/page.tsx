"use client";

import { useState, useEffect } from "react";
import { BesoinTable } from "@/components/BesoinTable";
import { fetchBesoins, deleteBesoin } from "@/lib/api/besoins";
import { Besoin } from "@/lib/types/besoin";

export default function BesoinsPage() {
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBesoins = async () => {
    try {
      setLoading(true);
      const data = await fetchBesoins();
      setBesoins(data);
    } catch (err) {
      setError("Échec de la récupération des besoins");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBesoins();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteBesoin(id);
      setBesoins(besoins.filter((besoin) => besoin.id !== id));
    } catch (err) {
      setError("Échec de la suppression du besoin");
      console.error(err);
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
          onClick={loadBesoins}
          className="ml-4 bg-red-500 text-white px-2 py-1 rounded text-sm"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Liste des Besoins</h1>
        <p className="text-gray-600">Gérez vos besoins et suivez leur statut.</p>
      </div>
      <BesoinTable besoins={besoins} onDelete={handleDelete} />
    </div>
  );
}

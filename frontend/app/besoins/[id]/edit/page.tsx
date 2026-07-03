"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BesoinForm } from "@/components/BesoinForm";
import { fetchBesoinById } from "@/lib/api/besoins";
import { Besoin } from "@/lib/types/besoin";

export default function EditBesoinPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Éditer le Besoin</h1>
        <p className="text-gray-600">Modifiez les informations du besoin.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <BesoinForm
          initialData={{
            id: besoin.id,
            titre: besoin.titre,
            description: besoin.description,
            statut: besoin.statut,
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Besoins</h1>
        <p className="text-xl text-gray-600 mt-2">
          Application CRUD pour gérer vos besoins
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/besoins")}>
          Voir les Besoins
        </Button>
        <Button variant="outline" onClick={() => router.push("/besoins/new")}>
          Créer un Besoin
        </Button>
      </div>

      <div className="text-center text-gray-500">
        <p>Bienvenue dans l&apos;application de gestion des besoins.</p>
        <p>Utilisez le menu à gauche pour naviguer.</p>
      </div>
    </div>
  );
}

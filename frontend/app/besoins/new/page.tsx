"use client";

import { BesoinForm } from "@/components/BesoinForm";

export default function NewBesoinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau Besoin</h1>
        <p className="text-gray-600">Créez un nouveau besoin.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <BesoinForm />
      </div>
    </div>
  );
}

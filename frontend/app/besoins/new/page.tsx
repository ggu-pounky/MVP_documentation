"use client";

import { BesoinForm } from "@/components/BesoinForm";

export default function NewBesoinPage() {
  return (
    <div className="content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]">Nouveau Besoin</h1>
        <p className="text-gray-600">Créez un nouveau besoin.</p>
      </div>
      <BesoinForm />
    </div>
  );
}

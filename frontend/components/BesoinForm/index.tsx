"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { STATUTS } from "@/lib/types/besoin";
import { createBesoin, updateBesoin } from "@/lib/api/besoins";

interface BesoinFormProps {
  initialData?: {
    id?: string;
    titre?: string;
    description?: string | null;
    statut?: string;
  };
}

export const BesoinForm = ({ initialData }: BesoinFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titre: initialData?.titre || "",
    description: initialData?.description || "",
    statut: initialData?.statut || "À faire",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        titre: initialData.titre || "",
        description: initialData.description || "",
        statut: initialData.statut || "À faire",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateBesoin(initialData.id, {
          titre: formData.titre,
          description: formData.description,
          statut: formData.statut,
        });
      } else {
        await createBesoin({
          titre: formData.titre,
          description: formData.description,
          statut: formData.statut,
        });
      }

      router.push("/besoins");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statutOptions = STATUTS.map((statut) => ({
    value: statut,
    label: statut,
  }));

  return (
    <div className="form-container">
      <h2 className="form-title">
        {initialData?.id ? "Éditer le besoin" : "Créer un nouveau besoin"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="titre">Titre *</label>
          <Input
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            error={errors.titre}
            placeholder="Ex: Améliorer l'interface utilisateur"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le besoin en détail"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="statut">Statut *</label>
          <Select
            id="statut"
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            options={statutOptions}
          />
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "En cours..." : initialData?.id ? "Mettre à jour" : "Créer"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/besoins")}
            className="cancel-button"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

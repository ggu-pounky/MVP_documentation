// API Client pour les besoins (Besoins)
// Utilise fetch pour communiquer avec le backend FastAPI

import { Besoin } from "@/lib/types/besoin";

// URL de base pour l'API (backend FastAPI)
// En développement : http://localhost:8000
// En production : à remplacer par l'URL de ton backend déployé
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Récupère tous les besoins
export const fetchBesoins = async (): Promise<Besoin[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/besoins/`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    // Conversion des IDs en string (car le frontend attend des strings)
    return data.map((besoin: any) => ({
      ...besoin,
      id: besoin.id.toString(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des besoins:", error);
    throw error;
  }
};

// Récupère un besoin par son ID
export const fetchBesoinById = async (id: string): Promise<Besoin> => {
  try {
    const response = await fetch(`${API_BASE_URL}/besoins/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    // Conversion de l'ID en string
    return {
      ...data,
      id: data.id.toString(),
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du besoin ${id}:`, error);
    throw error;
  }
};

// Crée un nouveau besoin
export const createBesoin = async (besoinData: Omit<Besoin, "id" | "created_at" | "updated_at">): Promise<Besoin> => {
  try {
    const response = await fetch(`${API_BASE_URL}/besoins/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(besoinData),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    // Conversion de l'ID en string
    return {
      ...data,
      id: data.id.toString(),
    };
  } catch (error) {
    console.error("Erreur lors de la création du besoin:", error);
    throw error;
  }
};

// Met à jour un besoin
export const updateBesoin = async (id: string, besoinData: Partial<Besoin>): Promise<Besoin> => {
  try {
    const response = await fetch(`${API_BASE_URL}/besoins/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(besoinData),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    // Conversion de l'ID en string
    return {
      ...data,
      id: data.id.toString(),
    };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du besoin ${id}:`, error);
    throw error;
  }
};

// Supprime un besoin
export const deleteBesoin = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/besoins/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du besoin ${id}:`, error);
    throw error;
  }
};

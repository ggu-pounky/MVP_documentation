'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

type Exigence = {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  created_at: string;
};

export default function ExigencesPage() {
  const supabase = getSupabaseClient();
  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire pour les exigences
  const [newExigence, setNewExigence] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
  });

  // Récupérer les exigences au chargement
  useEffect(() => {
    fetchExigences();
  }, []);

  const fetchExigences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exigences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExigences(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle exigence
  const handleCreateExigence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('exigences')
        .insert([{
          titre: newExigence.titre,
          description: newExigence.description,
          priorite: newExigence.priorite,
          statut: newExigence.statut,
        }])
        .select();

      if (error) throw error;
      setExigences([...exigences, data[0]]);
      setNewExigence({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Mettre à jour une exigence
  const handleUpdateExigence = async (id: string, updatedData: Partial<Exigence>) => {
    try {
      const { data, error } = await supabase
        .from('exigences')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setExigences(exigences.map(ex => ex.id === id ? data[0] : ex));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Supprimer une exigence
  const handleDeleteExigence = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exigences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExigences(exigences.filter(ex => ex.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
        <div className="text-red-500">Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
      <h1 className="text-3xl font-bold mb-8 text-[rgb(var(--primary-rgb))]">Gestion des Exigences</h1>

      {/* Formulaire pour ajouter une exigence */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Ajouter une exigence</h2>
        <form onSubmit={handleCreateExigence} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              value={newExigence.titre}
              onChange={(e) => setNewExigence({ ...newExigence, titre: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priorité</label>
            <select
              value={newExigence.priorite}
              onChange={(e) => setNewExigence({ ...newExigence, priorite: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
            >
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={newExigence.statut}
              onChange={(e) => setNewExigence({ ...newExigence, statut: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newExigence.description}
              onChange={(e) => setNewExigence({ ...newExigence, description: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-white rounded hover:bg-[rgba(var(--primary-rgb),0.8)] transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>

      {/* Tableau des exigences */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Liste des exigences</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--card-border-rgb))]">
                <th className="text-left p-3 font-medium">Titre</th>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-left p-3 font-medium">Priorité</th>
                <th className="text-left p-3 font-medium">Statut</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exigences.map((exigence) => (
                <tr key={exigence.id} className="border-b border-[rgba(var(--card-border-rgb),0.3)]">
                  <td className="p-3">{exigence.titre}</td>
                  <td className="p-3">{exigence.description}</td>
                  <td className="p-3">{exigence.priorite}</td>
                  <td className="p-3">{exigence.statut}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        const updatedTitre = prompt('Nouveau titre:', exigence.titre);
                        if (updatedTitre) {
                          handleUpdateExigence(exigence.id, { titre: updatedTitre });
                        }
                      }}
                      className="text-[rgb(var(--primary-rgb))] hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette exigence ?')) {
                          handleDeleteExigence(exigence.id);
                        }
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

type Parametre = {
  id: string;
  name: string;
  value: string;
};

export default function ParametersPage() {
  const supabase = getSupabaseClient();
  const [parametres, setParametres] = useState<Parametre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire pour les paramètres
  const [newParametre, setNewParametre] = useState({
    name: '',
    value: '',
  });

  // Récupérer les paramètres au chargement
  useEffect(() => {
    fetchParametres();
  }, []);

  const fetchParametres = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parameters')
        .select('*');

      if (error) throw error;
      setParametres(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau paramètre
  const handleCreateParametre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('parameters')
        .insert([{
          name: newParametre.name,
          value: newParametre.value,
        }])
        .select();

      if (error) throw error;
      setParametres([...parametres, data[0]]);
      setNewParametre({ name: '', value: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Mettre à jour un paramètre
  const handleUpdateParametre = async (id: string, updatedData: Partial<Parametre>) => {
    try {
      const { data, error } = await supabase
        .from('parameters')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setParametres(parametres.map(p => p.id === id ? data[0] : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Supprimer un paramètre
  const handleDeleteParametre = async (id: string) => {
    try {
      const { error } = await supabase
        .from('parameters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setParametres(parametres.filter(p => p.id !== id));
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
      <h1 className="text-3xl font-bold mb-8 text-[rgb(var(--primary-rgb))]">Gestion des Paramètres</h1>

      {/* Formulaire pour ajouter un paramètre */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Ajouter un paramètre</h2>
        <form onSubmit={handleCreateParametre} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={newParametre.name}
              onChange={(e) => setNewParametre({ ...newParametre, name: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valeur</label>
            <input
              type="text"
              value={newParametre.value}
              onChange={(e) => setNewParametre({ ...newParametre, value: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              required
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

      {/* Tableau des paramètres */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Liste des paramètres</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--card-border-rgb))]">
                <th className="text-left p-3 font-medium">Nom</th>
                <th className="text-left p-3 font-medium">Valeur</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parametres.map((parametre) => (
                <tr key={parametre.id} className="border-b border-[rgba(var(--card-border-rgb),0.3)]">
                  <td className="p-3">{parametre.name}</td>
                  <td className="p-3">{parametre.value}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        const updatedValue = prompt('Nouvelle valeur:', parametre.value);
                        if (updatedValue) {
                          handleUpdateParametre(parametre.id, { value: updatedValue });
                        }
                      }}
                      className="text-[rgb(var(--primary-rgb))] hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) {
                          handleDeleteParametre(parametre.id);
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

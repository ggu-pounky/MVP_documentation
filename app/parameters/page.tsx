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

type Parametre = {
  id: string;
  name: string;
  value: string;
};

export default function ParametersPage() {
  const supabase = getSupabaseClient();
  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [parametres, setParametres] = useState<Parametre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire pour les exigences
  const [newExigence, setNewExigence] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
  });

  // Formulaire pour les paramètres
  const [newParametre, setNewParametre] = useState({
    name: '',
    value: '',
  });

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les exigences
      const { data: exigencesData, error: exigencesError } = await supabase
        .from('exigences')
        .select('*')
        .order('created_at', { ascending: false });

      if (exigencesError) throw exigencesError;
      setExigences(exigencesData || []);

      // Récupérer les paramètres
      const { data: parametresData, error: parametresError } = await supabase
        .from('parameters')
        .select('*');

      if (parametresError) throw parametresError;
      setParametres(parametresData || []);

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
      <h1 className="text-3xl font-bold mb-8 text-[rgb(var(--primary-rgb))]">Gestion des Exigences et Paramètres</h1>

      {/* Section Exigences */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Exigences</h2>

        {/* Formulaire pour ajouter une exigence */}
        <form onSubmit={handleCreateExigence} className="mb-6 p-4 bg-[rgba(var(--background-start-rgb),0.1)] rounded-lg border border-[rgba(var(--card-border-rgb),0.3)]">
          <h3 className="text-lg font-medium mb-4 text-[rgb(var(--primary-rgb))]">Ajouter une exigence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-white rounded hover:bg-[rgba(var(--primary-rgb),0.8)] transition-colors"
          >
            Ajouter
          </button>
        </form>

        {/* Tableau des exigences */}
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
                        const updatedExigence = prompt('Nouveau titre:', exigence.titre);
                        if (updatedExigence) {
                          handleUpdateExigence(exigence.id, { titre: updatedExigence });
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

      {/* Section Paramètres */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Paramètres</h2>

        {/* Formulaire pour ajouter un paramètre */}
        <form onSubmit={handleCreateParametre} className="mb-6 p-4 bg-[rgba(var(--background-start-rgb),0.1)] rounded-lg border border-[rgba(var(--card-border-rgb),0.3)]">
          <h3 className="text-lg font-medium mb-4 text-[rgb(var(--primary-rgb))]">Ajouter un paramètre</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-white rounded hover:bg-[rgba(var(--primary-rgb),0.8)] transition-colors"
          >
            Ajouter
          </button>
        </form>

        {/* Tableau des paramètres */}
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

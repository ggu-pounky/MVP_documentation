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
  const [success, setSuccess] = useState<string | null>(null);

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
      setError(null);
      
      const { data, error } = await supabase
        .from('parameters')
        .select('*');

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
      
      setParametres(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des paramètres:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau paramètre
  const handleCreateParametre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (!newParametre.name) {
        throw new Error('Le nom est obligatoire');
      }

      const { data, error } = await supabase
        .from('parameters')
        .insert([{
          name: newParametre.name,
          value: newParametre.value,
        }])
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après insertion');
      }

      setParametres([...parametres, data[0]]);
      setNewParametre({ name: '', value: '' });
      setSuccess('Paramètre ajouté avec succès !');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Erreur lors de la création du paramètre:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un paramètre
  const handleUpdateParametre = async (id: string, updatedData: Partial<Parametre>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('parameters')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après mise à jour');
      }

      setParametres(parametres.map(p => p.id === id ? data[0] : p));
      setSuccess('Paramètre mis à jour avec succès !');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un paramètre
  const handleDeleteParametre = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('parameters')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      setParametres(parametres.filter(p => p.id !== id));
      setSuccess('Paramètre supprimé avec succès !');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  if (loading && parametres.length === 0) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-6">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[rgb(var(--primary-rgb))]">
          Gestion des Paramètres
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Configurez les paramètres de votre application.
        </p>
      </div>

      {/* Message de succès */}
      {success && (
        <div className="alert alert-success mb-6">
          {success}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-error mb-6">
          Erreur : {error}
        </div>
      )}

      {/* Formulaire pour ajouter un paramètre */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Ajouter un paramètre
        </h2>
        <form onSubmit={handleCreateParametre} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Nom *</label>
            <input
              type="text"
              value={newParametre.name}
              onChange={(e) => setNewParametre({ ...newParametre, name: e.target.value })}
              placeholder="Ex: max_users"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Valeur</label>
            <input
              type="text"
              value={newParametre.value}
              onChange={(e) => setNewParametre({ ...newParametre, value: e.target.value })}
              placeholder="Ex: 100"
              className="form-input"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le paramètre'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des paramètres */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Liste des paramètres
        </h2>
        {parametres.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            Aucun paramètre trouvé.
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Valeur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parametres.map((parametre) => (
                  <tr key={parametre.id}>
                    <td>
                      <code className="bg-[rgba(var(--background-start-rgb),0.2)] p-1 rounded">
                        {parametre.name}
                      </code>
                    </td>
                    <td>{parametre.value}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => {
                          const updatedValue = prompt('Nouvelle valeur:', parametre.value);
                          if (updatedValue) {
                            handleUpdateParametre(parametre.id, { value: updatedValue });
                          }
                        }}
                        disabled={loading}
                        className="link text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) {
                            handleDeleteParametre(parametre.id);
                          }
                        }}
                        disabled={loading}
                        className="text-red-500 hover:underline disabled:opacity-50 text-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

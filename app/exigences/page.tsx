'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Exigence = {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  besoin_id: string | null;
  created_at: string;
};

type Besoin = {
  id: string;
  titre: string;
};

export default function ExigencesPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const besoinIdFromUrl = searchParams.get('besoin_id');

  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulaire pour les exigences
  const [newExigence, setNewExigence] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
    besoin_id: besoinIdFromUrl || '',
  });

  // Récupérer les exigences et besoins au chargement
  useEffect(() => {
    fetchData();
  }, [besoinIdFromUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les exigences
      const { data: exigencesData, error: exigencesError } = await supabase
        .from('exigences')
        .select('*')
        .order('created_at', { ascending: false });

      if (exigencesError) {
        console.error('Erreur Supabase (exigences):', exigencesError);
        throw new Error(`Erreur Supabase: ${exigencesError.message}`);
      }
      setExigences(exigencesData || []);

      // Récupérer les besoins
      const { data: besoinsData, error: besoinsError } = await supabase
        .from('besoins')
        .select('id, titre');

      if (besoinsError) {
        console.error('Erreur Supabase (besoins):', besoinsError);
        throw new Error(`Erreur Supabase: ${besoinsError.message}`);
      }
      setBesoins(besoinsData || []);

    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle exigence
  const handleCreateExigence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!newExigence.titre) {
        throw new Error('Le titre est obligatoire');
      }

      // Si un besoin est sélectionné, l'associer à l'exigence
      const exigenceToInsert = {
        titre: newExigence.titre,
        description: newExigence.description,
        priorite: newExigence.priorite,
        statut: newExigence.statut,
        besoin_id: newExigence.besoin_id || null,
      };

      const { data, error } = await supabase
        .from('exigences')
        .insert([exigenceToInsert])
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après insertion');
      }

      setExigences([...exigences, data[0]]);
      setNewExigence({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', besoin_id: besoinIdFromUrl || '' });
      setSuccess('User Story ajoutée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la création de l\'exigence:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une exigence
  const handleUpdateExigence = async (id: string, updatedData: Partial<Exigence>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('exigences')
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

      setExigences(exigences.map(ex => ex.id === id ? data[0] : ex));
      setSuccess('User Story mise à jour avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une exigence
  const handleDeleteExigence = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('exigences')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      setExigences(exigences.filter(ex => ex.id !== id));
      setSuccess('User Story supprimée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les exigences par besoin si un besoin_id est sélectionné
  const filteredExigences = besoinIdFromUrl 
    ? exigences.filter(ex => ex.besoin_id === besoinIdFromUrl)
    : exigences;

  // Trouver le titre du besoin sélectionné
  const selectedBesoin = besoins.find(b => b.id === besoinIdFromUrl);

  if (loading && exigences.length === 0) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[rgb(var(--primary-rgb))]">
          {selectedBesoin ? `User Stories pour: ${selectedBesoin.titre}` : 'Gestion des User Stories (Exigences)'}
        </h1>
        {besoinIdFromUrl && (
          <Link
            href="/besoins"
            className="px-4 py-2 bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))] rounded hover:bg-[rgba(var(--primary-rgb),0.3)] transition-colors"
          >
            Retour aux besoins
          </Link>
        )}
      </div>

      {/* Message de succès */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 dark:border-green-400 rounded text-green-700 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-400 rounded text-red-700 dark:text-red-300">
          Erreur : {error}
        </div>
      )}

      {/* Formulaire pour ajouter une User Story */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          {selectedBesoin ? 'Ajouter une User Story pour ce besoin' : 'Ajouter une User Story'}
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Une User Story suit le format : <strong>"En tant que [rôle], je veux [fonctionnalité] afin de [bénéfice]."</strong>
        </p>
        <form onSubmit={handleCreateExigence} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre *</label>
            <input
              type="text"
              value={newExigence.titre}
              onChange={(e) => setNewExigence({ ...newExigence, titre: e.target.value })}
              placeholder="Ex: En tant qu'utilisateur, je veux me connecter afin d'accéder à mon compte"
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              required
            />
          </div>
          {!selectedBesoin && (
            <div>
              <label className="block text-sm font-medium mb-1">Besoin associé (optionnel)</label>
              <select
                value={newExigence.besoin_id}
                onChange={(e) => setNewExigence({ ...newExigence, besoin_id: e.target.value })}
                className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              >
                <option value="">Aucun besoin associé</option>
                {besoins.map((besoin) => (
                  <option key={besoin.id} value={besoin.id}>
                    {besoin.titre}
                  </option>
                ))}
              </select>
            </div>
          )}
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newExigence.description}
              onChange={(e) => setNewExigence({ ...newExigence, description: e.target.value })}
              placeholder="Décrivez la User Story en détail : critères d'acceptation, exemples, etc."
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              rows={4}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-white rounded hover:bg-[rgba(var(--primary-rgb),0.8)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter la User Story'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des User Stories */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Liste des User Stories
          {selectedBesoin && ` associées à "${selectedBesoin.titre}"`}
        </h2>
        {filteredExigences.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            {selectedBesoin 
              ? 'Aucune User Story associée à ce besoin.' 
              : 'Aucune User Story trouvée.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--card-border-rgb))]">
                  <th className="text-left p-3 font-medium">Titre</th>
                  <th className="text-left p-3 font-medium">Besoin associé</th>
                  <th className="text-left p-3 font-medium">Priorité</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExigences.map((exigence) => {
                  const besoinAssocie = besoins.find(b => b.id === exigence.besoin_id);
                  return (
                    <tr key={exigence.id} className="border-b border-[rgba(var(--card-border-rgb),0.3)]">
                      <td className="p-3">{exigence.titre}</td>
                      <td className="p-3">
                        {besoinAssocie ? (
                          <Link
                            href={`/besoins#${besoinAssocie.id}`}
                            className="text-[rgb(var(--primary-rgb))] hover:underline"
                          >
                            {besoinAssocie.titre}
                          </Link>
                        ) : (
                          <span className="text-[rgba(var(--secondary-rgb),0.5)]">Aucun</span>
                        )}
                      </td>
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
                          disabled={loading}
                          className="text-[rgb(var(--primary-rgb))] hover:underline disabled:opacity-50"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette User Story ?')) {
                              handleDeleteExigence(exigence.id);
                            }
                          }}
                          disabled={loading}
                          className="text-red-500 hover:underline disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

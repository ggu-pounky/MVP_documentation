'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

type Besoin = {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  createur: string;
  date_creation: string;
};

type Exigence = {
  id: string;
  titre: string;
  besoin_id: string;
};

export default function BesoinsPage() {
  const supabase = getSupabaseClient();
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulaire pour les besoins
  const [newBesoin, setNewBesoin] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
    createur: '',
  });

  // Récupérer les besoins et exigences au chargement
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les besoins
      const { data: besoinsData, error: besoinsError } = await supabase
        .from('besoins')
        .select('*')
        .order('date_creation', { ascending: false });

      if (besoinsError) {
        console.error('Erreur Supabase (besoins):', besoinsError);
        throw new Error(`Erreur Supabase: ${besoinsError.message}`);
      }
      setBesoins(besoinsData || []);

      // Récupérer les exigences
      const { data: exigencesData, error: exigencesError } = await supabase
        .from('exigences')
        .select('id, titre, besoin_id');

      if (exigencesError) {
        console.error('Erreur Supabase (exigences):', exigencesError);
        throw new Error(`Erreur Supabase: ${exigencesError.message}`);
      }
      setExigences(exigencesData || []);

    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau besoin
  const handleCreateBesoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!newBesoin.titre) {
        throw new Error('Le titre est obligatoire');
      }

      const { data, error } = await supabase
        .from('besoins')
        .insert([{
          titre: newBesoin.titre,
          description: newBesoin.description,
          priorite: newBesoin.priorite,
          statut: newBesoin.statut,
          createur: newBesoin.createur,
        }])
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après insertion');
      }

      setBesoins([...besoins, data[0]]);
      setNewBesoin({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', createur: '' });
      setSuccess('Besoin ajouté avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la création du besoin:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un besoin
  const handleDeleteBesoin = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier qu'il n'y a pas d'exigences associées
      const { data: associatedExigences, error: checkError } = await supabase
        .from('exigences')
        .select('id')
        .eq('besoin_id', id);

      if (checkError) {
        console.error('Erreur lors de la vérification des exigences associées:', checkError);
        throw new Error(`Erreur Supabase: ${checkError.message}`);
      }

      if (associatedExigences && associatedExigences.length > 0) {
        throw new Error('Impossible de supprimer ce besoin : des exigences y sont associées. Supprimez d\'abord les exigences liées.');
      }

      const { error } = await supabase
        .from('besoins')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      setBesoins(besoins.filter(b => b.id !== id));
      setSuccess('Besoin supprimé avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les exigences par besoin
  const getExigencesForBesoin = (besoinId: string) => {
    return exigences.filter(ex => ex.besoin_id === besoinId);
  };

  if (loading && besoins.length === 0) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
      <h1 className="text-3xl font-bold mb-8 text-[rgb(var(--primary-rgb))]">Expression des Besoins (Méthodologie Agile)</h1>

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

      {/* Formulaire pour ajouter un besoin */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Exprimer un nouveau besoin
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          En tant que <strong>métier</strong>, je souhaite pouvoir décrire un besoin fonctionnel 
          qui sera ensuite transformé en <strong>User Stories</strong> (exigences) par l'équipe technique.
        </p>
        <form onSubmit={handleCreateBesoin} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre *</label>
            <input
              type="text"
              value={newBesoin.titre}
              onChange={(e) => setNewBesoin({ ...newBesoin, titre: e.target.value })}
              placeholder="Ex: Gestion des utilisateurs"
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priorité</label>
            <select
              value={newBesoin.priorite}
              onChange={(e) => setNewBesoin({ ...newBesoin, priorite: e.target.value })}
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
              value={newBesoin.statut}
              onChange={(e) => setNewBesoin({ ...newBesoin, statut: e.target.value })}
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Votre nom (optionnel)</label>
            <input
              type="text"
              value={newBesoin.createur}
              onChange={(e) => setNewBesoin({ ...newBesoin, createur: e.target.value })}
              placeholder="Ex: Jean Dupont (MOA)"
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={newBesoin.description}
              onChange={(e) => setNewBesoin({ ...newBesoin, description: e.target.value })}
              placeholder="Décrivez le besoin en détail : contexte, objectif, bénéfices attendus..."
              className="w-full p-2 rounded bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              rows={4}
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-white rounded hover:bg-[rgba(var(--primary-rgb),0.8)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le besoin'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des besoins */}
      <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">Liste des besoins</h2>
        {besoins.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">Aucun besoin trouvé.</p>
        ) : (
          <div className="space-y-6">
            {besoins.map((besoin) => {
              const exigencesAssociees = getExigencesForBesoin(besoin.id);
              return (
                <div key={besoin.id} className="border border-[rgba(var(--card-border-rgb),0.3)] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[rgb(var(--primary-rgb))]">{besoin.titre}</h3>
                      <p className="text-sm text-[rgba(var(--secondary-rgb),0.7)] mt-1">
                        Priorité: {besoin.priorite} | Statut: {besoin.statut}
                        {besoin.createur && ` | Créé par: ${besoin.createur}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) {
                          handleDeleteBesoin(besoin.id);
                        }
                      }}
                      disabled={loading}
                      className="text-red-500 hover:underline disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                  <p className="mb-3 text-[rgb(var(--foreground-rgb))]">{besoin.description}</p>
                  
                  {/* Section des exigences associées */}
                  <div className="mt-4 pt-4 border-t border-[rgba(var(--card-border-rgb),0.3)]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-medium text-[rgb(var(--secondary-rgb))]">
                        User Stories / Exigences associées ({exigencesAssociees.length})
                      </h4>
                      <Link
                        href={`/exigences?besoin_id=${besoin.id}`}
                        className="px-3 py-1 bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))] rounded hover:bg-[rgba(var(--primary-rgb),0.3)] transition-colors"
                      >
                        + Ajouter une User Story
                      </Link>
                    </div>
                    {exigencesAssociees.length === 0 ? (
                      <p className="text-sm text-[rgba(var(--secondary-rgb),0.5)] italic">
                        Aucune User Story associée à ce besoin.
                      </p>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {exigencesAssociees.map((exigence) => (
                          <li key={exigence.id} className="text-[rgb(var(--foreground-rgb))]">
                            <Link
                              href={`/exigences/${exigence.id}`}
                              className="hover:text-[rgb(var(--primary-rgb))] underline"
                            >
                              {exigence.titre}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

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

type UserStory = {
  id: string;
  titre: string;
  description: string;
  besoin_id: string;
  priorite: string;
  statut: string;
};

type Exigence = {
  id: string;
  titre: string;
  feature_id: string | null; // Correspond à userstory_id dans la base
};

export default function BesoinsPage() {
  const supabase = getSupabaseClient();
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
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

  // État pour le formulaire de User Story
  const [newUserStory, setNewUserStory] = useState({
    titre: '',
    description: '',
    besoin_id: '',
    priorite: 'Moyenne',
    statut: 'À faire',
  });

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les besoins
      const { data: besoinsData, error: besoinsError } = await supabase
        .from('epics')
        .select('*')
        .order('date_creation', { ascending: false });

      if (besoinsError) {
        console.error('Erreur Supabase (besoins):', besoinsError);
        throw new Error(`Erreur Supabase: ${besoinsError.message}`);
      }
      setBesoins(besoinsData || []);

      // Récupérer les User Stories
      const { data: userStoriesData, error: userStoriesError } = await supabase
        .from('features')
        .select('*');

      if (userStoriesError) {
        console.error('Erreur Supabase (User Stories):', userStoriesError);
        throw new Error(`Erreur Supabase: ${userStoriesError.message}`);
      }
      setUserStories(userStoriesData || []);

      // Récupérer les exigences (avec feature_id au lieu de userstory_id)
      const { data: exigencesData, error: exigencesError } = await supabase
        .from('exigences')
        .select('id, titre, feature_id');

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
        .from('epics')
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

  // Créer une nouvelle User Story
  const handleCreateUserStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!newUserStory.titre) {
        throw new Error('Le titre est obligatoire');
      }

      if (!newUserStory.besoin_id) {
        throw new Error('Veuillez sélectionner un besoin');
      }

      const { data, error } = await supabase
        .from('features')
        .insert([{
          titre: newUserStory.titre,
          description: newUserStory.description,
          epic_id: newUserStory.besoin_id,
          priorite: newUserStory.priorite,
          statut: newUserStory.statut,
        }])
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après insertion');
      }

      setUserStories([...userStories, data[0]]);
      setNewUserStory({ titre: '', description: '', besoin_id: '', priorite: 'Moyenne', statut: 'À faire' });
      setSuccess('User Story ajoutée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la création de la User Story:', err);
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

      // Vérifier qu'il n'y a pas de User Stories associées
      const { data: associatedUserStories, error: checkError } = await supabase
        .from('features')
        .select('id')
        .eq('epic_id', id);

      if (checkError) {
        console.error('Erreur lors de la vérification des User Stories associées:', checkError);
        throw new Error(`Erreur Supabase: ${checkError.message}`);
      }

      if (associatedUserStories && associatedUserStories.length > 0) {
        throw new Error('Impossible de supprimer ce besoin : des User Stories y sont associées. Supprimez d\'abord les User Stories liées.');
      }

      const { error } = await supabase
        .from('epics')
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

  // Supprimer une User Story
  const handleDeleteUserStory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier qu'il n'y a pas d'exigences associées
      const { data: associatedExigences, error: checkError } = await supabase
        .from('exigences')
        .select('id')
        .eq('feature_id', id);

      if (checkError) {
        console.error('Erreur lors de la vérification des exigences associées:', checkError);
        throw new Error(`Erreur Supabase: ${checkError.message}`);
      }

      if (associatedExigences && associatedExigences.length > 0) {
        throw new Error('Impossible de supprimer cette User Story : des exigences y sont associées. Supprimez d\'abord les exigences liées.');
      }

      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      setUserStories(userStories.filter(us => us.id !== id));
      setSuccess('User Story supprimée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les User Stories par besoin
  const getUserStoriesForBesoin = (besoinId: string) => {
    return userStories.filter(us => us.besoin_id === besoinId);
  };

  // Filtrer les exigences par User Story
  const getExigencesForUserStory = (userStoryId: string) => {
    return exigences.filter(ex => ex.feature_id === userStoryId);
  };

  if (loading && besoins.length === 0) {
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
          Besoins
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos besoins et leurs User Stories associées.
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

      {/* Formulaire pour ajouter un besoin */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Créer un nouveau besoin
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Un <strong>besoin</strong> est une demande fonctionnelle qui regroupe plusieurs User Stories.
          Exemple : "Gestion des utilisateurs", "Intégration des paiements", etc.
        </p>
        <form onSubmit={handleCreateBesoin} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Titre *</label>
            <input
              type="text"
              value={newBesoin.titre}
              onChange={(e) => setNewBesoin({ ...newBesoin, titre: e.target.value })}
              placeholder="Ex: Gestion des utilisateurs"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Priorité</label>
            <select
              value={newBesoin.priorite}
              onChange={(e) => setNewBesoin({ ...newBesoin, priorite: e.target.value })}
              className="form-select"
            >
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>
          <div>
            <label className="form-label">Statut</label>
            <select
              value={newBesoin.statut}
              onChange={(e) => setNewBesoin({ ...newBesoin, statut: e.target.value })}
              className="form-select"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
          <div>
            <label className="form-label">Votre nom (optionnel)</label>
            <input
              type="text"
              value={newBesoin.createur}
              onChange={(e) => setNewBesoin({ ...newBesoin, createur: e.target.value })}
              placeholder="Ex: Jean Dupont (Product Owner)"
              className="form-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description *</label>
            <textarea
              value={newBesoin.description}
              onChange={(e) => setNewBesoin({ ...newBesoin, description: e.target.value })}
              placeholder="Décrivez le besoin : objectif, portée, bénéfices attendus..."
              className="form-textarea"
              rows={4}
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le besoin'}
            </button>
          </div>
        </form>
      </div>

      {/* Formulaire pour ajouter une User Story */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Ajouter une User Story à un besoin
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Une <strong>User Story</strong> est une exigence spécifique qui fait partie d'un besoin.
          Exemple : Pour le besoin "Gestion des utilisateurs", une User Story pourrait être "Authentification".
        </p>
        <form onSubmit={handleCreateUserStory} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Besoin *</label>
            <select
              value={newUserStory.besoin_id}
              onChange={(e) => setNewUserStory({ ...newUserStory, besoin_id: e.target.value })}
              className="form-select"
              required
            >
              <option value="">Sélectionnez un besoin</option>
              {besoins.map((besoin) => (
                <option key={besoin.id} value={besoin.id}>
                  {besoin.titre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Titre *</label>
            <input
              type="text"
              value={newUserStory.titre}
              onChange={(e) => setNewUserStory({ ...newUserStory, titre: e.target.value })}
              placeholder="Ex: Authentification"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Priorité</label>
            <select
              value={newUserStory.priorite}
              onChange={(e) => setNewUserStory({ ...newUserStory, priorite: e.target.value })}
              className="form-select"
            >
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>
          <div>
            <label className="form-label">Statut</label>
            <select
              value={newUserStory.statut}
              onChange={(e) => setNewUserStory({ ...newUserStory, statut: e.target.value })}
              className="form-select"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description</label>
            <textarea
              value={newUserStory.description}
              onChange={(e) => setNewUserStory({ ...newUserStory, description: e.target.value })}
              placeholder="Décrivez la User Story : fonctionnalités incluses, critères de succès..."
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading || !newUserStory.besoin_id}
              className="btn btn-primary"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter la User Story'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des besoins et User Stories */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Liste des besoins et User Stories
        </h2>
        {besoins.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">Aucun besoin trouvé.</p>
        ) : (
          <div className="space-y-6">
            {besoins.map((besoin) => {
              const userStoriesForBesoin = getUserStoriesForBesoin(besoin.id);
              return (
                <div key={besoin.id} className="border border-[rgba(var(--card-border-rgb),0.3)] rounded-lg p-4">
                  {/* En-tête du besoin */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgb(var(--primary-rgb))]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <h3 className="text-xl font-bold text-[rgb(var(--foreground-rgb))]">{besoin.titre}</h3>
                      </div>
                      <p className="text-sm text-[rgba(var(--secondary-rgb),0.7)]">
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
                      Supprimer besoin
                    </button>
                  </div>
                  
                  {/* Description du besoin */}
                  <p className="mb-4 text-[rgb(var(--foreground-rgb))]">{besoin.description}</p>

                  {/* Section des User Stories */}
                  <div className="mt-4 pt-4 border-t border-[rgba(var(--card-border-rgb),0.3)]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-medium text-[rgb(var(--secondary-rgb))]">
                        User Stories ({userStoriesForBesoin.length})
                      </h4>
                      <Link
                        href={`/exigences?feature_id=${besoin.id}`}
                        className="btn btn-secondary text-sm"
                      >
                        + Ajouter une User Story
                      </Link>
                    </div>
                    
                    {userStoriesForBesoin.length === 0 ? (
                      <p className="text-sm text-[rgba(var(--secondary-rgb),0.5)] italic mb-4">
                        Aucune User Story associée à ce besoin.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {userStoriesForBesoin.map((userStory) => {
                          const exigencesForUserStory = getExigencesForUserStory(userStory.id);
                          return (
                            <div key={userStory.id} className="border border-[rgba(var(--card-border-rgb),0.2)] rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-[rgb(var(--accent-rgb))]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                      />
                                    </svg>
                                    <h5 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))]">{userStory.titre}</h5>
                                  </div>
                                  <p className="text-sm text-[rgba(var(--secondary-rgb),0.7)]">
                                    Priorité: {userStory.priorite} | Statut: {userStory.statut}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    if (confirm('Êtes-vous sûr de vouloir supprimer cette User Story ?')) {
                                      handleDeleteUserStory(userStory.id);
                                    }
                                  }}
                                  disabled={loading}
                                  className="text-red-500 hover:underline disabled:opacity-50"
                                >
                                  Supprimer
                                </button>
                              </div>
                              
                              {/* Description de la User Story */}
                              {userStory.description && (
                                <p className="text-sm text-[rgba(var(--foreground-rgb),0.8)] mb-2">{userStory.description}</p>
                              )}

                              {/* Section des exigences */}
                              <div className="mt-3 pt-3 border-t border-[rgba(var(--card-border-rgb),0.2)]">
                                <div className="flex justify-between items-center mb-1">
                                  <h6 className="text-sm font-medium text-[rgba(var(--secondary-rgb),0.8)]">
                                    Exigences ({exigencesForUserStory.length})
                                  </h6>
                                  <Link
                                    href={`/exigences?feature_id=${userStory.id}`}
                                    className="btn btn-secondary text-xs"
                                  >
                                    + Ajouter une exigence
                                  </Link>
                                </div>
                                
                                {exigencesForUserStory.length === 0 ? (
                                  <p className="text-xs text-[rgba(var(--secondary-rgb),0.5)] italic">
                                    Aucune exigence associée à cette User Story.
                                  </p>
                                ) : (
                                  <ul className="list-disc list-inside space-y-1 mt-1">
                                    {exigencesForUserStory.map((exigence) => (
                                      <li key={exigence.id} className="text-sm text-[rgb(var(--foreground-rgb))]">
                                        <Link
                                          href={`/exigences/${exigence.id}`}
                                          className="link"
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

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
  feature_id: string | null;
  created_at: string;
};

type UserStory = {
  id: string;
  titre: string;
  epic_id: string;
};

type Besoin = {
  id: string;
  titre: string;
};

export default function ExigencesPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userStoryIdFromUrl = searchParams.get('feature_id');

  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
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
    feature_id: userStoryIdFromUrl || '',
  });

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, [userStoryIdFromUrl]);

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

      // Récupérer les User Stories
      const { data: userStoriesData, error: userStoriesError } = await supabase
        .from('features')
        .select('id, titre, epic_id');

      if (userStoriesError) {
        console.error('Erreur Supabase (User Stories):', userStoriesError);
        throw new Error(`Erreur Supabase: ${userStoriesError.message}`);
      }
      setUserStories(userStoriesData || []);

      // Récupérer les besoins
      const { data: besoinsData, error: besoinsError } = await supabase
        .from('epics')
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

      // Si une User Story est sélectionnée, l'associer à l'exigence
      const exigenceToInsert = {
        titre: newExigence.titre,
        description: newExigence.description,
        priorite: newExigence.priorite,
        statut: newExigence.statut,
        feature_id: newExigence.feature_id || null,
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
      setNewExigence({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', feature_id: userStoryIdFromUrl || '' });
      setSuccess('Exigence ajoutée avec succès !');
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
      setSuccess('Exigence mise à jour avec succès !');
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
      setSuccess('Exigence supprimée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les exigences par User Story si une userStory_id est sélectionnée
  const filteredExigences = userStoryIdFromUrl 
    ? exigences.filter(ex => ex.feature_id === userStoryIdFromUrl)
    : exigences;

  // Trouver la User Story sélectionnée
  const selectedUserStory = userStories.find(us => us.id === userStoryIdFromUrl);
  const selectedBesoin = selectedUserStory ? besoins.find(b => b.id === selectedUserStory.epic_id) : null;

  if (loading && exigences.length === 0) {
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
          {selectedUserStory 
            ? `Exigences pour: ${selectedBesoin?.titre} → ${selectedUserStory.titre}` 
            : 'Gestion des Exigences'}
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos exigences et associez-les aux User Stories correspondantes.
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

      {/* Formulaire pour ajouter une exigence */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          {selectedUserStory ? 'Ajouter une exigence pour cette User Story' : 'Ajouter une exigence'}
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Une <strong>exigence</strong> est une spécification technique détaillée.
        </p>
        <form onSubmit={handleCreateExigence} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Titre *</label>
            <input
              type="text"
              value={newExigence.titre}
              onChange={(e) => setNewExigence({ ...newExigence, titre: e.target.value })}
              placeholder="Ex: Le système doit valider le format de l'email"
              className="form-input"
              required
            />
          </div>
          {!selectedUserStory && (
            <div>
              <label className="form-label">User Story associée (optionnel)</label>
              <select
                value={newExigence.feature_id}
                onChange={(e) => setNewExigence({ ...newExigence, feature_id: e.target.value })}
                className="form-select"
              >
                <option value="">Aucune User Story associée</option>
                {userStories.map((userStory) => {
                  const besoin = besoins.find(b => b.id === userStory.epic_id);
                  return (
                    <option key={userStory.id} value={userStory.id}>
                      {besoin?.titre} → {userStory.titre}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div>
            <label className="form-label">Priorité</label>
            <select
              value={newExigence.priorite}
              onChange={(e) => setNewExigence({ ...newExigence, priorite: e.target.value })}
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
              value={newExigence.statut}
              onChange={(e) => setNewExigence({ ...newExigence, statut: e.target.value })}
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
              value={newExigence.description}
              onChange={(e) => setNewExigence({ ...newExigence, description: e.target.value })}
              placeholder="Décrivez l'exigence en détail : critères techniques, contraintes, etc."
              className="form-textarea"
              rows={4}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter l\'exigence'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des exigences */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Liste des exigences
          {selectedUserStory && ` associées à "${selectedBesoin?.titre} → ${selectedUserStory.titre}"`}
        </h2>
        {filteredExigences.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            {selectedUserStory 
              ? 'Aucune exigence associée à cette User Story.' 
              : 'Aucune exigence trouvée.'}
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>User Story associée</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExigences.map((exigence) => {
                  const userStoryAssociee = userStories.find(us => us.id === exigence.feature_id);
                  const besoinAssocie = userStoryAssociee ? besoins.find(b => b.id === userStoryAssociee.epic_id) : null;
                  
                  return (
                    <tr key={exigence.id}>
                      <td>
                        <Link
                          href={`/exigences/${exigence.id}`}
                          className="link"
                        >
                          {exigence.titre.length > 60 
                            ? `${exigence.titre.substring(0, 60)}...` 
                            : exigence.titre}
                        </Link>
                      </td>
                      <td>
                        {userStoryAssociee && besoinAssocie ? (
                          <Link
                            href={`/epics#${besoinAssocie.id}`}
                            className="link"
                          >
                            {besoinAssocie.titre} → {userStoryAssociee.titre}
                          </Link>
                        ) : (
                          <span className="text-[rgba(var(--secondary-rgb),0.5)]">Aucune</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${exigence.priorite === 'Haute' ? 'badge-danger' : exigence.priorite === 'Moyenne' ? 'badge-warning' : 'badge-secondary'}`}>
                          {exigence.priorite}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${exigence.statut === 'Terminé' ? 'badge-success' : exigence.statut === 'En cours' ? 'badge-warning' : 'badge-secondary'}`}>
                          {exigence.statut}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <button
                          onClick={() => {
                            const updatedTitre = prompt('Nouveau titre:', exigence.titre);
                            if (updatedTitre) {
                              handleUpdateExigence(exigence.id, { titre: updatedTitre });
                            }
                          }}
                          disabled={loading}
                          className="link text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette exigence ?')) {
                              handleDeleteExigence(exigence.id);
                            }
                          }}
                          disabled={loading}
                          className="text-red-500 hover:underline disabled:opacity-50 text-sm"
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

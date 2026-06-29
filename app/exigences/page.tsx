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

type Feature = {
  id: string;
  titre: string;
  epic_id: string;
};

type Epic = {
  id: string;
  titre: string;
};

export default function ExigencesPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const featureIdFromUrl = searchParams.get('feature_id');

  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulaire pour les User Stories
  const [newExigence, setNewExigence] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
    feature_id: featureIdFromUrl || '',
  });

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, [featureIdFromUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les User Stories (exigences)
      const { data: exigencesData, error: exigencesError } = await supabase
        .from('exigences')
        .select('*')
        .order('created_at', { ascending: false });

      if (exigencesError) {
        console.error('Erreur Supabase (exigences):', exigencesError);
        throw new Error(`Erreur Supabase: ${exigencesError.message}`);
      }
      setExigences(exigencesData || []);

      // Récupérer les FEATURES
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('id, titre, epic_id');

      if (featuresError) {
        console.error('Erreur Supabase (FEATURES):', featuresError);
        throw new Error(`Erreur Supabase: ${featuresError.message}`);
      }
      setFeatures(featuresData || []);

      // Récupérer les EPICs
      const { data: epicsData, error: epicsError } = await supabase
        .from('epics')
        .select('id, titre');

      if (epicsError) {
        console.error('Erreur Supabase (EPICs):', epicsError);
        throw new Error(`Erreur Supabase: ${epicsError.message}`);
      }
      setEpics(epicsData || []);

    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle User Story
  const handleCreateExigence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!newExigence.titre) {
        throw new Error('Le titre est obligatoire');
      }

      // Si une FEATURE est sélectionnée, l'associer à la User Story
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
      setNewExigence({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', feature_id: featureIdFromUrl || '' });
      setSuccess('User Story ajoutée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la création de la User Story:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une User Story
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

  // Supprimer une User Story
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

  // Filtrer les User Stories par FEATURE si une feature_id est sélectionnée
  const filteredExigences = featureIdFromUrl 
    ? exigences.filter(ex => ex.feature_id === featureIdFromUrl)
    : exigences;

  // Trouver la FEATURE sélectionnée
  const selectedFeature = features.find(f => f.id === featureIdFromUrl);
  const selectedEpic = selectedFeature ? epics.find(e => e.id === selectedFeature.epic_id) : null;

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
          {selectedFeature 
            ? `User Stories pour: ${selectedEpic?.titre} → ${selectedFeature.titre}` 
            : 'Gestion des User Stories'}
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos User Stories (exigences) et associez-les aux FEATURES correspondantes.
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

      {/* Formulaire pour ajouter une User Story */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          {selectedFeature ? 'Ajouter une User Story pour cette FEATURE' : 'Ajouter une User Story'}
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Une <strong>User Story</strong> suit le format : 
          <code className="bg-[rgba(var(--background-start-rgb),0.2)] p-1 rounded">
            "En tant que [rôle], je veux [fonctionnalité] afin de [bénéfice]."
          </code>
        </p>
        <form onSubmit={handleCreateExigence} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Titre *</label>
            <input
              type="text"
              value={newExigence.titre}
              onChange={(e) => setNewExigence({ ...newExigence, titre: e.target.value })}
              placeholder="Ex: En tant qu'utilisateur, je veux me connecter afin d'accéder à mon compte"
              className="form-input"
              required
            />
          </div>
          {!selectedFeature && (
            <div>
              <label className="form-label">FEATURE associée (optionnel)</label>
              <select
                value={newExigence.feature_id}
                onChange={(e) => setNewExigence({ ...newExigence, feature_id: e.target.value })}
                className="form-select"
              >
                <option value="">Aucune FEATURE associée</option>
                {features.map((feature) => {
                  const epic = epics.find(e => e.id === feature.epic_id);
                  return (
                    <option key={feature.id} value={feature.id}>
                      {epic?.titre} → {feature.titre}
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
              placeholder="Décrivez la User Story en détail : critères d'acceptation, exemples, etc."
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
              {loading ? 'Ajout en cours...' : 'Ajouter la User Story'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des User Stories */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Liste des User Stories
          {selectedFeature && ` associées à "${selectedEpic?.titre} → ${selectedFeature.titre}"`}
        </h2>
        {filteredExigences.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            {selectedFeature 
              ? 'Aucune User Story associée à cette FEATURE.' 
              : 'Aucune User Story trouvée.'}
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>FEATURE associée</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExigences.map((exigence) => {
                  const featureAssociee = features.find(f => f.id === exigence.feature_id);
                  const epicAssocie = featureAssociee ? epics.find(e => e.id === featureAssociee.epic_id) : null;
                  
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
                        {featureAssociee && epicAssocie ? (
                          <Link
                            href={`/epics#${epicAssocie.id}`}
                            className="link"
                          >
                            {epicAssocie.titre} → {featureAssociee.titre}
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
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette User Story ?')) {
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

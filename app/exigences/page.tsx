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

type Besoin = {
  id: string;
  titre: string;
};

// Recommandations IREB pour les exigences
const getIREBRecommendations = (exigence: Exigence): { titre: string; description: string; conseils: string[] } => {
  const conseils: string[] = [];
  let titreAmeliore = exigence.titre;
  let descriptionAmelioree = exigence.description;

  // 1. Vérifier que le titre est clair et concis
  if (!exigence.titre || exigence.titre.length < 10) {
    conseils.push("Le titre doit être plus descriptif et concis (10-50 caractères).");
    titreAmeliore = `En tant que [rôle], je veux [action] afin de [bénéfice].`;
  }

  // 2. Vérifier que la description contient des critères d'acceptation
  if (!exigence.description || !exigence.description.includes("Critères d'acceptation") && 
      !exigence.description.includes("Doit") && !exigence.description.includes("Doit pouvoir")) {
    conseils.push("Ajoutez des critères d'acceptation clairs. Exemple: 'Le système doit valider que...'");
    descriptionAmelioree = `${exigence.description || ''} \n\nCritères d'acceptation:\n- [ ] Critère 1\n- [ ] Critère 2`;
  }

  // 3. Vérifier la complétude (qui, quoi, pourquoi)
  if (!exigence.titre.match(/en tant que/i) && !exigence.description.match(/en tant que/i)) {
    conseils.push("Utilisez le format standard: 'En tant que [rôle], je veux [fonctionnalité] afin de [bénéfice].'");
  }

  // 4. Vérifier l'unicité et l'atomicité
  if (exigence.titre.includes("et") || exigence.titre.includes(",")) {
    conseils.push("Une exigence doit être atomique (une seule fonctionnalité par exigence). Divisez-la si nécessaire.");
  }

  // 5. Vérifier la testabilité
  if (!exigence.description || !exigence.description.match(/mesurable|vérifiable|testable/i)) {
    conseils.push("L'exigence doit être testable. Ajoutez: 'Le système doit permettre de vérifier que...'");
  }

  // 6. Vérifier l'absence d'ambiguïté
  if (exigence.titre.includes("peut-être") || exigence.titre.includes("si possible") || 
      exigence.description.includes("peut-être") || exigence.description.includes("si possible")) {
    conseils.push("Évitez les termes ambigus comme 'peut-être' ou 'si possible'. Soyez précis.");
  }

  // 7. Conseils généraux IREB
  conseils.push("Conseil IREB: Une bonne exigence doit être SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporelle).");

  return {
    titre: titreAmeliore,
    description: descriptionAmelioree,
    conseils: conseils.length > 0 ? conseils : ["Cette exigence semble bien formulée selon les standards IREB."]
  };
};

export default function ExigencesPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const featureIdFromUrl = searchParams.get('feature_id');

  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la modale d'amélioration
  const [showImprovementModal, setShowImprovementModal] = useState(false);
  const [selectedExigenceForImprovement, setSelectedExigenceForImprovement] = useState<Exigence | null>(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState<{ titre: string; description: string; conseils: string[] } | null>(null);

  // Formulaire pour les exigences
  const [newExigence, setNewExigence] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
    feature_id: featureIdFromUrl || null,
  });

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, [featureIdFromUrl]);

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

      // Récupérer les FEATURES
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('id, titre, epic_id');

      if (featuresError) {
        console.error('Erreur Supabase (FEATURES):', featuresError);
        throw new Error(`Erreur Supabase: ${featuresError.message}`);
      }
      setFeatures(featuresData || []);

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

      const exigenceToInsert = {
        titre: newExigence.titre,
        description: newExigence.description,
        priorite: newExigence.priorite,
        statut: newExigence.statut,
        feature_id: newExigence.feature_id,
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
      setNewExigence({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', feature_id: featureIdFromUrl || null });
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

  // Ouvrir la modale d'amélioration pour une exigence
  const handleImproveExigence = (exigence: Exigence) => {
    setSelectedExigenceForImprovement(exigence);
    const suggestions = getIREBRecommendations(exigence);
    setImprovementSuggestions(suggestions);
    setShowImprovementModal(true);
  };

  // Appliquer les améliorations suggérées
  const handleApplyImprovements = async () => {
    if (!selectedExigenceForImprovement || !improvementSuggestions) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('exigences')
        .update({
          titre: improvementSuggestions.titre,
          description: improvementSuggestions.description,
        })
        .eq('id', selectedExigenceForImprovement.id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      // Mettre à jour localement
      setExigences(exigences.map(ex => 
        ex.id === selectedExigenceForImprovement.id 
          ? { ...ex, titre: improvementSuggestions.titre, description: improvementSuggestions.description }
          : ex
      ));
      
      setShowImprovementModal(false);
      setSuccess('Exigence améliorée avec succès selon les recommandations IREB !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de l\'application des améliorations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de l\'amélioration');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les exigences par FEATURE si une feature_id est sélectionnée
  const filteredExigences = featureIdFromUrl 
    ? exigences.filter(ex => ex.feature_id === featureIdFromUrl)
    : exigences;

  // Trouver la FEATURE sélectionnée
  const selectedFeature = features.find(f => f.id === featureIdFromUrl);
  const selectedBesoin = selectedFeature ? besoins.find(b => b.id === selectedFeature.epic_id) : null;

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
            ? `Exigences pour: ${selectedBesoin?.titre} → ${selectedFeature.titre}` 
            : 'Gestion des Exigences'}
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos exigences et associez-les aux FEATURES correspondantes.
          <span className="ml-2 text-[rgba(var(--primary-rgb),0.7)]">
            🤖 Utilisez l'IA pour améliorer vos exigences selon les standards IREB.
          </span>
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
          {selectedFeature ? 'Ajouter une exigence pour cette FEATURE' : 'Ajouter une exigence'}
        </h2>
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
          {!selectedFeature && (
            <div>
              <label className="form-label">FEATURE associée (optionnel)</label>
              <select
                value={newExigence.feature_id || ''}
                onChange={(e) => setNewExigence({ ...newExigence, feature_id: e.target.value || null })}
                className="form-select"
              >
                <option value="">Aucune FEATURE associée</option>
                {features.map((feature) => {
                  const besoin = besoins.find(b => b.id === feature.epic_id);
                  return (
                    <option key={feature.id} value={feature.id}>
                      {besoin?.titre} → {feature.titre}
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
          {selectedFeature && ` associées à "${selectedBesoin?.titre} → ${selectedFeature.titre}"`}
        </h2>
        {filteredExigences.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            {selectedFeature 
              ? 'Aucune exigence associée à cette FEATURE.' 
              : 'Aucune exigence trouvée.'}
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
                  const besoinAssocie = featureAssociee ? besoins.find(b => b.id === featureAssociee.epic_id) : null;
                  
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
                        {featureAssociee && besoinAssocie ? (
                          <Link
                            href={`/epics#${besoinAssocie.id}`}
                            className="link"
                          >
                            {besoinAssocie.titre} → {featureAssociee.titre}
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
                          onClick={() => handleImproveExigence(exigence)}
                          disabled={loading}
                          className="text-[rgb(var(--primary-rgb))] hover:underline text-sm flex items-center gap-1"
                          title="Améliorer avec l'IA selon les recommandations IREB"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Améliorer
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

      {/* Modale d'amélioration avec IA (IREB) */}
      {showImprovementModal && selectedExigenceForImprovement && improvementSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[rgb(var(--primary-rgb))]">
                🤖 Amélioration de l'exigence avec l'IA (IREB)
              </h2>
              <button
                onClick={() => setShowImprovementModal(false)}
                className="text-[rgb(var(--secondary-rgb))] hover:text-[rgb(var(--foreground-rgb))] text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-[rgb(var(--secondary-rgb))] mb-2">Exigence actuelle :</h3>
              <div className="bg-[rgba(var(--background-start-rgb),0.1)] p-4 rounded-lg mb-4">
                <p className="font-medium text-[rgb(var(--foreground-rgb))]">{selectedExigenceForImprovement.titre}</p>
                {selectedExigenceForImprovement.description && (
                  <p className="text-[rgba(var(--secondary-rgb),0.8)] mt-2">{selectedExigenceForImprovement.description}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-[rgb(var(--secondary-rgb))] mb-2">Suggestions d'amélioration :</h3>
              <div className="bg-[rgba(var(--accent-rgb),0.1)] p-4 rounded-lg mb-4">
                <p className="font-medium text-[rgb(var(--accent-rgb))]">Titre amélioré :</p>
                <p className="text-[rgb(var(--foreground-rgb))] mt-1">{improvementSuggestions.titre}</p>
              </div>
              
              <div className="bg-[rgba(var(--primary-rgb),0.1)] p-4 rounded-lg mb-4">
                <p className="font-medium text-[rgb(var(--primary-rgb))]">Description améliorée :</p>
                <p className="text-[rgb(var(--foreground-rgb))] mt-1 whitespace-pre-wrap">{improvementSuggestions.description}</p>
              </div>

              <div className="bg-[rgba(var(--warning-rgb),0.1)] p-4 rounded-lg">
                <p className="font-medium text-[rgb(var(--warning-rgb))]">Recommandations IREB :</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[rgb(var(--foreground-rgb))]">
                  {improvementSuggestions.conseils.map((conseil, index) => (
                    <li key={index}>{conseil}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImprovementModal(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyImprovements}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Application en cours...' : 'Appliquer les améliorations'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

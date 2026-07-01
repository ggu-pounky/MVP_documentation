'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type UserStory = {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  epic_id: string | null;
  created_at: string;
};

type Epic = {
  id: string;
  titre: string;
  besoin_id: string;
};

type Besoin = {
  id: string;
  titre: string;
};

// Recommandations IREB pour les USER STORIES
const getIREBRecommendations = (userStory: UserStory): { titre: string; description: string; conseils: string[] } => {
  const conseils: string[] = [];
  let titreAmeliore = userStory.titre;
  let descriptionAmelioree = userStory.description;

  // 1. Vérifier que le titre est clair et concis
  if (!userStory.titre || userStory.titre.length < 10) {
    conseils.push("Le titre doit être plus descriptif et concis (10-50 caractères).");
    titreAmeliore = `En tant que [rôle], je veux [action] afin de [bénéfice].`;
  }

  // 2. Vérifier que la description contient des critères d'acceptation
  if (!userStory.description || !userStory.description.includes("Critères d'acceptation") && 
      !userStory.description.includes("Doit") && !userStory.description.includes("Doit pouvoir")) {
    conseils.push("Ajoutez des critères d'acceptation clairs. Exemple: 'Le système doit valider que...'");
    descriptionAmelioree = `${userStory.description || ''} \n\nCritères d'acceptation:\n- [ ] Critère 1\n- [ ] Critère 2`;
  }

  // 3. Vérifier la complétude (qui, quoi, pourquoi)
  if (!userStory.titre.match(/en tant que/i) && !userStory.description.match(/en tant que/i)) {
    conseils.push("Utilisez le format standard: 'En tant que [rôle], je veux [fonctionnalité] afin de [bénéfice].'");
  }

  // 4. Vérifier l'unicité et l'atomicité
  if (userStory.titre.includes("et") || userStory.titre.includes(",")) {
    conseils.push("Une USER STORY doit être atomique (une seule fonctionnalité par USER STORY). Divisez-la si nécessaire.");
  }

  // 5. Vérifier la testabilité
  if (!userStory.description || !userStory.description.match(/mesurable|vérifiable|testable/i)) {
    conseils.push("La USER STORY doit être testable. Ajoutez: 'Le système doit permettre de vérifier que...'");
  }

  // 6. Vérifier l'absence d'ambiguïté
  if (userStory.titre.includes("peut-être") || userStory.titre.includes("si possible") || 
      userStory.description.includes("peut-être") || userStory.description.includes("si possible")) {
    conseils.push("Évitez les termes ambigus comme 'peut-être' ou 'si possible'. Soyez précis.");
  }

  // 7. Conseils généraux IREB
  conseils.push("Conseil IREB: Une bonne USER STORY doit être SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporelle).");

  return {
    titre: titreAmeliore,
    description: descriptionAmelioree,
    conseils: conseils.length > 0 ? conseils : ["Cette USER STORY semble bien formulée selon les standards IREB."]
  };
};

// Suggestions IA pour les USER STORIES
const getAISuggestions = (context: string): { titre: string; description: string }[] => {
  // Simuler des suggestions IA basées sur le contexte
  const suggestions = [
    {
      titre: `En tant qu'utilisateur, je veux ${context.includes('authentification') ? 'me connecter avec mes identifiants' : context.includes('paiement') ? 'effectuer un paiement sécurisé' : 'accéder à la fonctionnalité principale'} afin de ${context.includes('authentification') ? 'accéder à mon compte' : context.includes('paiement') ? 'finaliser mon achat' : 'utiliser l\'application'}`,
      description: `Critères d'acceptation:\n- [ ] Le système doit valider les informations saisies\n- [ ] Le système doit afficher un message de confirmation\n- [ ] Le système doit gérer les erreurs de manière appropriée`
    },
    {
      titre: `En tant qu'administrateur, je veux ${context.includes('gestion') ? 'gérer les utilisateurs' : 'configurer les paramètres'} afin de ${context.includes('gestion') ? 'maintenir la sécurité' : 'personnaliser l\'expérience'}`,
      description: `Critères d'acceptation:\n- [ ] L'interface doit être intuitive\n- [ ] Les modifications doivent être sauvegardées automatiquement\n- [ ] Un historique des changements doit être disponible`
    },
    {
      titre: `En tant que visiteur, je veux ${context.includes('recherche') ? 'trouver des informations rapidement' : 'naviguer facilement'} afin de ${context.includes('recherche') ? 'obtenir les résultats pertinents' : 'découvrir le contenu'}`,
      description: `Critères d'acceptation:\n- [ ] Le temps de réponse doit être inférieur à 2 secondes\n- [ ] Les résultats doivent être pertinents\n- [ ] L'interface doit être responsive`
    }
  ];
  return suggestions;
};

export default function UserStoriesPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const epicIdFromUrl = searchParams.get('epic_id');

  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la modale d'amélioration
  const [showImprovementModal, setShowImprovementModal] = useState(false);
  const [selectedUserStoryForImprovement, setSelectedUserStoryForImprovement] = useState<UserStory | null>(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState<{ titre: string; description: string; conseils: string[] } | null>(null);

  // État pour la modale de proposition IA
  const [showAISuggestionsModal, setShowAISuggestionsModal] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<{ titre: string; description: string; selected: boolean }[]>([]);

  // Formulaire pour les USER STORIES
  const [newUserStory, setNewUserStory] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'À faire',
    epic_id: epicIdFromUrl || null,
  });

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, [epicIdFromUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les USER STORIES
      const { data: userStoriesData, error: userStoriesError } = await supabase
        .from('user_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (userStoriesError) {
        console.error('Erreur Supabase (user_stories):', userStoriesError);
        throw new Error(`Erreur Supabase: ${userStoriesError.message}`);
      }
      setUserStories(userStoriesData || []);

      // Récupérer les EPICS
      const { data: epicsData, error: epicsError } = await supabase
        .from('epics')
        .select('id, titre, besoin_id');

      if (epicsError) {
        console.error('Erreur Supabase (EPICS):', epicsError);
        throw new Error(`Erreur Supabase: ${epicsError.message}`);
      }
      setEpics(epicsData || []);

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

  // Créer une nouvelle USER STORY
  const handleCreateUserStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!newUserStory.titre) {
        throw new Error('Le titre est obligatoire');
      }

      const userStoryToInsert = {
        titre: newUserStory.titre,
        description: newUserStory.description,
        priorite: newUserStory.priorite,
        statut: newUserStory.statut,
        epic_id: newUserStory.epic_id,
      };

      const { data, error } = await supabase
        .from('user_stories')
        .insert([userStoryToInsert])
        .select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après insertion');
      }

      setUserStories([...userStories, data[0]]);
      setNewUserStory({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', epic_id: epicIdFromUrl || null });
      setSuccess('USER STORY ajoutée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la création de la USER STORY:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une USER STORY
  const handleUpdateUserStory = async (id: string, updatedData: Partial<UserStory>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_stories')
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

      setUserStories(userStories.map(us => us.id === id ? data[0] : us));
      setSuccess('USER STORY mise à jour avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une USER STORY
  const handleDeleteUserStory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('user_stories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      setUserStories(userStories.filter(us => us.id !== id));
      setSuccess('USER STORY supprimée avec succès !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir la modale d'amélioration pour une USER STORY
  const handleImproveUserStory = (userStory: UserStory) => {
    setSelectedUserStoryForImprovement(userStory);
    const suggestions = getIREBRecommendations(userStory);
    setImprovementSuggestions(suggestions);
    setShowImprovementModal(true);
  };

  // Appliquer les améliorations suggérées
  const handleApplyImprovements = async () => {
    if (!selectedUserStoryForImprovement || !improvementSuggestions) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_stories')
        .update({
          titre: improvementSuggestions.titre,
          description: improvementSuggestions.description,
        })
        .eq('id', selectedUserStoryForImprovement.id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      // Mettre à jour localement
      setUserStories(userStories.map(us => 
        us.id === selectedUserStoryForImprovement.id 
          ? { ...us, titre: improvementSuggestions.titre, description: improvementSuggestions.description }
          : us
      ));
      
      setShowImprovementModal(false);
      setSuccess('USER STORY améliorée avec succès selon les recommandations IREB !');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de l\'application des améliorations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de l\'amélioration');
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir la modale de proposition IA
  const handleOpenAISuggestions = () => {
    // Générer des suggestions IA basées sur le contexte
    const context = newUserStory.titre || 'USER STORY générale';
    const suggestions = getAISuggestions(context);
    setAISuggestions(suggestions.map(s => ({ ...s, selected: false })));
    setShowAISuggestionsModal(true);
  };

  // Appliquer les suggestions IA sélectionnées
  const handleApplyAISuggestions = async () => {
    const selectedSuggestions = aiSuggestions.filter(s => s.selected);
    
    if (selectedSuggestions.length === 0) {
      setError('Veuillez sélectionner au moins une suggestion');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Créer une USER STORY pour chaque suggestion sélectionnée
      for (const suggestion of selectedSuggestions) {
        const userStoryToInsert = {
          titre: suggestion.titre,
          description: suggestion.description,
          priorite: newUserStory.priorite,
          statut: newUserStory.statut,
          epic_id: newUserStory.epic_id,
        };

        const { data, error } = await supabase
          .from('user_stories')
          .insert([userStoryToInsert])
          .select();

        if (error) {
          console.error('Erreur Supabase:', error);
          throw new Error(`Erreur Supabase: ${error.message}`);
        }

        if (data && data.length > 0) {
          setUserStories([...userStories, data[0]]);
        }
      }

      setShowAISuggestionsModal(false);
      setNewUserStory({ titre: '', description: '', priorite: 'Moyenne', statut: 'À faire', epic_id: epicIdFromUrl || null });
      setSuccess(`${selectedSuggestions.length} USER STORY(s) ajoutée(s) avec succès à partir des suggestions IA !`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Erreur lors de l\'application des suggestions IA:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de l\'application des suggestions IA');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les USER STORIES par EPIC si un epic_id est sélectionné
  const filteredUserStories = epicIdFromUrl 
    ? userStories.filter(us => us.epic_id === epicIdFromUrl)
    : userStories;

  // Trouver l'EPIC sélectionné
  const selectedEpic = epics.find(e => e.id === epicIdFromUrl);
  const selectedBesoin = selectedEpic ? besoins.find(b => b.id === selectedEpic.besoin_id) : null;

  if (loading && userStories.length === 0) {
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
          {selectedEpic 
            ? `USER STORIES pour: ${selectedBesoin?.titre} → ${selectedEpic.titre}` 
            : 'Gestion des USER STORIES'}
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos USER STORIES et associez-les aux EPICS correspondants.
          <span className="ml-2 text-[rgba(var(--primary-rgb),0.7)]">
            🤖 Utilisez l'IA pour améliorer vos USER STORIES selon les standards IREB.
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

      {/* Formulaire pour ajouter une USER STORY */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          {selectedEpic ? 'Ajouter une USER STORY pour cet EPIC' : 'Ajouter une USER STORY'}
        </h2>
        <form onSubmit={handleCreateUserStory} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Titre *</label>
            <input
              type="text"
              value={newUserStory.titre}
              onChange={(e) => setNewUserStory({ ...newUserStory, titre: e.target.value })}
              placeholder="Ex: Le système doit valider le format de l'email"
              className="form-input"
              required
            />
          </div>
          {!selectedEpic && (
            <div>
              <label className="form-label">EPIC associé (optionnel)</label>
              <select
                value={newUserStory.epic_id || ''}
                onChange={(e) => setNewUserStory({ ...newUserStory, epic_id: e.target.value || null })}
                className="form-select"
              >
                <option value="">Aucun EPIC associé</option>
                {epics.map((epic) => {
                  const besoin = besoins.find(b => b.id === epic.besoin_id);
                  return (
                    <option key={epic.id} value={epic.id}>
                      {besoin?.titre} → {epic.titre}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
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
              placeholder="Décrivez la USER STORY en détail : critères techniques, contraintes, etc."
              className="form-textarea"
              rows={4}
            />
          </div>
          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter la USER STORY'}
            </button>
            <button
              type="button"
              onClick={handleOpenAISuggestions}
              disabled={loading}
              className="btn btn-secondary"
            >
              🤖 Proposition IA
            </button>
          </div>
        </form>
      </div>

      {/* Liste des USER STORIES */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
          Liste des USER STORIES
          {selectedEpic && ` associées à "${selectedBesoin?.titre} → ${selectedEpic.titre}"`}
        </h2>
        {filteredUserStories.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            {selectedEpic 
              ? 'Aucune USER STORY associée à cet EPIC.' 
              : 'Aucune USER STORY trouvée.'}
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>EPIC associé</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserStories.map((userStory) => {
                  const epicAssocie = epics.find(e => e.id === userStory.epic_id);
                  const besoinAssocie = epicAssocie ? besoins.find(b => b.id === epicAssocie.besoin_id) : null;
                  
                  return (
                    <tr key={userStory.id}>
                      <td>
                        <Link
                          href={`/user-stories/${userStory.id}`}
                          className="link"
                        >
                          {userStory.titre.length > 60 
                            ? `${userStory.titre.substring(0, 60)}...` 
                            : userStory.titre}
                        </Link>
                      </td>
                      <td>
                        {epicAssocie && besoinAssocie ? (
                          <Link
                            href={`/epics#${besoinAssocie.id}`}
                            className="link"
                          >
                            {besoinAssocie.titre} → {epicAssocie.titre}
                          </Link>
                        ) : (
                          <span className="text-[rgba(var(--secondary-rgb),0.5)]">Aucun</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${userStory.priorite === 'Haute' ? 'badge-danger' : userStory.priorite === 'Moyenne' ? 'badge-warning' : 'badge-secondary'}`}>
                          {userStory.priorite}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${userStory.statut === 'Terminé' ? 'badge-success' : userStory.statut === 'En cours' ? 'badge-warning' : 'badge-secondary'}`}>
                          {userStory.statut}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <button
                          onClick={() => {
                            const updatedTitre = prompt('Nouveau titre:', userStory.titre);
                            if (updatedTitre) {
                              handleUpdateUserStory(userStory.id, { titre: updatedTitre });
                            }
                          }}
                          disabled={loading}
                          className="link text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleImproveUserStory(userStory)}
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
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette USER STORY ?')) {
                              handleDeleteUserStory(userStory.id);
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
      {showImprovementModal && selectedUserStoryForImprovement && improvementSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[rgb(var(--primary-rgb))]">
                🤖 Amélioration de la USER STORY avec l'IA (IREB)
              </h2>
              <button
                onClick={() => setShowImprovementModal(false)}
                className="text-[rgb(var(--secondary-rgb))] hover:text-[rgb(var(--foreground-rgb))] text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-[rgb(var(--secondary-rgb))] mb-2">USER STORY actuelle :</h3>
              <div className="bg-[rgba(var(--background-start-rgb),0.1)] p-4 rounded-lg mb-4">
                <p className="font-medium text-[rgb(var(--foreground-rgb))]">{selectedUserStoryForImprovement.titre}</p>
                {selectedUserStoryForImprovement.description && (
                  <p className="text-[rgba(var(--secondary-rgb),0.8)] mt-2">{selectedUserStoryForImprovement.description}</p>
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

      {/* Modale de proposition IA */}
      {showAISuggestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[rgb(var(--primary-rgb))]">
                🤖 Proposition IA pour USER STORIES
              </h2>
              <button
                onClick={() => setShowAISuggestionsModal(false)}
                className="text-[rgb(var(--secondary-rgb))] hover:text-[rgb(var(--foreground-rgb))] text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[rgba(var(--secondary-rgb),0.7)] mb-4">
                L'IA propose les USER STORIES suivantes. Cochez celles que vous souhaitez ajouter.
              </p>
              
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="border border-[rgba(var(--card-border-rgb),0.3)] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={suggestion.selected}
                        onChange={(e) => {
                          const updatedSuggestions = [...aiSuggestions];
                          updatedSuggestions[index].selected = e.target.checked;
                          setAISuggestions(updatedSuggestions);
                        }}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[rgb(var(--foreground-rgb))] mb-2">{suggestion.titre}</h4>
                        <p className="text-sm text-[rgba(var(--secondary-rgb),0.8)] whitespace-pre-wrap">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAISuggestionsModal(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyAISuggestions}
                disabled={loading || aiSuggestions.filter(s => s.selected).length === 0}
                className="btn btn-primary"
              >
                {loading ? 'Ajout en cours...' : `Ajouter ${aiSuggestions.filter(s => s.selected).length} USER STORY(s) sélectionnée(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

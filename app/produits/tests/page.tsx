'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { getSupabaseClient } from '@/lib/supabase';

type UserStory = {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  epic_id: string | null;
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

type TestCase = {
  id: string;
  titre: string;
  description: string;
  etapes: string[];
  resultatAttendu: string;
  user_story_id: string;
};

// Génération de tests basés sur une USER STORY
const generateTestCases = (userStory: UserStory): TestCase[] => {
  const testCases: TestCase[] = [];
  
  // 1. Test de validation positive
  if (userStory.titre.toLowerCase().includes('valider') || 
      userStory.titre.toLowerCase().includes('vérifier') ||
      userStory.description.toLowerCase().includes('valider')) {
    testCases.push({
      id: `test-${Date.now()}-1`,
      titre: `Test de validation positive pour: ${userStory.titre}`,
      description: `Vérifier que la fonctionnalité fonctionne correctement avec des entrées valides.`,
      etapes: [
        `1. Accéder à l'interface concernée`,
        `2. Saisir des données valides (ex: ${userStory.titre.includes('email') ? 'email@domaine.com' : 'valeur valide'})`,
        `3. Valider le formulaire`,
      ],
      resultatAttendu: `La fonctionnalité doit s'exécuter avec succès et afficher un message de confirmation.`,
      user_story_id: userStory.id,
    });
  }

  // 2. Test de validation négative
  if (userStory.titre.toLowerCase().includes('valider') || 
      userStory.titre.toLowerCase().includes('vérifier')) {
    testCases.push({
      id: `test-${Date.now()}-2`,
      titre: `Test de validation négative pour: ${userStory.titre}`,
      description: `Vérifier que la fonctionnalité gère correctement les entrées invalides.`,
      etapes: [
        `1. Accéder à l'interface concernée`,
        `2. Saisir des données invalides (ex: ${userStory.titre.includes('email') ? 'email-invalide' : 'valeur invalide'})`,
        `3. Valider le formulaire`,
      ],
      resultatAttendu: `Un message d'erreur clair doit être affiché et la fonctionnalité ne doit pas s'exécuter.`,
      user_story_id: userStory.id,
    });
  }

  // 3. Test de performance (si applicable)
  if (userStory.priorite === 'Haute') {
    testCases.push({
      id: `test-${Date.now()}-3`,
      titre: `Test de performance pour: ${userStory.titre}`,
      description: `Vérifier que la fonctionnalité répond dans un temps acceptable sous charge normale.`,
      etapes: [
        `1. Simuler une charge normale (ex: 100 utilisateurs simultanés)`,
        `2. Exécuter la fonctionnalité`,
        `3. Mesurer le temps de réponse`,
      ],
      resultatAttendu: `Le temps de réponse doit être inférieur à 2 secondes.`,
      user_story_id: userStory.id,
    });
  }

  // 4. Test de sécurité (si applicable)
  if (userStory.description.toLowerCase().includes('sécurité') || 
      userStory.description.toLowerCase().includes('authentification')) {
    testCases.push({
      id: `test-${Date.now()}-4`,
      titre: `Test de sécurité pour: ${userStory.titre}`,
      description: `Vérifier que la fonctionnalité est sécurisée contre les attaques courantes.`,
      etapes: [
        `1. Tenter une injection SQL (ex: ' OR '1'='1)`,
        `2. Tenter une attaque XSS (ex: <script>alert('test')</script>)`,
        `3. Vérifier les permissions d'accès`,
      ],
      resultatAttendu: `Aucune vulnérabilité ne doit être exploitée. Les données doivent rester sécurisées.`,
      user_story_id: userStory.id,
    });
  }

  // 5. Test d'accessibilité (si applicable)
  testCases.push({
    id: `test-${Date.now()}-5`,
    titre: `Test d'accessibilité pour: ${userStory.titre}`,
    description: `Vérifier que la fonctionnalité est accessible à tous les utilisateurs, y compris ceux utilisant des technologies d'assistance.`,
    etapes: [
      `1. Utiliser un lecteur d'écran (ex: NVDA, JAWS)`,
      `2. Naviguer avec le clavier uniquement`,
      `3. Vérifier les contrastes de couleurs`,
    ],
    resultatAttendu: `La fonctionnalité doit être entièrement accessible et conforme aux standards WCAG.`,
    user_story_id: userStory.id,
  });

  // Si aucun test n'a été généré, ajouter un test par défaut
  if (testCases.length === 0) {
    testCases.push({
      id: `test-${Date.now()}-default`,
      titre: `Test de base pour: ${userStory.titre}`,
      description: `Test de base pour vérifier le fonctionnement général de la fonctionnalité.`,
      etapes: [
        `1. Accéder à la fonctionnalité`,
        `2. Exécuter l'action principale`,
        `3. Vérifier le résultat`,
      ],
      resultatAttendu: `La fonctionnalité doit fonctionner comme attendu.`,
      user_story_id: userStory.id,
    });
  }

  return testCases;
};

export default function TestsPage() {
  const supabase = getSupabaseClient();
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la génération de tests
  const [selectedUserStory, setSelectedUserStory] = useState<UserStory | null>(null);
  const [generatedTests, setGeneratedTests] = useState<TestCase[]>([]);
  const [showTestsModal, setShowTestsModal] = useState(false);

  // Récupérer les données au chargement
  useEffect(() => {
    fetchData();
  }, []);

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

  // Générer des tests pour une USER STORY
  const handleGenerateTests = (userStory: UserStory) => {
    setSelectedUserStory(userStory);
    const tests = generateTestCases(userStory);
    setGeneratedTests(tests);
    setShowTestsModal(true);
  };

  // Formater le nom complet d'une USER STORY (Besoin → EPIC → USER STORY)
  const getUserStoryFullName = (userStory: UserStory) => {
    const epic = epics.find(e => e.id === userStory.epic_id);
    if (!epic) return userStory.titre;
    
    const besoin = besoins.find(b => b.id === epic.besoin_id);
    if (!besoin) return `${epic.titre} → ${userStory.titre}`;
    
    return `${besoin.titre} → ${epic.titre} → ${userStory.titre}`;
  };

  if (loading) {
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
          Génération de Tests
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Sélectionnez une USER STORY pour générer automatiquement des cas de test.
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

      {/* Sélecteur de USER STORY */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Sélectionner une USER STORY
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Choisissez une USER STORY dans la liste ci-dessous pour générer des cas de test adaptés.
        </p>
        
        {userStories.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            Aucune USER STORY trouvée. <Link href="/user-stories" className="text-[rgb(var(--primary-rgb))] underline">Ajoutez-en ici</Link>.
          </p>
        ) : (
          <div className="space-y-4">
            <select
              onChange={(e) => {
                const selectedUserStory = userStories.find(us => us.id === e.target.value);
                if (selectedUserStory) {
                  handleGenerateTests(selectedUserStory);
                }
              }}
              className="w-full p-3 rounded-lg bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionnez une USER STORY...
              </option>
              {userStories.map((userStory) => (
                <option key={userStory.id} value={userStory.id}>
                  {getUserStoryFullName(userStory)}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => {
                if (userStories.length > 0) {
                  handleGenerateTests(userStories[0]);
                }
              }}
              disabled={userStories.length === 0}
              className="btn btn-primary w-full"
            >
              Générer des tests pour la USER STORY sélectionnée
            </button>
          </div>
        )}
      </div>

      {/* Liste des USER STORIES avec bouton de génération rapide */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Liste des USER STORIES
        </h2>
        {userStories.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            Aucune USER STORY trouvée.
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>USER STORY</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userStories.map((userStory) => (
                  <tr key={userStory.id}>
                    <td>
                      <div className="font-medium">{getUserStoryFullName(userStory)}</div>
                      {userStory.description && (
                        <div className="text-sm text-[rgba(var(--secondary-rgb),0.7)] truncate max-w-xs">
                          {userStory.description.substring(0, 50)}{userStory.description.length > 50 ? '...' : ''}
                        </div>
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
                    <td>
                      <button
                        onClick={() => handleGenerateTests(userStory)}
                        className="btn btn-primary text-sm"
                      >
                        Générer des tests
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modale d'affichage des tests générés */}
      {showTestsModal && selectedUserStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[rgb(var(--primary-rgb))]">
                🧪 Tests générés pour: {getUserStoryFullName(selectedUserStory)}
              </h2>
              <button
                onClick={() => setShowTestsModal(false)}
                className="text-[rgb(var(--secondary-rgb))] hover:text-[rgb(var(--foreground-rgb))] text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-[rgb(var(--secondary-rgb))] mb-2">USER STORY source :</h3>
              <div className="bg-[rgba(var(--background-start-rgb),0.1)] p-4 rounded-lg">
                <p className="font-medium text-[rgb(var(--foreground-rgb))]">{selectedUserStory.titre}</p>
                {selectedUserStory.description && (
                  <p className="text-[rgba(var(--secondary-rgb),0.8)] mt-2">{selectedUserStory.description}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-[rgb(var(--secondary-rgb))] mb-4">
                Cas de test générés ({generatedTests.length})
              </h3>
              
              <div className="space-y-4">
                {generatedTests.map((testCase, index) => (
                  <div key={testCase.id} className="border border-[rgb(var(--card-border-rgb))] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-[rgb(var(--foreground-rgb))]">
                        Test {index + 1}: {testCase.titre}
                      </h4>
                      <span className="badge badge-primary">IREB</span>
                    </div>
                    
                    <p className="text-sm text-[rgba(var(--secondary-rgb),0.8)] mb-2">
                      {testCase.description}
                    </p>

                    <div className="mb-2">
                      <p className="text-sm font-medium text-[rgb(var(--secondary-rgb))] mb-1">Étapes :</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-[rgb(var(--foreground-rgb))]">
                        {testCase.etapes.map((etape, etapeIndex) => (
                          <li key={etapeIndex}>{etape}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-[rgba(var(--accent-rgb),0.1)] p-3 rounded-lg">
                      <p className="text-sm font-medium text-[rgb(var(--accent-rgb))] mb-1">Résultat attendu :</p>
                      <p className="text-sm text-[rgb(var(--foreground-rgb))]">{testCase.resultatAttendu}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  // Copier les tests dans le presse-papiers (optionnel)
                  const testsText = generatedTests.map((test, index) => 
                    `Test ${index + 1}: ${test.titre}\n` +
                    `Description: ${test.description}\n` +
                    `Étapes: ${test.etapes.join('\n  ')}\n` +
                    `Résultat attendu: ${test.resultatAttendu}\n\n`
                  ).join('\n');
                  navigator.clipboard.writeText(testsText);
                  setSuccess('Tests copiés dans le presse-papiers !');
                  setTimeout(() => setSuccess(null), 3000);
                }}
                className="btn btn-secondary"
              >
                Copier les tests
              </button>
              <button
                onClick={() => setShowTestsModal(false)}
                className="btn btn-primary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

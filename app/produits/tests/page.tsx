'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

type Exigence = {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  feature_id: string | null;
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

type TestCase = {
  id: string;
  titre: string;
  description: string;
  etapes: string[];
  resultatAttendu: string;
  exigence_id: string;
};

// Génération de tests basés sur une exigence
const generateTestCases = (exigence: Exigence): TestCase[] => {
  const testCases: TestCase[] = [];
  
  // 1. Test de validation positive
  if (exigence.titre.toLowerCase().includes('valider') || 
      exigence.titre.toLowerCase().includes('vérifier') ||
      exigence.description.toLowerCase().includes('valider')) {
    testCases.push({
      id: `test-${Date.now()}-1`,
      titre: `Test de validation positive pour: ${exigence.titre}`,
      description: `Vérifier que la fonctionnalité fonctionne correctement avec des entrées valides.`,
      etapes: [
        `1. Accéder à l'interface concernée`,
        `2. Saisir des données valides (ex: ${exigence.titre.includes('email') ? 'email@domaine.com' : 'valeur valide'})`,
        `3. Valider le formulaire`,
      ],
      resultatAttendu: `La fonctionnalité doit s'exécuter avec succès et afficher un message de confirmation.`,
      exigence_id: exigence.id,
    });
  }

  // 2. Test de validation négative
  if (exigence.titre.toLowerCase().includes('valider') || 
      exigence.titre.toLowerCase().includes('vérifier')) {
    testCases.push({
      id: `test-${Date.now()}-2`,
      titre: `Test de validation négative pour: ${exigence.titre}`,
      description: `Vérifier que la fonctionnalité gère correctement les entrées invalides.`,
      etapes: [
        `1. Accéder à l'interface concernée`,
        `2. Saisir des données invalides (ex: ${exigence.titre.includes('email') ? 'email-invalide' : 'valeur invalide'})`,
        `3. Valider le formulaire`,
      ],
      resultatAttendu: `Un message d'erreur clair doit être affiché et la fonctionnalité ne doit pas s'exécuter.`,
      exigence_id: exigence.id,
    });
  }

  // 3. Test de performance (si applicable)
  if (exigence.priorite === 'Haute') {
    testCases.push({
      id: `test-${Date.now()}-3`,
      titre: `Test de performance pour: ${exigence.titre}`,
      description: `Vérifier que la fonctionnalité répond dans un temps acceptable sous charge normale.`,
      etapes: [
        `1. Simuler une charge normale (ex: 100 utilisateurs simultanés)`,
        `2. Exécuter la fonctionnalité`,
        `3. Mesurer le temps de réponse`,
      ],
      resultatAttendu: `Le temps de réponse doit être inférieur à 2 secondes.`,
      exigence_id: exigence.id,
    });
  }

  // 4. Test de sécurité (si applicable)
  if (exigence.description.toLowerCase().includes('sécurité') || 
      exigence.description.toLowerCase().includes('authentification')) {
    testCases.push({
      id: `test-${Date.now()}-4`,
      titre: `Test de sécurité pour: ${exigence.titre}`,
      description: `Vérifier que la fonctionnalité est sécurisée contre les attaques courantes.`,
      etapes: [
        `1. Tenter une injection SQL (ex: ' OR '1'='1)`,
        `2. Tenter une attaque XSS (ex: <script>alert('test')</script>)`,
        `3. Vérifier les permissions d'accès`,
      ],
      resultatAttendu: `Aucune vulnérabilité ne doit être exploitée. Les données doivent rester sécurisées.`,
      exigence_id: exigence.id,
    });
  }

  // 5. Test d'accessibilité (si applicable)
  testCases.push({
    id: `test-${Date.now()}-5`,
    titre: `Test d'accessibilité pour: ${exigence.titre}`,
    description: `Vérifier que la fonctionnalité est accessible à tous les utilisateurs, y compris ceux utilisant des technologies d'assistance.`,
    etapes: [
      `1. Utiliser un lecteur d'écran (ex: NVDA, JAWS)`,
      `2. Naviguer avec le clavier uniquement`,
      `3. Vérifier les contrastes de couleurs`,
    ],
    resultatAttendu: `La fonctionnalité doit être entièrement accessible et conforme aux standards WCAG.`,
    exigence_id: exigence.id,
  });

  // Si aucun test n'a été généré, ajouter un test par défaut
  if (testCases.length === 0) {
    testCases.push({
      id: `test-${Date.now()}-default`,
      titre: `Test de base pour: ${exigence.titre}`,
      description: `Test de base pour vérifier le fonctionnement général de la fonctionnalité.`,
      etapes: [
        `1. Accéder à la fonctionnalité`,
        `2. Exécuter l'action principale`,
        `3. Vérifier le résultat`,
      ],
      resultatAttendu: `La fonctionnalité doit fonctionner comme attendu.`,
      exigence_id: exigence.id,
    });
  }

  return testCases;
};

export default function TestsPage() {
  const supabase = getSupabaseClient();
  const [exigences, setExigences] = useState<Exigence[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la génération de tests
  const [selectedExigence, setSelectedExigence] = useState<Exigence | null>(null);
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

  // Générer des tests pour une exigence
  const handleGenerateTests = (exigence: Exigence) => {
    setSelectedExigence(exigence);
    const tests = generateTestCases(exigence);
    setGeneratedTests(tests);
    setShowTestsModal(true);
  };

  // Formater le nom complet d'une exigence (Besoin → FEATURE → Exigence)
  const getExigenceFullName = (exigence: Exigence) => {
    const feature = features.find(f => f.id === exigence.feature_id);
    if (!feature) return exigence.titre;
    
    const besoin = besoins.find(b => b.id === feature.epic_id);
    if (!besoin) return `${feature.titre} → ${exigence.titre}`;
    
    return `${besoin.titre} → ${feature.titre} → ${exigence.titre}`;
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
          Sélectionnez une exigence pour générer automatiquement des cas de test.
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

      {/* Sélecteur d'exigence */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Sélectionner une exigence
        </h2>
        <p className="mb-4 text-[rgba(var(--secondary-rgb),0.7)]">
          Choisissez une exigence dans la liste ci-dessous pour générer des cas de test adaptés.
        </p>
        
        {exigences.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            Aucune exigence trouvée. <Link href="/exigences" className="text-[rgb(var(--primary-rgb))] underline">Ajoutez-en ici</Link>.
          </p>
        ) : (
          <div className="space-y-4">
            <select
              onChange={(e) => {
                const selectedExigence = exigences.find(ex => ex.id === e.target.value);
                if (selectedExigence) {
                  handleGenerateTests(selectedExigence);
                }
              }}
              className="w-full p-3 rounded-lg bg-[rgb(var(--background-start-rgb))] border border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]"
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionnez une exigence...
              </option>
              {exigences.map((exigence) => (
                <option key={exigence.id} value={exigence.id}>
                  {getExigenceFullName(exigence)}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => {
                if (exigences.length > 0) {
                  handleGenerateTests(exigences[0]);
                }
              }}
              disabled={exigences.length === 0}
              className="btn btn-primary w-full"
            >
              Générer des tests pour l'exigence sélectionnée
            </button>
          </div>
        )}
      </div>

      {/* Liste des exigences avec bouton de génération rapide */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
          Liste des exigences
        </h2>
        {exigences.length === 0 ? (
          <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
            Aucune exigence trouvée.
          </p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Exigence</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exigences.map((exigence) => (
                  <tr key={exigence.id}>
                    <td>
                      <div className="font-medium">{getExigenceFullName(exigence)}</div>
                      {exigence.description && (
                        <div className="text-sm text-[rgba(var(--secondary-rgb),0.7)] truncate max-w-xs">
                          {exigence.description.substring(0, 50)}{exigence.description.length > 50 ? '...' : ''}
                        </div>
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
                    <td>
                      <button
                        onClick={() => handleGenerateTests(exigence)}
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
      {showTestsModal && selectedExigence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[rgb(var(--primary-rgb))]">
                🧪 Tests générés pour: {getExigenceFullName(selectedExigence)}
              </h2>
              <button
                onClick={() => setShowTestsModal(false)}
                className="text-[rgb(var(--secondary-rgb))] hover:text-[rgb(var(--foreground-rgb))] text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-[rgb(var(--secondary-rgb))] mb-2">Exigence source :</h3>
              <div className="bg-[rgba(var(--background-start-rgb),0.1)] p-4 rounded-lg">
                <p className="font-medium text-[rgb(var(--foreground-rgb))]">{selectedExigence.titre}</p>
                {selectedExigence.description && (
                  <p className="text-[rgba(var(--secondary-rgb),0.8)] mt-2">{selectedExigence.description}</p>
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

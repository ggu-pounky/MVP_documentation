import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  const supabase = getSupabaseClient();

  // Récupérer les Besoins, FEATURES et Exigences depuis Supabase
  const { data: epics, error: epicsError } = await supabase
    .from('epics')
    .select('*')
    .order('date_creation', { ascending: false });

  const { data: features, error: featuresError } = await supabase
    .from('features')
    .select('*');

  const { data: exigences, error: exigencesError } = await supabase
    .from('exigences')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: parameters, error: parametersError } = await supabase
    .from('parameters')
    .select('*');

  if (epicsError || featuresError || exigencesError || parametersError) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
        <div className="text-red-500 text-xl mb-4">
          Erreur : {epicsError?.message || featuresError?.message || exigencesError?.message || parametersError?.message}
        </div>
      </div>
    );
  }

  // Compter les éléments
  const epicCount = epics?.length || 0;
  const featureCount = features?.length || 0;
  const userStoryCount = exigences?.length || 0;
  const parameterCount = parameters?.length || 0;

  // Calculer les KPIs par Besoin
  const epicsWithKPIs = epics?.map(epic => {
    const epicFeatures = features?.filter(f => f.epic_id === epic.id) || [];
    
    const featuresWithExigences = epicFeatures.map(feature => {
      const featureExigences = exigences?.filter(ex => ex.feature_id === feature.id) || [];
      
      // Compter les exigences par statut
      const exigencesByStatut = {
        'À faire': featureExigences.filter(ex => ex.statut === 'À faire').length,
        'En cours': featureExigences.filter(ex => ex.statut === 'En cours').length,
        'Terminé': featureExigences.filter(ex => ex.statut === 'Terminé').length,
      };
      
      const totalExigences = featureExigences.length;
      const avancement = totalExigences > 0 
        ? Math.round((exigencesByStatut['Terminé'] / totalExigences) * 100)
        : 0;
      
      return {
        feature,
        exigencesCount: totalExigences,
        exigencesByStatut,
        avancement
      };
    });
    
    // Calculer les totaux pour le besoin
    const totalFeatures = epicFeatures.length;
    const totalExigences = featuresWithExigences.reduce((sum, f) => sum + f.exigencesCount, 0);
    const totalExigencesTerminees = featuresWithExigences.reduce((sum, f) => sum + f.exigencesByStatut['Terminé'], 0);
    const totalExigencesEnCours = featuresWithExigences.reduce((sum, f) => sum + f.exigencesByStatut['En cours'], 0);
    const totalExigencesAFaire = featuresWithExigences.reduce((sum, f) => sum + f.exigencesByStatut['À faire'], 0);
    
    const avancementGlobal = totalExigences > 0 
      ? Math.round((totalExigencesTerminees / totalExigences) * 100)
      : 0;
    
    return {
      epic,
      totalFeatures,
      totalExigences,
      totalExigencesTerminees,
      totalExigencesEnCours,
      totalExigencesAFaire,
      avancementGlobal,
      features: featuresWithExigences
    };
  }) || [];

  // Calculer les totaux globaux
  const totalFeaturesAll = epicsWithKPIs.reduce((sum, e) => sum + e.totalFeatures, 0);
  const totalExigencesAll = epicsWithKPIs.reduce((sum, e) => sum + e.totalExigences, 0);
  const totalExigencesTermineesAll = epicsWithKPIs.reduce((sum, e) => sum + e.totalExigencesTerminees, 0);
  const avancementGlobalAll = totalExigencesAll > 0 
    ? Math.round((totalExigencesTermineesAll / totalExigencesAll) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-[rgb(var(--primary-rgb))]">
          Bienvenue dans Gestion Agile
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos projets avec la méthodologie Agile : Besoins, FEATURES et Exigences.
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Carte Besoins */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[rgba(var(--primary-rgb),0.1)] rounded-lg flex items-center justify-center">
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
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{epicCount}</h3>
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">Besoins</p>
            </div>
          </div>
          <Link
            href="/epics"
            className="btn btn-primary text-sm"
          >
            Voir les Besoins
          </Link>
        </div>

        {/* Carte FEATURES */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[rgba(var(--accent-rgb),0.1)] rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[rgb(var(--accent-rgb))]"
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
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{featureCount}</h3>
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">FEATURES</p>
            </div>
          </div>
          <Link
            href="/epics"
            className="btn btn-primary text-sm"
          >
            Voir les FEATURES
          </Link>
        </div>

        {/* Carte Exigences */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[rgba(var(--warning-rgb),0.1)] rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[rgb(var(--warning-rgb))]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{userStoryCount}</h3>
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">Exigences</p>
            </div>
          </div>
          <Link
            href="/exigences"
            className="btn btn-primary text-sm"
          >
            Voir les Exigences
          </Link>
        </div>

        {/* Carte Avancement Global */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[rgba(var(--success-rgb),0.1)] rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[rgb(var(--success-rgb))]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{avancementGlobalAll}%</h3>
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">Avancement Global</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-success">{totalExigencesTermineesAll} Terminées</span>
            <span className="badge badge-warning">{totalExigencesAll - totalExigencesTermineesAll} En cours/À faire</span>
          </div>
        </div>
      </div>

      {/* KPIs par Besoin - Avancement Fonctionnel */}
      {epicsWithKPIs.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[rgb(var(--secondary-rgb))]">
              Avancement Fonctionnel par Besoin
            </h2>
          </div>
          
          <div className="space-y-6">
            {epicsWithKPIs.map(({ epic, totalFeatures, totalExigences, totalExigencesTerminees, totalExigencesEnCours, totalExigencesAFaire, avancementGlobal, features }) => (
              <div key={epic.id} className="border border-[rgba(var(--border-rgb),0.2)] rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))] mb-1">
                      {epic.titre}
                    </h3>
                    <p className="text-sm text-[rgba(var(--secondary-rgb),0.7)]">
                      {epic.description.length > 100 
                        ? `${epic.description.substring(0, 100)}...` 
                        : epic.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`badge ${epic.priorite === 'Haute' ? 'badge-danger' : epic.priorite === 'Moyenne' ? 'badge-warning' : 'badge-secondary'}`}>
                      {epic.priorite}
                    </span>
                    <span className="badge badge-primary">{totalFeatures} Features</span>
                  </div>
                </div>
                
                {/* Barre de progression globale pour le besoin */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[rgba(var(--secondary-rgb),0.7)]">Avancement global</span>
                    <span className="font-medium text-[rgb(var(--foreground-rgb))]">{avancementGlobal}%</span>
                  </div>
                  <div className="w-full bg-[rgba(var(--border-rgb),0.2)] rounded-full h-2.5">
                    <div 
                      className="bg-[rgb(var(--success-rgb))] h-2.5 rounded-full"
                      style={{ width: `${avancementGlobal}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Détails des Features et Exigences */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map(({ feature, exigencesCount, exigencesByStatut, avancement }) => (
                    <div key={feature.id} className="card p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-[rgb(var(--foreground-rgb))] text-sm">
                          {feature.titre}
                        </h4>
                        <span className={`badge ${feature.priorite === 'Haute' ? 'badge-danger' : feature.priorite === 'Moyenne' ? 'badge-warning' : 'badge-secondary'} text-xs`}>
                          {feature.priorite}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[rgba(var(--secondary-rgb),0.7)]">Exigences:</span>
                          <span className="font-medium">{exigencesCount}</span>
                        </div>
                        
                        {exigencesByStatut['À faire'] > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[rgba(var(--danger-rgb),0.8)]">• À faire:</span>
                            <span className="font-medium">{exigencesByStatut['À faire']}</span>
                          </div>
                        )}
                        
                        {exigencesByStatut['En cours'] > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[rgba(var(--warning-rgb),0.8)]">• En cours:</span>
                            <span className="font-medium">{exigencesByStatut['En cours']}</span>
                          </div>
                        )}
                        
                        {exigencesByStatut['Terminé'] > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[rgba(var(--success-rgb),0.8)]">• Terminées:</span>
                            <span className="font-medium">{exigencesByStatut['Terminé']}</span>
                          </div>
                        )}
                      </div>
                      
                      {exigencesCount > 0 && (
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-[rgba(var(--secondary-rgb),0.7)]">Avancement:</span>
                          <span className="font-medium">{avancement}%</span>
                        </div>
                      )}
                      
                      {exigencesCount > 0 && (
                        <div className="w-full bg-[rgba(var(--border-rgb),0.2)] rounded-full h-1.5">
                          <div 
                            className="bg-[rgb(var(--success-rgb))] h-1.5 rounded-full"
                            style={{ width: `${avancement}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Résumé des exigences pour le besoin */}
                {totalExigences > 0 && (
                  <div className="mt-4 pt-4 border-t border-[rgba(var(--border-rgb),0.2)] flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[rgb(var(--success-rgb))] rounded-full"></div>
                      <span className="text-sm">{totalExigencesTerminees} Terminées</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[rgb(var(--warning-rgb))] rounded-full"></div>
                      <span className="text-sm">{totalExigencesEnCours} En cours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[rgb(var(--danger-rgb))] rounded-full"></div>
                      <span className="text-sm">{totalExigencesAFaire} À faire</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Derniers Besoins */}
      {epicCount > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[rgb(var(--secondary-rgb))]">
              Derniers Besoins
            </h2>
            <Link
              href="/epics"
              className="btn btn-primary text-sm"
            >
              Voir tous les Besoins
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {epics?.slice(0, 3).map((epic) => {
              const featuresForEpic = features?.filter(f => f.epic_id === epic.id) || [];
              const userStoriesForEpic = exigences?.filter(ex => 
                featuresForEpic.some(f => f.id === ex.feature_id)
              ) || [];
              
              return (
                <div key={epic.id} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[rgb(var(--primary-rgb))]"
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
                    <h3 className="font-semibold text-[rgb(var(--foreground-rgb))]">{epic.titre}</h3>
                  </div>
                  <p className="text-sm text-[rgba(var(--secondary-rgb),0.7)] mb-3">
                    {epic.description.length > 100 
                      ? `${epic.description.substring(0, 100)}...` 
                      : epic.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="badge badge-primary">{featuresForEpic.length} FEATURES</span>
                    <span className="badge badge-success">{userStoriesForEpic.length} Exigences</span>
                    <span className={`badge ${epic.priorite === 'Haute' ? 'badge-danger' : epic.priorite === 'Moyenne' ? 'badge-warning' : 'badge-secondary'}`}>
                      {epic.priorite}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={`/epics#${epic.id}`}
                      className="btn btn-secondary text-xs w-full"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Dernières Exigences */}
      {userStoryCount > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[rgb(var(--secondary-rgb))]">
              Dernières Exigences
            </h2>
            <Link
              href="/exigences"
              className="btn btn-primary text-sm"
            >
              Voir toutes les Exigences
            </Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>FEATURE</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {exigences?.slice(0, 5).map((exigence) => {
                  const feature = features?.find(f => f.id === exigence.feature_id);
                  const epic = feature ? epics?.find(e => e.id === feature.epic_id) : null;
                  
                  return (
                    <tr key={exigence.id}>
                      <td>
                        <Link
                          href={`/exigences/${exigence.id}`}
                          className="link"
                        >
                          {exigence.titre.length > 50 
                            ? `${exigence.titre.substring(0, 50)}...` 
                            : exigence.titre}
                        </Link>
                      </td>
                      <td>
                        {feature && epic ? (
                          <Link
                            href={`/epics#${epic.id}`}
                            className="link"
                          >
                            {epic.titre} → {feature.titre}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

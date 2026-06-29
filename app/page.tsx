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

      {/* Statistiques */}
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

        {/* Carte Paramètres */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[rgba(var(--danger-rgb),0.1)] rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[rgb(var(--danger-rgb))]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{parameterCount}</h3>
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">Paramètres</p>
            </div>
          </div>
          <Link
            href="/parameters"
            className="btn btn-primary text-sm"
          >
            Voir les paramètres
          </Link>
        </div>
      </div>

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

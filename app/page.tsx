import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  const supabase = getSupabaseClient();

  // Récupérer les Besoins, EPICS et USER STORIES depuis Supabase
  const { data: besoins, error: besoinsError } = await supabase
    .from('epics')
    .select('*')
    .order('date_creation', { ascending: false });

  const { data: epics, error: epicsError } = await supabase
    .from('epics')
    .select('*');

  const { data: userStories, error: userStoriesError } = await supabase
    .from('user_stories')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: parameters, error: parametersError } = await supabase
    .from('parameters')
    .select('*');

  if (besoinsError || epicsError || userStoriesError || parametersError) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
        <div className="text-red-500 text-xl mb-4">
          Erreur : {besoinsError?.message || epicsError?.message || userStoriesError?.message || parametersError?.message}
        </div>
      </div>
    );
  }

  // Compter les éléments
  const besoinCount = besoins?.length || 0;
  const epicCount = epics?.length || 0;
  const userStoryCount = userStories?.length || 0;
  const parameterCount = parameters?.length || 0;

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-[rgb(var(--primary-rgb))]">
          Bienvenue dans Gestion Agile
        </h1>
        <p className="text-[rgba(var(--secondary-rgb),0.7)]">
          Gérez vos projets avec la méthodologie Agile : Besoins, EPICS et USER STORIES.
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
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{besoinCount}</h3>
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

        {/* Carte EPICS */}
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
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">{epicCount}</h3>
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">EPICS</p>
            </div>
          </div>
          <Link
            href="/epics"
            className="btn btn-primary text-sm"
          >
            Voir les EPICS
          </Link>
        </div>

        {/* Carte USER STORIES */}
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
              <p className="text-[rgba(var(--secondary-rgb),0.7)]">USER STORIES</p>
            </div>
          </div>
          <Link
            href="/user-stories"
            className="btn btn-primary text-sm"
          >
            Voir les USER STORIES
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
      {besoinCount > 0 && (
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
            {besoins?.slice(0, 3).map((besoin) => {
              const epicsForBesoin = epics?.filter(e => e.besoin_id === besoin.id) || [];
              const userStoriesForBesoin = userStories?.filter(us => 
                epicsForBesoin.some(e => e.id === us.epic_id)
              ) || [];
              
              return (
                <div key={besoin.id} className="card p-4">
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
                    <h3 className="font-semibold text-[rgb(var(--foreground-rgb))]">{besoin.titre}</h3>
                  </div>
                  <p className="text-sm text-[rgba(var(--secondary-rgb),0.7)] mb-3">
                    {besoin.description.length > 100 
                      ? `${besoin.description.substring(0, 100)}...` 
                      : besoin.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="badge badge-primary">{epicsForBesoin.length} EPICS</span>
                    <span className="badge badge-success">{userStoriesForBesoin.length} USER STORIES</span>
                    <span className={`badge ${besoin.priorite === 'Haute' ? 'badge-danger' : besoin.priorite === 'Moyenne' ? 'badge-warning' : 'badge-secondary'}`}>
                      {besoin.priorite}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={`/epics#${besoin.id}`}
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

      {/* Section Dernières USER STORIES */}
      {userStoryCount > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[rgb(var(--secondary-rgb))]">
              Dernières USER STORIES
            </h2>
            <Link
              href="/user-stories"
              className="btn btn-primary text-sm"
            >
              Voir toutes les USER STORIES
            </Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>EPIC</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {userStories?.slice(0, 5).map((userStory) => {
                  const epic = epics?.find(e => e.id === userStory.epic_id);
                  const besoin = epic ? besoins?.find(b => b.id === epic.besoin_id) : null;
                  
                  return (
                    <tr key={userStory.id}>
                      <td>
                        <Link
                          href={`/user-stories/${userStory.id}`}
                          className="link"
                        >
                          {userStory.titre.length > 50 
                            ? `${userStory.titre.substring(0, 50)}...` 
                            : userStory.titre}
                        </Link>
                      </td>
                      <td>
                        {epic && besoin ? (
                          <Link
                            href={`/epics#${besoin.id}`}
                            className="link"
                          >
                            {besoin.titre} → {epic.titre}
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

"use client";

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<{
    besoins: any[],
    epics: any[],
    userStories: any[],
    parameters: any[],
    useOldStructure: boolean
  }>({
    besoins: [],
    epics: [],
    userStories: [],
    parameters: [],
    useOldStructure: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonctions pour la modale
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseClient();
      
      try {
        // Essayer la nouvelle structure de tables
        const { data: besoins, error: besoinsError } = await supabase
          .from('besoins')
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

        if (!besoinsError && !epicsError && !userStoriesError && !parametersError) {
          setData({
            besoins: besoins || [],
            epics: epics || [],
            userStories: userStories || [],
            parameters: parameters || [],
            useOldStructure: false
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log('New table structure not available, trying old structure...');
      }

      // Basculer sur l'ancienne structure de tables
      try {
        const { data: besoins, error: besoinsError } = await supabase
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

        if (besoinsError || featuresError || exigencesError || parametersError) {
          setError(besoinsError?.message || featuresError?.message || exigencesError?.message || parametersError?.message || 'Erreur de connexion à la base de données');
          setLoading(false);
          return;
        }

        setData({
          besoins: besoins || [],
          epics: features || [],
          userStories: exigences || [],
          parameters: parameters || [],
          useOldStructure: true
        });
        setLoading(false);
      } catch (e) {
        setError('Erreur de connexion à la base de données');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))] mb-4"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <p className="text-[rgba(var(--secondary-rgb),0.7)] mt-4">
          Veuillez vérifier votre configuration Supabase.
        </p>
      </div>
    );
  }

  return renderHomePage(
    data.besoins,
    data.epics,
    data.userStories,
    data.parameters,
    data.useOldStructure,
    openModal,
    isModalOpen,
    closeModal
  );
}

function renderHomePage(
  besoins: any[],
  epics: any[],
  userStories: any[],
  parameters: any[],
  useOldStructure: boolean = false,
  openModal: () => void,
  isModalOpen: boolean,
  closeModal: () => void
) {
  // Compter les éléments
  const besoinCount = besoins?.length || 0;
  const epicCount = epics?.length || 0;
  const userStoryCount = userStories?.length || 0;
  const parameterCount = parameters?.length || 0;

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-6">
      {/* Barre latérale */}
      <aside className="sidebar">
        <div className="logo">
          <i className="fas fa-building logo-icon"></i>
          <span>Gestion Agile</span>
        </div>
        <nav className="nav">
          <Link href="/epics" className="nav-item">
            <i className="fas fa-home nav-item-icon"></i>
            <span>Tableau de bord</span>
          </Link>
          <Link href="/epics" className="nav-item">
            <i className="fas fa-list nav-item-icon"></i>
            <span>Besoins</span>
          </Link>
          <Link href="/epics" className="nav-item">
            <i className="fas fa-layer-group nav-item-icon"></i>
            <span>EPICS</span>
          </Link>
          <Link href="/user-stories" className="nav-item">
            <i className="fas fa-tasks nav-item-icon"></i>
            <span>USER STORIES</span>
          </Link>
          <Link href="/parameters" className="nav-item">
            <i className="fas fa-cog nav-item-icon"></i>
            <span>Paramètres</span>
          </Link>
          <button className="nav-item" onClick={openModal}>
            <i className="fas fa-info-circle nav-item-icon"></i>
            <span>Version</span>
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[rgb(var(--primary-rgb))]">
            Bienvenue dans Gestion Agile
          </h1>
          <p className="text-[rgba(var(--secondary-rgb),0.7)]">
            Gérez vos projets avec la méthodologie Agile : Besoins, EPICS et USER STORIES.
          </p>
          {useOldStructure && (
            <div className="mt-4 p-4 bg-[rgba(var(--warning-rgb),0.1)] border border-[rgb(var(--warning-rgb))] rounded-lg">
              <p className="text-sm text-[rgb(var(--warning-rgb))]">
                ⚠️ Vous utilisez l&apos;ancienne structure de base de données. 
                <Link href="/sql/003_final_schema.sql" className="text-[rgb(var(--primary-rgb))] underline">
                  Exécutez ce script SQL
                </Link> pour migrer vers la nouvelle structure.
              </p>
            </div>
          )}
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
            <Link href="/epics" className="btn btn-primary text-sm">
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
            <Link href="/epics" className="btn btn-primary text-sm">
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
            <Link href="/user-stories" className="btn btn-primary text-sm">
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
            <Link href="/parameters" className="btn btn-primary text-sm">
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
              <Link href="/epics" className="btn btn-primary text-sm">
                Voir tous les Besoins
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {besoins?.slice(0, 3).map((besoin) => {
                // For old structure, epics are actually features
                const epicsForBesoin = useOldStructure
                  ? epics?.filter((e: any) => e.epic_id === besoin.id) || []
                  : epics?.filter((e: any) => e.besoin_id === besoin.id) || [];
                
                const userStoriesForBesoin = useOldStructure
                  ? userStories?.filter((us: any) =>
                      epicsForBesoin.some((e: any) => e.id === us.feature_id)
                    ) || []
                  : userStories?.filter((us: any) =>
                      epicsForBesoin.some((e: any) => e.id === us.epic_id)
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
              <Link href="/user-stories" className="btn btn-primary text-sm">
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
                    const epic = useOldStructure
                      ? epics?.find((e: any) => e.id === userStory.feature_id)
                      : epics?.find((e: any) => e.id === userStory.epic_id);
                    
                    const besoin = epic ? besoins?.find((b: any) =>
                      useOldStructure ? b.id === epic.epic_id : b.id === epic.besoin_id
                    ) : null;
                    
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
      </main>

      {/* Fenêtre modale pour la version */}
      <div className={`modal-overlay ${isModalOpen ? 'modal-open' : ''}`} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2><i className="fas fa-info-circle"></i> Informations sur la version</h2>
            <button className="modal-close" onClick={closeModal}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="version-info">
              <div className="version-item">
                <span className="version-label">Version actuelle :</span>
                <span className="version-value">1.0.0</span>
              </div>
              <div className="version-item">
                <span className="version-label">Date de sortie :</span>
                <span className="version-value">15 octobre 2024</span>
              </div>
              <div className="version-item">
                <span className="version-label">Auteur :</span>
                <span className="version-value">Équipe Corporate UI</span>
              </div>
            </div>
            <div className="version-description">
              <h3>Résumé des modifications</h3>
              <ul>
                <li><strong>Nouveautés :</strong> Ajout de l&apos;interface Dark Mode avec thème bleu électrique.</li>
                <li><strong>Améliorations :</strong> Design corporate moderne et responsive.</li>
                <li><strong>Corrections :</strong> Optimisation des performances et de l&apos;accessibilité.</li>
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>
              <i className="fas fa-check"></i> Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  // Vérifie si le chemin commence par une des routes principales
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 sidebar z-40 overflow-y-auto">
      <div className="p-4">
        {/* Accueil */}
        <div className="mb-4">
          <Link
            href="/"
            className={`sidebar-link flex items-center gap-3 ${
              isActive('/') ? 'active' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Accueil</span>
          </Link>
        </div>

        {/* Séparation */}
        <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />

        {/* Besoins */}
        <div className="mb-4">
          <Link
            href="/epics"
            className={`sidebar-link flex items-center gap-3 ${
              isActive('/epics') ? 'active' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
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
            <span>Besoins</span>
          </Link>
        </div>

        {/* Séparation */}
        <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />

        {/* Produits */}
        <div className="mb-4">
          <Link
            href="/produits"
            className={`sidebar-link flex items-center gap-3 ${
              isActive('/produits') ? 'active' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>Produits</span>
          </Link>
          {/* Sous-éléments de Produits */}
          <div className="pl-6 mt-1 space-y-1">
            <Link
              href="/exigences"
              className={`sidebar-link flex items-center gap-3 text-sm ${
                isActive('/exigences') ? 'active' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span>Exigences</span>
            </Link>
            <Link
              href="/produits/developpement"
              className={`sidebar-link flex items-center gap-3 text-sm ${
                isActive('/produits/developpement') ? 'active' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>Développement</span>
            </Link>
            <Link
              href="/produits/tests"
              className={`sidebar-link flex items-center gap-3 text-sm ${
                isActive('/produits/tests') ? 'active' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Tests</span>
            </Link>
          </div>
          
          {/* Séparation + Matrice */}
          <div className="mt-3">
            <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />
            <p className="px-6 py-1 text-xs text-[rgb(var(--secondary-rgb))] font-medium">
              Matrice
            </p>
            <div className="pl-6 mt-1 space-y-1">
              <Link
                href="/produits/matrice-exigences"
                className={`sidebar-link flex items-center gap-3 text-xs ${
                  isActive('/produits/matrice-exigences') ? 'active' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>EXIGENCES</span>
              </Link>
              <Link
                href="/produits/matrice-tests"
                className={`sidebar-link flex items-center gap-3 text-xs ${
                  isActive('/produits/matrice-tests') ? 'active' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span>TESTS</span>
              </Link>
              <Link
                href="/produits/matrice-code"
                className={`sidebar-link flex items-center gap-3 text-xs ${
                  isActive('/produits/matrice-code') ? 'active' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span>CODE</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Séparation */}
        <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />

        {/* Réversibilité */}
        <div className="mb-4">
          <Link
            href="/reversibilite"
            className={`sidebar-link flex items-center gap-3 ${
              isActive('/reversibilite') ? 'active' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Réversibilité</span>
          </Link>
          {/* Sous-élément de Réversibilité */}
          <div className="pl-6 mt-1">
            <Link
              href="/reversibilite/prm"
              className={`sidebar-link flex items-center gap-3 text-sm ${
                isActive('/reversibilite/prm') ? 'active' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
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
              <span>PRM</span>
            </Link>
          </div>
        </div>

        {/* Maintenance */}
        <div className="mb-4">
          <Link
            href="/maintenance"
            className={`sidebar-link flex items-center gap-3 ${
              isActive('/maintenance') ? 'active' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Maintenance</span>
          </Link>
          {/* Sous-élément de Maintenance */}
          <div className="pl-6 mt-1">
            <Link
              href="/maintenance/analyse-impact"
              className={`sidebar-link flex items-center gap-3 text-sm ${
                isActive('/maintenance/analyse-impact') ? 'active' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Analyse d'impact</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

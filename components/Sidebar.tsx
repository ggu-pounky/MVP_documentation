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
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[rgb(var(--card-rgb))] border-r border-[rgb(var(--card-border-rgb))] shadow-md z-40 overflow-y-auto">
      <div className="p-4">
        {/* Analytics */}
        <div className="mb-4">
          <Link
            href="/analytics"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive('/analytics')
                ? 'bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))]'
                : 'text-[rgb(var(--foreground-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
            }`}
          >
            Analytics
          </Link>
        </div>

        {/* Séparation au-dessus de Besoins */}
        <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />

        {/* Besoins */}
        <div className="mb-4">
          <Link
            href="/besoins"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive('/besoins')
                ? 'bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))]'
                : 'text-[rgb(var(--foreground-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
            }`}
          >
            Besoins
          </Link>
        </div>

        {/* Séparation au-dessus de Produits */}
        <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />

        {/* Produits */}
        <div className="mb-4">
          <Link
            href="/produits"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive('/produits')
                ? 'bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))]'
                : 'text-[rgb(var(--foreground-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
            }`}
          >
            Produits
          </Link>
          {/* Sous-éléments de Produits */}
          <div className="pl-6 mt-1 space-y-1">
            <Link
              href="/produits/exigences"
              className={`block px-3 py-1 rounded text-sm transition-colors ${
                isActive('/produits/exigences')
                  ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                  : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
              }`}
            >
              Exigences
            </Link>
            <Link
              href="/produits/developpement"
              className={`block px-3 py-1 rounded text-sm transition-colors ${
                isActive('/produits/developpement')
                  ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                  : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
              }`}
            >
              Développement
            </Link>
            <Link
              href="/produits/tests"
              className={`block px-3 py-1 rounded text-sm transition-colors ${
                isActive('/produits/tests')
                  ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                  : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
              }`}
            >
              Tests
            </Link>
          </div>
          
          {/* Séparation + Documentations */}
          <div className="mt-3">
            <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />
            <p className="px-6 py-1 text-xs text-[rgb(var(--secondary-rgb))] font-medium">
              Documentations
            </p>
            <div className="pl-6 mt-1 space-y-1">
              <Link
                href="/produits/matrice-exigences"
                className={`block px-3 py-1 rounded text-xs transition-colors ${
                  isActive('/produits/matrice-exigences')
                    ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                    : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
                }`}
              >
                Matrice de traçabilité EXIGENCES
              </Link>
              <Link
                href="/produits/matrice-tests"
                className={`block px-3 py-1 rounded text-xs transition-colors ${
                  isActive('/produits/matrice-tests')
                    ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                    : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
                }`}
              >
                Matrice de traçabilité TESTS
              </Link>
              <Link
                href="/produits/matrice-code"
                className={`block px-3 py-1 rounded text-xs transition-colors ${
                  isActive('/produits/matrice-code')
                    ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                    : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
                }`}
              >
                Matrice de traçabilité CODE
              </Link>
            </div>
          </div>
        </div>

        {/* Séparation au-dessus de Maintenance */}
        <div className="border-t border-[rgb(var(--card-border-rgb))] my-2" />

        {/* Réversibilité */}
        <div className="mb-4">
          <Link
            href="/reversibilite"
            className={`block px-4 py-2 rounded-lg transition-colors italic ${
              isActive('/reversibilite')
                ? 'bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))]'
                : 'text-[rgb(var(--foreground-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
            }`}
          >
            Réversibilité
          </Link>
          {/* Sous-élément de Réversibilité */}
          <div className="pl-6 mt-1">
            <Link
              href="/reversibilite/prm"
              className={`block px-3 py-1 rounded text-sm transition-colors ${
                isActive('/reversibilite/prm')
                  ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                  : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
              }`}
            >
              PRM
            </Link>
          </div>
        </div>

        {/* Maintenance */}
        <div className="mb-4">
          <Link
            href="/maintenance"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive('/maintenance')
                ? 'bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))]'
                : 'text-[rgb(var(--foreground-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
            }`}
          >
            Maintenance
          </Link>
          {/* Sous-élément de Maintenance */}
          <div className="pl-6 mt-1">
            <Link
              href="/maintenance/analyse-impact"
              className={`block px-3 py-1 rounded text-sm transition-colors ${
                isActive('/maintenance/analyse-impact')
                  ? 'bg-[rgba(var(--primary-rgb),0.15)] text-[rgb(var(--primary-rgb))]'
                  : 'text-[rgb(var(--secondary-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
              }`}
            >
              Analyse d&apos;impact
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

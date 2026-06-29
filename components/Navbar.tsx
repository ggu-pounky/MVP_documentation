'use client';

import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Titre - À gauche */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[rgb(var(--primary-rgb))] rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <Link
              href="/"
              className="text-xl font-bold text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors"
            >
              Gestion Agile
            </Link>
          </div>
          
          {/* Menu - Au centre */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/epics"
              className="text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors font-medium"
            >
              EPICs
            </Link>
            <Link
              href="/exigences"
              className="text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors font-medium"
            >
              User Stories
            </Link>
            <Link
              href="/parameters"
              className="text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors font-medium"
            >
              Paramètres
            </Link>
          </div>
          
          {/* Boutons - À droite */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

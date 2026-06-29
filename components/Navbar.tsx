'use client';

import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--card-rgb))] border-b border-[rgb(var(--card-border-rgb))] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Titre */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-[rgb(var(--primary-rgb))]">
              Mon App Supabase
            </a>
          </div>
          
          {/* Menu */}
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))] transition-colors"
            >
              Accueil
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

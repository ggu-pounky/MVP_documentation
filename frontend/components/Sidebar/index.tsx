"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Gestion des Besoins</h1>
      </div>
      
      <nav className="space-y-2">
        <Link
          href="/besoins"
          className={`flex items-center px-4 py-2 rounded-md ${isActive("/besoins") ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Liste des Besoins
        </Link>

        <Link
          href="/besoins/new"
          className={`flex items-center px-4 py-2 rounded-md ${isActive("/besoins/new") ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Nouveau Besoin
        </Link>

        <Link
          href="/"
          className={`flex items-center px-4 py-2 rounded-md ${isActive("/") ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Accueil
        </Link>
      </nav>
    </aside>
  );
};

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la nouvelle page matrice USER STORIES
    router.push('/produits/matrice-user-stories');
  }, [router]);

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirection en cours...</h1>
        <p>Vous allez être redirigé vers la page Matrice USER STORIES.</p>
      </div>
    </div>
  );
}

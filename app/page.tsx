import { getSupabaseClient } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function Home() {
  const supabase = getSupabaseClient();

  // Récupérer les paramètres depuis Supabase (requête asynchrone)
  const { data: parameters, error } = await supabase
    .from('parameters')
    .select('*');

  if (error) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
        <div className="text-red-500 text-xl mb-4">Erreur : {error.message}</div>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-[rgb(var(--primary-rgb))]">
          Hello World avec Supabase !
        </h1>
        
        <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-[rgb(var(--secondary-rgb))]">
            Liste des paramètres :
          </h2>
          
          {parameters && parameters.length > 0 ? (
            <ul className="space-y-3">
              {parameters.map((param) => (
                <li
                  key={param.id}
                  className="p-4 bg-[rgba(var(--background-start-rgb),0.1)] rounded-lg border border-[rgba(var(--card-border-rgb),0.3)] hover:bg-[rgba(var(--background-start-rgb),0.2)] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="text-[rgb(var(--primary-rgb))]">
                      {param.name}:
                    </strong>
                    <span className="text-[rgb(var(--foreground-rgb))]">
                      {param.value}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
              Aucun paramètre trouvé. Ajoutez-en dans Supabase !
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  const supabase = getSupabaseClient();

  // Récupérer les paramètres depuis Supabase (requête asynchrone)
  const { data: parameters, error: parametersError } = await supabase
    .from('parameters')
    .select('*');

  // Récupérer les exigences depuis Supabase
  const { data: exigences, error: exigencesError } = await supabase
    .from('exigences')
    .select('*')
    .order('created_at', { ascending: false });

  if (parametersError || exigencesError) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))]">
        <div className="text-red-500 text-xl mb-4">
          Erreur : {parametersError?.message || exigencesError?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background-start-rgb))] text-[rgb(var(--foreground-rgb))] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-[rgb(var(--primary-rgb))]">
          Hello World avec Supabase !
        </h1>
        
        {/* Section Paramètres */}
        <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[rgb(var(--secondary-rgb))]">
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
              Aucun paramètre trouvé. <Link href="/parameters" className="text-[rgb(var(--primary-rgb))] underline">Ajoutez-en ici</Link> !
            </p>
          )}
        </div>

        {/* Section Exigences */}
        <div className="bg-[rgb(var(--card-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[rgb(var(--secondary-rgb))]">
              Liste des exigences :
            </h2>
            <Link
              href="/parameters"
              className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-white rounded hover:bg-[rgba(var(--primary-rgb),0.8)] transition-colors"
            >
              Gérer les exigences
            </Link>
          </div>
          {exigences && exigences.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgb(var(--card-border-rgb))]">
                    <th className="text-left p-3 font-medium">Titre</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">Priorité</th>
                    <th className="text-left p-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {exigences.map((exigence) => (
                    <tr key={exigence.id} className="border-b border-[rgba(var(--card-border-rgb),0.3)]">
                      <td className="p-3">{exigence.titre}</td>
                      <td className="p-3">{exigence.description}</td>
                      <td className="p-3">{exigence.priorite}</td>
                      <td className="p-3">{exigence.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[rgba(var(--secondary-rgb),0.7)] italic">
              Aucune exigence trouvée. <Link href="/parameters" className="text-[rgb(var(--primary-rgb))] underline">Ajoutez-en ici</Link> !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { getSupabaseClient } from '@/lib/supabase';

export default async function Home() {
  const supabase = getSupabaseClient();

  // Récupérer les paramètres depuis Supabase (requête asynchrone)
  const { data: parameters, error } = await supabase
    .from('parameters')
    .select('*');

  if (error) {
    return <div className="text-red-500">Erreur : {error.message}</div>;
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Hello World avec Supabase !</h1>
      <h2 className="text-xl mb-4">Liste des paramètres :</h2>
      {parameters && parameters.length > 0 ? (
        <ul className="list-disc pl-6">
          {parameters.map((param) => (
            <li key={param.id} className="mb-2">
              <strong>{param.name}:</strong> {param.value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun paramètre trouvé. Ajoutez-en dans Supabase !</p>
      )}
    </main>
  );
}

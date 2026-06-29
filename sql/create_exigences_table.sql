-- Créer la table exigences pour la gestion CRUD
CREATE TABLE IF NOT EXISTS exigences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
CREATE TRIGGER update_exigences_updated_at
  BEFORE UPDATE ON exigences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données de test (optionnel)
-- INSERT INTO exigences (titre, description, priorite, statut) VALUES
-- ('Exigence 1', 'Description de l''exigence 1', 'Haute', 'À faire'),
-- ('Exigence 2', 'Description de l''exigence 2', 'Moyenne', 'En cours'),
-- ('Exigence 3', 'Description de l''exigence 3', 'Basse', 'Terminé');

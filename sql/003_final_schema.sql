-- Final schema with proper table separation
-- This creates distinct tables for besoins, epics, and user_stories

-- Drop old tables if they exist
DROP TABLE IF EXISTS user_stories CASCADE;
DROP TABLE IF EXISTS epics CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS exigences CASCADE;

-- Create the BESOINS table (for needs)
CREATE TABLE IF NOT EXISTS besoins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  createur TEXT,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the EPICS table (for epics, formerly features)
CREATE TABLE IF NOT EXISTS epics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  besoin_id UUID REFERENCES besoins(id) ON DELETE CASCADE,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create USER_STORIES table (formerly exigences)
CREATE TABLE IF NOT EXISTS user_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parameters table
CREATE TABLE IF NOT EXISTS parameters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_besoins_updated_at
  BEFORE UPDATE ON besoins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_epics_updated_at
  BEFORE UPDATE ON epics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE ON user_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parameters_updated_at
  BEFORE UPDATE ON parameters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- Uncomment the following lines to insert test data

-- Insert a besoin (need)
-- INSERT INTO besoins (id, titre, description, priorite, statut, createur) 
-- VALUES ('10000000-0000-0000-0000-000000000001', 'Gestion des utilisateurs', 'Besoin de gérer les utilisateurs de l''application', 'Haute', 'À faire', 'Product Owner');

-- Insert an epic for the besoin
-- INSERT INTO epics (id, titre, description, besoin_id, priorite, statut) 
-- VALUES ('20000000-0000-0000-0000-000000000001', 'Authentification', 'EPIC pour l''authentification des utilisateurs', '10000000-0000-0000-0000-000000000001', 'Haute', 'À faire');

-- Insert a user story for the epic
-- INSERT INTO user_stories (id, titre, description, priorite, statut, epic_id) 
-- VALUES ('30000000-0000-0000-0000-000000000001', 'En tant qu''utilisateur, je veux me connecter afin d''accéder à mon compte', 'L''utilisateur doit pouvoir se connecter avec son email et mot de passe', 'Haute', 'À faire', '20000000-0000-0000-0000-000000000001');

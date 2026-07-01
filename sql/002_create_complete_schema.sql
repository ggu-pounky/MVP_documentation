-- Complete schema creation for the updated application
-- This file creates all necessary tables with the new terminology

-- Drop old tables if they exist (for fresh start)
DROP TABLE IF EXISTS user_stories CASCADE;
DROP TABLE IF EXISTS epics CASCADE;

-- Create the main EPICS table for needs (Besoins)
CREATE TABLE IF NOT EXISTS epics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  createur TEXT,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- This column distinguishes between besoins (needs) and epics
  type TEXT NOT NULL DEFAULT 'besoin'
);

-- Create the EPICS table for epics (formerly features)
-- This table contains the epics that belong to besoins
CREATE TABLE IF NOT EXISTS epics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  parent_epic_id UUID,
  besoin_id UUID REFERENCES epics(id) ON DELETE CASCADE,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- This column distinguishes between besoins (needs) and epics
  type TEXT NOT NULL DEFAULT 'epic'
);

-- Add constraint to prevent circular references
ALTER TABLE epics ADD CONSTRAINT fk_epics_parent 
  FOREIGN KEY (parent_epic_id) REFERENCES epics(id) ON DELETE CASCADE;

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

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_epics_updated_at
  BEFORE UPDATE ON epics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE ON user_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create parameters table if it doesn't exist
CREATE TABLE IF NOT EXISTS parameters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_parameters_updated_at
  BEFORE UPDATE ON parameters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- Uncomment the following lines to insert test data

-- Insert a besoin (need)
-- INSERT INTO epics (id, titre, description, priorite, statut, createur, type) 
-- VALUES ('10000000-0000-0000-0000-000000000001', 'Gestion des utilisateurs', 'Besoin de gérer les utilisateurs de l''application', 'Haute', 'À faire', 'Product Owner', 'besoin');

-- Insert an epic for the besoin
-- INSERT INTO epics (id, titre, description, besoin_id, priorite, statut, type) 
-- VALUES ('20000000-0000-0000-0000-000000000001', 'Authentification', 'EPIC pour l''authentification des utilisateurs', '10000000-0000-0000-0000-000000000001', 'Haute', 'À faire', 'epic');

-- Insert a user story for the epic
-- INSERT INTO user_stories (id, titre, description, priorite, statut, epic_id) 
-- VALUES ('30000000-0000-0000-0000-000000000001', 'En tant qu''utilisateur, je veux me connecter afin d''accéder à mon compte', 'L''utilisateur doit pouvoir se connecter avec son email et mot de passe', 'Haute', 'À faire', '20000000-0000-0000-0000-000000000001');

-- Note: The application now uses a single 'epics' table with a 'type' column to distinguish between
-- 'besoin' (needs) and 'epic' (epics). This simplifies the schema while maintaining the hierarchy.

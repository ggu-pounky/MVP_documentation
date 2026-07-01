-- Updated SQL schema with new terminology
-- Tables: epics (for needs), epics (for epics, formerly features), user_stories (formerly exigences)

-- Create the main EPICS table for needs (this was already existing as 'epics')
CREATE TABLE IF NOT EXISTS epics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  priorite TEXT NOT NULL DEFAULT 'Moyenne',
  statut TEXT NOT NULL DEFAULT 'À faire',
  createur TEXT,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the EPICS table for epics (formerly features)
-- This table contains the epics that belong to needs
CREATE TABLE IF NOT EXISTS epics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  parent_epic_id UUID REFERENCES epics(id) ON DELETE CASCADE,
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

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_epics_updated_at
  BEFORE UPDATE ON epics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE ON user_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

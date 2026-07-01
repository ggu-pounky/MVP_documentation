-- Migration 001: Rename FEATURE to EPIC and Exigence to USERStory
-- This migration renames tables and columns to match the new terminology

-- Step 1: Rename the 'features' table to 'epics'
ALTER TABLE IF EXISTS features RENAME TO epics;

-- Step 2: Rename the 'exigences' table to 'user_stories'
ALTER TABLE IF EXISTS exigences RENAME TO user_stories;

-- Step 3: Update the epics table structure (formerly features)
-- Add any missing columns if needed
ALTER TABLE epics ADD COLUMN IF NOT EXISTS epic_id UUID REFERENCES epics(id);

-- Step 4: Rename the epic_id column to parent_epic_id for clarity
ALTER TABLE epics RENAME COLUMN epic_id TO parent_epic_id;

-- Step 5: Update the user_stories table (formerly exigences)
-- Rename feature_id to epic_id to reference epics instead of features
ALTER TABLE user_stories RENAME COLUMN feature_id TO epic_id;

-- Step 6: Update the foreign key constraint
ALTER TABLE user_stories 
DROP CONSTRAINT IF EXISTS user_stories_feature_id_fkey,
ADD CONSTRAINT user_stories_epic_id_fkey FOREIGN KEY (epic_id) REFERENCES epics(id);

-- Step 7: Update the trigger for user_stories
DROP TRIGGER IF EXISTS update_exigences_updated_at ON user_stories;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE ON user_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: The original 'epics' table (for needs) will remain as is
-- The original 'features' table is now 'epics' (for epics)
-- The original 'exigences' table is now 'user_stories'

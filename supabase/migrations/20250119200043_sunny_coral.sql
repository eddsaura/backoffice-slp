/*
  # Fix ingredients table RLS policies

  1. Changes
    - Replace existing RLS policy with separate policies for each operation
    - Add explicit policies for INSERT, SELECT, UPDATE, and DELETE operations
  
  2. Security
    - Enable RLS on ingredients table
    - Add policies to allow authenticated users to:
      - Create new ingredients
      - Read their own ingredients
      - Update their own ingredients
      - Delete their own ingredients
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own ingredients" ON ingredients;

-- Create separate policies for each operation
CREATE POLICY "Users can create ingredients"
  ON ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own ingredients"
  ON ingredients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own ingredients"
  ON ingredients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ingredients"
  ON ingredients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
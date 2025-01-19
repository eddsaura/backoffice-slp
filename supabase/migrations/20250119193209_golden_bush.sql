/*
  # Add ingredients tracking

  1. New Tables
    - `ingredients`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `unit` (text) - e.g., kg, liters, units
      - `created_at` (timestamp)
      - `user_id` (uuid) - reference to auth.users
    
    - `ingredient_purchases`
      - `id` (uuid, primary key)
      - `ingredient_id` (uuid) - reference to ingredients
      - `order_id` (uuid, nullable) - reference to paella_orders
      - `quantity` (numeric)
      - `price` (numeric)
      - `supplier` (text)
      - `purchase_date` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid) - reference to auth.users

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  unit text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  UNIQUE(name, user_id)
);

-- Create ingredient purchases table
CREATE TABLE IF NOT EXISTS ingredient_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  order_id uuid REFERENCES paella_orders(id) ON DELETE SET NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  supplier text NOT NULL,
  purchase_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for ingredients
CREATE POLICY "Users can manage their own ingredients"
  ON ingredients
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for ingredient purchases
CREATE POLICY "Users can manage their own ingredient purchases"
  ON ingredient_purchases
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
CREATE INDEX idx_ingredient_purchases_user_id ON ingredient_purchases(user_id);
CREATE INDEX idx_ingredient_purchases_ingredient_id ON ingredient_purchases(ingredient_id);
CREATE INDEX idx_ingredient_purchases_order_id ON ingredient_purchases(order_id);
CREATE INDEX idx_ingredient_purchases_purchase_date ON ingredient_purchases(purchase_date);
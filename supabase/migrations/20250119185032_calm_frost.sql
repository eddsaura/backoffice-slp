/*
  # Create paella orders schema

  1. New Tables
    - `paella_orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `date` (date)
      - `status` (enum)
      - `servings` (integer)
      - `type` (enum)
      - `costs` (jsonb)
      - `price` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `paella_orders` table
    - Add policies for authenticated users to:
      - Read their own orders
      - Create new orders
*/

-- Create enum types for order status and paella type
CREATE TYPE order_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE paella_type AS ENUM ('Valenciana', 'Seafood', 'Vegetarian', 'Mixed');

-- Create the paella_orders table
CREATE TABLE IF NOT EXISTS paella_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  date date NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  servings integer NOT NULL CHECK (servings > 0),
  type paella_type NOT NULL,
  costs jsonb NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  notes text,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE paella_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own orders"
  ON paella_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON paella_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON paella_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_paella_orders_user_id ON paella_orders(user_id);
CREATE INDEX idx_paella_orders_date ON paella_orders(date);
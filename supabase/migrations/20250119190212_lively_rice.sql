/*
  # Add support for multiple paellas per order

  1. New Tables
    - `paella_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references paella_orders)
      - `type` (paella_type)
      - `servings` (integer)
      - `created_at` (timestamptz)

  2. Changes
    - Remove `type` and `servings` from `paella_orders` table as they're now in `paella_items`

  3. Security
    - Enable RLS on `paella_items` table
    - Add policies for authenticated users to manage their items
*/

-- Create paella_items table
CREATE TABLE IF NOT EXISTS paella_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES paella_orders(id) ON DELETE CASCADE,
  type paella_type NOT NULL,
  servings integer NOT NULL CHECK (servings > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE paella_items ENABLE ROW LEVEL SECURITY;

-- Create policies for paella_items
CREATE POLICY "Users can read own order items"
  ON paella_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paella_orders
      WHERE paella_orders.id = paella_items.order_id
      AND paella_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items for own orders"
  ON paella_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM paella_orders
      WHERE paella_orders.id = paella_items.order_id
      AND paella_orders.user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_paella_items_order_id ON paella_items(order_id);
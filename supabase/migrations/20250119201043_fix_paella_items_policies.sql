/*
  # Fix paella_items RLS policies

  1. Changes
    - Add UPDATE and DELETE policies for paella_items table
  
  2. Security
    - Allow users to update and delete items for their own orders
*/

-- Create update policy
CREATE POLICY "Users can update own order items"
  ON paella_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paella_orders
      WHERE paella_orders.id = paella_items.order_id
      AND paella_orders.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM paella_orders
      WHERE paella_orders.id = paella_items.order_id
      AND paella_orders.user_id = auth.uid()
    )
  );

-- Create delete policy
CREATE POLICY "Users can delete own order items"
  ON paella_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paella_orders
      WHERE paella_orders.id = paella_items.order_id
      AND paella_orders.user_id = auth.uid()
    )
  ); 
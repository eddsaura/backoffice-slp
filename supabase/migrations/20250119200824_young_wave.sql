/*
  # Add unit price to ingredient purchases

  1. Changes
    - Add unit_price column to ingredient_purchases table
    - Update existing rows to calculate unit price from total price and quantity
  
  2. Notes
    - Unit price is stored alongside total price for better data tracking
    - Helps with historical price analysis and reporting
*/

-- Add unit_price column
ALTER TABLE ingredient_purchases
ADD COLUMN unit_price numeric NOT NULL DEFAULT 0;

-- Update existing rows to calculate unit price
UPDATE ingredient_purchases
SET unit_price = CASE 
  WHEN quantity > 0 THEN price / quantity 
  ELSE 0 
END;

-- Add check constraint to ensure unit price is non-negative
ALTER TABLE ingredient_purchases
ADD CONSTRAINT ingredient_purchases_unit_price_check 
CHECK (unit_price >= 0);
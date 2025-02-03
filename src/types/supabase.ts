export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string
          name: string
          unit: string
          created_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['ingredients']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ingredients']['Insert']>
      }
      ingredient_purchases: {
        Row: {
          id: string
          ingredient_id: string
          order_id: string | null
          quantity: number
          price: number
         unit_price: number
          supplier: string
          purchase_date: string
          notes: string | null
          created_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['ingredient_purchases']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ingredient_purchases']['Insert']>
      }
      paella_items: {
        Row: {
          id: string
          order_id: string
          type: 'Valenciana' | 'Seafood' | 'Vegetarian' | 'Mixed'
          servings: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['paella_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['paella_items']['Insert']>
      }
      paella_orders: {
        Row: {
          id: string
          customer_name: string
          date: string
          status: 'pending' | 'in-progress' | 'completed'
          costs: {
            ingredients: number
            labor: number
            transport: number
            other: number
          }
          price: number
          notes: string | null
          created_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['paella_orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['paella_orders']['Insert']>
      }
      recipes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          cooking_time_minutes: number | null;
          base_servings: number;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database["public"]["Tables"]["recipes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["recipes"]["Insert"]>;
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["recipe_ingredients"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["recipe_ingredients"]["Insert"]>;
      };
    }
  }
}
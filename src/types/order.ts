export interface PaellaItem {
  id: string;
  type: 'Valenciana' | 'Seafood' | 'Vegetarian' | 'Mixed';
  servings: number;
}

export interface PaellaOrder {
  id: string;
  customerName: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  items: PaellaItem[];
  costs: {
    ingredients: number;
    labor: number;
    transport: number;
    other: number;
  };
  price: number;
  notes?: string;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  averageProfit: number;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

export interface IngredientPurchase {
  id: string;
  ingredientId: string;
  orderId?: string;
  quantity: number;
  price: number;
  unit_price: number;
  isUnitPrice: boolean;
  supplier: string;
  purchaseDate: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  cookingTimeMinutes?: number;
  baseServings: number;
  ingredients: RecipeIngredient[];
  createdAt: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientId: string;
  ingredient: Ingredient;
  quantity: number;
  createdAt: string;
}
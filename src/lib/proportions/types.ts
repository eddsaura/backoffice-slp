export type IngredientUnit = 'kg' | 'g' | 'l' | 'ml' | 'units';

export interface ProportionRule {
  baseServings: number;
  ratio: number;
  unit: IngredientUnit;
  roundingPrecision?: number;
}

export interface PaellaIngredientProportions {
  [ingredientName: string]: ProportionRule;
}

export interface CalculatedProportion {
  amount: number;
  unit: IngredientUnit;
}

export type PaellaType = 'Valenciana' | 'Seafood' | 'Vegetarian' | 'Mixed';
import { PAELLA_PROPORTIONS } from './rules';
import { PaellaType, CalculatedProportion } from './types';

export function calculateIngredientAmount(
  paellaType: PaellaType,
  ingredientName: string,
  servings: number
): CalculatedProportion | null {
  const proportions = PAELLA_PROPORTIONS[paellaType];
  const rule = proportions[ingredientName];

  if (!rule) {
    return null;
  }

  const amount = rule.ratio * servings;
  const roundedAmount = Number(amount.toFixed(rule.roundingPrecision ?? 2));

  return {
    amount: roundedAmount,
    unit: rule.unit,
  };
}

export function calculateAllIngredients(
  paellaType: PaellaType,
  servings: number
): Record<string, CalculatedProportion> {
  const proportions = PAELLA_PROPORTIONS[paellaType];
  const result: Record<string, CalculatedProportion> = {};

  for (const [ingredient, rule] of Object.entries(proportions)) {
    const amount = rule.ratio * servings;
    const roundedAmount = Number(amount.toFixed(rule.roundingPrecision ?? 2));

    result[ingredient] = {
      amount: roundedAmount,
      unit: rule.unit,
    };
  }

  return result;
}

export function formatAmount(proportion: CalculatedProportion): string {
  const { amount, unit } = proportion;
  
  switch (unit) {
    case 'kg':
      return amount < 1 
        ? `${(amount * 1000).toFixed(0)}g`
        : `${amount}kg`;
    case 'l':
      return amount < 1
        ? `${(amount * 1000).toFixed(0)}ml`
        : `${amount}L`;
    case 'g':
    case 'ml':
    case 'units':
      return `${amount}${unit}`;
  }
}
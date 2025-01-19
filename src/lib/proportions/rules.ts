import { PaellaIngredientProportions, PaellaType } from './types';

export const PAELLA_PROPORTIONS: Record<PaellaType, PaellaIngredientProportions> = {
  Valenciana: {
    rice: {
      baseServings: 6,
      ratio: 0.08333, // 500g for 6 servings = ~83.33g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    water: {
      baseServings: 6,
      ratio: 0.20833, // 1.25L for 6 servings = ~208.33ml per person
      unit: 'l',
      roundingPrecision: 2,
    },
    'green beans': {
      baseServings: 6,
      ratio: 0.16667, // 1kg for 6 servings = ~166.67g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    'garrofón beans': {
      baseServings: 6,
      ratio: 0.05, // 300g for 6 servings = 50g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    chicken: {
      baseServings: 6,
      ratio: 0.16667, // 1kg for 6 servings = ~166.67g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    rabbit: {
      baseServings: 6,
      ratio: 0.16667, // 1kg for 6 servings = ~166.67g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    'olive oil': {
      baseServings: 6,
      ratio: 0.01667, // 100ml for 6 servings = ~16.67ml per person
      unit: 'l',
      roundingPrecision: 3,
    },
    saffron: {
      baseServings: 6,
      ratio: 0.05, // 0.3g for 6 servings = 0.05g per person
      unit: 'g',
      roundingPrecision: 2,
    },
  },
  Seafood: {
    rice: {
      baseServings: 6,
      ratio: 0.08333,
      unit: 'kg',
      roundingPrecision: 2,
    },
    water: {
      baseServings: 6,
      ratio: 0.20833,
      unit: 'l',
      roundingPrecision: 2,
    },
    prawns: {
      baseServings: 6,
      ratio: 0.08333, // 500g for 6 servings = ~83.33g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    mussels: {
      baseServings: 6,
      ratio: 0.16667, // 1kg for 6 servings = ~166.67g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    squid: {
      baseServings: 6,
      ratio: 0.08333, // 500g for 6 servings = ~83.33g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
  },
  Vegetarian: {
    rice: {
      baseServings: 6,
      ratio: 0.08333,
      unit: 'kg',
      roundingPrecision: 2,
    },
    water: {
      baseServings: 6,
      ratio: 0.20833,
      unit: 'l',
      roundingPrecision: 2,
    },
    'green beans': {
      baseServings: 6,
      ratio: 0.16667,
      unit: 'kg',
      roundingPrecision: 2,
    },
    artichokes: {
      baseServings: 6,
      ratio: 0.16667, // 1kg for 6 servings = ~166.67g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    mushrooms: {
      baseServings: 6,
      ratio: 0.16667,
      unit: 'kg',
      roundingPrecision: 2,
    },
  },
  Mixed: {
    rice: {
      baseServings: 6,
      ratio: 0.08333,
      unit: 'kg',
      roundingPrecision: 2,
    },
    water: {
      baseServings: 6,
      ratio: 0.20833,
      unit: 'l',
      roundingPrecision: 2,
    },
    chicken: {
      baseServings: 6,
      ratio: 0.08333, // 500g for 6 servings = ~83.33g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    prawns: {
      baseServings: 6,
      ratio: 0.04167, // 250g for 6 servings = ~41.67g per person
      unit: 'kg',
      roundingPrecision: 2,
    },
    mussels: {
      baseServings: 6,
      ratio: 0.08333,
      unit: 'kg',
      roundingPrecision: 2,
    },
  },
};
import rawPresets from '../data/RECIPE_PRESETS.json';

import type { RecipePresets } from './types';

export const RECIPE_PRESETS = rawPresets as RecipePresets;

export const DEFAULT_RECIPE_KEY = 'potage';

export const recipeKeys = Object.keys(RECIPE_PRESETS);

export function isRecipeKey(value: string): value is keyof typeof RECIPE_PRESETS {
  return Object.prototype.hasOwnProperty.call(RECIPE_PRESETS, value);
}

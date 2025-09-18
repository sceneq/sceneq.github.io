export type RatioValue = number | string;

export interface RecipePreset {
  name: string;
  description?: string;
  baseIngredients: string[];
  defaultBaseKey: string;
  referenceAmount?: number;
  ratio: Record<string, RatioValue>;
}

export type RecipePresets = Record<string, RecipePreset>;

export type WeightMap = Record<string, RatioValue>;

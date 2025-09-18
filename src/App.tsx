import { useCallback, useEffect, useMemo, useState } from 'react';

import { IngredientTable } from './components/IngredientTable';
import { RecipeDetails } from './components/RecipeDetails';
import { RecipeSelector } from './components/RecipeSelector';
import { DEFAULT_RECIPE_KEY, isRecipeKey, RECIPE_PRESETS } from './recipes';
import { round } from './utils/round';
import type { RecipePreset, WeightMap } from './types';

function getInitialRecipeKey(): keyof typeof RECIPE_PRESETS {
  const params = new URLSearchParams(window.location.search);
  const recipeParam = params.get('recipe');
  if (recipeParam && isRecipeKey(recipeParam)) {
    return recipeParam;
  }
  return DEFAULT_RECIPE_KEY;
}

function calculateInitialUnit(preset: RecipePreset): number {
  const referenceAmount = preset.referenceAmount ?? 200;
  const defaultRatio = preset.ratio[preset.defaultBaseKey];
  if (typeof defaultRatio === 'number' && defaultRatio !== 0) {
    return referenceAmount / defaultRatio;
  }
  return referenceAmount;
}

function computeWeights(
  preset: RecipePreset,
  unit: number,
  includeUnsaltedButterSalt: boolean,
): WeightMap {
  const weights: WeightMap = {};

  for (const [name, ratio] of Object.entries(preset.ratio)) {
    if (typeof ratio === 'number') {
      weights[name] = round(unit * ratio);
    } else {
      weights[name] = ratio;
    }
  }

  if (includeUnsaltedButterSalt) {
    let extraSalt = 0;
    for (const [name, value] of Object.entries(weights)) {
      if (
        typeof value === 'number' &&
        (name.includes('バター') || name.includes('油脂'))
      ) {
        extraSalt += value * 0.014;
      }
    }

    if (extraSalt > 0) {
      weights['塩（無塩バター用）'] = round(extraSalt);
    }
  }

  return weights;
}

export function App() {
  const [recipeKey, setRecipeKey] = useState<keyof typeof RECIPE_PRESETS>(getInitialRecipeKey);
  const preset = RECIPE_PRESETS[recipeKey];

  const [unit, setUnit] = useState(() => calculateInitialUnit(preset));
  const [unsaltedButter, setUnsaltedButter] = useState(false);
  const [totalWeightOverride, setTotalWeightOverride] = useState<number | null>(null);

  useEffect(() => {
    const nextPreset = RECIPE_PRESETS[recipeKey];
    setUnit(calculateInitialUnit(nextPreset));
    setUnsaltedButter(false);
    setTotalWeightOverride(null);
  }, [recipeKey]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('recipe', recipeKey);
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', nextUrl);
  }, [recipeKey]);

  useEffect(() => {
    document.title = `${preset.name}材料計算機`;
  }, [preset.name]);

  const weights = useMemo(
    () => computeWeights(preset, unit, unsaltedButter),
    [preset, unit, unsaltedButter],
  );

  const totalRatio = useMemo(() => {
    let sum = 0;
    for (const ratio of Object.values(preset.ratio)) {
      if (typeof ratio === 'number') {
        sum += ratio;
      }
    }
    return sum;
  }, [preset]);

  const calculatedTotalWeight = useMemo(() => {
    let total = 0;
    for (const weight of Object.values(weights)) {
      if (typeof weight === 'number') {
        total += weight;
      }
    }
    return round(total);
  }, [weights]);

  const showUnsaltedButterOption = useMemo(() => {
    return Object.keys(preset.ratio).some((name) => name.includes('バター') || name.includes('油脂'));
  }, [preset]);

  const handleRecipeChange = useCallback((nextKey: string) => {
    if (isRecipeKey(nextKey)) {
      setRecipeKey(nextKey);
    }
  }, []);

  const handleWeightChange = useCallback(
    (name: string, weight: number) => {
      const ratio = preset.ratio[name];
      if (typeof ratio !== 'number' || ratio === 0) {
        return;
      }
      const newUnit = weight / ratio;
      setUnit(newUnit);
      setTotalWeightOverride(null);
    },
    [preset.ratio],
  );

  const handleTotalWeightChange = useCallback(
    (nextWeight: number | null) => {
      if (!nextWeight || nextWeight <= 0) {
        setTotalWeightOverride(null);
        return;
      }

      let currentTotal = 0;
      for (const weight of Object.values(weights)) {
        if (typeof weight === 'number') {
          currentTotal += weight;
        }
      }

      if (currentTotal > 0) {
        const ratio = nextWeight / currentTotal;
        setUnit((prev) => prev * ratio);
        setTotalWeightOverride(nextWeight);
      }
    },
    [weights],
  );

  const handleUnsaltedButterToggle = useCallback((value: boolean) => {
    setUnsaltedButter(value);
    setTotalWeightOverride(null);
  }, []);

  return (
    <div>
      <RecipeSelector presets={RECIPE_PRESETS} selectedKey={recipeKey} onChange={handleRecipeChange} />

      <RecipeDetails
        description={preset.description}
        defaultBaseKey={preset.defaultBaseKey}
        baseIngredients={preset.baseIngredients}
      />

      <IngredientTable
        ratios={preset.ratio}
        weights={weights}
        totalRatio={totalRatio}
        totalWeight={totalWeightOverride}
        calculatedTotalWeight={calculatedTotalWeight}
        onWeightChange={handleWeightChange}
        onTotalWeightChange={handleTotalWeightChange}
        unsaltedButter={unsaltedButter}
        onUnsaltedButterToggle={handleUnsaltedButterToggle}
        showUnsaltedButterOption={showUnsaltedButterOption}
      />
    </div>
  );
}

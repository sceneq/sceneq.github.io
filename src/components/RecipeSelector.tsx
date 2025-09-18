import type { RecipePresets } from '../types';

interface RecipeSelectorProps {
  presets: RecipePresets;
  selectedKey: string;
  onChange: (key: string) => void;
}

export function RecipeSelector({ presets, selectedKey, onChange }: RecipeSelectorProps) {
  return (
    <label htmlFor="recipe">
      レシピ
      <select
        id="recipe"
        value={selectedKey}
        onChange={(event) => onChange(event.target.value)}
      >
        {Object.entries(presets).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.name}　-　{preset.description ?? ''}
          </option>
        ))}
      </select>
    </label>
  );
}

import { useCallback } from 'react';

import type { RecipePreset, WeightMap } from '../types';
import { round } from '../utils/round';

interface IngredientTableProps {
  ratios: RecipePreset['ratio'];
  weights: WeightMap;
  totalRatio: number;
  totalWeight: number | null;
  calculatedTotalWeight: number;
  onWeightChange: (name: string, weight: number) => void;
  onTotalWeightChange: (weight: number | null) => void;
  unsaltedButter: boolean;
  onUnsaltedButterToggle: (value: boolean) => void;
  showUnsaltedButterOption: boolean;
}

export function IngredientTable({
  ratios,
  weights,
  totalRatio,
  totalWeight,
  calculatedTotalWeight,
  onWeightChange,
  onTotalWeightChange,
  unsaltedButter,
  onUnsaltedButterToggle,
  showUnsaltedButterOption,
}: IngredientTableProps) {
  const handleTotalWeightChange = useCallback(
    (value: string) => {
      if (value === '') {
        onTotalWeightChange(null);
        return;
      }
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue)) {
        onTotalWeightChange(numericValue);
      }
    },
    [onTotalWeightChange],
  );

  return (
    <section>
      <h3>材料の重量</h3>

      {showUnsaltedButterOption && (
        <label>
          <input
            type="checkbox"
            checked={unsaltedButter}
            onChange={(event) => onUnsaltedButterToggle(event.target.checked)}
          />
          無塩バターを使用（バター100gに対して塩1.4gを追加）
        </label>
      )}

      <table className="striped">
        <thead>
          <tr>
            <th>材料</th>
            <th>重量 (g)</th>
            <th>比率</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(weights).map(([name, weight]) => {
            const ratio = ratios[name];
            const percentage =
              typeof ratio === 'number' && totalRatio > 0
                ? `${round((ratio / totalRatio) * 100)}%`
                : '';
            const isEditable = typeof ratio === 'number' && name !== '塩（無塩バター用）';
            const numericWeight = typeof weight === 'number' ? weight : 0;

            return (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  {isEditable ? (
                    <input
                      type="number"
                      value={numericWeight}
                      onChange={(event) => {
                        const nextValue = Number(event.target.value);
                        if (!Number.isNaN(nextValue)) {
                          onWeightChange(name, nextValue);
                        }
                      }}
                    />
                  ) : (
                    <span>{weight}</span>
                  )}
                </td>
                <td>{percentage}</td>
              </tr>
            );
          })}
          <tr style={{ borderTop: '2px solid #ccc', fontWeight: 'bold' }}>
            <td>材料の総重量</td>
            <td>
              <input
                type="number"
                value={totalWeight ?? calculatedTotalWeight}
                placeholder={String(calculatedTotalWeight)}
                onChange={(event) => handleTotalWeightChange(event.target.value)}
              />
            </td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

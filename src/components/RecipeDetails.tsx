interface RecipeDetailsProps {
  description?: string;
  defaultBaseKey: string;
  baseIngredients: string[];
}

export function RecipeDetails({ description, defaultBaseKey, baseIngredients }: RecipeDetailsProps) {
  return (
    <div>
      {description && <label>{description}</label>}
      {baseIngredients.length > 0 && (
        <label>
          {defaultBaseKey}例: {baseIngredients.join(', ')}
        </label>
      )}
    </div>
  );
}

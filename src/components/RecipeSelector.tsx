import { useCallback, useMemo, useState } from 'react';
import Select, {
  components,
  type GroupBase,
  type InputActionMeta,
  type SingleValue,
  type SingleValueProps,
  type StylesConfig,
} from 'react-select';

import type { RecipePresets } from '../types';

import './RecipeSelector.css';

interface RecipeSelectorProps {
  presets: RecipePresets;
  selectedKey: string;
  onChange: (key: string) => void;
}

interface RecipeOption {
  value: string;
  label: string;
  searchText: string;
}

export function RecipeSelector({ presets, selectedKey, onChange }: RecipeSelectorProps) {
  const [inputValue, setInputValue] = useState('');

  const options = useMemo<RecipeOption[]>(() => {
    return Object.entries(presets).map(([key, preset]) => {
      const description = preset.description?.trim() ?? '';
      const label = description ? `${preset.name} - ${description}` : preset.name;
      const searchText = `${preset.name} ${description} ${key}`.toLowerCase();

      return {
        value: key,
        label,
        searchText,
      };
    });
  }, [presets]);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedKey) ?? null;
  }, [options, selectedKey]);

  const handleChange = useCallback(
    (option: SingleValue<RecipeOption>) => {
      if (option) {
        onChange(option.value);
        setInputValue('');
      }
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (value: string, action: InputActionMeta) => {
      switch (action.action) {
        case 'input-change':
          setInputValue(value);
          return value;
        case 'set-value':
          setInputValue('');
          return '';
        case 'menu-close':
        case 'input-blur':
        default:
          // Preserve the current typed text when focus leaves the field.
          return inputValue;
      }
    },
    [inputValue],
  );

  const selectStyles = useMemo<StylesConfig<RecipeOption, false>>(
    () => ({
      control: (base) => ({
        ...base,
        backgroundColor: 'var(--pico-form-element-background-color)',
        borderColor: 'var(--pico-form-element-border-color)',
        boxShadow: 'none',
        outline: 'none',
        '&:hover': {
          borderColor: 'var(--pico-form-element-border-color)',
        },
        '&:focus': {
          borderColor: 'var(--pico-form-element-border-color)',
          boxShadow: 'none',
        },
        '&:focus-visible': {
          outline: 'none',
          borderColor: 'var(--pico-form-element-border-color)',
        },
        '&:focus-within': {
          borderColor: 'var(--pico-form-element-border-color)',
          boxShadow: 'none',
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: 'var(--pico-color)',
      }),
      input: (base) => ({
        ...base,
        color: 'var(--pico-color)',
        outline: 'none',
      }),
      placeholder: (base) => ({
        ...base,
        color: 'var(--pico-muted-color)',
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: 'var(--pico-card-background-color)',
        color: 'var(--pico-color)',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? 'var(--pico-primary)'
          : state.isFocused
            ? 'var(--pico-primary-background)'
            : 'transparent',
        color: state.isSelected
          ? 'var(--pico-primary-inverse)'
          : 'var(--pico-color)',
      }),
    }),
    [],
  );

  const selectComponents = useMemo(() => {
    const SingleValueComponent = (
      props: SingleValueProps<RecipeOption, false, GroupBase<RecipeOption>>,
    ) => {
      if (inputValue) {
        return <components.SingleValue {...props}>{inputValue}</components.SingleValue>;
      }
      return <components.SingleValue {...props} />;
    };

    return { SingleValue: SingleValueComponent };
  }, [inputValue]);

  return (
    <label htmlFor="recipe">
      レシピ
      <Select<RecipeOption, false>
        inputId="recipe"
        instanceId="recipe"
        classNamePrefix="recipe-selector"
        options={options}
        value={selectedOption}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder="レシピを検索..."
        isSearchable
        isClearable={false}
        styles={selectStyles}
        filterOption={(candidate, rawInput) => {
          const normalized = rawInput.trim().toLowerCase();
          if (!normalized) {
            return true;
          }
          return candidate.data.searchText.includes(normalized);
        }}
        components={selectComponents}
      />
    </label>
  );
}

"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

type SearchInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
};

export function SearchInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Rechercher...",
  name,
}: SearchInputProps) {
  const t = useTranslations("form");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  const showLabel = label && label.trim() !== "";

  return (
    <div className="w-full">
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus-within:border-emerald-600">
        <input
          id={id}
          type="text"
          className="w-full p-2 ps-7 border-none rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={handleClear}
            aria-label={t("clear")}
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <Search className="absolute start-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>

      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
        />
      )}
    </div>
  );
}

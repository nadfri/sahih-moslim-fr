"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { useClickOutside } from "@/src/hooks/useClickOutside";

type MultiSelectProps = {
  id: string;
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  name?: string;
  error?: boolean;
  errorMessage?: string;
};

export function MultiSelect({
  id,
  label,
  options,
  selected,
  onChange,
  placeholder = "Rechercher...",
  name,
  error = false,
  errorMessage,
}: MultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selected.includes(option)
  );

  const handleSelect = (option: string) => {
    if (options.includes(option) && !selected.includes(option)) {
      const newSelected = [...selected, option];
      onChange(newSelected);
    }
    setSearchTerm("");
    inputRef.current?.blur();
    setIsOpen(false);
  };

  const handleRemove = (itemToRemove: string) => {
    const updatedSelected = selected.filter((item) => item !== itemToRemove);
    onChange(updatedSelected);
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

      <div
        ref={dropdownRef}
        className="relative"
      >
        <div
          className={`flex items-center w-full border rounded-md ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/30 focus-within:ring-red-500 focus-within:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus-within:ring-emerald-600 focus-within:border-emerald-600 bg-white dark:bg-gray-800"
          } focus-within:ring-1`}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          <div className="flex-1 flex flex-wrap items-center gap-1 px-2 py-1.5">
            {selected.map((item) => (
              <div
                key={item}
                className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="ml-1 text-emerald-600 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <input
              ref={inputRef}
              id={id}
              type="text"
              className={`flex-grow p-0.5 border-none focus:ring-0 focus:outline-none min-w-[100px] ${
                error
                  ? "bg-red-50 dark:bg-red-950/30"
                  : "bg-white dark:bg-gray-800 dark:text-gray-200"
              }`}
              placeholder={selected.length === 0 ? placeholder : ""}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          <button
            type="button"
            className={`p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500 rounded-r-md border-none ${
              error
                ? "bg-red-50 dark:bg-red-950/30"
                : "bg-white dark:bg-gray-800"
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            aria-label={isOpen ? "Fermer la liste" : "Ouvrir la liste"}
            tabIndex={-1}
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {isOpen && (
          <ul
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 dark:text-gray-200"
                  onMouseDown={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Aucun résultat trouvé"
                  : "Toutes les options sont sélectionnées"}
              </li>
            )}
          </ul>
        )}

        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {name &&
          selected.map((item, index) => (
            <input
              key={`${name}-${index}`}
              type="hidden"
              name={`${name}[${index}]`}
              value={item}
            />
          ))}
      </div>
    </div>
  );
}

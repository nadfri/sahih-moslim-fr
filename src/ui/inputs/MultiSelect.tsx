"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

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

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Filter options based on search term and already selected items
  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selected.includes(option)
  );

  // Handle selection of an option
  const handleSelect = (option: string) => {
    // Ensure the option is valid before adding it
    if (options.includes(option) && !selected.includes(option)) {
      const newSelected = [...selected, option];
      onChange(newSelected);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle removal of a selected item
  const handleRemove = (itemToRemove: string) => {
    const updatedSelected = selected.filter((item) => item !== itemToRemove);
    onChange(updatedSelected);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div
        ref={dropdownRef}
        className="relative"
      >
        {/* Selected items display */}
        <div
          className={`w-full min-h-[42px] p-1 border rounded-md ${
            error
              ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
              : "border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500"
          } focus-within:ring-2 flex flex-wrap gap-1`}
        >
          {selected.map((item) => (
            <div
              key={item}
              className="inline-flex items-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="ml-1 text-emerald-600 hover:text-emerald-800 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <input
            id={id}
            type="text"
            className={`flex-grow min-w-[120px] p-1 focus:outline-none ${
              error ? "bg-red-50" : ""
            }`}
            placeholder={selected.length === 0 ? placeholder : ""}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 cursor-pointer hover:bg-emerald-100"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">
                {searchTerm
                  ? "Aucun résultat trouvé"
                  : "Toutes les options sont sélectionnées"}
              </li>
            )}
          </ul>
        )}

        {/* Error message */}
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}

        {/* Hidden field for form handling */}
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

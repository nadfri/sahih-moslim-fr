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

  // Determine if the label should be shown (not empty string)
  const showLabel = label && label.trim() !== "";

  return (
    <div className="w-full">
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
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
              ? "border-red-500 bg-red-50 focus-within:ring-red-500 focus-within:border-red-500"
              : "border-gray-300 focus-within:ring-emerald-600 focus-within:border-emerald-600 bg-white"
          } focus-within:ring-1`}
          // Add onClick to open dropdown if not already open, mimicking input focus behavior
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {/* Removed p-2 from this div, rely on gap and element padding */}
          <div className="flex-1 flex flex-wrap items-center gap-1 px-2 py-1.5">
            {" "}
            {/* Adjusted padding slightly px-2 py-1.5 */}
            {selected.map((item) => (
              <div
                key={item}
                className="inline-flex items-center bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  // Prevent click propagation to the outer div's onClick
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="ml-1 text-emerald-600 hover:text-emerald-800 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {/* Ensure input has some vertical padding if needed, or adjust container padding */}
            <input
              id={id}
              type="text"
              className={`flex-grow p-0.5 border-none focus:ring-0 focus:outline-none min-w-[100px] ${
                // Added p-0.5 for slight vertical space
                error ? "bg-red-50" : "bg-white"
              }`}
              placeholder={selected.length === 0 ? placeholder : ""}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Prevent click propagation to the outer div's onClick
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          {/* Dropdown toggle button */}
          <button
            type="button"
            // Standard padding, match background, prevent input blur
            className={`p-2 text-gray-500 hover:text-emerald-700 rounded-r-md border-none ${
              error ? "bg-red-50" : "bg-white"
            }`}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus shift
            // Prevent click propagation to the outer div's onClick and toggle dropdown
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

        {/* Dropdown list */}
        {isOpen && (
          <ul
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
            // Prevent input blur when clicking inside the list
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 cursor-pointer hover:bg-emerald-100"
                  // Use onMouseDown for selection to avoid blur issues
                  onMouseDown={() => handleSelect(option)}
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

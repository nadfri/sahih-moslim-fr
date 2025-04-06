"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

type SearchSelectProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  error?: boolean;
  errorMessage?: string;
};

export function SearchSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  name,
  error = false,
  errorMessage,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleSelectOption = (option: string) => {
    // Ensure option is in the list before passing it
    if (options.includes(option)) {
      onChange(option);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // If the user types in a valid option and then moves away,
    // we want to update the value
    if (options.includes(newValue)) {
      onChange(newValue);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);

        // When closing by clicking outside, verify if current search term is valid
        if (options.includes(searchTerm)) {
          onChange(searchTerm);
        } else if (searchTerm !== "" && value !== "") {
          // Reset to current valid value if search term is invalid
          setSearchTerm(value);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options, onChange, searchTerm, value]);

  // Update search term when value changes
  useEffect(() => {
    // Don't update if input has focus to avoid disrupting typing
    if (document.activeElement !== inputRef.current) {
      setSearchTerm(value);
    }
  }, [value]);

  return (
    <div>
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
        <div
          className={`flex items-center border rounded-md ${
            error
              ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
              : "border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500"
          } focus-within:ring-2`}
        >
          <input
            ref={inputRef}
            id={id}
            type="text"
            className={`w-full p-2 rounded-md focus:outline-none ${error ? "bg-red-50" : ""}`}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // On blur, keep the valid value or reset to previous valid value
              setTimeout(() => {
                if (!options.includes(searchTerm)) {
                  setSearchTerm(value);
                }
              }, 100);
            }}
          />
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-emerald-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className={`p-2 cursor-pointer hover:bg-emerald-100 ${
                    value === option ? "bg-emerald-50 font-medium" : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">Aucun résultat trouvé</li>
            )}
          </ul>
        )}

        {/* Error message */}
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}

        {/* Hidden field for React Hook Form */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value}
          />
        )}
      </div>
    </div>
  );
}

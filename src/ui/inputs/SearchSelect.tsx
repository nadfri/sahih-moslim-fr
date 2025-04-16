"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type SearchSelectProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = `${id}-listbox`;

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handler for selecting an option from the list
  const handleSelectOption = useCallback(
    (option: string) => {
      if (options.includes(option)) {
        onChange(option);
        setInputValue(option);
        setIsOpen(false);
      }
    },
    [options, onChange]
  );

  // Handler for input field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value;
    setInputValue(currentInput);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Check if the currently displayed text in the input is a valid option
    if (options.includes(inputValue)) {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    } else {
      setInputValue(value); // Reset to the last valid committed value
    }
  }, [options, inputValue, value, onChange]);

  // Effect to handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]); // handleClose depends on inputValue, value, onChange, options

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div>
      {/* Label */}
      <label
        htmlFor={id}
        // Label styling
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      {/* Dropdown container */}
      <div
        ref={dropdownRef}
        className="relative"
      >
        {/* Input wrapper */}
        <div
          className={`flex items-center border rounded-md ${
            error // Conditional styling for error state
              ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
              : "border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500"
          } focus-within:ring-2`}
        >
          {/* Input field */}
          <input
            ref={inputRef}
            id={id}
            type="text"
            // Input styling
            className={`w-full p-2 rounded-l-md focus:outline-none ${error ? "bg-red-50" : ""}`}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            // Use handleClose directly onBlur for tabbing away etc.
            onBlur={handleClose}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            autoComplete="off"
          />
          {/* Dropdown toggle button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-emerald-700 rounded-r-md"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
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
            id={listboxId}
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
            role="listbox"
            aria-label={label}
            // Prevent input blur when clicking inside the list
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  id={`${id}-option-${option.replace(/\s+/g, "-")}`}
                  className={`p-2 cursor-pointer hover:bg-emerald-100 ${
                    value === option ? "bg-emerald-50 font-medium" : ""
                  }`}
                  onMouseDown={() => handleSelectOption(option)}
                  role="option"
                  aria-selected={value === option}
                >
                  {option}
                </li>
              ))
            ) : (
              <li
                className="p-2 text-gray-500 italic"
                role="option"
                aria-selected="false"
                aria-disabled="true"
              >
                Pas de résultat
              </li>
            )}
          </ul>
        )}

        {/* Error message display */}
        {error && errorMessage && (
          // Error text styling
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}

        {/* Hidden input for forms if name prop is provided */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value} // Use the committed value
          />
        )}
      </div>
    </div>
  );
}

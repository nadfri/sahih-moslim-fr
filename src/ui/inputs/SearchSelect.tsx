"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

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

  const handleSelectOption = useCallback(
    (option: string) => {
      if (options.includes(option)) {
        onChange(option);
        setInputValue(option);
        setIsOpen(false);
        inputRef.current?.focus();
      }
    },
    [options, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value;
    setInputValue(currentInput);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (options.includes(inputValue)) {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    } else {
      setInputValue(value);
    }
  }, [options, inputValue, value, onChange]);

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
  }, [handleClose]);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputValue(value);
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
            className={`w-full p-2 rounded-l-md focus:outline-none ${error ? "bg-red-50" : ""}`}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={handleClose}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            autoComplete="off"
          />
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-emerald-700 rounded-r-md"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer la liste" : "Ouvrir la liste"}
            tabIndex={-1}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {isOpen && (
          <ul
            id={listboxId}
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  id={`${id}-option-${option.replace(/\s+/g, "-")}`}
                  className={`p-2 cursor-pointer hover:bg-emerald-100 ${
                    value === option ? "bg-emerald-50 font-medium" : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
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
                Aucun résultat trouvé
              </li>
            )}
          </ul>
        )}

        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}

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

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { normalizeTextForSearch } from "@/src/utils/textNormalization";

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
  onInputChange?: (value: string) => void;
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
  onInputChange,
}: SearchSelectProps) {
  const t = useTranslations("form");

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = `${id}-listbox`;

  const filteredOptions = options.filter((option) => {
    const normalizedOption = normalizeTextForSearch(option);
    const normalizedInput = normalizeTextForSearch(inputValue);
    return normalizedOption.includes(normalizedInput);
  });

  const handleSelectOption = (option: string) => {
    if (options.includes(option)) {
      onChange(option);
      setInputValue(option);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value;
    setInputValue(currentInput);
    if (onInputChange) onInputChange(currentInput);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    onChange("");
    setInputValue("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (options.includes(inputValue)) {
          if (inputValue !== value) {
            onChange(inputValue);
          }
        } else {
          setInputValue(value);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options, inputValue, value, onChange]);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputValue(value);
    }
  }, [value]);

  const showLabel = label && label.trim() !== "";

  return (
    <div className="w-full relative">
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
          className={`flex items-center border rounded-md ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/30"
              : "border-gray-300 dark:border-gray-700 focus-within:border-emerald-600 bg-white dark:bg-gray-800"
          }`}
        >
          <input
            ref={inputRef}
            id={id}
            type="text"
            className={`w-full p-2 border-none rounded-l-md focus:outline-none ${
              error
                ? "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-white"
                : "bg-white dark:bg-gray-800 dark:text-gray-200"
            }`}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            autoComplete="off"
          />
          {inputValue && (
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-500"
              onClick={handleClear}
              aria-label={t("clear")}
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className={`p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500 rounded-r-md border-none ${
              error
                ? "bg-red-50 dark:bg-red-950/30"
                : "bg-white dark:bg-gray-800"
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t("close-list") : t("open-list")}
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
            id={listboxId}
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
            aria-label={label}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  id={`${id}-option-${option.replace(/\s+/g, "-")}`}
                  className="p-0"
                >
                  <button
                    type="button"
                    className={`w-full text-left p-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 ${
                      value === option
                        ? "bg-emerald-50 dark:bg-emerald-950/60 font-medium"
                        : ""
                    } dark:text-gray-200`}
                    onMouseDown={() => handleSelectOption(option)}
                    role="option"
                    aria-selected={value === option}
                    tabIndex={-1}
                  >
                    {option}
                  </button>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 dark:text-gray-400 italic">
                {t("no-results")}
              </li>
            )}
          </ul>
        )}

        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 absolute -bottom-5">
            {errorMessage}
          </p>
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

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { useClickOutside } from "@/src/hooks/useClickOutside";
import { useTranslations } from "next-intl";
import { normalizeTextForSearch } from "@/src/utils/textNormalization";

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
  const t = useTranslations("form");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const filteredOptions = options.filter((option) => {
    const normalizedOption = normalizeTextForSearch(option);
    const normalizedSearch = normalizeTextForSearch(searchTerm);
    return (
      normalizedOption.includes(normalizedSearch) && !selected.includes(option)
    );
  });

  const handleSelect = (option: string) => {
    if (options.includes(option) && !selected.includes(option)) {
      const newSelected = [...selected, option];
      onChange(newSelected);
    }
    setSearchTerm("");
    setHighlightedIndex(-1);
    inputRef.current?.blur();
    setIsOpen(false);
  };

  const handleRemove = (itemToRemove: string) => {
    const updatedSelected = selected.filter((item) => item !== itemToRemove);
    onChange(updatedSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="w-full">
      <div
        ref={dropdownRef}
        className="relative"
      >
        <div
          className={`flex items-center w-full border rounded-md ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/30"
              : "border-gray-300 dark:border-gray-700  focus-within:border-emerald-600 bg-white dark:bg-gray-800"
          }`}
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
                  className="ms-1 text-emerald-600 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <input
              ref={inputRef}
              id={id}
              type="text"
              className={`flex-grow p-0.5 border-none focus:outline-none min-w-[100px] ${
                error
                  ? "bg-red-50 dark:bg-red-950/30"
                  : "bg-white dark:bg-gray-800 dark:text-gray-200"
              }`}
              placeholder={selected.length === 0 ? placeholder : ""}
              aria-label={label || placeholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(-1);
              }}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={`${id}-listbox`}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `${id}-option-${highlightedIndex}`
                  : undefined
              }
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
            id={`${id}-listbox`}
            role="listbox"
            aria-multiselectable="true"
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected="false"
                  className={`p-2 cursor-pointer dark:text-gray-200 ${
                    index === highlightedIndex
                      ? "bg-emerald-100 dark:bg-emerald-900/50"
                      : "hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                  }`}
                  onMouseDown={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 dark:text-gray-400">
                {searchTerm ? t("noResult") : t("noOptionsAvailable")}
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

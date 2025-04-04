"use client";

import { useEffect, useRef, useState } from "react";

type MultiSelectProps = {
  id: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onRemove: (item: string) => void;
  placeholder?: string;
  required?: boolean;
};

export function MultiSelect({
  id,
  options,
  selected,
  onChange,
  onRemove,
  placeholder = "Sélectionner...",
  required = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrer les options non sélectionnées qui correspondent au terme de recherche
  const filteredOptions = options.filter(
    (option) => !selected.includes(option) && option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter une option à la sélection
  const handleSelectOption = (option: string) => {
    if (!selected.includes(option) && options.includes(option)) {
      onChange([...selected, option]);
    }
    setSearchTerm("");
    // Garder le dropdown ouvert après sélection pour permettre plusieurs sélections consécutives
    inputRef.current?.focus();
  };

  // Fermer le menu déroulant quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Afficher les éléments sélectionnés */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selected.map((item) => (
          <div
            key={item}
            className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm flex items-center group"
          >
            <span>{item}</span>
            <button
              type="button"
              className="ml-1 text-emerald-600 hover:text-emerald-800 focus:outline-none"
              onClick={() => onRemove(item)}
              aria-label={`Supprimer ${item}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Champ de recherche */}
      <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className="w-full p-2 rounded-md focus:outline-none"
          placeholder={selected.length === 0 ? placeholder : "Ajouter plus..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-emerald-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Liste déroulante */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                className="p-2 cursor-pointer hover:bg-emerald-100"
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">
              {searchTerm ? "Aucun résultat trouvé" : "Toutes les options sont déjà sélectionnées"}
            </li>
          )}
        </ul>
      )}

      {/* Champ caché pour la validation si requis */}
      {required && selected.length === 0 && (
        <input
          type="hidden"
          name={id}
          required
        />
      )}
    </div>
  );
}

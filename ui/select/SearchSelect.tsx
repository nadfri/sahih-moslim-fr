"use client";

import { useEffect, useRef, useState } from "react";

type SearchSelectProps = {
  id: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

export function SearchSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  required = false,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrer les options en fonction du terme de recherche
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));

  // Gestionnaire pour la sélection d'une option
  const handleSelectOption = (option: string) => {
    // S'assurer que l'option est dans la liste avant de la passer
    if (options.includes(option)) {
      onChange(option);
    }
    setSearchTerm("");
    setIsOpen(false);
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

  // Mettre à jour le terme de recherche quand la valeur change
  useEffect(() => {
    // Ne pas mettre à jour si l'input a le focus pour éviter de perturber la saisie
    if (document.activeElement !== inputRef.current) {
      setSearchTerm(value);
    }
  }, [value]);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className="w-full p-2 rounded-md focus:outline-none"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          required={required && !value}
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

      {/* Champ caché pour la validation du formulaire si requis */}
      {required && (
        <input
          type="hidden"
          name={id}
          value={value}
          required
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import type { ItemType, VariantType } from "@/src/types/types";
import { Input } from "@/src/ui/forms/inputs/Input/Input";
import { CardEdit } from "../CardEdit/CardEdit";

type Props = {
  items: ItemType[];
  variant: VariantType;
};

const variantOptions = {
  chapters: {
    label: "Liste des chapitres",
    placeholder: "Rechercher un chapitre...",
    name: "chapitre",
  },
  sahabas: {
    label: "Liste des sahabas",
    placeholder: "Rechercher un sahaba...",
    name: "sahaba",
  },
  transmitters: {
    label: "Liste des transmetteurs",
    placeholder: "Rechercher un transmetteur...",
    name: "transmetteur",
  },
};

export function FilteredCardsEdit({ items, variant }: Props) {
  const [inputValue, setInputValue] = useState("");

  // Filter items based on search
  const filteredItems = (() => {
    if (!inputValue) return items;
    const searchLower = inputValue.toLowerCase();

    return items.filter((item) => {
      const label = (item.name_fr ?? "").toLowerCase();
      return label.includes(searchLower);
    });
  })();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">
        {variantOptions[variant].label}
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          id="search-bar"
          label="Recherche"
          type="text"
          placeholder={variantOptions[variant].placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {/* item List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            Aucun {variantOptions[variant].name} trouvé
          </p>
        ) : (
          filteredItems.map((item) => (
            <CardEdit
              key={item.id}
              item={item}
              items={items}
              variant={variant}
            />
          ))
        )}
      </div>
    </div>
  );
}

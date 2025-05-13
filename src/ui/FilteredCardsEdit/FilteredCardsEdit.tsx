"use client";

import { useMemo, useState } from "react";

import type { ItemType, VariantType } from "@/src/types/types"; // Import ItemType
import { CardEdit } from "../CardEdit/CardEdit";

type Props = {
  items: ItemType[];
  variant: VariantType;
};

export function FilteredCardsEdit({ items, variant }: Props) {
  const [inputValue, setInputValue] = useState("");

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!inputValue) return items;
    const searchLower = inputValue.toLowerCase();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        (item.nameArabic && item.nameArabic.toLowerCase().includes(searchLower))
    );
  }, [items, inputValue]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">
        Liste des {variant}
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un chapitre..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* item List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            Aucun {variant} trouvé
          </p>
        ) : (
          filteredItems.map((item) => (
            <CardEdit
              key={item.id}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
}

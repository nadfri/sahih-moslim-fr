"use client";

import { useMemo, useState } from "react";

import { ItemType, VariantType } from "@/src/types/types";
import { Card } from "@/src/ui/Card/Card";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";

type Props = {
  items: ItemType[];
  variant: VariantType;
};

const placeholder = {
  chapters: "Rechercher un chapitre...",
  sahabas: "Rechercher un compagnon...",
  narrators: "Rechercher un narrateur...",
};

export function FilteredList({ items, variant }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");

  // Dynamically filter items based on input value
  const filteredItems = useMemo(() => {
    if (!inputValue) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [items, inputValue]);

  // Extract names for SearchSelect options
  const options = useMemo(() => items.map((item) => item.name), [items]);

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-10">
        <SearchSelect
          id="search"
          label=""
          options={options}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            setInputValue(value);
          }}
          placeholder={placeholder[variant]}
          // Add onInputChange to update inputValue dynamically
          onInputChange={setInputValue}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/*Links*/}
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            item={item}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

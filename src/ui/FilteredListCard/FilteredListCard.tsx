"use client";

import { useState } from "react";

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
  transmitters: "Rechercher un transmetteur...",
};

export function FilteredListCard({ items, variant }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");

  // Dynamically filter items based on input value
  const filteredItems = !inputValue
    ? items
    : items.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      );

  // Extract names for SearchSelect options
  const options = items.map((item) => item.name);

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

"use client";

import { useState } from "react";

import { ItemType, VariantType } from "@/src/types/types";
import { Card } from "@/src/ui/FilteredListCard/Card/Card";
import { SearchSelect } from "@/src/ui/forms/inputs/SearchSelect/SearchSelect";
import { useTranslations } from "next-intl";

type Props = {
  items: ItemType[];
  variant: VariantType;
};

export function FilteredListCard({ items, variant }: Props) {
  const t = useTranslations("search");

  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");

  // Dynamically filter items based on input value
  const filteredItems = !inputValue
    ? items
    : items.filter((item) =>
        item.name_fr.toLowerCase().includes(inputValue.toLowerCase())
      );

  // Extract names for SearchSelect options
  const options = items.map((item) => item.name_fr);

  const placeholder = {
    chapters: t("search-chapter"),
    sahabas: t("search-sahaba"),
    transmitters: t("search-transmitter"),
  };

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

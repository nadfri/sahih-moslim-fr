"use client";

import { useState } from "react";

import { ItemType, VariantType } from "@/src/types/types";
import { SearchSelect } from "@/src/ui/forms/inputs/SearchSelect/SearchSelect";
import { useLocale, useTranslations } from "next-intl";
import { CardItem } from "./CardItem/CardItem";
import { getLocalizedName } from "@/src/utils/getLocalizedName";
import { normalizeTextForSearch } from "@/src/utils/textNormalization";

type Props = {
  items: ItemType[];
  variant: VariantType;
};

export function FilteredListCardItem({ items, variant }: Props) {
  const t = useTranslations("search");
  const locale = useLocale();

  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");

  // Dynamically filter items based on input value with text normalization
  // This ignores accents and special characters for better search experience
  const filteredItems = !inputValue
    ? items
    : items.filter((item) => {
        const itemName = getLocalizedName(item, locale);
        const normalizedItemName = normalizeTextForSearch(itemName);
        const normalizedInput = normalizeTextForSearch(inputValue);

        return normalizedItemName.includes(normalizedInput);
      });

  // Extract names for SearchSelect options
  const options = items.map((item) => getLocalizedName(item, locale));

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
          <CardItem
            key={item.id}
            item={item}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

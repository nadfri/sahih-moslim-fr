"use client";

import { useState } from "react";

import { ItemType, VariantType } from "@/src/types/types";
import { SearchInput } from "@/src/ui/forms/inputs/SearchInput/SearchInput";
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

  const placeholder = {
    chapters: t("search-chapter"),
    sahabas: t("search-sahaba"),
    transmitters: t("search-transmitter"),
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-10">
        <SearchInput
          id="search"
          label=""
          value={inputValue}
          onChange={setInputValue}
          placeholder={placeholder[variant]}
        />
      </div>

      {filteredItems.length > 0 ? (
        // Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <CardItem
              key={item.id}
              item={item}
              variant={variant}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {t("noResults")}
        </p>
      )}
    </div>
  );
}

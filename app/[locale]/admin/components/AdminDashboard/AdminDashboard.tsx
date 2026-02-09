"use client";

import { VariantType, ItemType } from "@/src/types/types";
import { AddItemForm } from "../forms/AddItemForm";
import { useState } from "react";
import { DataManagement } from "../DataManagement/DataManagement";
import { DatasType } from "../../page";
import { FilteredCardsEdit } from "../FilteredCardsEdit/FilteredCardsEdit";

const variantOptions: { label: string; value: VariantType }[] = [
  { label: "Chapitres", value: "chapters" },
  { label: "Compagnons", value: "sahabas" },
  { label: "Transmetteurs", value: "transmitters" },
];

export function AdminDashboard({ datas }: { datas: DatasType }) {
  const [selectedVariant, setSelectedVariant] =
    useState<VariantType>("chapters");

  const { chapters, sahabas, transmitters } = datas;

  let currentItems: ItemType[];

  switch (selectedVariant) {
    case "chapters":
      currentItems = chapters;
      break;

    case "sahabas":
      currentItems = sahabas;
      break;

    case "transmitters":
      currentItems = transmitters;
      break;

    default:
      currentItems = chapters; // Fallback case
      break;
  }

  return (
    <div className="space-y-8">
      <DataManagement datas={datas} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {variantOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
              selectedVariant === option.value
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="variantSelector"
              value={option.value}
              checked={selectedVariant === option.value}
              onChange={() => setSelectedVariant(option.value)}
              className="sr-only"
            />
            <span className="font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      <AddItemForm
        key={selectedVariant}
        items={currentItems}
        variant={selectedVariant}
      />

      <div>
        <FilteredCardsEdit
          key={selectedVariant}
          items={currentItems}
          variant={selectedVariant}
        />
      </div>
    </div>
  );
}

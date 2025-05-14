import { Pencil, Trash2 } from "lucide-react";

import type { ItemType } from "@/src/types/types";

type Props = {
  item: ItemType;
};

export function CardEdit({ item }: Props) {
  const onEdit = (data: {
    id: string;
    name: string;
    index?: number;
    nameArabic?: string;
  }) => {
    // Handle edit action
    console.log("Edit item:", data);
  };

  const onDelete = (id: string) => {
    // Handle delete action
    console.log("Delete item with id:", id);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex">
      {/* Main content on the left */}
      <div className="flex-grow flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* Index */}
          {item.index && (
            <span className="inline-flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm font-medium h-6 min-w-6 px-1.5 rounded-md">
              {item.index}
            </span>
          )}

          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {item.name}
          </h3>
        </div>

        {item.nameArabic && (
          <div className="mt-1">
            <span className="block text-emerald-600 dark:text-emerald-400 text-lg font-arabic">
              {item.nameArabic}
            </span>
          </div>
        )}

        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Slug: {item.slug}
        </div>
      </div>

      {/* Action buttons on the right, centered vertically */}
      <div className="flex items-center ml-3">
        <button
          type="button"
          onClick={() =>
            onEdit({
              id: item.id,
              name: item.name,
              index: item.index ?? undefined, // Ensure index is number | undefined
              nameArabic: item.nameArabic || "",
            })
          }
          className="p-1.5 rounded text-orange-500 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/70 flex items-center justify-center"
          aria-label="Éditer"
          title="Éditer"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center"
          aria-label="Supprimer"
          title="Supprimer"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

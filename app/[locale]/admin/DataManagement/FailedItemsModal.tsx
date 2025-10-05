import { X } from "lucide-react";

type FailedItem = { item?: unknown; reason: string };

type Props = {
  items: FailedItem[];
  onClose: () => void;
};

export function FailedItemsModal({ items, onClose }: Props) {
  if (!items || items.length === 0) return null;

  const getFailedItemLabel = (obj: unknown) => {
    if (!obj || typeof obj !== "object") return "Item";
    const record = obj as Record<string, unknown>;
    if (typeof record.numero === "number") return `Hadith #${record.numero}`;
    if (typeof record.name_fr === "string") return record.name_fr;
    if (typeof record.name === "string") return record.name;
    return "Item";
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold dark:text-white">
            Échecs d'import
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4 text-sm dark:text-gray-300">
          Certains éléments n'ont pas pu être importés. Voir la liste ci-dessous
          :
        </div>
        <ul className="mb-4 text-sm list-disc ps-4 space-y-1">
          {items.map((f, i) => (
            <li
              key={i}
              className="text-red-700 dark:text-red-400"
            >{`${getFailedItemLabel(f.item)} — ${f.reason}`}</li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

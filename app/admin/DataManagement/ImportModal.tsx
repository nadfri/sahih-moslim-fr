"use client";

import { ExportedHadithType, ItemType } from "@/src/types/types";

type Props = {
  isOpen: boolean;
  titleId: string;
  selectedFile?: File | null;
  previewItems: Array<ExportedHadithType | ItemType>;
  isImporting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ImportModal({
  isOpen,
  titleId,
  selectedFile,
  previewItems,
  isImporting,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-2">
          <h2
            className="text-lg font-semibold dark:text-white"
            id={titleId}
          >
            Confirmer l'import
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="mb-4 dark:text-gray-300">
          Êtes-vous sûr de vouloir importer ce fichier JSON ?
        </div>
        {selectedFile && (
          <div className="mb-4 p-3 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-sm">
            <div className="font-medium mb-1">Fichier sélectionné :</div>
            <div>{selectedFile.name}</div>
            <div className="text-xs mt-1 opacity-75">
              Taille : {(selectedFile.size / 1024).toFixed(1)} KB
            </div>
          </div>
        )}
        {previewItems.length > 0 && (
          <div className="mb-4 max-h-48 overflow-auto rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs">
            <div className="font-medium mb-1 text-emerald-700 dark:text-emerald-300">
              Aperçu des items à importer :
            </div>
            <ul className="list-disc pl-4">
              {previewItems.slice(-10).map((item) => (
                <li
                  key={
                    "id" in item
                      ? (item as ItemType).id
                      : `hadith-${(item as ExportedHadithType).numero}`
                  }
                  className="mb-1 text-sm text-emerald-700 dark:text-emerald-300"
                >
                  {"name" in item
                    ? (item as ItemType).name
                    : `Hadith #${(item as ExportedHadithType).numero}`}
                </li>
              ))}
              {previewItems.length > 10 && (
                <li className="text-xs text-gray-500 dark:text-gray-400">
                  ...et {previewItems.length - 10} autres
                </li>
              )}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isImporting}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isImporting}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isImporting ? "Importation..." : "Importer"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useId, useRef } from "react";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string | React.ReactNode;
  hadithCount?: number;
};

export function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  loading = false,
  title = "Supprimer cet élément ?",
  description = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  hadithCount = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleId = useId();

  if (!open) return null;

  const handleCancel = () => {
    if (ref.current) {
      ref.current.classList.replace("fadeIn", "fadeOut");
      timeoutRef.current = setTimeout(onCancel, 200);
    }
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2 transition-opacity duration-200 fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full moveUp">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">{title}</h2>
        <div className="mb-4 dark:text-gray-300">{description}</div>
        {hadithCount > 0 && (
          <div className="mb-4 p-3 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-sm">
            {`Attention : ${hadithCount} hadith(s) lié(s) seront rattachés à « Inconnu ».`}
            <br />
            Cette action est irréversible.
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ExportedHadithType, ItemType } from "@/src/types/types";

type Props = {
  selectedFile: File | null;
  previewItems: Array<ExportedHadithType | ItemType>;
  selectedEndpoint?: string;
};

export function ImportConfirmModal({
  selectedFile,
  previewItems,
  selectedEndpoint,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  const close = () => {
    if (ref.current) {
      ref.current.classList.replace("fadeIn", "fadeOut");
      // Schedule close event with defensive guards for test environments
      timeoutRef.current = window.setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("admin:close-import-modal"));
        }
      }, 200);
    } else {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("admin:close-import-modal"));
      }
    }
  };

  // Ensure pending timeouts are cleared on unmount to avoid callbacks after teardown
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleConfirm = async () => {
    if (!selectedFile || !selectedEndpoint) return;
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const resp = await fetch(`/api/import/${selectedEndpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok) {
        if (
          data.failed &&
          Array.isArray(data.failed) &&
          data.failed.length > 0
        ) {
          window.dispatchEvent(
            new CustomEvent("admin:import-failed-items", {
              detail: { failed: data.failed },
            })
          );
          toast.warn(
            `⚠️ ${data.failed.length} item(s) n'ont pas pu être importés. Voir détails.`,
            { position: "top-right", autoClose: 5000 }
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("admin:import-done", { detail: {} })
          );
          toast.success("✅ Import réussi !", {
            position: "top-right",
            autoClose: 3000,
          });
          try {
            router.refresh();
          } catch {}
        }
      } else {
        toast.error("❌ Erreur lors de l'import", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'import", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsImporting(false);
      close();
    }
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2 transition-opacity duration-200 fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full moveUp">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold dark:text-white">
            Confirmer l'import
          </h2>
          <button
            type="button"
            onClick={close}
            disabled={isImporting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
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
          <div className="mb-4 max-h-48 overflow-auto rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-800 dark:text-emerald-200">
            <div className="font-medium mb-1 text-emerald-700 dark:text-emerald-300">
              Aperçu des items à importer :
            </div>
            <ul className="list-disc pl-4">
              {previewItems.slice(-10).map((item) => (
                <li
                  key={
                    "id" in item
                      ? item.id
                      : `hadith-${(item as ExportedHadithType).numero}`
                  }
                  className="mb-1 text-sm text-emerald-700 dark:text-emerald-300"
                >
                  {"name_fr" in item && typeof item.name_fr === "string"
                    ? item.name_fr
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
            onClick={close}
            disabled={isImporting}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            disabled={isImporting}
            aria-live="polite"
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 dark:text-white"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                Importation...
              </>
            ) : (
              "Importer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  file: File | null;
};

export function RestoreConfirmModal({ file }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  if (!file) return null;

  const close = () => {
    if (ref.current) {
      ref.current.classList.replace("fadeIn", "fadeOut");
      timeoutRef.current = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("admin:close-restore-modal"));
      }, 200);
    } else {
      window.dispatchEvent(new CustomEvent("admin:close-restore-modal"));
    }
  };

  const performRestore = async () => {
    setIsRestoring(true);
    try {
      toast.info("🔄 Restauration SQL en cours...", {
        position: "top-right",
        autoClose: false,
      });

      const formData = new FormData();
      formData.append("file", file as File);

      const response = await fetch("/api/full-restore", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Erreur lors de la restauration complète"
        );
      }

      const result = await response.json();

      toast.dismiss();
      toast.success(
        `✅ Restauration SQL terminée avec succès !\n\n⏰ Restauré le: ${new Date(result.restoredAt).toLocaleString()}\n\n⚠️ Toutes les données précédentes ont été supprimées.`,
        { position: "top-right", autoClose: 8000 }
      );
      window.dispatchEvent(
        new CustomEvent("admin:restore-done", {
          detail: { restoredAt: result.restoredAt },
        })
      );
      try {
        router.push("/");
      } catch {}
    } catch (error) {
      console.error("Erreur lors de la restauration complète:", error);
      toast.dismiss();
      toast.error(
        `❌ Erreur lors de la restauration: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        { position: "top-right", autoClose: 5000 }
      );
      window.dispatchEvent(
        new CustomEvent("admin:restore-failed", { detail: { error } })
      );
    } finally {
      setIsRestoring(false);
      close();
    }
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-2">
          <h2
            className="text-lg font-semibold dark:text-white"
            id="restore-title"
          >
            Confirmer la restauration
          </h2>
          <button
            type="button"
            onClick={close}
            disabled={isRestoring}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4 dark:text-gray-300">
          Êtes-vous sûr de vouloir restaurer la base de données depuis ce
          fichier ?
        </div>
        <div className="mb-4 p-3 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm">
          <div className="font-medium mb-1">Fichier sélectionné :</div>
          <div>{file.name}</div>
          <div className="text-xs mt-1 opacity-75">
            Taille : {(file.size / 1024).toFixed(1)} KB
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={isRestoring}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={performRestore}
            disabled={isRestoring}
            className="px-4 py-2 rounded-md bg-stone-600 hover:bg-stone-700 text-white dark:bg-stone-700 dark:hover:bg-stone-800 dark:text-white"
          >
            {isRestoring ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                Restauration...
              </>
            ) : (
              "Restaurer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

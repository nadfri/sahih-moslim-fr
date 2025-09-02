"use client";

import { useState } from "react";
import { Download, HardDrive } from "lucide-react";
import { toast } from "react-toastify";

// Self-contained backup + restore UI.
// Emits a `admin:restore-file` CustomEvent when a restore file is selected.
export function BackupRestoreSection() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadBackup = async () => {
    setIsGenerating(true);
    try {
      toast.info("🔄 Génération du backup SQL en cours...", {
        position: "top-right",
        autoClose: false,
      });

      const response = await fetch("/api/full-backup", { method: "GET" });
      if (!response.ok)
        throw new Error("Erreur lors de la génération du backup");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) a.download = filenameMatch[1];
        else
          a.download = `sahih-muslim-fr-backup-${new Date().toISOString().split("T")[0]}.sql`;
      } else {
        a.download = `sahih-muslim-fr-backup-${new Date().toISOString().split("T")[0]}.sql`;
      }

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success("✅ Backup SQL téléchargé avec succès !", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Erreur lors du téléchargement du backup:", err);
      toast.dismiss();
      toast.error(
        `❌ Erreur lors du téléchargement: ${err instanceof Error ? err.message : "Erreur inconnue"}`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelected = (file: File | null) => {
    // Emit a custom event for parent to pick up and show confirm modal
    const evt = new CustomEvent("admin:restore-file", { detail: { file } });
    window.dispatchEvent(evt);
    toast.info("Fichier prêt pour restauration");
  };

  return (
    <div className="mt-8 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">
          Sauvegarde Base de Données
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadBackup}
          type="button"
          disabled={isGenerating}
          className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow-md transition-all duration-200 font-medium disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2" />
              <span>Génération...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Télécharger Backup</span>
            </>
          )}
        </button>
        <label
          htmlFor="restore-file-input"
          aria-label="Restaurer depuis backup"
          className="flex justify-center items-center gap-3 p-3 bg-gradient-to-r from-stone-500 to-stone-600 rounded-lg shadow-md cursor-pointer"
        >
          <div className="flex-1">
            <div className="font-medium text-stone-100 flex justify-center items-center gap-2">
              <HardDrive className="w-5 h-5 text-stone-200" />
              <span>Restaurer depuis Backup</span>
            </div>
            <input
              id="restore-file-input"
              type="file"
              accept=".backup,.sql"
              onChange={(e) => {
                const input = e.currentTarget as HTMLInputElement;
                const file = input.files?.[0] || null;
                handleFileSelected(file);
                input.value = "";
              }}
              className="hidden"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

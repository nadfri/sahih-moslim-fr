"use client";

import React from "react";
import { Download, HardDrive } from "lucide-react";

type Props = {
  handleDownloadBackup: () => void;
  restoreInputRef: React.RefObject<HTMLInputElement | null>;
  onRestoreFileSelected: (file: File | null) => void;
  isGenerating?: boolean;
};

export function BackupRestoreSection({
  handleDownloadBackup,
  restoreInputRef,
  onRestoreFileSelected,
  isGenerating,
}: Props) {
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
              ref={restoreInputRef}
              type="file"
              accept=".backup,.sql"
              onChange={(e) => {
                const input = e.currentTarget as HTMLInputElement;
                const file = input.files?.[0] || null;
                onRestoreFileSelected(file);
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

"use client";

import { useState, useId, useRef } from "react";
import {
  Download,
  Upload,
  Database,
  FileText,
  Users,
  BookOpen,
  User,
  HardDrive,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

const exportOptions = [
  {
    label: "Chapitres",
    endpoint: "/api/export/chapters",
    filename: "chapters.json",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Compagnons",
    endpoint: "/api/export/sahabas",
    filename: "sahabas.json",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Transmetteurs",
    endpoint: "/api/export/transmitters",
    filename: "transmitters.json",
    icon: User,
    color: "text-stone-600 dark:text-stone-400",
  },
  {
    label: "Hadiths",
    endpoint: "/api/export/hadiths",
    filename: "hadiths.json",
    icon: FileText,
    color: "text-emerald-700 dark:text-emerald-300",
  },
];

const importOptions = [
  {
    label: "Chapitres",
    endpoint: "/api/import/chapters",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Compagnons",
    endpoint: "/api/import/sahabas",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Transmetteurs",
    endpoint: "/api/import/transmitters",
    icon: User,
    color: "text-stone-600 dark:text-stone-400",
  },
  {
    label: "Hadiths",
    endpoint: "/api/import/hadiths",
    icon: FileText,
    color: "text-emerald-700 dark:text-emerald-300",
  },
];

export function DataManagement() {
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleId = useId();

  const handleExport = async (endpoint: string, filename: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Erreur lors de l'export");
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch("/api/backup");
      if (!response.ok) throw new Error("Backup failed");

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Backup error:", error);
      alert("Erreur lors du backup");
    }
  };

  const handleRestore = async (file: File) => {
    // For restore, we'd need to upload the file and call the API
    // But for simplicity, just alert
    console.log("Restore file:", file);
    alert("Fonctionnalité de restore à implémenter");
  };

  const handleImportClick = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setIsImportModalOpen(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile || !selectedEndpoint) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`/api/import/${selectedEndpoint}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Import réussi !");
        window.location.reload();
      } else {
        alert("Erreur lors de l'import");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'import");
    } finally {
      setIsImporting(false);
      setIsImportModalOpen(false);
      setSelectedFile(null);
      setSelectedEndpoint("");
    }
  };

  const handleImportCancel = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
    setSelectedEndpoint("");
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/20 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/50 overflow-hidden">
        <button
          onClick={() => setIsDataManagementOpen(!isDataManagementOpen)}
          className="w-full p-3 flex items-center justify-between hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Database className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              Gestion des Données
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              {isDataManagementOpen ? "Masquer" : "Afficher"}
            </span>
            {isDataManagementOpen ? (
              <ChevronUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isDataManagementOpen
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Export */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                    Exporter en JSON
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {exportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.endpoint}
                        onClick={() =>
                          handleExport(option.endpoint, option.filename)
                        }
                        className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors`}
                          >
                            <Icon className={`w-5 h-5 ${option.color}`} />
                          </div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                            {option.label}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <span className="text-sm font-medium">
                            Télécharger
                          </span>
                          <Download className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Import */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                    Importer depuis JSON
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {importOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.endpoint}
                        className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-md bg-amber-50 dark:bg-amber-900/30 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors`}
                          >
                            <Icon className={`w-5 h-5 ${option.color}`} />
                          </div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                            {option.label}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <span className="text-sm font-medium">Importer</span>
                          <Upload className="w-4 h-4" />
                        </div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                              handleImportClick(option.endpoint);
                            }
                          }}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Backup/Restore */}
          <div className="mt-8 p-6">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">
                Sauvegarde Base de Données
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleBackup}
                className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                <Database className="w-5 h-5" />
                Créer un Backup
              </button>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-stone-500 to-stone-600 rounded-lg shadow-md">
                <HardDrive className="w-5 h-5 text-stone-200" />
                <div className="flex-1">
                  <div className="font-medium text-stone-100 mb-1">
                    Restaurer depuis Backup
                  </div>
                  <input
                    type="file"
                    accept=".backup,.sql"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleRestore(file);
                    }}
                    className="w-full text-sm text-stone-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-stone-700 file:text-stone-200 hover:file:bg-stone-600 file:transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Confirmation Modal */}
      {isImportModalOpen && (
        <div
          ref={ref}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2 transition-opacity duration-200 fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full moveUp">
            <div className="flex items-center justify-between mb-2">
              <h2
                className="text-lg font-semibold dark:text-white"
                id={titleId}
              >
                Confirmer l'import
              </h2>
              <button
                onClick={() => {
                  if (ref.current) {
                    ref.current.classList.replace("fadeIn", "fadeOut");
                    timeoutRef.current = setTimeout(handleImportCancel, 200);
                  }
                }}
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
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (ref.current) {
                    ref.current.classList.replace("fadeIn", "fadeOut");
                    timeoutRef.current = setTimeout(handleImportCancel, 200);
                  }
                }}
                disabled={isImporting}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={isImporting}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 dark:text-white"
              >
                {isImporting ? "Importation..." : "Importer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

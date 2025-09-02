"use client";

import { useState, useId, useRef } from "react";
import {
  Download,
  Upload,
  Database,
  BookText,
  Users,
  UsersRound,
  BookOpen,
  HardDrive,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { ItemFormValues } from "@/src/types/types";

const dataOptions = [
  {
    key: "chapters",
    label: "Chapitres",
    icon: BookOpen,
    export: {
      endpoint: "/api/export/chapters",
      filename: "chapters.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "chapters",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    key: "sahabas",
    label: "Compagnons",
    icon: UsersRound,
    export: {
      endpoint: "/api/export/sahabas",
      filename: "sahabas.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "sahabas",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    key: "transmitters",
    label: "Transmetteurs",
    icon: Users,
    export: {
      endpoint: "/api/export/transmitters",
      filename: "transmitters.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "transmitters",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    key: "hadiths",
    label: "Hadiths",
    icon: BookText,
    export: {
      endpoint: "/api/export/hadiths",
      filename: "hadiths.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "hadiths",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
];

export function DataManagement() {
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);
  const [previewItems, setPreviewItems] = useState<ItemFormValues[]>([]);
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
      toast.success("✅ Export réussi !");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("❌ Erreur lors de l'export");
    }
  };

  const handleDownloadBackup = async () => {
    setIsGeneratingBackup(true);

    try {
      toast.info("🔄 Génération du backup SQL en cours...", {
        position: "top-right",
        autoClose: false,
      });

      const response = await fetch("/api/full-backup", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du backup");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Utiliser le nom du fichier fourni par l'API via Content-Disposition
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          a.download = filenameMatch[1];
        } else {
          // Fallback si le header n'est pas correctement formaté
          a.download = `sahih-muslim-fr-backup-${new Date().toISOString().split("T")[0]}.sql`;
        }
      } else {
        // Fallback si le header n'existe pas
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
    } catch (error) {
      console.error("Erreur lors du téléchargement du backup:", error);
      toast.dismiss();
      toast.error(
        `❌ Erreur lors du téléchargement: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setIsGeneratingBackup(false);
    }
  };

  const handleRestore = async (file: File) => {
    const confirmed = window.confirm(
      "⚠️ ATTENTION: Cette action va supprimer TOUTES les données actuelles et les remplacer par celles du fichier SQL. Cette action est IRRÉVERSIBLE et nécessite un fichier .sql généré par pg_dump.\n\nVoulez-vous continuer ?"
    );

    if (!confirmed) return;

    try {
      toast.info("🔄 Restauration SQL en cours...", {
        position: "top-right",
        autoClose: false,
      });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/full-restore", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la restauration complète"
        );
      }

      const result = await response.json();

      toast.dismiss();
      toast.success(
        `✅ Restauration SQL terminée avec succès !\n\n⏰ Restauré le: ${new Date(result.restoredAt).toLocaleString()}\n\n⚠️ Toutes les données précédentes ont été supprimées.`,
        {
          position: "top-right",
          autoClose: 8000,
        }
      );

      // Recharger la page pour voir les changements
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Erreur lors de la restauration complète:", error);
      toast.dismiss();
      toast.error(
        `❌ Erreur lors de la restauration: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  const handleImportClick = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setIsImportModalOpen(true);
  };

  // Reusable file input change handler used by import inputs
  const handleFileChange = (file: File | undefined, importEndpoint: string) => {
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setPreviewItems(Array.isArray(json) ? json : []);
      } catch {
        setPreviewItems([]);
      }
    };
    reader.readAsText(file);
    handleImportClick(importEndpoint);
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
        toast.success("✅ Import réussi !", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("❌ Erreur lors de l'import", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("❌ Erreur lors de l'import", {
        position: "top-right",
        autoClose: 5000,
      });
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
                  {dataOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={`${option.key}-export`}
                        onClick={() =>
                          handleExport(
                            option.export.endpoint,
                            option.export.filename
                          )
                        }
                        className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors`}
                          >
                            <Icon
                              className={`w-5 h-5 ${option.export.color}`}
                            />
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
                  {dataOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={`${option.key}-import`}
                        className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-md bg-amber-50 dark:bg-amber-900/30 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors`}
                          >
                            <Icon
                              className={`w-5 h-5 ${option.import.color}`}
                            />
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
                            handleFileChange(file, option.import.endpoint);
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
                onClick={handleDownloadBackup}
                disabled={isGeneratingBackup}
                className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg shadow-md hover:shadow-lg disabled:hover:shadow-md transition-all duration-200 font-medium"
              >
                {isGeneratingBackup ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Télécharger Backup
                  </>
                )}
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
            {previewItems.length > 0 && (
              <div className="mb-4 max-h-48 overflow-auto rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs scrollbar-thin scrollbar-thumb-emerald-400 dark:scrollbar-thumb-emerald-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-900 text-gray-800 dark:text-emerald-200">
                <div className="font-medium mb-1 text-emerald-700 dark:text-emerald-300">
                  Aperçu des items à importer :
                </div>
                <ul className="list-disc pl-4">
                  {previewItems.slice(0, 10).map((item, idx) => (
                    <li
                      key={idx}
                      className="mb-1 text-sm text-emerald-700 dark:text-emerald-300"
                    >
                      {item.name}
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

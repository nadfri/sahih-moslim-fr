"use client";

import { useState, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  BookText,
  Users,
  UsersRound,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  ExportedHadithType,
  ExportedHadithSchema,
  ItemType,
  ImportItemSchema,
  ChapterImportSchema,
} from "@/src/types/types";
import { ExportSection } from "./ExportSection";
import { ImportSection } from "./ImportSection";
import { BackupRestoreSection } from "./BackupRestoreSection";
// ImportModal available if needed elsewhere

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
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);
  const [failedItems, setFailedItems] = useState<
    Array<{ item?: unknown; reason: string }>
  >([]);
  const [pendingRestoreFile, setPendingRestoreFile] = useState<File | null>(
    null
  );
  const [isRestoring, setIsRestoring] = useState(false);

  const [previewItems, setPreviewItems] = useState<
    Array<ExportedHadithType | ItemType>
  >([]);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restoreInputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const router = useRouter();

  // Return a compact preview string for an item or hadith
  const getPreviewText = (item: ExportedHadithType | ItemType) => {
    // If item has a name property, it's a chapter/sahaba/transmitter
    if ("name" in item) return item.name;
    // Otherwise treat as hadith export shape
    const hadith = item as ExportedHadithType;

    return `Hadith #${hadith.numero}`;
  };

  // Safely extract a display label from an unknown failed item
  const getFailedItemLabel = (obj: unknown) => {
    if (!obj || typeof obj !== "object") return "Item";
    const record = obj as Record<string, unknown>;
    if (typeof record.numero === "number") return `Hadith #${record.numero}`;
    if (typeof record.name === "string") return record.name;
    return "Item";
  };

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

  // Show a confirmation modal before executing the restore.
  const performRestore = async (file: File) => {
    setIsRestoring(true);
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
        const errorData = await response.json().catch(() => ({}));
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

      // server performs revalidation and redirect; ensure client navigates home
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la restauration complète:", error);
      toast.dismiss();
      toast.error(
        `❌ Erreur lors de la restauration: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setIsRestoring(false);
      setPendingRestoreFile(null);
      setIsRestoreModalOpen(false);
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
        // Support multiple export shapes:
        // - array directly: [{...}, {...}]
        // - wrapped object: { chapters: [...]} or { data: [...] }
        let arr: unknown[] = [];
        if (Array.isArray(json)) {
          arr = json;
        } else if (json && typeof json === "object") {
          // find the first property that is an array
          const values = Object.values(json as Record<string, unknown>);
          const firstArray = values.find((v) => Array.isArray(v));
          if (Array.isArray(firstArray)) arr = firstArray as unknown[];
        }

        // Choose validation schema based on endpoint
        if (importEndpoint === "hadiths") {
          const parsed = ExportedHadithSchema.array().safeParse(arr);
          if (parsed.success) {
            setPreviewItems(parsed.data);
            // only open confirmation modal when preview is valid
            handleImportClick(importEndpoint);
          } else {
            setPreviewItems([]);
            toast.error(
              "❌ Fichier JSON invalide pour l'import (format hadiths attendu)"
            );
            console.debug(
              "Import preview validation errors:",
              parsed.error.issues
            );
          }
        } else if (importEndpoint === "chapters") {
          // validate chapters where index must be present
          const parsed = ChapterImportSchema.array().safeParse(arr);
          if (parsed.success) {
            // normalize preview items to ItemType-ish for display: ensure id/slug exist-ish
            const normalized = parsed.data.map((it) => ({
              id:
                (it.id as string) ||
                `preview-${Math.random().toString(36).slice(2, 8)}`,
              index: it.index as number | undefined,
              name: it.name,
              slug:
                (it.slug as string) ||
                (it.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              nameArabic: it.nameArabic,
              hadithCount: it.hadithCount,
            }));
            setPreviewItems(normalized as ItemType[]);
            // only open confirmation modal when preview is valid
            handleImportClick(importEndpoint);
          } else {
            setPreviewItems([]);
            toast.error(
              "❌ Fichier JSON invalide pour l'import (format chapters attendu)"
            );
            console.debug(
              "Import preview validation errors:",
              parsed.error.issues
            );
          }
        } else {
          // validate generic item structure (sahaba / transmitter)
          const parsed = ImportItemSchema.array().safeParse(arr);
          if (parsed.success) {
            const normalized = parsed.data.map((it) => ({
              id:
                (it.id as string) ||
                `preview-${Math.random().toString(36).slice(2, 8)}`,
              index: it.index as number | undefined,
              name: it.name,
              slug:
                (it.slug as string) ||
                (it.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              nameArabic: it.nameArabic,
              hadithCount: it.hadithCount,
            }));
            setPreviewItems(normalized as ItemType[]);
            handleImportClick(importEndpoint);
          } else {
            setPreviewItems([]);
            toast.error(
              "❌ Fichier JSON invalide pour l'import (format items attendu)"
            );
            console.debug(
              "Import preview validation errors:",
              parsed.error.issues
            );
          }
        }
      } catch {
        setPreviewItems([]);
        toast.error("❌ Impossible de lire le fichier JSON");
      }
    };
    reader.readAsText(file);
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

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        // If API returned failed items, show them in a modal instead of full reload
        if (
          data.failed &&
          Array.isArray(data.failed) &&
          data.failed.length > 0
        ) {
          setFailedItems(data.failed);
          toast.warn(
            `⚠️ ${data.failed.length} item(s) n'ont pas pu être importés. Voir détails.`,
            { position: "top-right", autoClose: 5000 }
          );
        } else {
          toast.success("✅ Import réussi !", {
            position: "top-right",
            autoClose: 3000,
          });
          // trigger client-side refresh so server revalidation is reflected
          router.refresh();
        }
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
              <ExportSection
                dataOptions={dataOptions}
                handleExport={handleExport}
              />
              <ImportSection
                dataOptions={dataOptions}
                handleFileChange={handleFileChange}
              />
            </div>
          </div>

          <BackupRestoreSection
            handleDownloadBackup={handleDownloadBackup}
            restoreInputRef={restoreInputRef}
            isGenerating={isGeneratingBackup}
            onRestoreFileSelected={(file) => {
              if (file) {
                setPendingRestoreFile(file);
                setIsRestoreModalOpen(true);
              }
            }}
          />
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
                type="button"
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
                  {previewItems.slice(-10).map((item) => (
                    <li
                      key={
                        "id" in item
                          ? item.id
                          : `hadith-${(item as ExportedHadithType).numero}`
                      }
                      className="mb-1 text-sm text-emerald-700 dark:text-emerald-300"
                    >
                      {getPreviewText(item)}
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
      )}
      {/* Failed items modal (generic for hadiths/items) */}
      {failedItems.length > 0 && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold dark:text-white">
                Échecs d'import
              </h2>
              <button
                onClick={() => setFailedItems([])}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4 text-sm dark:text-gray-300">
              Certains éléments n'ont pas pu être importés. Voir la liste
              ci‑dessous :
            </div>
            <ul className="mb-4 text-sm list-disc pl-4 space-y-1">
              {failedItems.map((f, i) => (
                <li
                  key={i}
                  className="text-red-700 dark:text-red-400"
                >
                  {`${getFailedItemLabel(f.item)} — ${f.reason}`}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setFailedItems([])}
                className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Restore Confirmation Modal */}
      {isRestoreModalOpen && pendingRestoreFile && (
        <div
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
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setPendingRestoreFile(null);
                }}
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
              <div>{pendingRestoreFile.name}</div>
              <div className="text-xs mt-1 opacity-75">
                Taille : {(pendingRestoreFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setPendingRestoreFile(null);
                }}
                disabled={isRestoring}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingRestoreFile) performRestore(pendingRestoreFile);
                }}
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
      )}
    </>
  );
}

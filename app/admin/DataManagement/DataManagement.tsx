"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
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
import { ImportConfirmModal } from "./ImportConfirmModal";
import { FailedItemsModal } from "./FailedItemsModal";
import { useDataManagementEvents } from "./useDataManagementEvents";
import { DatasType } from "../page";

export function DataManagement({ datas }: { datas: DatasType }) {
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  // backup generation state moved inside BackupRestoreSection
  const [failedItems, setFailedItems] = useState<
    Array<{ item?: unknown; reason: string }>
  >([]);

  const [previewItems, setPreviewItems] = useState<
    Array<ExportedHadithType | ItemType>
  >([]);

  const router = useRouter();

  const handleImportClick = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setIsImportModalOpen(true);
  };

  const handleFileChange = (file: File | undefined, importEndpoint: string) => {
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        let arr: unknown[] = [];
        if (Array.isArray(json)) {
          arr = json;
        } else if (json && typeof json === "object") {
          const values = Object.values(json as Record<string, unknown>);
          const firstArray = values.find((v) => Array.isArray(v));
          if (Array.isArray(firstArray)) arr = firstArray as unknown[];
        }

        if (importEndpoint === "hadiths") {
          const parsed = ExportedHadithSchema.array().safeParse(arr);
          if (parsed.success) {
            setPreviewItems(parsed.data);
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
          const parsed = ChapterImportSchema.array().safeParse(arr);
          if (parsed.success) {
            const normalized = parsed.data.map((it) => ({
              id:
                (it.id as string) ||
                `preview-${Math.random().toString(36).slice(2, 8)}`,
              index: it.index as number | undefined,
              name_fr: it.name_fr,
              slug:
                (it.slug as string) ||
                (it.name_fr || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              name_ar: it.name_ar,
              hadithCount: it.hadithCount,
            }));
            setPreviewItems(normalized as ItemType[]);
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
          const parsed = ImportItemSchema.array().safeParse(arr);
          if (parsed.success) {
            const normalized = parsed.data.map((it) => ({
              id:
                (it.id as string) ||
                `preview-${Math.random().toString(36).slice(2, 8)}`,
              index: it.index as number | undefined,
              name_fr: it.name_fr,
              slug:
                (it.slug as string) ||
                (it.name_fr || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              name_ar: it.name_ar,
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

  // Event handlers for the custom hook
  const eventHandlers = {
    onImportFile: (file: File, endpoint: string) => {
      handleFileChange(file, endpoint);
    },

    onImportDone: () => {
      setIsImportModalOpen(false);
      setSelectedFile(null);
      setSelectedEndpoint("");
      router.refresh();
    },

    onImportFailed: (failed: Array<{ item?: unknown; reason: string }>) => {
      setFailedItems(failed);
      setIsImportModalOpen(false);
    },

    onCloseImportModal: () => {
      setIsImportModalOpen(false);
      setSelectedFile(null);
      setSelectedEndpoint("");
    },
  };

  // Use the custom hook to handle all events
  useDataManagementEvents(eventHandlers);

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
              <ExportSection datas={datas} />
              <ImportSection />
            </div>
          </div>

          <BackupRestoreSection />
        </div>
      </div>

      {isImportModalOpen && (
        <ImportConfirmModal
          selectedFile={selectedFile}
          previewItems={previewItems}
          selectedEndpoint={selectedEndpoint}
        />
      )}

      {failedItems.length > 0 && (
        <FailedItemsModal
          items={failedItems}
          onClose={() => setFailedItems([])}
        />
      )}
    </>
  );
}

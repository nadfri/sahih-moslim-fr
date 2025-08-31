"use client";

import { useState } from "react";
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
} from "lucide-react";

import type { ItemType, VariantType } from "@/src/types/types";
import { FilteredCardsEdit } from "@/src/ui/admin/FilteredCardsEdit/FilteredCardsEdit";
import { AddItemForm } from "@/src/ui/forms/AddItemForm/AddItemForm";

type Props = {
  chapters: ItemType[];
  sahabas: ItemType[];
  transmitters: ItemType[];
};

const variantOptions: { label: string; value: VariantType }[] = [
  { label: "Chapitres", value: "chapters" },
  { label: "Compagnons", value: "sahabas" },
  { label: "Transmetteurs", value: "transmitters" },
];

const exportOptions = [
  {
    label: "Chapitres",
    endpoint: "/api/export/chapters",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Compagnons",
    endpoint: "/api/export/sahabas",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Transmetteurs",
    endpoint: "/api/export/transmitters",
    icon: User,
    color: "text-stone-600 dark:text-stone-400",
  },
  {
    label: "Hadiths",
    endpoint: "/api/export/hadiths",
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

export function AdminDashboard({ chapters, sahabas, transmitters }: Props) {
  const [selectedVariant, setSelectedVariant] =
    useState<VariantType>("chapters");
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);

  let currentItems: ItemType[];

  switch (selectedVariant) {
    case "chapters":
      currentItems = chapters;
      break;

    case "sahabas":
      currentItems = sahabas;
      break;

    case "transmitters":
      currentItems = transmitters;
      break;

    default:
      currentItems = chapters; // Fallback case
      break;
  }

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

  const handleImport = async (endpoint: string, file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Import failed");

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Import error:", error);
      alert("Erreur lors de l'import");
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

  return (
    <div className="space-y-8">
      {/* Export/Import Section */}
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
                          handleExport(
                            option.endpoint,
                            `${option.label.toLowerCase()}.json`
                          )
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
                            if (file) handleImport(option.endpoint, file);
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {variantOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
              selectedVariant === option.value
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="variantSelector"
              value={option.value}
              checked={selectedVariant === option.value}
              onChange={() => setSelectedVariant(option.value)}
              className="sr-only"
            />
            <span className="font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      <AddItemForm
        key={selectedVariant}
        items={currentItems}
        variant={selectedVariant}
      />

      <div>
        <FilteredCardsEdit
          key={selectedVariant}
          items={currentItems}
          variant={selectedVariant}
        />
      </div>
    </div>
  );
}

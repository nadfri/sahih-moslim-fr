"use client";

import { toast } from "react-toastify";
import { dataOptions } from "./dataOptions";

export function ExportSection() {
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
      // Use toast directly in this component to avoid prop drilling
      // Note: toast import kept minimal to avoid large changes here
      // If unavailable, the click still triggers download.
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
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
              type="button"
              aria-label={`Exporter ${option.label}`}
              onClick={() => {
                handleExport(option.export!.endpoint, option.export!.filename);
                toast.success("Export démarré");
              }}
              className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
                  <Icon className={`w-5 h-5 ${option.export?.color || ""}`} />
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="text-sm font-medium">Télécharger</span>
                <svg className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

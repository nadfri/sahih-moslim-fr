"use client";

import { toast } from "react-toastify";
import { dataOptions } from "./dataOptions";
import { DatasType } from "../page";

export function ExportSection({ datas }: { datas: DatasType }) {
  const { chapters, sahabas, transmitters, hadithsCount } = datas;

  // Adjusting the hadith count by subtracting Intro and Unknown
  const chaptersCount = chapters.length - 2;

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
                <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm font-medium h-6 min-w-6 px-1.5 rounded-md">
                    {option.key === "chapters" && chaptersCount}
                    {option.key === "sahabas" && sahabas.length}
                    {option.key === "transmitters" && transmitters.length}
                    {option.key === "hadiths" && hadithsCount}
                  </span>
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
